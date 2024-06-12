import sys
from contextlib import redirect_stdout
from io import StringIO

from loguru import logger

from common.unify_logging_fastapi import setup_logging


def test_setup_logging():
    # Arrange
    captured_output = StringIO()
    logger.configure(handlers=[{'sink': captured_output, 'level': 'DEBUG'}])

    # Act
    with redirect_stdout(captured_output):
        setup_logging()
        logger.info('Loguru logging message')

    # Assert
    captured_output.seek(0)
    output = captured_output.read()
    assert 'Loguru logging message' in output

    # Reset
    logger.remove()
    sys.stdout = sys.__stdout__
