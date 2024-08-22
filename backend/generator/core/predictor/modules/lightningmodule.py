import lightning as L
import torch
from torch.optim import AdamW
from torchmetrics import MetricCollection
from torchmetrics.regression import MeanSquaredError, PearsonCorrCoef, R2Score
from transformers import get_cosine_schedule_with_warmup

from ..models.transformer_regressor import SimpleTransformerRegressor


class LightningSimpleTransformer(L.LightningModule):
    def __init__(
        self,
        vocab_size: int,
        seq_len: int,
        d_model: int,
        nhead: int,
        num_encoder_layers: int,
        dim_feedforward: int,
        dropout: float,
        lr: float,
        num_warmup_steps: int,
    ) -> None:
        super().__init__()
        self.model = SimpleTransformerRegressor(
            vocab_size=vocab_size,
            seq_len=seq_len,
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_encoder_layers,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
        )

        self.lr = lr
        self.num_warmup_steps = num_warmup_steps

        self.save_hyperparameters()

        metrics = MetricCollection(
            [
                MeanSquaredError(),
                R2Score(),
                PearsonCorrCoef(),
            ]
        )
        self.train_metrics = metrics.clone(prefix='train_')
        self.val_metrics = metrics.clone(prefix='val_')
        self.test_metrics = metrics.clone(prefix='test_')

    def forward(self, input_ids: torch.Tensor) -> torch.Tensor:
        return self.model(input_ids)  # type: ignore

    def training_step(self, batch: dict[str, torch.Tensor], batch_idx: int) -> torch.Tensor:
        output = self(batch['input_ids'])

        metrics = self.train_metrics(output, batch['target'])
        self.log_dict(metrics, prog_bar=True, logger=True, on_step=False, on_epoch=True)

        loss = metrics['train_MeanSquaredError']  # type: torch.Tensor
        return loss

    def predict_step(self, batch: dict[str, torch.Tensor], batch_idx: int) -> torch.Tensor:
        return self(batch['input_ids'])  # type: ignore

    def configure_optimizers(self):  # type: ignore
        stepping_batches = self.trainer.estimated_stepping_batches

        optimizer = AdamW(self.model.parameters(), lr=self.lr)
        scheduler = get_cosine_schedule_with_warmup(
            optimizer,
            num_warmup_steps=self.num_warmup_steps,
            num_training_steps=stepping_batches,
        )

        return {
            'optimizer': optimizer,
            'lr_scheduler': {
                'scheduler': scheduler,
                'interval': 'step',
            },
        }

    def validation_step(self, batch: dict[str, torch.Tensor], batch_idx: int) -> None:
        output = self(batch['input_ids'])
        self.val_metrics.update(output, batch['target'])

    def on_validation_epoch_end(self) -> None:
        output = self.val_metrics.compute()
        self.log_dict(output, logger=True)

        self.val_metrics.reset()

    def test_step(self, batch: dict[str, torch.Tensor], batch_idx: int) -> None:
        output = self(batch['input_ids'])
        self.test_metrics.update(output, batch['target'])

    def on_test_epoch_end(self) -> None:
        output = self.test_metrics.compute()
        self.log_dict(output, logger=True)

        self.test_metrics.reset()
