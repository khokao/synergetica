This page explains how to generate sequences and export them in FASTA format.

## Generating sequences

After you have designed your circuit and adjusted the desired parameters in the simulation section, you can generate optimized DNA sequences based on those parameters.

To start the generation process, click the **"Run"** button in the Generation section.

![](../assets/imgs/guides/sequence-generation/whole_screen_for_generation.png)

!!! tip
	During generation, a popup will appear in the bottom-right corner of the screen. If you want to stop the process, click the **"Cancel"** button inside that popup.

!!! info
	Generation time may vary depending on the number of proteins in your circuit and your machine’s specifications.

## Viewing results

Once sequence generation is complete, the **"Result"** button becomes available. Clicking it will open a window displaying your results, as shown below.

![](../assets/imgs/guides/sequence-generation/viewing_result.png)

On the left side of the window, you can see your circuit along with the parameters you specified. On the right side, a table displays the resulting sequences. Each chain is assigned a random ID, which appears in both the circuit and the table.

## Exporting a FASTA file

To export generated sequences as a FASTA file, click the **"Export FASTA"** button.

In the FASTA file, the names of the sequences are set to their corresponding chain IDs. For example, the exported file may look like this:

``` fasta title="Example FASTA"
> stupid-crabs-allow
GATTCGTTACCAATTGACAGTTTCTATCGATCTATAGATAATGCTAGCGGACCCCGCCATCAGCTGCATGAAGTATCAGCCAATTATTGAACACCCTAACGGGTGTTTTTTTTTTTTTGGTCTACC
> brown-rice-wish
GATAGTGACAAACTTGACAACTCATCACTTCCTAGGTATAATGCTAGCTGGCTGCCCTGCGCGTGCAAGCCTCGGGATCCCAATTATTGAACACCCTAACGGGTGTTTTTTTTTTTTTGGTCTACC
```

## Technical details

### Generated sequence

Synergetica generates ribosome binding sites (RBS) sequences according to the parameters specified in the simulation section. Because the RBS sequence regulates the translation rate of each downstream protein, it is inserted directly before the coding region for that protein. As a result, each chain’s final sequence is formed by concatenating all blocks, with an RBS placed immediately before every protein.

![](../assets/imgs/guides/sequence-generation/generation_sequence_order.png)

### Generation algorithm

In Synergetica, RBS sequences are optimized using a genetic algorithm. During optimization, we employ a prediction model that estimates the translation initiation rate (TIR) based on each RBS sequence.

!!! info
	For more detailed information on training the prediction model, see the <u>[GitHub README](https://github.com/khokao/synergetica/tree/main/services#43-ml-model-training-and-evaluation)</u>.
