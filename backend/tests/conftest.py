import pytest


@pytest.fixture
def test_circuit():
    return TEST_CIRCUIT


@pytest.fixture
def protein_ids():
    protein_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'child' and node['data']['category'] == 'protein':  # type: ignore
            protein_ids.append(node['id'])  # type: ignore
    return protein_ids


@pytest.fixture
def parent_ids():
    parent_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'parent':  # type: ignore
            parent_ids.append(node['id'])  # type: ignore
    return parent_ids


@pytest.fixture
def child_ids():
    child_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'child':  # type: ignore
            child_ids.append(node['id'])  # type: ignore
    return child_ids


TEST_CIRCUIT = {
    'nodes': [
        {
            'id': 'true-friends-say',
            'type': 'parent',
            'position': {'x': 0, 'y': 0},
            'width': 680,
            'height': 166,
            'data': {},
            'className': '!z-0',
            'measured': {'width': 680, 'height': 166},
        },
        {
            'id': 'zMHtvnldTXSJIWtVgBhUt',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'promoter',
                'name': 'PameR',
                'description': 'Regulated Promoter repressed by AmeR',
                'sequence': 'gatagtgacaaacttgacaactcatcacttcctaggtataatgctagc',
                'controlBy': [{'name': 'AmeR', 'type': 'repression'}],
                'controlTo': [],
                'meta': None,
                'leftHandleConnected': False,
                'rightHandleConnected': True,
                'showParentId': False,
            },
            'parentId': 'true-friends-say',
            'measured': {'width': 180, 'height': 126},
        },
        {
            'id': 'GGwPR58MCezysPUWtA1bl',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'protein',
                'name': 'BM3R1',
                'description': 'Repressor Protein of Pbm3R1',
                'sequence': 'atggaaagcaccccgaccaaacagaaagcaatttttagcgcaagcctgctgctgtttgcagaacgtggttttgatgcaaccaccatgccgatgattgcagaaaatgcaaaagttggtgcaggcaccatttatcgctatttcaaaaacaaagaaagcctggtgaacgaactgtttcagcagcatgttaatgaatttctgcagtgtattgaaagcggtctggcaaatgaacgtgatggttatcgtgatggctttcatcacatttttgaaggtatggtgacctttaccaaaaatcatccgcgtgcactgggttttatcaaaacccatagccagggcacctttctgaccgaagaaagccgtctggcatatcagaaactggttgaatttgtgtgcaccttttttcgtgaaggtcagaaacagggtgtgattcgtaatctgccggaaaatgcactgattgcaattctgtttggcagctttatggaagtgtatgaaatgatcgagaacgattatctgagcctgaccgatgaactgctgaccggtgttgaagaaagcctgtgggcagcactgagccgtcagagctaa',  # noqa
                'controlBy': [],
                'controlTo': [{'name': 'Pbm3r1', 'type': 'repression'}],
                'meta': {'Pmax': 5.590683685e-05, 'Ymax': 0.5, 'Ymin': 0.004, 'K': 0.04, 'n': 3.4, 'Dp': 0.14726881},
                'leftHandleConnected': True,
                'rightHandleConnected': True,
                'showParentId': False,
            },
            'parentId': 'true-friends-say',
            'measured': {'width': 180, 'height': 126},
        },
        {
            'id': 'mhUORsqGhTC97jP-AAsgE',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'controlTo': [],
                'meta': None,
                'leftHandleConnected': True,
                'rightHandleConnected': False,
                'showParentId': False,
            },
            'parentId': 'true-friends-say',
            'measured': {'width': 180, 'height': 126},
        },
        {
            'id': 'fast-baboons-wink',
            'type': 'parent',
            'position': {'x': 0, 'y': 326},
            'width': 680,
            'height': 166,
            'data': {},
            'className': '!z-0',
            'measured': {'width': 680, 'height': 166},
            'selected': True,
        },
        {
            'id': 'n2iZ_CHolZnqJHB3qJwXd',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'promoter',
                'name': 'Pbm3r1',
                'description': 'Regulated Promoter repressed by BM3R1',
                'sequence': 'tctgattcgttaccaattgacggaatgaacgttcattccgataatgctagc',
                'controlBy': [{'name': 'BM3R1', 'type': 'repression'}],
                'controlTo': [],
                'meta': None,
                'leftHandleConnected': False,
                'rightHandleConnected': True,
                'showParentId': False,
            },
            'parentId': 'fast-baboons-wink',
            'measured': {'width': 180, 'height': 126},
        },
        {
            'id': '8r73zQJfh4qLjcA97ucBq',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'protein',
                'name': 'AmeR',
                'description': 'Repressor Protein of PameR',
                'sequence': 'atgaacaaaaccattgatcaggtgcgtaaaggtgatcgtaaaagcgatctgccggttcgtcgtcgtccgcgtcgtagtgccgaagaaacccgtcgtgatattctggcaaaagccgaagaactgtttcgtgaacgtggttttaatgcagttgccattgcagatattgcaagcgcactgaatatgagtccggcaaatgtgtttaaacattttagcagcaaaaacgcactggttgatgcaattggttttggtcagattggtgtttttgaacgtcagatttgtccgctggataaaagccatgcaccgctggatcgtctgcgtcatctggcacgtaatctgatggaacagcatcatcaggatcatttcaaacacatacgggtttttattcagatcctgatgaccgccaaacaggatatgaaatgtggcgattattacaaaagcgtgattgcaaaactgctggccgaaattattcgtgatggtgttgaagcaggtctgtatattgcaaccgatattccggttctggcagaaaccgttctgcatgcactgaccagcgttattcatccggttctgattgcacaagaagatattggtaatctggcaacccgttgtgatcagctggttgatctgattgatgcaggtctgcgtaatccgctggcaaaataa',  # noqa
                'controlBy': [],
                'controlTo': [{'name': 'PameR', 'type': 'repression'}],
                'meta': {'Pmax': 8.389048759e-05, 'Ymax': 3.8, 'Ymin': 0.2, 'K': 0.09, 'n': 1.4, 'Dp': 0.74589307},
                'leftHandleConnected': True,
                'rightHandleConnected': True,
                'showParentId': False,
            },
            'parentId': 'fast-baboons-wink',
            'measured': {'width': 180, 'height': 126},
        },
        {
            'id': 'XdLLQriLSxeW1FavAONoG',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'controlTo': [],
                'meta': None,
                'leftHandleConnected': True,
                'rightHandleConnected': False,
                'showParentId': False,
            },
            'parentId': 'fast-baboons-wink',
            'measured': {'width': 180, 'height': 126},
        },
    ],
    'edges': [
        {
            'id': '8mGuegDYDdwAlc7wfANwZ',
            'type': 'custom',
            'source': 'zMHtvnldTXSJIWtVgBhUt',
            'target': 'GGwPR58MCezysPUWtA1bl',
            'sourceHandle': 'right',
            'targetHandle': 'left',
            'style': {'strokeWidth': 4},
            'animated': False,
            'zIndex': 10,
        },
        {
            'id': 'nlqYXo17n-giXwzYrEDbM',
            'type': 'custom',
            'source': 'GGwPR58MCezysPUWtA1bl',
            'target': 'mhUORsqGhTC97jP-AAsgE',
            'sourceHandle': 'right',
            'targetHandle': 'left',
            'style': {'strokeWidth': 4},
            'animated': False,
            'zIndex': 10,
        },
        {
            'id': 'LMCQfA4Afcp-TGEyOTreT',
            'type': 'custom',
            'source': 'n2iZ_CHolZnqJHB3qJwXd',
            'target': '8r73zQJfh4qLjcA97ucBq',
            'sourceHandle': 'right',
            'targetHandle': 'left',
            'style': {'strokeWidth': 4},
            'animated': False,
            'zIndex': 10,
        },
        {
            'id': 'oh2FMTHOuxfrGVW_SP-ch',
            'type': 'custom',
            'source': '8r73zQJfh4qLjcA97ucBq',
            'target': 'XdLLQriLSxeW1FavAONoG',
            'sourceHandle': 'right',
            'targetHandle': 'left',
            'style': {'strokeWidth': 4},
            'animated': False,
            'zIndex': 10,
        },
        {
            'id': 'm0vW6UmEUkM2fmtMPqaJT',
            'type': 'annotation',
            'source': '8r73zQJfh4qLjcA97ucBq',
            'target': 'zMHtvnldTXSJIWtVgBhUt',
            'style': {'strokeWidth': 4, 'stroke': '#818cf8'},
            'markerEnd': 'repression',
            'zIndex': 0,
            'selectable': False,
        },
        {
            'id': 'lRey2QXTKZkNpB2xx0vUW',
            'type': 'annotation',
            'source': 'GGwPR58MCezysPUWtA1bl',
            'target': 'n2iZ_CHolZnqJHB3qJwXd',
            'style': {'strokeWidth': 4, 'stroke': '#818cf8'},
            'markerEnd': 'repression',
            'zIndex': 0,
            'selectable': False,
        },
    ],
    'viewport': {'x': 100, 'y': 100, 'zoom': 1},
}
