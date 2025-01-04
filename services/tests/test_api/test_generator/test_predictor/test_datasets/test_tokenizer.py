from transformers import PreTrainedTokenizerFast

from api.generator.predictor.datasets.tokenizer import DEFAULT_VOCAB, get_tokenizer


def test_tokenizer_creation_with_default_vocab():
    expected_vocab = DEFAULT_VOCAB
    expected_unk_token = '[UNK]'
    expected_pad_token = '[PAD]'

    tokenizer = get_tokenizer()

    assert isinstance(tokenizer, PreTrainedTokenizerFast)
    assert tokenizer.get_vocab() == expected_vocab
    assert tokenizer.unk_token == expected_unk_token
    assert tokenizer.pad_token == expected_pad_token


def test_tokenizer_creation_with_custom_vocab_and_tokens():
    custom_vocab = {'A': 0, 'B': 1, '<UNK>': 2, '<PAD>': 3}
    custom_unk_token = '<UNK>'
    custom_pad_token = '<PAD>'

    tokenizer = get_tokenizer(vocab=custom_vocab, unk_token=custom_unk_token, pad_token=custom_pad_token)

    assert isinstance(tokenizer, PreTrainedTokenizerFast)
    assert tokenizer.get_vocab() == custom_vocab
    assert tokenizer.unk_token == custom_unk_token
    assert tokenizer.pad_token == custom_pad_token
