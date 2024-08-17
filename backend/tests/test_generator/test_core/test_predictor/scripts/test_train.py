from hydra import compose, initialize

from generator.core.predictor.scripts.train import main


def test_train(tmpdir):
    with initialize(version_base=None, config_path='../../../../../generator/core/predictor/configs'):
        cfg = compose(
            config_name='default',
            overrides=[
                f'trainer.default_root_dir={str(tmpdir)}',
                f'trainer.logger.save_dir={str(tmpdir)}',
                'trainer.fast_dev_run=true',
            ],
        )

    main(cfg)
