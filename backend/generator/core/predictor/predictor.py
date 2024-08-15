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
        self.ckpt_path = ckpt_path
        self.model = LightningSimpleTransformer.load_from_checkpoint(self.ckpt_path)
        self.trainer = L.Trainer(
            accelerator=accelerator,
            logger=False,
            enable_checkpointing=False,
            enable_progress_bar=False,
        )

        self.scaler_mean = None
        self.scaler_scale = None

    def __call__(
        self,
        sequences: list[str],
        targets: list[float] | None,
    ) -> list[float]:
        if targets is None:
            targets = [None] * len(sequences)

        datamodule = SequenceTargetDataModule.load_from_checkpoint(
            self.ckpt_path,
            predict_mode=True,
            should_load_csv=False,
            sequences=sequences,
            targets=targets,
        )
        if self.scaler_mean is None or self.scaler_scale is None:
            self.scaler_mean = datamodule.scaler_mean
            self.scaler_scale = datamodule.scaler_scale

        predictions = self.trainer.predict(model=self.model, datamodule=datamodule)[0]
        rescaled_predictions = self.rescale(predictions)

        return rescaled_predictions.tolist()

    def rescale(self, values: torch.Tensor) -> torch.Tensor:
        assert self.scaler_mean is not None and self.scaler_scale is not None, 'Scaler params must be provided.'
        return values * self.scaler_scale + self.scaler_mean
