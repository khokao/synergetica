# Backend
The backend is implemented in Python and utilizes FastAPI for building the web API.

## Setup
To install the required dependencies, run:
```zsh
uv sync --all-extras
```

## Running the Server
To run the development server, use:
```zsh
uv run fastapi run src/api/main.py
```

## Development Tools
### Ruff
#### Linter
To check the code for linting issues, run:
```zsh
uv run ruff check
```

#### Formatter
To format the code, run:
```zsh
uv run ruff format
```

#### mypy
To perform static type checking, run:
```zsh
uv run mypy
```

#### pytest
To run the test suite, use:
```zsh
uv run pytest
```
