import torch
import torch.nn as nn


class AbsolutePositionalEmbedding(nn.Module):
    def __init__(self, dim: int, max_seq_len: int) -> None:
        """
        Args:
            dim (int): The dimensionality of the embeddings.
            max_seq_len (int): The maximum sequence length the module can handle.
        """
        super().__init__()
        self.scale = dim**-0.5
        self.max_seq_len = max_seq_len
        self.emb = nn.Embedding(max_seq_len, dim)

    def forward(self, x: torch.Tensor, pos: torch.Tensor | None = None) -> torch.Tensor:
        """Computes the positional embeddings for a given input tensor.

        Args:
            x (torch.Tensor): The input tensor of shape (batch_size, sequence_length, embedding_dim).
            pos (torch.Tensor | None): A tensor of positional indices.
                If None, default positions (0 to sequence length) are used.

        Returns:
            torch.Tensor: A tensor of positional embeddings of shape (sequence_length, embedding_dim).
        """
        seq_len = x.shape[1]
        assert seq_len <= self.max_seq_len, f'Sequence length {seq_len} exceeds max {self.max_seq_len}'

        if pos is None:
            pos = torch.arange(seq_len, device=x.device)

        pos_emb = self.emb(pos)  # type: torch.Tensor
        pos_emb = pos_emb * self.scale

        return pos_emb
