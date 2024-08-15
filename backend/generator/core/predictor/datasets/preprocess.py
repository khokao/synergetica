import numpy as np
from datasets import Dataset, DatasetDict
from sklearn.preprocessing import StandardScaler
from transformers import PreTrainedTokenizerFast

from .utils import scaler_params_to_dataset_description


def preprocess_sequence(dataset: Dataset, sequence_key: str) -> Dataset:  # type: ignore[no-any-unimported]
    """Converts sequence data in a dataset.

    Args:
        dataset (Dataset): The dataset containing the sequences to be processed.
        sequence_key (str): The key of the sequence column to be converted.

    Returns:
        Dataset: A new dataset with the processed sequences.
    """

    def to_upper(example: dict) -> dict:
        example[sequence_key] = example[sequence_key].upper()
        return example

    dataset = dataset.map(
        to_upper,
        batched=False,
        load_from_cache_file=False,
    )

    return dataset


def scale_target(
    dataset: Dataset,
    target_key: str,
    mean: float | None = None,
    scale: float | None = None,
) -> Dataset | tuple[Dataset, StandardScaler]:  # type: ignore[no-any-unimported]
    """Scales the target values in a dataset using standard scaling.

    Args:
        dataset (Dataset): The dataset containing the target values to be scaled.
        target_key (str): The key of the target column to be scaled.

    Returns:
        Dataset: A new dataset with the scaled target values.
    """
    target_values = np.array(dataset[target_key]).reshape(-1, 1)

    if mean is None and scale is None:
        scaler = StandardScaler()
        target_values = scaler.fit_transform(target_values).flatten().tolist()
    else:
        if mean is None or scale is None:
            raise ValueError('Both mean and scale must be provided.')

        scaler = StandardScaler()
        scaler.mean_ = np.array([mean])
        scaler.scale_ = np.array([scale])
        target_values = scaler.transform(target_values).flatten().tolist()

    dataset = dataset.remove_columns(target_key).add_column(target_key, target_values)

    dataset.info.description = scaler_params_to_dataset_description(scaler.mean_[0], scaler.scale_[0])

    return dataset


def tokenize_sequence(  # type: ignore[no-any-unimported]
    dataset: Dataset,
    tokenizer: PreTrainedTokenizerFast,
    sequence_key: str,
    tokenize_kwargs: dict,
) -> Dataset:
    """Tokenizes sequences in a dataset using a specified tokenizer.

    Args:
        dataset (Dataset): The dataset containing the sequences to be tokenized.
        tokenizer (PreTrainedTokenizerFast): The tokenizer to use for tokenization.
        sequence_key (str): The key of the sequence column to be tokenized.
        tokenize_kwargs (dict): Additional keyword arguments for the tokenizer.

    Returns:
        Dataset: A new dataset with the tokenized sequences.
    """

    def tokenization(examples: dict[str, list]) -> dict[str, list]:
        return tokenizer(examples[sequence_key], **tokenize_kwargs)  # type: ignore[no-any-return]

    dataset = dataset.map(
        tokenization,
        batched=True,
        load_from_cache_file=False,
    )

    return dataset


def split_dataset(  # type: ignore[no-any-unimported]
    dataset: Dataset,
    train_ratio: float = 0.8,
    val_ratio: float = 0.1,
    test_ratio: float = 0.1,
) -> DatasetDict:
    """Splits a dataset into train, val, and test sets.

    Args:
        dataset (Dataset): The dataset to be split into subsets.
        train_ratio (float, optional): The proportion of the dataset to include in the train split.
        val_ratio (float, optional): The proportion of the dataset to include in the validation split.
        test_ratio (float, optional): The proportion of the dataset to include in the test split.

    Returns:
        DatasetDict: A dictionary containing the train, val, and test subsets.
    """
    if (train_ratio + val_ratio + test_ratio) != 1.0:
        raise ValueError('The sum of train_ratio, val_ratio and test_ratio must be 1.0')

    val_test_ratio = val_ratio + test_ratio

    train_valtest = dataset.train_test_split(test_size=val_test_ratio)

    test_in_valtest_ratio = test_ratio / val_test_ratio

    val_test = train_valtest['test'].train_test_split(test_size=test_in_valtest_ratio)

    train_val_test_dataset = DatasetDict(
        {
            'train': train_valtest['train'],
            'val': val_test['train'],
            'test': val_test['test'],
        }
    )

    return train_val_test_dataset
