import logging
from typing import Literal

import lightning as L
import torch
from datasets.utils.logging import disable_progress_bar

from .modules.datamodule import SequenceTargetDataModule
from .modules.lightningmodule import LightningSimpleTransformer

disable_progress_bar()
logging.getLogger('lightning.pytorch').setLevel(logging.ERROR)


class Predictor:
    def __init__(
        self,
        ckpt_path: str,
        accelerator: Literal['cpu', 'gpu', 'tpu', 'hpu', 'auto'] = 'cpu',
    ) -> None:
        """
        Args:
            ckpt_path (str): The path to the predictor model checkpoint.
            accelerator (str): The accelerator to use for prediction.
        """
        self.model = LightningSimpleTransformer.load_from_checkpoint(ckpt_path)
        self.datamodule = SequenceTargetDataModule.load_from_checkpoint(
            ckpt_path,
            predict_mode=True,
            should_load_csv=False,
        )
        self.trainer = L.Trainer(
            accelerator=accelerator,
            callbacks=None,
            logger=False,
            enable_checkpointing=False,
            enable_progress_bar=False,
        )

        self.scaler_mean = self.datamodule.scaler_mean
        self.scaler_scale = self.datamodule.scaler_scale

    def __call__(self, sequences: list[str]) -> list[float]:
        self.datamodule.sequences = sequences
        self.datamodule.targets = [None] * len(sequences)  # type: ignore

        predictions = self.trainer.predict(model=self.model, datamodule=self.datamodule)[0]  # type: ignore
        rescaled_predictions = self.rescale(predictions)  # type: ignore

        return rescaled_predictions.tolist()

    def rescale(self, values: torch.Tensor) -> torch.Tensor:
        assert self.scaler_mean is not None and self.scaler_scale is not None, 'Scaler params must be provided.'
        return values * self.scaler_scale + self.scaler_mean
