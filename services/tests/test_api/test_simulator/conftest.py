# ruff: noqa: E501

import pytest


@pytest.fixture
def test_circuit_flipflop():
    return FLIPFLOP_CIRCUIT


@pytest.fixture
def test_circuit_hybrid():
    return HYBRID_PROMOTER_CIRCUIT


FLIPFLOP_CIRCUIT = {
    'nodes': [
        # Parent nodes
        {
            'id': 'chain-id-1',
            'type': 'parent',
            'position': {'x': 100, 'y': 16},
            'width': 680,
            'height': 166,
            'data': {},
        },
        {
            'id': 'chain-id-2',
            'type': 'parent',
            'position': {'x': 294, 'y': 387},
            'width': 680,
            'height': 166,
            'data': {},
        },
        # Child nodes
        # Chain 1
        {
            'id': 'chain-1-node-1-PameR',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'PameR',
                'description': 'Regulated Promoter repressed by AmeR',
                'sequence': 'gatagtgacaaacttgacaactcatcacttcctaggtataatgctagc',
                'controlBy': [
                    {'name': 'AmeR', 'type': 'Repression', 'params': {'Ymax': 3.8, 'Ymin': 0.2, 'K': 0.09, 'n': 1.4}}
                ],
                'params': {'Ydef': 3.8},
            },
            'parentId': 'chain-id-1',
        },
        {
            'id': 'chain-1-node-2-BM3R1',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'BM3R1',
                'description': 'Repressor Protein of Pbm3R1',
                'sequence': 'atggaaagcaccccgaccaaacagaaagcaatttttagcgcaagcctgctgctgtttgcagaacgtggttttgatgcaaccaccatgccgatgattgcagaaaatgcaaaagttggtgcaggcaccatttatcgctatttcaaaaacaaagaaagcctggtgaacgaactgtttcagcagcatgttaatgaatttctgcagtgtattgaaagcggtctggcaaatgaacgtgatggttatcgtgatggctttcatcacatttttgaaggtatggtgacctttaccaaaaatcatccgcgtgcactgggttttatcaaaacccatagccagggcacctttctgaccgaagaaagccgtctggcatatcagaaactggttgaatttgtgtgcaccttttttcgtgaaggtcagaaacagggtgtgattcgtaatctgccggaaaatgcactgattgcaattctgtttggcagctttatggaagtgtatgaaatgatcgagaacgattatctgagcctgaccgatgaactgctgaccggtgttgaagaaagcctgtgggcagcactgagccgtcagagctaa',
                'controlBy': [],
                'params': {'Dp': 0.14726881, 'TIRb': 596.23},
            },
            'parentId': 'chain-id-1',
        },
        {
            'id': 'chain-1-node-3-L3S3P31',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'params': {},
            },
            'parentId': 'chain-id-1',
        },
        # Chain 2
        {
            'id': 'chain-2-node-1-Pbm3r1',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'Pbm3r1',
                'description': 'Regulated Promoter repressed by BM3R1',
                'sequence': 'tctgattcgttaccaattgacggaatgaacgttcattccgataatgctagc',
                'controlBy': [
                    {'name': 'BM3R1', 'type': 'Repression', 'params': {'Ymax': 0.5, 'Ymin': 0.004, 'K': 0.04, 'n': 3.4}}
                ],
                'params': {'Ydef': 0.5},
            },
            'parentId': 'chain-id-2',
        },
        {
            'id': 'chain-2-node-2-AmeR',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'AmeR',
                'description': 'Repressor Protein of PameR',
                'sequence': 'atgaacaaaaccattgatcaggtgcgtaaaggtgatcgtaaaagcgatctgccggttcgtcgtcgtccgcgtcgtagtgccgaagaaacccgtcgtgatattctggcaaaagccgaagaactgtttcgtgaacgtggttttaatgcagttgccattgcagatattgcaagcgcactgaatatgagtccggcaaatgtgtttaaacattttagcagcaaaaacgcactggttgatgcaattggttttggtcagattggtgtttttgaacgtcagatttgtccgctggataaaagccatgcaccgctggatcgtctgcgtcatctggcacgtaatctgatggaacagcatcatcaggatcatttcaaacacatacgggtttttattcagatcctgatgaccgccaaacaggatatgaaatgtggcgattattacaaaagcgtgattgcaaaactgctggccgaaattattcgtgatggtgttgaagcaggtctgtatattgcaaccgatattccggttctggcagaaaccgttctgcatgcactgaccagcgttattcatccggttctgattgcacaagaagatattggtaatctggcaacccgttgtgatcagctggttgatctgattgatgcaggtctgcgtaatccgctggcaaaataa',
                'controlBy': [],
                'params': {'Dp': 0.74589307, 'TIRb': 3019.81},
            },
            'parentId': 'chain-id-2',
        },
        {
            'id': 'chain-2-node-3-L3S3P31',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'params': {},
            },
            'parentId': 'chain-id-2',
        },
    ],
    'edges': [
        # Chain edges
        {
            'id': 'chain-1-node-1-PameR_chain-1-node-2-BM3R1',
            'type': 'connection',
            'source': 'chain-1-node-1-PameR',
            'target': 'chain-1-node-2-BM3R1',
        },
        {
            'id': 'chain-1-node-2-BM3R1_chain-1-node-3-L3S3P31',
            'type': 'connection',
            'source': 'chain-1-node-2-BM3R1',
            'target': 'chain-1-node-3-L3S3P31',
        },
        {
            'id': 'chain-2-node-1-Pbm3r1_chain-2-node-2-AmeR',
            'type': 'connection',
            'source': 'chain-2-node-1-Pbm3r1',
            'target': 'chain-2-node-2-AmeR',
        },
        {
            'id': 'chain-2-node-2-AmeR_chain-2-node-3-L3S3P31',
            'type': 'connection',
            'source': 'chain-2-node-2-AmeR',
            'target': 'chain-2-node-3-L3S3P31',
        },
        # Annotation edges
        {
            'id': 'chain-2-node-2-AmeR_chain-1-node-1-PameR',
            'type': 'annotation',
            'source': 'chain-2-node-2-AmeR',
            'target': 'chain-1-node-1-PameR',
        },
        {
            'id': 'chain-1-node-2-BM3R1_chain-2-node-1-Pbm3r1',
            'type': 'annotation',
            'source': 'chain-1-node-2-BM3R1',
            'target': 'chain-2-node-1-Pbm3r1',
        },
    ],
}


