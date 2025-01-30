from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

from api.simulator.schemas import ReactFlowObject

from .constants import T0, TF
from .service import formulate, parse_circuit, run_simulation

router = APIRouter()


@router.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Manages WebSocket connections to handle circuit formulation and simulation requests.

    This endpoint listens for messages from a connected WebSocket client and
    interprets them based on their `type` field. It handles two main message types:
    1) 'formulate': Parses the circuit data from the client using `parse_circuit`
        and constructs ODE functions via `formulate`.
    2) 'simulate': Runs the simulation using `run_simulation` given the parameters
        provided by the client, then returns the computed results.
    """
    logger.info('WebSocket connection initiated.')
    await websocket.accept()
    logger.info('WebSocket connection accepted.')

    try:
        while True:
            message = await websocket.receive_json()
            msg_type = message.get('type')
            logger.debug(f'Received message of type: {msg_type}')

            if msg_type == 'formulate':
                logger.info('Starting circuit formulation.')

                rfobject = ReactFlowObject(**message['payload']['rfobject'])
                parsed_items = parse_circuit(rfobject)
                func = formulate(parsed_items)

                num_chains = len(parsed_items['chain_promoters'])
                num_unique_proteins = len(parsed_items['protein_name2ids'])
                num_equations = num_chains + num_unique_proteins

                logger.debug(
                    '\nFormulated:\n'
                    f'  - Chains          : {num_chains}\n'
                    f'  - Unique proteins : {num_unique_proteins}\n'
                    f'  - Total equations : {num_equations}'
                )

                y0 = [0.0] * num_equations
                t_span = (T0, TF)

                await websocket.send_json(
                    {
                        'type': 'formulated',
                        'payload': {
                            'protein_name2ids': parsed_items['protein_name2ids'],
                        },
                    }
                )
            elif msg_type == 'simulate':
                logger.info('Starting circuit simulation.')

                params = message['payload']['params']

                solutions = run_simulation(
                    parsed_items=parsed_items,
                    func=func,
                    t_span=t_span,
                    y0=y0,
                    params=params,
                )

                await websocket.send_json(
                    {
                        'type': 'simulated',
                        'payload': {
                            'solutions': solutions,
                        },
                    }
                )
    except WebSocketDisconnect:
        logger.info('WebSocket disconnected')
