import os

from tokenizers import Tokenizer
from tokenizers.models import WordLevel
from tokenizers.pre_tokenizers import Split
from transformers import PreTrainedTokenizerFast

# Set the environment variable to disable the warning
# huggingface/tokenizers: The current process just got forked, after parallelism has already been used.
# Disabling parallelism to avoid deadlocks...
# To disable this warning, you can either:
#         - Avoid using `tokenizers` before the fork if possible
#         - Explicitly set the environment variable TOKENIZERS_PARALLELISM=(true | false)
os.environ['TOKENIZERS_PARALLELISM'] = 'false'

DEFAULT_VOCAB = {
    '[UNK]': 0,
    '[PAD]': 1,
    'A': 2,
    'T': 3,
    'G': 4,
    'C': 5,
}


def get_tokenizer(
    vocab: dict[str, int] | None = None,
    unk_token: str = '[UNK]',
    pad_token: str = '[PAD]',
) -> PreTrainedTokenizerFast:
    """Creates a tokenizer using the specified vocabulary and token settings.

    Args:
        vocab (dict[str, int] | None, optional): A dictionary mapping tokens to their respective IDs.
        unk_token (str, optional): The token to use for unknown words.
        pad_token (str, optional): The token to use for padding sequences.

    Returns:
        PreTrainedTokenizerFast: A fast tokenizer configured with the specified vocabulary and token settings.
    """
    if vocab is None:
        vocab = DEFAULT_VOCAB

    tokenizer = Tokenizer(WordLevel(vocab=vocab, unk_token=unk_token))
    tokenizer.pre_tokenizer = Split('', 'isolated')
    tokenizer.add_special_tokens([pad_token, unk_token])

    fast_tokenizer = PreTrainedTokenizerFast(
        tokenizer_object=tokenizer,
        pad_token=pad_token,
        unk_token=unk_token,
        clean_up_tokenization_spaces=True,
    )

    return fast_tokenizer
