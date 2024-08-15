# Generator

NOTE: Please run the command in the [`backend`](../../backend/) directory.

## 1. Set up a server with FastAPI (dev)

```zsh
poetry run fastapi dev generator/api/main.py
```

## 2. Generic Algorithm


## 3. Predictor
### 3.1. Training the Predictor
To start training, run the following command:
```zsh
poetry run python generator/core/predictor/scripts/train.py
```

The default configuration file is located at [`core/predictor/configs/default.yaml`](core/predictor/configs/default.yaml). If you need to adjust the settings, you can pass arguments in Hydra format.

For training on a single GPU, use:
```zsh
poetry run python generator/core/predictor/scripts/train.py --config-name single_gpu
```

For distributed data parallel (DDP) training, use:
```zsh
poetry run python generator/core/predictor/scripts/train.py --config-name multi_gpu
```

The training results will be saved in the [`generator/outputs`](outputs) directory.

### 3.2. Evaluating the Predictor
To evaluate the model, run the following command:
```zsh
poetry run python generator/core/predictor/scripts/test.py inference.ckpt=foobar.ckpt inference.output_dir=generator/outputs/foobar
```

This will output evaluation metrics such as the coefficient of determination (R²).

### 3.3. Making Predictions Only
To run inference and make predictions, use the following command:
```zsh
poetry run python generator/core/predictor/scripts/inference.py foobar.ckpt --sequences SEQUENCE1 --sequences SEQUENCE2
```

The predicted values (rescaled) will be shown in the console.
