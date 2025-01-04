import argparse
import logging

import lightning as L
import torch
from datasets.utils.logging import disable_progress_bar

from api.generator.predictor import LightningSimpleTransformer, SequenceTargetDataModule

disable_progress_bar()
logging.getLogger('lightning.pytorch').setLevel(logging.ERROR)


class Predictor:
    def __init__(self, ckpt_path: str) -> None:
        self.model = LightningSimpleTransformer.load_from_checkpoint(ckpt_path)
        self.datamodule = SequenceTargetDataModule.load_from_checkpoint(
            ckpt_path,
            predict_mode=True,
            should_load_csv=False,
        )
        self.trainer = L.Trainer(
            accelerator='cpu',  # 'cpu' | 'gpu' | 'tpu' | 'hpu' | 'auto'
            callbacks=None,
            logger=False,
            enable_checkpointing=False,
            enable_progress_bar=False,
        )

        self.scaler_mean = self.datamodule.scaler_mean
        self.scaler_scale = self.datamodule.scaler_scale

    def __call__(self, sequences: list[str]) -> list[float]:
        self.datamodule.sequences = sequences
        self.datamodule.targets = [1.0] * len(sequences)  # Dummy target values

        predictions = self.trainer.predict(model=self.model, datamodule=self.datamodule)[0]  # type: ignore
        rescaled_predictions = self.rescale(predictions)  # type: ignore

        return rescaled_predictions.tolist()

    def rescale(self, values: torch.Tensor) -> torch.Tensor:
        assert self.scaler_mean is not None and self.scaler_scale is not None, 'Scaler params must be provided.'
        return values * self.scaler_scale + self.scaler_mean  # type: ignore


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument('-c', '--ckpt', type=str, help='Path to the PyTorch Lightning checkpoint file', required=True)
    parser.add_argument('-s', '--sequences', type=str, nargs='+', help='Input DNA sequences', required=True)
    args = parser.parse_args()
    return args


def main() -> None:
    args = vars(get_args())
    print(args)

    predictor = Predictor(ckpt_path=args['ckpt'])
    predictions = predictor(sequences=args['sequences'])

    print(predictions)


if __name__ == '__main__':
    main()
