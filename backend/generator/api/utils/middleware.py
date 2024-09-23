import asyncio


class RequestCancelledMiddleware:
    """ref: https://github.com/fastapi/fastapi/discussions/11360"""

    def __init__(self, app):  # type: ignore
        self.app = app

    async def __call__(self, scope, receive, send):  # type: ignore
        if scope['type'] != 'http':
            await self.app(scope, receive, send)
            return

        # Let's make a shared queue for the request messages
        queue = asyncio.Queue()  # type: ignore

        async def message_poller(sentinel, handler_task):  # type: ignore
            nonlocal queue
            while True:
                message = await receive()
                if message['type'] == 'http.disconnect':
                    handler_task.cancel()
                    return sentinel  # Break the loop

                # Puts the message in the queue
                await queue.put(message)

        sentinel = object()
        handler_task = asyncio.create_task(self.app(scope, queue.get, send))
        asyncio.create_task(message_poller(sentinel, handler_task))

        try:
            return await handler_task
        except asyncio.CancelledError:
            print('Cancelling request due to disconnect')
