"""
Codes are modified

ref:
    - https://github.com/tiangolo/fastapi/issues/1276
        - License: MIT License (https://opensource.org/licenses/MIT)
    - https://github.com/pawamoy/website/blob/25a433d8d0bfcb670df78cc5bf4c85a172eaf466/docs/posts/unify-logging-for-a-gunicorn-uvicorn-app.md
        - License: ISC License (https://opensource.org/licenses/ISC)
"""

import logging
import sys

from loguru import logger


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno  # type: ignore

        # Find caller from where originated the logged message
        frame = logging.currentframe()
        depth = 2
        while frame and frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back  # type: ignore
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


def setup_logging() -> None:
    # Intercept everything at the root logger
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(logging.DEBUG)

    # Remove every other logger's handlers and propagate to root logger
    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    # Configure loguru
    logger.configure(handlers=[{'sink': sys.stdout}])
