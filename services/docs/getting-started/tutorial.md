Through this tutorial, you will be able to build and simulate simple `toggle switch` circuit.

![](../assets/imgs/tutorial/tutorial_goal.png)

## 1. Designing a circuit

### Build a single chain
First, we'll build a single **chain**, a sequence of blocks.

You can place any block by dragging and dropping them from the block placement area at the top of the application.

(See [<u>this page</u>](../guides/circuit-design.md) to find out which color means which type of block.)

![](../assets/imgs/tutorial/dnd_parts.png)


By clicking on the block you placed, you can select which biological parts the block represents.

Please select `PameR` in this tutorial.

![](../assets/imgs/tutorial/select_parts.png)

When you drag a new block and bring it near an already existing part, the blocks will automatically connect to each other.

In synergetica, this unit of connection between blocks is called a **chain**.

Connect the green block to the blue block to create a chain. In the green block, select `AmtR` as a part.

![](../assets/imgs/tutorial/dnd_new_parts.png)

Drag a new red block and connect it to the already existing chain. In the red block, select `L3S3P31` as the part.

As shown, a chain basically consists of <span style="color: blue; ">blue</span>(promoter),  <span style="color: green; ">green</span>(protein), and  <span style="color: red; ">red</span>(terminator) blocks in sequence.

![](../assets/imgs/tutorial/single_chain.png)

### Build another chain with DSL

In synergetica, you can build circuit not only through GUI-like operations such as drag-and-drop, but also through **coding with DSL**.

The coding palette appears by clicking the tab button on the left side of the application.

The code to represent the chain you have just constructed is already written in the coding palette.
!!! Note
	The code and the graphical representation of the circuit are **always synchronized**


![](../assets/imgs/tutorial/dsl_pallete.png)

When you copy the existing code and paste it on the line immediately after, the same chain will appear.

![](../assets/imgs/tutorial/dsl_copy_paste.png)

Then, please change the names of the two parts enclosed by the red frame in the image from `PameR`→`PamtR` and `AmtR`→`AmeR`, respectively.
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

After that, the name displayed on the block will also be changed and a blue arrow will appear from the green block.

Now, you completed building toggle switch circuit :raised_hands: .

![](../assets/imgs/tutorial/dsl_name_change.png)


## 2. Simulation

When the circuit construction is complete, press the `Simulate` button in the lower right corner of the application. 

This will automatically open the simulation tab from the right side and display the results.

The graph shows the time concentration change of the protein (green block) in this circuit.

![](../assets/imgs/tutorial/simulation_first.png)


Two slide bars also appear below the graph. 

Each of these corresponds to a protein in the green block, allowing you to adjust the translation intensity of the protein.

Changing the value of the slide bar seamlessly reflects the corresponding simulation results in the graph.

![](../assets/imgs/tutorial/simulation_bar_move.png)

## 3. Generating sequences

xxx
