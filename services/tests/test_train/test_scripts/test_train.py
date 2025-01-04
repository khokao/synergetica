import pandas as pd  # Use pandas because huggingface datasets depends on pandas
from hydra import compose, initialize

from train.scripts.train import main


def test_train(tmpdir):
    csv_path = tmpdir / 'test.csv'
    df = pd.DataFrame(
        {
            'sequence': ['ATGC'] * 20,
            'value': [1.0] * 20,
        }
    )
    df.to_csv(csv_path)

    with initialize(version_base=None, config_path='../../../src/train/configs'):
        cfg = compose(
            config_name='default',
            overrides=[
                f'trainer.default_root_dir={str(tmpdir)}',
                f'trainer.logger.save_dir={str(tmpdir)}',
                'trainer.fast_dev_run=true',
                f'datamodule.csv_path={str(csv_path)}',
                'datamodule.sequence_col=sequence',
                'datamodule.target_col=value',
                f'datamodule.save_disk_dir={str(tmpdir)}',
                'datamodule.batch_size=2',
            ],
        )

    main(cfg)
