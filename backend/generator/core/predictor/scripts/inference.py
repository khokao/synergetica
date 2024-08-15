
from typing import List, Optional

import typer
from typing_extensions import Annotated

from generator.core.predictor import Predictor


def main(
    ckpt_path: str,
    sequences: Annotated[Optional[List[str]], typer.Option()] = None,
    targets: Annotated[Optional[List[float]], typer.Option()] = None,
):
    if sequences is None:
        print('No provided sequences.')
        raise typer.Abort()

    predictor = Predictor(ckpt_path=ckpt_path)
    predictions = predictor(sequences=sequences, targets=targets)

    print(predictions)


if __name__ == '__main__':
    typer.run(main)
