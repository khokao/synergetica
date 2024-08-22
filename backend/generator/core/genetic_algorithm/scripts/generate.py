from typing import List, Optional

import typer
from typing_extensions import Annotated

from generator.core.genetic_algorithm import FastGeneticAlgorithm
from generator.core.predictor.datasets.tokenizer import get_tokenizer
from generator.core.predictor.modules.datamodule import SequenceTargetDataModule
from generator.core.predictor.modules.lightningmodule import LightningSimpleTransformer

app = typer.Typer()

RBS_INIT_BASE_SEQUENCES = [
    'TCTAGAGTTCACACAGGAAACCTACTAG',
    'TCTAGAGATTAAAGAGGAGAAATACTAG',
    'TCTAGAGTCACACAGGAAACCTACTAG',
    'TCTAGAGTCACACAGGAAAGTACTAG',
    'TCTAGAGTCACACAGGACTACTAG',
    'TCTAGAGAAAGAGGAGAAATACTAG',
    'TCTAGAGATTAAAGAGGAGAATACTAG',
    'TCTAGAGAAAGAGGGGAAATACTAG',
]


@app.command()
def generate_rbs(
    predictor_ckpt_path: str,
    target_value: float,
    population_size: int = 100,
    mutation_rate: float = 0.5,
    num_iterations: int = 50,
    batch_size: int = 64,
    num_workers: int = 4,
    init_base_sequences: Annotated[Optional[List[str]], typer.Option()] = None,
    show_top_k: int = 3,
) -> None:
    """
    Args:
        predictor_ckpt_path (str): The path to the predictor model checkpoint.
        target_value (float): The optimal value that the genetic algorithm should converge to.
        population_size (int): The number of sequences in the population.
        mutation_rate (float): The probability of mutation occurring at each nucleotide position.
        num_iterations (int): The number of iterations to run the genetic algorithm.
        batch_size (int): The batch size used for generating predictions.
        num_workers (int): The number of workers used for torch DataLoader.
        init_base_sequences (list[str]): The initial sequences from which the population is generated.
    """
    if init_base_sequences is None:
        init_base_sequences = RBS_INIT_BASE_SEQUENCES

    lightning_module = LightningSimpleTransformer.load_from_checkpoint(predictor_ckpt_path)
    datamodule = SequenceTargetDataModule.load_from_checkpoint(predictor_ckpt_path)

    assert datamodule.scaler_mean is not None and datamodule.scaler_scale is not None, 'Scaler params must be provided'

    genetic_algorithm = FastGeneticAlgorithm(
        model=lightning_module.model,
        scaler_mean=datamodule.scaler_mean,
        scaler_scale=datamodule.scaler_scale,
        tokenizer=get_tokenizer(),
        tokenize_kwargs=datamodule.tokenize_kwargs,
        dataloader_kwargs={
            'batch_size': batch_size,
            'shuffle': False,
            'num_workers': num_workers,
            'pin_memory': True,
            'drop_last': False,
            'persistent_workers': True,
        },
    )

    sequences, rescaled_predictions = genetic_algorithm(
        target_value=target_value,
        population_size=population_size,
        mutation_rate=mutation_rate,
        num_iterations=num_iterations,
        init_base_sequences=init_base_sequences,
    )

    print(sequences[:show_top_k])
    print(rescaled_predictions[:show_top_k])


@app.command()
def generate_promoter() -> None:
    raise NotImplementedError


if __name__ == '__main__':
    app()
