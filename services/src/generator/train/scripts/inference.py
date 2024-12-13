from typing import Annotated

import typer

from generator.predictor import Predictor


def main(
    ckpt_path: str,
    sequences: Annotated[list[str] | None, typer.Option()] = None,
) -> None:
    """
    Args:
        ckpt_path (str): The path to the predictor model checkpoint.
        sequences (list[str]): The sequences to predict.
    """
    if sequences is None:
        print('No provided sequences.')
        raise typer.Abort()

    predictor = Predictor(ckpt_path=ckpt_path)
    predictions = predictor(sequences=sequences)

    print(predictions)


if __name__ == '__main__':
    typer.run(main)
