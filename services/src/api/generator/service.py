import asyncio
from http import HTTPStatus
from pathlib import Path

import torch
import torch.nn as nn
from aiomultiprocess import Pool
from fastapi import HTTPException
from loguru import logger
from tqdm import tqdm
from transformers import PreTrainedTokenizerFast

from .constants import CHECKPOINT_PATH
from .predictor import LightningSimpleTransformer, SequenceTargetDataModule


class GeneticAlgorithm:
    def __init__(
        self,
        model: nn.Module,
        scaler_mean: float,
        scaler_scale: float,
        tokenizer: PreTrainedTokenizerFast,
        tokenize_kwargs: dict,
    ) -> None:
        """
        Args:
            model (nn.Module): Prediction model used for fitness calculation.
            scaler_mean (float): The mean value used for scaling the target value.
            scaler_scale (float): The scale factor used for normalizing the target value.
            tokenize_kwargs (dict): Keyword arguments passed to the tokenizer during tokenization.
        """
        self.model = model
        self.scaler_mean = scaler_mean
        self.scaler_scale = scaler_scale
        self.tokenizer = tokenizer
        self.tokenize_kwargs = tokenize_kwargs
        self.tokenize_kwargs['return_tensors'] = 'pt'

        self.nucleotide_ids_tensor = torch.tensor(
            [
                self.tokenizer.vocab['A'],
                self.tokenizer.vocab['T'],
                self.tokenizer.vocab['G'],
                self.tokenizer.vocab['C'],
            ]
        )

    @torch.inference_mode()
    async def __call__(
        self,
        target_value: float,
        init_sequence: str,
        num_iterations: int,
        population_size: int,
        mutation_rate: float,
    ) -> tuple[list[str], list[float]]:
        """
        Args:
            target_value (float): The optimal value that the genetic algorithm should converge to.
            init_sequence (str): The initial sequence used for generating the population.
            num_iterations (int): The number of iterations to run the genetic algorithm.
            population_size (int): The number of sequences in the population.
            mutation_rate (float): The probability of mutation occurring at each nucleotide position.

        Returns:
            tuple[list[str], list[float]]:
                - A list of optimized sequences after the genetic algorithm has run.
                - A list of corresponding rescaled predictions from the model.
        """
        assert 0 <= mutation_rate <= 1, 'Mutation rate must be between 0 and 1'

        scaled_target_value = (target_value - self.scaler_mean) / self.scaler_scale

        # Initialization
        init_sequences = [init_sequence] * population_size
        encoded = self.tokenizer(init_sequences, **self.tokenize_kwargs)
        input_ids = encoded['input_ids']
        attention_mask = encoded['attention_mask'].bool()

        for _ in tqdm(range(num_iterations)):
            await asyncio.sleep(0)

            # Mutation
            mutation_mask = torch.rand(input_ids.shape) < mutation_rate
            applied_mask = attention_mask & mutation_mask

            random_nucleotides = torch.randint(0, len(self.nucleotide_ids_tensor), size=input_ids.shape)
            random_nucleotide_ids = self.nucleotide_ids_tensor[random_nucleotides]

            input_ids[applied_mask] = random_nucleotide_ids[applied_mask]

            # Fitness calculation
            predictions = self.model(input_ids)
            error = torch.abs(predictions - scaled_target_value)
            fitnesses = 1 / (1 + error)

            # Selection
            probs = fitnesses / fitnesses.sum()
            selected_indices = torch.multinomial(probs, num_samples=population_size, replacement=True)
            input_ids = input_ids[selected_indices]

        # Post-processing
        predictions = self.model(input_ids)
        rescaled_predictions = (predictions * self.scaler_scale + self.scaler_mean).tolist()
        sequences = self.tokenizer.batch_decode(input_ids, skip_special_tokens=True)
        sequences = [seq.replace(' ', '') for seq in sequences]

        error = torch.abs(predictions - scaled_target_value)
        fitnesses = (1 / (1 + error)).tolist()
        sorted_results = sorted(
            zip(sequences, rescaled_predictions, fitnesses, strict=False), key=lambda x: x[2], reverse=True
        )
        sequences, rescaled_predictions, _ = map(list, zip(*sorted_results, strict=False))

        return sequences, rescaled_predictions


def load_ckpt(ckpt_path: Path) -> dict:
    """
    Args:
        ckpt_path (Path): Path to the PyTorch Lightning checkpoint file.

    Returns:
        loaded_items (dict): A dictionary containing the loaded items, which has the following keys:
            model (L.LightningModule): LightningModule instance.
            scaler_mean (float): The mean value used for scaling the target value.
            scaler_scale (float): The scale factor used for normalizing the target value.
            tokenize_kwargs (dict): Keyword arguments passed to the tokenizer during tokenization.
    """
    assert ckpt_path.exists(), f'Checkpoint file not found: {ckpt_path}'

    lightning_module = LightningSimpleTransformer.load_from_checkpoint(ckpt_path)
    datamodule = SequenceTargetDataModule.load_from_checkpoint(ckpt_path)

    loaded_items = {
        'model': lightning_module.model,
        'scaler_mean': datamodule.scaler_mean,
        'scaler_scale': datamodule.scaler_scale,
        'tokenizer': datamodule.tokenizer,
        'tokenize_kwargs': datamodule.tokenize_kwargs,
    }

    return loaded_items


async def generate_single_sequence(
    protein_id: str,
    target_value: float,
    init_sequence: str,
) -> tuple[str, str]:
    """
    Args:
        protein_id (str): The protein node ID.
        target_value (float): The target value for the genetic algorithm.
        init_sequence (str): The initial sequence used for generating the population.

    Returns:
        tuple[str, str]:
            - The protein node ID.
            - The optimized sequence generated by the genetic algorithm.
    """
    loaded_items = load_ckpt(CHECKPOINT_PATH)
    ga = GeneticAlgorithm(**loaded_items)
    sequences, _ = await ga(
        target_value=target_value,
        init_sequence=init_sequence,
        num_iterations=5,
        population_size=100,
        mutation_rate=0.5,
    )

    return protein_id, sequences[0]  # Return the top 1 sequence


async def generate_sequences(
    protein_target_values: dict[str, float],
    protein_init_sequences: dict[str, str],
) -> dict[str, str]:
    """
    Args:
        protein_target_values (dict[str, float]): A dict containing the protein node ID and target value.
        protein_init_sequences (dict[str, str]): A dict containing the protein node ID and initial sequence.

    Returns:
        protein_generated_sequences (dict[str, str]): A dict containing the protein node ID and generated sequence.
    """
    try:
        async with Pool() as pool:
            tasks = []
            for protein_id in protein_target_values.keys():
                task = pool.apply(
                    generate_single_sequence,
                    args=(
                        protein_id,
                        protein_target_values[protein_id],
                        protein_init_sequences[protein_id],
                    ),
                )
                tasks.append(task)

            results = await asyncio.gather(*tasks)

    except asyncio.CancelledError as e:
        logger.error('The task was canceled due to a client disconnect.')
        raise HTTPException(status_code=499, detail='Request canceled') from e
    except Exception as e:
        logger.error(f'Error during sequence generation: {str(e)}')
        raise HTTPException(status_code=HTTPStatus.INTERNAL_SERVER_ERROR, detail='Internal server error') from e

    protein_generated_sequences = dict(results)  # list[tuple[protein_id, sequence], ...] -> dict[protein_id, sequence]
    return protein_generated_sequences
