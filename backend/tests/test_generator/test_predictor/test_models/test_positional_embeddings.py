import torch

from generator.predictor.models.positional_embeddings import AbsolutePositionalEmbedding


def test_absolute_positional_embedding_default_positions():
    dim = 16
    max_seq_len = 10
    batch_size = 2
    seq_len = 5

    embedding_layer = AbsolutePositionalEmbedding(dim, max_seq_len)
    x = torch.randn(batch_size, seq_len, dim)

    pos_emb = embedding_layer(x)

    assert pos_emb.shape == (seq_len, dim), 'The shape of the positional embeddings should match (seq_len, dim)'


def test_absolute_positional_embedding_custom_positions():
    dim = 16
    max_seq_len = 10
    batch_size = 2
    seq_len = 5

    embedding_layer = AbsolutePositionalEmbedding(dim, max_seq_len)
    x = torch.randn(batch_size, seq_len, dim)
    custom_pos = torch.tensor([1, 3, 4, 2, 0])

    pos_emb = embedding_layer(x, pos=custom_pos)

    assert pos_emb.shape == (seq_len, dim), 'The shape of the positional embeddings should match (seq_len, dim)'
