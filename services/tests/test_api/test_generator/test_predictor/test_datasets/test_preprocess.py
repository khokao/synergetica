import numpy as np
from datasets import Dataset

from api.generator.predictor.datasets.preprocess import (
    preprocess_sequence,
    scale_target,
    split_dataset,
    tokenize_sequence,
)
from api.generator.predictor.datasets.tokenizer import get_tokenizer


def test_preprocess_sequence_converts_to_uppercase():
    data = {'sequence': ['atg', 'gct']}
    dataset = Dataset.from_dict(data)
    sequence_key = 'sequence'

    processed_dataset = preprocess_sequence(dataset, sequence_key)

    assert processed_dataset[sequence_key] == ['ATG', 'GCT']


def test_scale_target_with_default_scaling():
    data = {'sequence': ['AT', 'GC', 'AA'], 'target': [1.0, 2.0, 3.0]}
    dataset = Dataset.from_dict(data)
    target_key = 'target'

    scaled_dataset = scale_target(dataset, target_key)

    assert np.isclose(scaled_dataset[target_key], [-1.224744871391589, 0.0, 1.224744871391589]).all()


def test_scale_target_with_custom_mean_and_scale():
    data = {'sequence': ['AT', 'GC', 'AA'], 'target': [10.0, 20.0, 30.0]}
    dataset = Dataset.from_dict(data)
    target_key = 'target'
    mean = 20.0
    scale = 10.0

    scaled_dataset = scale_target(dataset, target_key, mean=mean, scale=scale)

    assert np.isclose(scaled_dataset[target_key], [-1.0, 0.0, 1.0]).all()


def test_tokenize_sequence_with_simple_tokenizer():
    data = {'sequence': ['ATGC', 'CGTA']}
    dataset = Dataset.from_dict(data)
    sequence_key = 'sequence'
    tokenizer = get_tokenizer()
    tokenize_kwargs = {'padding': True, 'truncation': True}

    tokenized_dataset = tokenize_sequence(dataset, tokenizer, sequence_key, tokenize_kwargs)

    assert 'input_ids' in tokenized_dataset.column_names
    assert all(isinstance(i, list) for i in tokenized_dataset['input_ids'])
    assert all(isinstance(ii, int) for ii in tokenized_dataset['input_ids'][0])


def test_split_dataset_with_custom_ratios():
    data = {'feature': list(range(100))}
    dataset = Dataset.from_dict(data)

    split_datasets = split_dataset(dataset, train_ratio=0.7, val_ratio=0.2, test_ratio=0.1)

    assert len(split_datasets['train']) in [69, 70, 71]
    assert len(split_datasets['val']) in [19, 20, 21]
    assert len(split_datasets['test']) in [9, 10, 11]
    assert len(split_datasets['train']) + len(split_datasets['val']) + len(split_datasets['test']) == 100
