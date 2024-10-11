import pytest


@pytest.fixture
def test_circuit():
    return TEST_CIRCUIT


@pytest.fixture
def protein_ids():
    protein_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'child' and node['data']['nodeCategory'] == 'protein':  # type: ignore
            protein_ids.append(node['id'])
    return protein_ids


@pytest.fixture
def parent_ids():
    parent_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'parent':
            parent_ids.append(node['id'])
    return parent_ids


@pytest.fixture
def child_ids():
    child_ids = []
    for node in TEST_CIRCUIT['nodes']:
        if node['type'] == 'child':
            child_ids.append(node['id'])
    return child_ids


TEST_CIRCUIT = {
    'nodes': [
        {
            'id': 'sad-apples-appear',
            'type': 'parent',
            'position': {'x': 224.8125, 'y': 998},
            'style': {'width': 571, 'height': 123},
            'data': {'width': 571, 'height': 123},
            'width': 571,
            'height': 123,
            'positionAbsolute': {'x': 224.8125, 'y': 998},
        },
        {
            'id': 'RPp8K6j_urCFeMtsm2pZv',
            'type': 'child',
            'position': {'x': 194, 'y': 73},
            'data': {
                'iconUrl': '/images/node-protein.svg',
                'nodeCategory': 'protein',
                'nodeSubcategory': 'RepressorProtein',
                'nodePartsName': 'BM3R1',
                'sequence': 'atggaaagcaccccgaccaaacagaaagcaatttttagcgcaagcctgctgctgtttgcagaacgtggttttgatgcaaccaccatgccgatgattgcagaaaatgcaaaagttggtgcaggcaccatttatcgctatttcaaaaacaaagaaagcctggtgaacgaactgtttcagcagcatgttaatgaatttctgcagtgtattgaaagcggtctggcaaatgaacgtgatggttatcgtgatggctttcatcacatttttgaaggtatggtgacctttaccaaaaatcatccgcgtgcactgggttttatcaaaacccatagccagggcacctttctgaccgaagaaagccgtctggcatatcagaaactggttgaatttgtgtgcaccttttttcgtgaaggtcagaaacagggtgtgattcgtaatctgccggaaaatgcactgattgcaattctgtttggcagctttatggaagtgtatgaaatgatcgagaacgattatctgagcctgaccgatgaactgctgaccggtgttgaagaaagcctgtgggcagcactgagccgtcagagctaa',  # noqa: E501
                'controlBy': None,
                'controlTo': [
                    {
                        'partsId': '3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c',
                        'controlType': 'Repression',
                    }
                ],
                'meta': {'Pmax': 0.5, 'Ymax': 1, 'Ymin': 0.2, 'K': 3, 'n': 2, 'Dp': 0.1},
                'leftHandleStyle': {'top': 15, 'left': 6},
                'rightHandleStyle': {'top': 15, 'left': 178},
                'commandPaletteButtonStyle': {'top': -6, 'left': 12, 'right': 30},
                'leftHandleConnected': True,
                'rightHandleConnected': True,
                'partsId': '8e962d8c0de8f20c5dc9047784fc10f3b55053a300cf987bfca6f9c2f3a3d62a',
            },
            'width': 184,
            'height': 30,
            'selected': False,
            'positionAbsolute': {'x': 418.8125, 'y': 1071},
            'dragging': False,
            'parentId': 'sad-apples-appear',
        },
        {
            'id': 'RhEl0dU5hqHmBtOy92eDj',
            'type': 'child',
            'position': {'x': 367, 'y': 25},
            'data': {
                'iconUrl': '/images/node-terminator.svg',
                'nodeCategory': 'terminator',
                'nodeSubcategory': 'StandardTerminator',
                'nodePartsName': 'L3S3P31',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': None,
                'controlTo': None,
                'meta': None,
                'leftHandleStyle': {'top': 63, 'left': 5},
                'rightHandleStyle': {'top': 63, 'left': 180},
                'commandPaletteButtonStyle': {'top': 42, 'left': 11, 'right': 10},
                'leftHandleConnected': True,
                'rightHandleConnected': False,
                'partsId': '8a714a91168b796a27d449aae65d3b3bdffee30d737b94fb255e710e2b0427b4',
            },
            'width': 184,
            'height': 78,
            'selected': False,
            'positionAbsolute': {'x': 591.8125, 'y': 1023},
            'dragging': False,
            'parentId': 'sad-apples-appear',
        },
        {
            'id': '03PeAEAA3uRVcCqVHwftQ',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'data': {
                'iconUrl': '/images/node-promoter.svg',
                'nodeCategory': 'promoter',
                'nodeSubcategory': 'RepressivePromoter',
                'nodePartsName': 'PameR',
                'sequence': 'gatagtgacaaacttgacaactcatcacttcctaggtataatgctagc',
                'controlBy': [
                    {
                        'partsId': '89369dbb6260c55bde1634ef497efb19f26f7e8eeb19bf949500a9575209b4a6',
                        'controlType': 'Repression',
                    }
                ],
                'controlTo': None,
                'meta': None,
                'leftHandleStyle': {'top': 68, 'left': 5},
                'rightHandleStyle': {'top': 68, 'left': 180},
                'commandPaletteButtonStyle': {'top': 47, 'left': 11, 'right': 10},
                'leftHandleConnected': False,
                'rightHandleConnected': True,
                'partsId': '3185f745eb818a94545e9a8607a4541ef31e47ba6a246ad8eb73fe078fc1542c',
            },
            'width': 184,
            'height': 83,
            'selected': False,
            'dragging': False,
            'positionAbsolute': {'x': 244.8125, 'y': 1018},
            'parentId': 'sad-apples-appear',
        },
        {
            'id': 'soft-rabbits-boil',
            'type': 'parent',
            'position': {'x': 230.8125, 'y': 1316},
            'style': {'width': 571, 'height': 123},
            'data': {'width': 571, 'height': 123},
            'width': 571,
            'height': 123,
            'positionAbsolute': {'x': 230.8125, 'y': 1316},
        },
        {
            'id': 'QaBV3nMXJxcNaNN_hE6ji',
            'type': 'child',
            'position': {'x': 194, 'y': 73},
            'data': {
                'iconUrl': '/images/node-protein.svg',
                'nodeCategory': 'protein',
                'nodeSubcategory': 'RepressorProtein',
                'nodePartsName': 'AmeR',
                'sequence': 'atgaacaaaaccattgatcaggtgcgtaaaggtgatcgtaaaagcgatctgccggttcgtcgtcgtccgcgtcgtagtgccgaagaaacccgtcgtgatattctggcaaaagccgaagaactgtttcgtgaacgtggttttaatgcagttgccattgcagatattgcaagcgcactgaatatgagtccggcaaatgtgtttaaacattttagcagcaaaaacgcactggttgatgcaattggttttggtcagattggtgtttttgaacgtcagatttgtccgctggataaaagccatgcaccgctggatcgtctgcgtcatctggcacgtaatctgatggaacagcatcatcaggatcatttcaaacacatacgggtttttattcagatcctgatgaccgccaaacaggatatgaaatgtggcgattattacaaaagcgtgattgcaaaactgctggccgaaattattcgtgatggtgttgaagcaggtctgtatattgcaaccgatattccggttctggcagaaaccgttctgcatgcactgaccagcgttattcatccggttctgattgcacaagaagatattggtaatctggcaacccgttgtgatcagctggttgatctgattgatgcaggtctgcgtaatccgctggcaaaataa',  # noqa: E501
                'controlBy': None,
                'controlTo': [
                    {
                        'partsId': '3185f745eb818a94545e9a8607a4541ef31e47ba6a246ad8eb73fe078fc1542c',
                        'controlType': 'Repression',
                    }
                ],
                'meta': {'Pmax': 0.5, 'Ymax': 1, 'Ymin': 0.2, 'K': 3, 'n': 2, 'Dp': 0.1},
                'leftHandleStyle': {'top': 15, 'left': 6},
                'rightHandleStyle': {'top': 15, 'left': 178},
                'commandPaletteButtonStyle': {'top': -6, 'left': 12, 'right': 30},
                'leftHandleConnected': True,
                'rightHandleConnected': True,
                'partsId': '89369dbb6260c55bde1634ef497efb19f26f7e8eeb19bf949500a9575209b4a6',
            },
            'width': 184,
            'height': 30,
            'selected': False,
            'positionAbsolute': {'x': 424.8125, 'y': 1389},
            'dragging': False,
            'parentId': 'soft-rabbits-boil',
        },
        {
            'id': 'Vc0hhaojeiO-2MNutZQKK',
            'type': 'child',
            'position': {'x': 367, 'y': 25},
            'data': {
                'iconUrl': '/images/node-terminator.svg',
                'nodeCategory': 'terminator',
                'nodeSubcategory': 'StandardTerminator',
                'nodePartsName': 'L3S3P31',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': None,
                'controlTo': None,
                'meta': None,
                'leftHandleStyle': {'top': 63, 'left': 5},
                'rightHandleStyle': {'top': 63, 'left': 180},
                'commandPaletteButtonStyle': {'top': 42, 'left': 11, 'right': 10},
                'leftHandleConnected': True,
                'rightHandleConnected': False,
                'partsId': '8a714a91168b796a27d449aae65d3b3bdffee30d737b94fb255e710e2b0427b4',
            },
            'width': 184,
            'height': 78,
            'selected': True,
            'positionAbsolute': {'x': 597.8125, 'y': 1341},
            'dragging': False,
            'parentId': 'soft-rabbits-boil',
        },
        {
            'id': 'bbV7AW66sYRL9UJFXq7uH',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'data': {
                'iconUrl': '/images/node-promoter.svg',
                'nodeCategory': 'promoter',
                'nodeSubcategory': 'RepressivePromoter',
                'nodePartsName': 'Pbm3r1',
                'sequence': 'tctgattcgttaccaattgacggaatgaacgttcattccgataatgctagc',
                'controlBy': [
                    {
                        'partsId': '8e962d8c0de8f20c5dc9047784fc10f3b55053a300cf987bfca6f9c2f3a3d62a',
                        'controlType': 'Repression',
                    }
                ],
                'controlTo': None,
                'meta': None,
                'leftHandleStyle': {'top': 68, 'left': 5},
                'rightHandleStyle': {'top': 68, 'left': 180},
                'commandPaletteButtonStyle': {'top': 47, 'left': 11, 'right': 10},
                'leftHandleConnected': False,
                'rightHandleConnected': True,
                'partsId': '3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c',
            },
            'width': 184,
            'height': 83,
            'selected': False,
            'dragging': False,
            'positionAbsolute': {'x': 250.8125, 'y': 1336},
            'parentId': 'soft-rabbits-boil',
        },
    ],
    'edges': [
        {
            'id': 'RqmaZoQJZwGYmknciXbMv',
            'source': '03PeAEAA3uRVcCqVHwftQ',
            'target': 'RPp8K6j_urCFeMtsm2pZv',
            'style': {'strokeWidth': 4},
            'data': {'draggedNodeIsTarget': True},
            'animated': False,
        },
        {
            'id': 'f52L26mUXm-boC_k5quts',
            'source': 'RPp8K6j_urCFeMtsm2pZv',
            'target': 'RhEl0dU5hqHmBtOy92eDj',
            'style': {'strokeWidth': 4},
            'data': {'draggedNodeIsTarget': True},
            'animated': False,
        },
        {
            'id': 'FvlTnj3HC3Pjo2BE612Ir',
            'source': 'bbV7AW66sYRL9UJFXq7uH',
            'target': 'QaBV3nMXJxcNaNN_hE6ji',
            'style': {'strokeWidth': 4},
            'data': {'draggedNodeIsTarget': True},
            'animated': False,
        },
        {
            'id': 'fITTsTdEi6WcEXthqlsuy',
            'source': 'QaBV3nMXJxcNaNN_hE6ji',
            'target': 'Vc0hhaojeiO-2MNutZQKK',
            'style': {'strokeWidth': 4},
            'data': {'draggedNodeIsTarget': True},
            'animated': False,
        },
    ],
}
