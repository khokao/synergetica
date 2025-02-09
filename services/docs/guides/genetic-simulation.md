This page explains how to start a simulation and adjust its parameters.

## Starting a simulation

After designing a <u>[valid circuit](./circuit-design.md#completing-valid-circuits)</u>, you can begin the simulation by clicking the **"Start"** button in the bottom-right corner. Once the simulation starts, a sidebar opens on the right. It displays a results graph and a set of adjustable sliders.

![](../assets/imgs/guides/genetic-simulation/simulation_whole.png)

!!! note
	To start the simulation, your circuit must be valid ( :fontawesome-regular-circle-check:{ .ok } ) and the API must be connected ( :octicons-zap-24:{ .ok } ).

!!! note
	Whenever you modify the circuit or click the **"Reset"** button, the simulation results are automatically cleared.

## Adjusting parameters

The graph shows how protein concentrations change over time within your circuit. You can adjust the translation initiation rate (TIR) for each protein block using the sliders.

Each slider has a colored dot beside its label. Find the protein block in your circuit with the same outline color to identify which slider controls that block.

!!! tip
	You can also type values directly into the numeric fields beside each slider.

!!! note
	Although every protein block has its own slider, blocks that share the same protein name are merged into a single curve on the graph. This is because Synergetica computes the total expression of each protein in the cell.

	If you have multiple blocks of the same protein, they are labeled with a number (e.g., BM3R1 [1], BM3R1 [2]). The graph is drawn using the color assigned to the first block ([1]).

	![](../assets/imgs/guides/genetic-simulation/simulation_multiple_same_protein.png)

## Technical details

Synergetica simulates how protein concentrations change over time for every protein in a designed circuit. When you click the **"Start"** button, it automatically constructs a set of differential equations based on the circuit’s structure and then uses Euler’s method to compute an approximate solution.

### Formulation

Synergetica creates differential equations for each protein block to model two biological events: **transcription** and **translation**. These equations and their parameters are based on <u>[**Cello** (Nielsen, Alec AK, et al. Science, 2016)](https://www.science.org/doi/full/10.1126/science.aac7341)</u>, a leading study in genetic circuit design.

| Biological Event | Example Equation                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transcription    | $\frac{d[ProtX_m]}{dt} = PCN\cdot \zeta \cdot  \left\{Y_{\min} + \left(Y_{\max} - Y_{\min}\right) \cdot \frac{K^n}{K^n + [ProtX_m]^n}\right\} - D_{mRNA}\cdot[ProtX_m]$ |
| Translation      | $\frac{d[ProtX_p]}{dt} = E_{RPU}\cdot \frac{TIR}{TIRb} - D_{ProtX_p}\cdot[ProtX_p]$                                                                                     |

- [$ProtX_m$] represents the mRNA concentration of Protein X.
- [$ProtX_p$] represents the protein concentration of Protein X.

The table below briefly describes each parameter.

| Parameter  | Description                                                                         |
| ---------- | ----------------------------------------------------------------------------------- |
| $PCN$      | Plasmid copy number (copies/cell). Default is 15.                                   |
| $\zeta$    | Translate coefficient from RPU to mRNA (units: [mRNA]/(min·RPU)). Default is 0.025. |
| $D_{mRNA}$ | Degradation rate of mRNA ([1/s]), shared by all parts.  Default is 0.025.           |
| $E_{RPU}$  | Translation efficiency coefficient. Default is 0.02.                                |
| $TIR$      | Translation initiation rate. Adjustable via the slider.                             |

!!! note
	For details on other parameters, see the <u>[guide on parts customization](./parts-customization.md#promoter-specific-parameters)</u>.

!!! tip
	For more details on the simulation’s underlying logic, see the <u>[implementation code](https://github.com/khokao/synergetica/blob/main/services/src/api/simulator/service.py)</u>.
