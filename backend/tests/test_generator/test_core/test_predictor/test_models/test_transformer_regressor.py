import torch

from generator.core.predictor.models.transformer_regressor import SimpleTransformerRegressor


def test_simple_transformer_regressor_forward_pass():
    # Arrange
    vocab_size = 10
    seq_len = 5
    d_model = 16
    nhead = 2
    num_encoder_layers = 3
    dim_feedforward = 32
    dropout = 0.1

    model = SimpleTransformerRegressor(
        vocab_size=vocab_size,
        seq_len=seq_len,
        d_model=d_model,
        nhead=nhead,
        num_encoder_layers=num_encoder_layers,
        dim_feedforward=dim_feedforward,
        dropout=dropout,
    )

    input_ids = torch.randint(0, vocab_size, (8, seq_len))  # batch_size=8

    # Act
    output = model(input_ids)

    # Assert
    assert output.shape == (8,), 'Output should have shape (batch_size,)'
    assert isinstance(output, torch.Tensor), 'Output should be a torch.Tensor'
