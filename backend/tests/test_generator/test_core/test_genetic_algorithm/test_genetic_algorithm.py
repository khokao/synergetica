import pytest

from generator.core.genetic_algorithm import FastGeneticAlgorithm
from generator.core.genetic_algorithm.scripts.generate import RBS_INIT_BASE_SEQUENCES
from generator.core.predictor.datasets.tokenizer import get_tokenizer
from generator.core.predictor.models.transformer_regressor import SimpleTransformerRegressor


def test_fast_genetic_algorithm():
    # Arrange
    model = SimpleTransformerRegressor(
        vocab_size=10,
        seq_len=31,
        d_model=16,
        nhead=2,
        num_encoder_layers=3,
        dim_feedforward=32,
        dropout=0.1,
    )
    tokenizer = get_tokenizer()
    genetic_algorithm = FastGeneticAlgorithm(
        model=model,
        scaler_mean=0.0,
        scaler_scale=1.0,
        tokenizer=tokenizer,
        tokenize_kwargs={'padding': True, 'truncation': True},
        dataloader_kwargs={
            'batch_size': 1,
            'shuffle': False,
            'num_workers': 0,
            'pin_memory': True,
        },
    )

    # Act
    sequences, rescaled_predictions = genetic_algorithm(
        target_value=1.0,
        population_size=2,
        mutation_rate=0.5,
        num_iterations=1,
        init_base_sequences=RBS_INIT_BASE_SEQUENCES,
    )

    # Assert
    assert all(isinstance(seq, str) for seq in sequences)
    assert all(isinstance(pred, float) for pred in rescaled_predictions)


@pytest.mark.parametrize('mutation_rate', [-1.0, 2.0])
def test_generic_algorithm_fail_with_invalid_mutation_rate(mutation_rate):
    # Arrange
    model = SimpleTransformerRegressor(
        vocab_size=10,
        seq_len=31,
        d_model=16,
        nhead=2,
        num_encoder_layers=3,
        dim_feedforward=32,
        dropout=0.1,
    )
    tokenizer = get_tokenizer()
    genetic_algorithm = FastGeneticAlgorithm(
        model=model,
        scaler_mean=0.0,
        scaler_scale=1.0,
        tokenizer=tokenizer,
        tokenize_kwargs={'padding': True, 'truncation': True},
        dataloader_kwargs={
            'batch_size': 1,
            'shuffle': False,
            'num_workers': 0,
            'pin_memory': True,
        },
    )

    # Act & Assert
    with pytest.raises(AssertionError):
        sequences, rescaled_predictions = genetic_algorithm(
            target_value=1.0,
            population_size=2,
            mutation_rate=mutation_rate,
            num_iterations=1,
            init_base_sequences=RBS_INIT_BASE_SEQUENCES,
        )
