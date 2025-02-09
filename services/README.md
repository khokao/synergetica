<a id="readme-top"></a>

# Services

[![Ruff Linter](https://github.com/khokao/synergetica/actions/workflows/python-ruff-check.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/python-ruff-check.yml)
[![Ruff Formatter](https://github.com/khokao/synergetica/actions/workflows/python-ruff-format.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/python-ruff-format.yml)
[![mypy](https://github.com/khokao/synergetica/actions/workflows/python-mypy.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/python-mypy.yml)
[![pytest](https://github.com/khokao/synergetica/actions/workflows/python-pytest.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/python-pytest.yml)

[![Docker](https://github.com/khokao/synergetica/actions/workflows/docker-build.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/docker-build.yml)
[![MkDocs](https://github.com/khokao/synergetica/actions/workflows/python-mkdocs.yml/badge.svg)](https://github.com/khokao/synergetica/actions/workflows/python-mkdocs.yml)



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#1-about-this-directory">About This Directory</a>
      <ul>
        <li><a href="#11-built-with">Built With</a></li>
        <li><a href="#12-external-repositories">External Repositories</a></li>
      </ul>
    </li>
    <li>
      <a href="#2-getting-started">Getting Started</a>
      <ul>
        <li><a href="#21-prerequisites">Prerequisites</a></li>
        <li><a href="#22-installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#3-usage">Usage</a>
      <ul>
        <li><a href="#31-running-the-api-server">Running the API server</a></li>
        <li><a href="#32-serving-the-documentation">Serving the Documentation</a></li>
      </ul>
    </li>
    <li>
      <a href="#4-developer-guide">Developer Guide</a>
      <ul>
        <li><a href="#41-code-quality--testing">Code Quality & Testing</a></li>
        <li><a href="#42-docker-build-and-deployment">Docker Build and Deployment</a></li>
        <li><a href="#43-ml-model-training-and-evaluation">ML Model Training and Evaluation</a></li>
      </ul>
    </li>
  </ol>
</details>



## 1. About This Directory

This directory contains a Python-based API implementation and documentation.

- [`src/api`](src/api) contains the API implementation developed using FastAPI
- [`src/train`](src/train) includes scripts for building the ML model used by the DNA sequence generation
- [`docs`](docs) contains Markdown files for documentation built with MkDocs

The API provides two main features: **simulation** and **generation**. For more details on each feature, please refer to the [documentation](https://khokao.github.io/synergetica/).

### 1.1. Built With
* [![Python][Python]][Python-url]
* [![FastAPI][FastAPI]][FastAPI-url]
* [![Docker][Docker]][Docker-url]
* [![MkDocs][MkDocs]][MkDocs-url]
* [![GitHub Pages][GitHub-Pages]][GitHub-Pages-url]
* [![GitHub Actions][GitHub-Actions]][GitHub-Actions-url]

### 1.2. External Repositories

- [Docker Hub repository](https://hub.docker.com/r/khokao/synergetica)
- [Hugging Face Hub repository](https://huggingface.co/khokao/synergetica)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 2. Getting Started

### 2.1. Prerequisites

* uv

  Please follow the official [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/) to install it.

### 2.2. Installation

1. Install the required Python packages with the following command
   ```sh
   uv sync --all-extras
   ```
2. Download the pretrained model weights from the [Hugging Face Hub repository](https://huggingface.co/khokao/synergetica) into the specified directory
   ```sh
   uv run huggingface-cli download khokao/synergetica base.ckpt --local-dir src/api/generator/checkpoints
   ```

> [!NOTE]
> The pretrained model weights are required for the iterative optimization process, which relies on the prediction model to generate DNA sequences.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 3. Usage

### 3.1. Running the API server

The desktop application uses port `7007`, so please configure the API to use the same port (`7007`).

By default, the desktop application automatically launches the API in a Docker container. However, if you launch the API locally on port `7007` beforehand, the application will instead connect to your manually launched API.

**Development Mode**

```sh
uv run fastapi dev src/api/main.py --port 7007
```

**Production Mode**

```sh
uv run fastapi run src/api/main.py --port 7007
```

### 3.2. Serving the Documentation

The configuration is defined in [`mkdocs.yml`](mkdocs.yml), and Markdown files are located in the [`docs`](docs) directory.

**Development Mode**

```sh
uv run mkdocs serve
```

**Production Mode**

Documentation deployment is managed via GitHub Actions, so manual execution is generally not required:

```sh
uv run mkdocs gh-deploy --strict --force
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 4. Developer Guide

### 4.1. Code Quality & Testing

We use Ruff for linting and formatting, mypy for type checking, and pytest for testing. These checks run automatically on GitHub Actions.

**Lint (Ruff)**

```sh
uv run ruff check --fix
```

**Format (Ruff)**

```sh
uv run ruff format
```

**Type Check (mypy)**

```sh
uv run mypy
```

**Test (pytest)**

```sh
uv run pytest
```

### 4.2. Docker Build and Deployment

The Docker image is managed in a [Docker Hub repository](https://hub.docker.com/r/khokao/synergetica) and is automatically built and deployed via GitHub Actions.

**Build the Docker image locally**

```sh
docker build -t khokao/synergetica .
```

**Run the Docker container locally**

```sh
docker run --rm -p 7007:7007 khokao/synergetica
```

**Pull the Docker image from Docker Hub**

If you prefer to pull the prebuilt image directly from Docker Hub, run:

```sh
docker pull khokao/synergetica:latest
docker run --rm -p 7007:7007 khokao/synergetica:latest
```

> [!NOTE]
> The Docker image only includes the pretrained model weights and API source code. ML model training and evaluation scripts, as well as documentation source files, are excluded.

### 4.3. ML Model Training and Evaluation

The generation feature uses an optimization process that relies on a prediction model trained with the scripts in the [`src/train`](src/train) directory. We currently employ a compact Transformer model to predict the translation initiation rate (TIR) from ribosome binding site (RBS) sequences. Its pretrained weights are available on the [Hugging Face Hub](https://huggingface.co/khokao/synergetica).

**Train**

The training configurations are defined in [`src/train/configs/default.yaml`](src/train/configs/default.yaml) and managed using [Hydra](https://hydra.cc/). You can modify these settings by editing the config file directly or by providing command-line overrides in Hydra format when running the training scripts.

> [!NOTE]
> A dummy dataset is provided in [`src/train/datasets`](src/train/datasets) to verify that the training pipeline works correctly. If you prefer to train on your own dataset, prepare it in the same format as the dummy dataset, and then update the config file accordingly.

To start training, run the following command in the [`src/train`](src/train) directory:

```sh
uv run python scripts/train.py
```

Training outputs (weights, logs, etc.) will be saved under [`src/train/outputs`](src/train/outputs).

**Test**

The dataset is automatically split into train, val, and test sets. After training, you can evaluate model performance on the test set by running the following command:

```sh
uv run python scripts/test.py inference.output_dir=outputs/yy-mm-dd-HH-MM-SS inference.ckpt=outputs/yy-mm-dd-HH-MM-SS/lightning_logs/version_0/checkpoints/last.ckpt
```

Make sure to replace the directory name and checkpoint file as appropriate.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Python]: https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff
[Python-url]: https://www.python.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-009485.svg?logo=fastapi&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com/
[Docker]: https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff
[Docker-url]: https://www.docker.com/
[MkDocs]: https://img.shields.io/badge/MkDocs-526CFE?logo=materialformkdocs&logoColor=fff
[MkDocs-url]: https://www.mkdocs.org/
[GitHub-Pages]: https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white
[GitHub-Pages-url]: https://pages.github.com/
[GitHub-Actions]: https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white
[GitHub-Actions-url]: https://github.com/features/actions/
