import json
import shutil
from pathlib import Path

import hydra
from hydra.core.hydra_config import HydraConfig
from hydra.utils import instantiate
from omegaconf import DictConfig


@hydra.main(version_base=None, config_path='../configs', config_name='default')
def main(cfg: DictConfig) -> None:
    output_dir = Path(cfg.inference.output_dir)
    assert output_dir.exists(), f'Output directory {output_dir} does not exist.'

    try:
        datamodule = instantiate(cfg.datamodule)
        model = instantiate(cfg.model)

        trainer = instantiate(cfg.trainer)
        test_metrics = trainer.test(model=model, datamodule=datamodule, ckpt_path=cfg.inference.ckpt)

        with (output_dir / 'test_metrics.json').open('w') as f:
            json.dump(test_metrics, f, indent=2)
    finally:
        hydra_cfg = HydraConfig.get()
        shutil.rmtree(hydra_cfg.run.dir)


if __name__ == '__main__':
    main()
