import lightning as L
from datasets import load_from_disk
from torch.utils.data import DataLoader

from ..datasets.load import load_dataset_from_csv
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
    ) -> None:
        super().__init__()
        self.csv_path = csv_path
        self.sequence_col = sequence_col
        self.target_col = target_col
        self.save_disk_dir = save_disk_dir
        self.batch_size = batch_size
        self.num_workers = num_workers
        self.tokenize_kwargs = tokenize_kwargs

    def prepare_data(self) -> None:
        dataset = load_dataset_from_csv(self.csv_path, self.sequence_col, self.target_col)

        dataset = preprocess_sequence(dataset, self.sequence_col)
        dataset = scale_target(dataset, self.target_col)

        tokenizer = get_tokenizer()
        dataset = tokenize_sequence(dataset, tokenizer, self.sequence_col, self.tokenize_kwargs)

        dataset = split_dataset(dataset)

        dataset = dataset.rename_column(self.target_col, 'target')

        dataset.save_to_disk(self.save_disk_dir)

    def setup(self, stage: str) -> None:
        dataset = load_from_disk(self.save_disk_dir)

        if stage == 'fit':
            self.train_dataset = dataset['train'].with_format('torch')
            self.val_dataset = dataset['val'].with_format('torch')
        else:
            self.test_dataset = dataset['test'].with_format('torch')

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
