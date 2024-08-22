import tempfile

import polars as pl
import pytest

from generator.core.predictor.modules.datamodule import SequenceTargetDataModule

SEQUENCE = ['ATGC'] * 10
TARGET = [1.0] * 10


@pytest.fixture
def temp_csv_file():
    df = pl.DataFrame(
        {
            'sequence': SEQUENCE,
            'target': TARGET,
        }
    )
    with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
        df.write_csv(temp_file.name)
        yield temp_file.name


@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir


@pytest.fixture
def datamodule(temp_dir, temp_csv_file):
    dm = SequenceTargetDataModule(
        csv_path=temp_csv_file,
        sequence_col='sequence',
        target_col='target',
        save_disk_dir=temp_dir,
        batch_size=1,
        num_workers=1,
        tokenize_kwargs={'padding': True, 'truncation': True},
        predict_mode=False,
        should_load_csv=True,
        sequences=None,
        targets=None,
    )
    dm.prepare_data()
    return dm


@pytest.fixture
def predictmode_datamodule(temp_dir):
    dm = SequenceTargetDataModule(
        csv_path='',
        sequence_col='sequence',
        target_col='target',
        save_disk_dir=temp_dir,
        batch_size=1,
        num_workers=1,
        tokenize_kwargs={'padding': True, 'truncation': True},
        predict_mode=True,
        should_load_csv=False,
        sequences=SEQUENCE,
        targets=TARGET,
    )
    dm.scaler_mean = 0.0
    dm.scaler_scale = 1.0
    dm.prepare_data()
    return dm


def test_setup_fit(datamodule):
    datamodule.setup('fit')

    train_batch = next(iter(datamodule.train_dataloader()))
    val_batch = next(iter(datamodule.val_dataloader()))
    assert train_batch['input_ids'].shape == (1, 4)
    assert val_batch['input_ids'].shape == (1, 4)


def test_setup_test(datamodule):
    datamodule.setup('test')

    test_batch = next(iter(datamodule.test_dataloader()))
    assert test_batch['input_ids'].shape == (1, 4)


def test_setup_predict(predictmode_datamodule):
    predictmode_datamodule.setup('predict')

    predict_batch = next(iter(predictmode_datamodule.predict_dataloader()))
    assert predict_batch['input_ids'].shape == (1, 4)
