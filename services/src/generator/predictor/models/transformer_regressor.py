import torch
import torch.nn as nn
from einops import reduce, repeat

from .positional_embeddings import AbsolutePositionalEmbedding


class SimpleTransformerRegressor(nn.Module):
    def __init__(
        self,
        vocab_size: int,
        seq_len: int,
        d_model: int,
        nhead: int,
        num_encoder_layers: int,
        dim_feedforward: int,
        dropout: float,
    ) -> None:
        """
        Args:
            vocab_size (int): The size of the vocabulary.
            seq_len (int): The maximum sequence length.
            d_model (int): The dimensionality of the token embeddings.
            nhead (int): The number of attention heads in the transformer encoder.
            num_encoder_layers (int): The number of layers in the transformer encoder.
            dim_feedforward (int): The dimensionality of the feedforward network model.
            dropout (float): The dropout rate.
        """
        super().__init__()
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = AbsolutePositionalEmbedding(d_model, seq_len)

        # batch_first=True for for better inference performance.
        encoder_layer = nn.TransformerEncoderLayer(d_model, nhead, dim_feedforward, dropout, batch_first=True)
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_encoder_layers)

        self.fc = nn.Linear(d_model, 1)

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        batch_size, _ = input_ids.shape

        x = self.token_emb(input_ids)  # type: torch.Tensor

        pos_emb = self.pos_emb(x)
        x = x + repeat(pos_emb, 's d -> b s d', b=batch_size)

        x = self.transformer_encoder(x)

        x = reduce(x, 'b s d -> b d', 'mean')
        x = self.fc(x)

        x = reduce(x, 'b d -> b', 'mean')

        return x