HYBRID_PROMOTER_CIRCUIT = {
    'nodes': [
        # Parent nodes
        {
            'id': 'chain-id-1',
            'type': 'parent',
            'position': {'x': 100, 'y': 7},
            'width': 680,
            'height': 166,
            'data': {},
        },
        {
            'id': 'chain-id-2',
            'type': 'parent',
            'position': {'x': 465.9839829458, 'y': 257.02135607226654},
            'width': 680,
            'height': 166,
            'data': {},
        },
        {
            'id': 'chain-id-3',
            'type': 'parent',
            'position': {'x': 88.74874791620005, 'y': 530.0388849832959},
            'width': 910,
            'height': 166,
            'data': {},
        },
        # Child nodes
        # Chain 1
        {
            'id': 'chain-1-node-1-PphlF',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'PphlF',
                'description': 'Regulated Promoter repressed by PhlF',
                'sequence': 'tctgattcgttaccaattgacatgatacgaaacgtaccgtatcgttaaggt',
                'controlBy': [
                    {'name': 'PhlF', 'type': 'Repression', 'params': {'Ymax': 3.9, 'Ymin': 0.01, 'K': 0.03, 'n': 4}}
                ],
                'params': {'Ydef': 3.9},
            },
            'parentId': 'chain-id-1',
        },
        {
            'id': 'chain-1-node-2-AmeR',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'AmeR',
                'description': 'Repressor Protein of PameR',
                'sequence': 'atgaacaaaaccattgatcaggtgcgtaaaggtgatcgtaaaagcgatctgccggttcgtcgtcgtccgcgtcgtagtgccgaagaaacccgtcgtgatattctggcaaaagccgaagaactgtttcgtgaacgtggttttaatgcagttgccattgcagatattgcaagcgcactgaatatgagtccggcaaatgtgtttaaacattttagcagcaaaaacgcactggttgatgcaattggttttggtcagattggtgtttttgaacgtcagatttgtccgctggataaaagccatgcaccgctggatcgtctgcgtcatctggcacgtaatctgatggaacagcatcatcaggatcatttcaaacacatacgggtttttattcagatcctgatgaccgccaaacaggatatgaaatgtggcgattattacaaaagcgtgattgcaaaactgctggccgaaattattcgtgatggtgttgaagcaggtctgtatattgcaaccgatattccggttctggcagaaaccgttctgcatgcactgaccagcgttattcatccggttctgattgcacaagaagatattggtaatctggcaacccgttgtgatcagctggttgatctgattgatgcaggtctgcgtaatccgctggcaaaataa',
                'controlBy': [],
                'params': {'Dp': 0.74589307, 'TIRb': 3019.81},
            },
            'parentId': 'chain-id-1',
        },
        {
            'id': 'chain-1-node-3-L3S3P31',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'params': {},
            },
            'parentId': 'chain-id-1',
        },
        # Chain 2
        {
            'id': 'chain-2-node-1-PpsrA',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'PpsrA',
                'description': 'Regulated Promoter repressed by PsrA',
                'sequence': 'aggaacaaacgtttgattgacagctagctcagtcctaggtataatgctagc',
                'controlBy': [
                    {'name': 'PsrA', 'type': 'Repression', 'params': {'Ymax': 5.9, 'Ymin': 0.2, 'K': 0.19, 'n': 1.8}}
                ],
                'params': {'Ydef': 5.9},
            },
            'parentId': 'chain-id-2',
        },
        {
            'id': 'chain-2-node-2-AmtR',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'AmtR',
                'description': 'Repressor Protein of PamtR',
                'sequence': 'atggcaggcgcagttggtcgtccgcgtcgtagtgcaccgcgtcgtgcaggtaaaaatccgcgtgaagaaattctggatgcaagcgcagaactgtttacccgtcagggttttgcaaccaccagtacccatcagattgcagatgcagttggtattcgtcaggcaagcctgtattatcattttccgagcaaaaccgaaatctttctgaccctgctgaaaagcaccgttgaaccgagcaccgttctggcagaagatctgagcaccctggatgcaggtccggaaatgcgtctgtgggcaattgttgcaagcgaagttcgtctgctgctgagcaccaaatggaatgttggtcgtctgtatcagctgccgattgttggtagcgaagaatttgcagaatatcatagccagcgtgaagcactgaccaatgtttttcgtgatctggcaaccgaaattgttggtgatgatccgcgtgcagaactgccgtttcatattaccatgagcgttattgaaatgcgtcgcaatgatggtaaaattccgagtccgctgagcgcagatagcctgccggaaaccgcaattatgctggcagatgcaagcctggcagttctgggtgcaccgctgcctgcagatcgtgttgaaaaaaccctggaactgattaaacaggcagatgcaaaataa',
                'controlBy': [],
                'params': {'Dp': 0.26308464, 'TIRb': 1065.12},
            },
            'parentId': 'chain-id-2',
        },
        {
            'id': 'chain-2-node-3-BetI',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'BetI',
                'description': 'Repressor Protein of BetI',
                'sequence': 'atgccgaaactgggtatgcagagcattcgtcgtcgtcagctgattgatgcaaccctggaagcaattaatgaagttggtatgcatgatgcaaccattgcacagattgcacgtcgtgccggtgttagcaccggtattattagccattatttccgcgataaaaacggtctgctggaagcaaccatgcgtgatattaccagccagctgcgtgatgcagttctgaatcgtctgcatgcactgccgcagggtagcgcagaacagcgtctgcaggcaattgttggtggtaattttgatgaaacccaggttagcagcgcagcaatgaaagcatggctggcattttgggcaagcagcatgcatcagccgatgctgtatcgtctgcagcaggttagcagtcgtcgtctgctgagcaatctggttagcgaatttcgtcgtgaactgcctcgtgaacaggcacaagaggcaggttatggtctggcagcactgattgatggtctgtggctgcgtgcagcactgagcggtaaaccgctggataaaacccgtgcaaatagcctgacccgtcattttatcacccagcatctgccgaccgattaa',
                'controlBy': [],
                'params': {'Dp': 0.12914642, 'TIRb': 522.86},
            },
            'parentId': 'chain-id-2',
        },
        {
            'id': 'chain-2-node-4-L3S3P31',
            'type': 'child',
            'position': {'x': 710, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'params': {},
            },
            'parentId': 'chain-id-2',
        },
        # Chain 3
        {
            'id': 'chain-3-node-1-PameR',
            'type': 'child',
            'position': {'x': 20, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'PameR',
                'description': 'Regulated Promoter repressed by AmeR',
                'sequence': 'gatagtgacaaacttgacaactcatcacttcctaggtataatgctagc',
                'controlBy': [
                    {'name': 'AmeR', 'type': 'Repression', 'params': {'Ymax': 3.8, 'Ymin': 0.2, 'K': 0.09, 'n': 1.4}}
                ],
                'params': {'Ydef': 3.8},
            },
            'parentId': 'chain-id-3',
        },
        {
            'id': 'chain-3-node-2-PamtR',
            'type': 'child',
            'position': {'x': 250, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Promoter',
                'name': 'PamtR',
                'description': 'Regulated Promoter repressed by AmtR',
                'sequence': 'gattcgttaccaattgacagtttctatcgatctatagataatgctagc',
                'controlBy': [
                    {'name': 'AmtR', 'type': 'Repression', 'params': {'Ymax': 3.8, 'Ymin': 0.08, 'K': 0.07, 'n': 1.6}}
                ],
                'params': {'Ydef': 3.8},
            },
            'parentId': 'chain-id-3',
        },
        {
            'id': 'chain-3-node-3-BetI',
            'type': 'child',
            'position': {'x': 480, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Protein',
                'name': 'BetI',
                'description': 'Repressor Protein of BetI',
                'sequence': 'atgccgaaactgggtatgcagagcattcgtcgtcgtcagctgattgatgcaaccctggaagcaattaatgaagttggtatgcatgatgcaaccattgcacagattgcacgtcgtgccggtgttagcaccggtattattagccattatttccgcgataaaaacggtctgctggaagcaaccatgcgtgatattaccagccagctgcgtgatgcagttctgaatcgtctgcatgcactgccgcagggtagcgcagaacagcgtctgcaggcaattgttggtggtaattttgatgaaacccaggttagcagcgcagcaatgaaagcatggctggcattttgggcaagcagcatgcatcagccgatgctgtatcgtctgcagcaggttagcagtcgtcgtctgctgagcaatctggttagcgaatttcgtcgtgaactgcctcgtgaacaggcacaagaggcaggttatggtctggcagcactgattgatggtctgtggctgcgtgcagcactgagcggtaaaccgctggataaaacccgtgcaaatagcctgacccgtcattttatcacccagcatctgccgaccgattaa',
                'controlBy': [],
                'params': {'Dp': 0.12914642, 'TIRb': 522.86},
            },
            'parentId': 'chain-id-3',
        },
        {
            'id': 'chain-3-node-4-L3S3P31',
            'type': 'child',
            'position': {'x': 710, 'y': 20},
            'width': 180,
            'height': 126,
            'data': {
                'category': 'Terminator',
                'name': 'L3S3P31',
                'description': 'Standard Terminator',
                'sequence': 'ccaattattgaacaccctaacgggtgtttttttttttttggtctacc',
                'controlBy': [],
                'params': {},
            },
            'parentId': 'chain-id-3',
        },
    ],
    'edges': [
        # Chain edges
        {
            'id': 'chain-1-node-1-PphlF_chain-1-node-2-AmeR',
            'type': 'connection',
            'source': 'chain-1-node-1-PphlF',
            'target': 'chain-1-node-2-AmeR',
        },
        {
            'id': 'chain-1-node-2-AmeR_chain-1-node-3-L3S3P31',
            'type': 'connection',
            'source': 'chain-1-node-2-AmeR',
            'target': 'chain-1-node-3-L3S3P31',
        },
        {
            'id': 'chain-2-node-1-PpsrA_chain-2-node-2-AmtR',
            'type': 'connection',
            'source': 'chain-2-node-1-PpsrA',
            'target': 'chain-2-node-2-AmtR',
        },
        {
            'id': 'chain-2-node-2-AmtR_chain-2-node-3-BetI',
            'type': 'connection',
            'source': 'chain-2-node-2-AmtR',
            'target': 'chain-2-node-3-BetI',
        },
        {
            'id': 'chain-2-node-3-BetI_chain-2-node-4-L3S3P31',
            'type': 'connection',
            'source': 'chain-2-node-3-BetI',
            'target': 'chain-2-node-4-L3S3P31',
        },
        {
            'id': 'chain-3-node-1-PameR_chain-3-node-2-PamtR',
            'type': 'connection',
            'source': 'chain-3-node-1-PameR',
            'target': 'chain-3-node-2-PamtR',
        },
        {
            'id': 'chain-3-node-2-PamtR_chain-3-node-3-BetI',
            'type': 'connection',
            'source': 'chain-3-node-2-PamtR',
            'target': 'chain-3-node-3-BetI',
        },
        {
            'id': 'chain-3-node-3-BetI_chain-3-node-4-L3S3P31',
            'type': 'connection',
            'source': 'chain-3-node-3-BetI',
            'target': 'chain-3-node-4-L3S3P31',
        },
        # Annotation edges
        {
            'id': 'chain-1-node-2-AmeR_chain-3-node-1-PameR',
            'type': 'annotation',
            'source': 'chain-1-node-2-AmeR',
            'target': 'chain-3-node-1-PameR',
        },
        {
            'id': 'chain-2-node-2-AmtR_chain-3-node-2-PamtR',
            'type': 'annotation',
            'source': 'chain-2-node-2-AmtR',
            'target': 'chain-3-node-2-PamtR',
        },
    ],
}
