Through this tutorial, you will be able to build and simulate simple **toggle switch** circuit.

![](../assets/imgs/tutorial/tutorial_goal.png)

## 1. Designing a circuit

### Build a single chain
First, we'll build a single **chain**, a sequence of blocks.

You can place any block by dragging it from the block placement area at the top of the application and dropping it onto the main area.

!!! Tip
	See [<u>this page</u>](../guides/circuit-design.md) to understand in more detail what each block means.

![](../assets/imgs/tutorial/dnd_parts.png)


By clicking on the block you placed, you can select which biological parts that block represents.

Please select `PameR` in this tutorial.

![](../assets/imgs/tutorial/select_parts.png)

When you drag a new block and bring it near an already existing block, the blocks will automatically connect to each other.

In Synergetica, this this connected unit of blocks is called a **chain**.

Connect the green block to the blue block to create a chain. In the green block, select `AmtR` as the part.

![](../assets/imgs/tutorial/dnd_new_parts.png)

Drag a new red block and connect it to the already existing chain. In the red block, select `L3S3P31` as the part.

As shown, a chain basically consists of <span style="color: blue; ">blue</span>(promoter),  <span style="color: green; ">green</span>(protein), and  <span style="color: red; ">red</span>(terminator) blocks in sequence.

![](../assets/imgs/tutorial/single_chain.png)

### Build another chain with DSL

In Synergetica, you can build circuit not only through GUI (via drag-and-drop), but also through **writing DSL code.**.

The coding palette appears by clicking the tab button on the left side of the application.

The code to represent the chain you have just constructed is already written in the coding palette.
!!! Note
	The code and the graphical representation of the circuit are **always synchronized**


![](../assets/imgs/tutorial/dsl_pallete.png)

When you copy the existing code and paste it on the line immediately below, the same chain will appear in the graphical view.

![](../assets/imgs/tutorial/dsl_copy_paste.png)

Then, please change the names of the two parts highlighted in the below code sample `PameR`→`PamtR` and `AmtR`→`AmeR`, respectively.
```yaml { hl_lines="10 12" }
- chain:
  - type: Promoter
    name: PameR
  - type: Protein
    name: AmtR
  - type: Terminator
    name: L3S3P31
- chain:
  - type: Promoter
    name: PamtR
  - type: Protein
    name: AmeR
  - type: Terminator
    name: L3S3P31
```

After that, the name displayed on the block will change and a blue arrow will appear from the green block.

Now, you completed building toggle switch circuit :raised_hands: .

![](../assets/imgs/tutorial/dsl_name_change.png)


## 2. Simulation

When the circuit construction is complete, press the `Simulate` button in the lower right corner of the application. 

This will automatically open the simulation tab from the right side and display the results.

The graph shows the time concentration change of the protein (green block) in this circuit.

!!! Tip
	See <u>[this page](../guides/genetic-simulation.md)</u> if you want to know more about what the graphs and slide bars mean biologically.

![](../assets/imgs/tutorial/simulation_first.png)


Two slide bars also appear below the graph. 

Each of these corresponds to a protein in the green block, allowing you to adjust the translation intensity of the protein.

Changing the value of the slide bar seamlessly reflects the corresponding simulation results in the graph.

Adjust the parameters to achieve the protein concentration you desire.

![](../assets/imgs/tutorial/simulation_bar_move.png)


## 3. Generating sequences

Once the parameters have been adjusted, the last step is to generate the specific DNA sequences to realize the parameters.

Press the `Run` button in the `Generation` section at the bottom right of the app, start sequence generation.

![](../assets/imgs/tutorial/generation_generating.png)

When generation is complete, the result can be viewed by pressing the `Result` button.

The generated DNA sequences corresponding to each **chain** will be displayed in the result window.

![](../assets/imgs/tutorial/generation_result.png)

You can also export generated DNA sequneces as **Fasta** format file by pressing on `Export Fasta` button.

```text
> great-coins-check
GATAGTGACAAACTTGACAACTCATCACTTCCTAGGTATAATGCTAGCCAGCGTGTGTTCCGGGGCCACTTGTTACTGCCCAATTATTGAACACCCTAACGGGTGTTTTTTTTTTTTTGGTCTACC

> tangy-parents-dress
GATTCGTTACCAATTGACAGTTTCTATCGATCTATAGATAATGCTAGCGTGCCGACTCGATGGAATGTACCATTGGCCCCCAATTATTGAACACCCTAACGGGTGTTTTTTTTTTTTTGGTCTACC
```

![](../assets/imgs/tutorial/generation_export.png)


**The tutorial is that's all. Let's build your own circuit !!**
