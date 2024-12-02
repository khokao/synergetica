import typer
from huggingface_hub import HfApi

app = typer.Typer()


@app.command()
def upload_file(
    path_or_fileobj: str,
    path_in_repo: str,
    repo_id: str,
    repo_type: str = 'model',
) -> None:
    api = HfApi()
    api.upload_file(path_or_fileobj=path_or_fileobj, path_in_repo=path_in_repo, repo_id=repo_id, repo_type=repo_type)


@app.command()
def create_repo(
    repo_id: str,
    private: bool = True,
    repo_type: str = 'model',
) -> None:
    api = HfApi()
    api.create_repo(repo_id=repo_id, private=private, repo_type=repo_type)


if __name__ == '__main__':
    app()
