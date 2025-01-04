import pytest

from api.generator.predictor.datasets import get_tokenizer
from api.generator.predictor.models import SimpleTransformerRegressor
from api.generator.service import GeneticAlgorithm, generate_sequences, generate_single_sequence, load_ckpt


@pytest.mark.asyncio
async def test_genetic_algorithm():
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
    ga = GeneticAlgorithm(
        model=model,
        scaler_mean=0.0,
        scaler_scale=1.0,
        tokenizer=get_tokenizer(),
        tokenize_kwargs={'padding': True, 'truncation': True},
    )

    # Act
    sequences, rescaled_predictions = await ga(
        target_value=1.0,
        init_sequence='ATGC',
        population_size=2,
        mutation_rate=0.5,
        num_iterations=1,
    )

    # Assert
    assert all(isinstance(seq, str) for seq in sequences)
    assert all(isinstance(pred, float) for pred in rescaled_predictions)


def test_load_ckpt_file_not_found(tmp_path):
    fake_ckpt_path = tmp_path / 'not_exists.ckpt'
    with pytest.raises(AssertionError) as exc_info:
        load_ckpt(fake_ckpt_path)
    assert f'Checkpoint file not found: {fake_ckpt_path}' in str(exc_info.value)


@pytest.mark.asyncio
async def test_generate_single_sequence():
    # Arrange
    protein_id = 'test-protein-id'
    target_value = 100
    init_sequence = 'ATGC'

    # Act
    protein_id, sequence = await generate_single_sequence(
        protein_id=protein_id,
        target_value=target_value,
        init_sequence=init_sequence,
    )

    # Assert
    assert protein_id == 'test-protein-id'
    assert isinstance(sequence, str)


@pytest.mark.asyncio
async def test_generate_sequences():
    # Arrange
    protein_target_values = {'protein-1': 100, 'protein-2': 100}
    protein_init_sequences = {'protein-1': 'ATGC', 'protein-2': 'ATGC'}

    # Act
    protein_generated_sequences = await generate_sequences(
        protein_target_values=protein_target_values,
        protein_init_sequences=protein_init_sequences,
    )

    # Assert
    assert all(isinstance(protein_id, str) for protein_id in protein_generated_sequences.keys())
    assert all(isinstance(sequence, str) for sequence in protein_generated_sequences.values())
