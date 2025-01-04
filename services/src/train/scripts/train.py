import hydra
from hydra.utils import instantiate
from lightning.pytorch import seed_everything
from omegaconf import DictConfig


@hydra.main(version_base=None, config_path='../configs', config_name='default')
def main(cfg: DictConfig) -> None:
    seed_everything(cfg.seed, workers=True)

    datamodule = instantiate(cfg.datamodule)
    model = instantiate(cfg.model)

    trainer = instantiate(cfg.trainer)
    trainer.fit(model=model, datamodule=datamodule)


if __name__ == '__main__':
    main()
