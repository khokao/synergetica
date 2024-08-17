import lightning as L
from datasets import Dataset, DatasetDict, load_dataset, load_from_disk
from torch.utils.data import DataLoader

from ..datasets.preprocess import preprocess_sequence, scale_target, split_dataset, tokenize_sequence
from ..datasets.tokenizer import get_tokenizer


class SequenceTargetDataModule(L.LightningDataModule):
    def __init__(
        self,
        csv_path: str,
        sequence_col: str,
        target_col: str,
        save_disk_dir: str,
        batch_size: int,
        num_workers: int,
        tokenize_kwargs: dict,
        predict_mode: bool,
        should_load_csv: bool,
        sequences: list[str] | None,
        targets: list[float] | None,
    ) -> None:
        super().__init__()
        self.csv_path = csv_path
        self.sequence_col = sequence_col
        self.target_col = target_col
        self.save_disk_dir = save_disk_dir
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.tokenize_kwargs = tokenize_kwargs
        self.predict_mode = predict_mode
        self.should_load_csv = should_load_csv
        self.sequences = sequences
        self.targets = targets

        self.save_hyperparameters()

        self.scaler_mean = None  # type: float | None
        self.scaler_scale = None  # type: float | None

    def prepare_data(self) -> None:
        if self.should_load_csv:
            dataset = load_dataset('csv', data_files=self.csv_path, split='train').select_columns(
                [self.sequence_col, self.target_col]
            )
        else:
            dataset = Dataset.from_dict({self.sequence_col: self.sequences, self.target_col: self.targets})

        dataset = preprocess_sequence(dataset, self.sequence_col)
        dataset = scale_target(dataset, self.target_col, mean=self.scaler_mean, scale=self.scaler_scale)

        tokenizer = get_tokenizer()
        dataset = tokenize_sequence(dataset, tokenizer, self.sequence_col, self.tokenize_kwargs)

        if not self.predict_mode:
            dataset = split_dataset(dataset)
        else:
            assert self.scaler_mean is not None and self.scaler_scale is not None, 'Scaler params must be provided.'
            dataset = DatasetDict({'predict': dataset})

        if self.target_col != 'target':
            dataset = dataset.rename_column(self.target_col, 'target')

        dataset.save_to_disk(self.save_disk_dir)

    def setup(self, stage: str) -> None:
        dataset = load_from_disk(self.save_disk_dir)

        if stage == 'fit':
            self.train_dataset = dataset['train'].with_format('torch')
            self.val_dataset = dataset['val'].with_format('torch')

            # Load the scaling parameters calculated during preprocessing.
            parts = self.train_dataset.info.description.split(', ')
            self.scaler_mean = float(parts[0].split(': ')[1])
            self.scaler_scale = float(parts[1].split(': ')[1])
        elif stage == 'test':
            self.test_dataset = dataset['test'].with_format('torch')
        elif stage == 'predict':
            self.predict_dataset = dataset['predict'].with_format('torch')

    def train_dataloader(self) -> DataLoader:
        return DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            shuffle=True,
            num_workers=self.num_workers,
            pin_memory=True,
            drop_last=True,
            persistent_workers=True,
        )

    def val_dataloader(self) -> DataLoader:
        return DataLoader(
            self.val_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
            pin_memory=True,
            drop_last=False,
            persistent_workers=True,
        )

    def test_dataloader(self) -> DataLoader:
        return DataLoader(
            self.test_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
            pin_memory=True,
            drop_last=False,
            persistent_workers=True,
        )

    def predict_dataloader(self) -> DataLoader:
        return DataLoader(
            self.predict_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=self.num_workers,
            pin_memory=True,
            drop_last=False,
            persistent_workers=True,
        )

    def state_dict(self) -> dict[str, float]:
        assert self.scaler_mean is not None and self.scaler_scale is not None, 'Scaler params must be provided.'
        state = {
            'scaler_mean': self.scaler_mean,
            'scaler_scale': self.scaler_scale,
        }
        return state

    def load_state_dict(self, state_dict: dict[str, float]) -> None:
        self.scaler_mean = state_dict['scaler_mean']
        self.scaler_scale = state_dict['scaler_scale']
