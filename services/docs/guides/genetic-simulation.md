## Starting simulations

- After designed your desired circuit, you can simulate it by clicking **"Start"** button in the Simulation section.
- If the simulation is successful, the right side tab will open and the simulation results section will be displayed.

![](../assets/imgs/guides/genetic-simulation/simulation_whole.png) 

!!! info "Info (Cirtcuit validtion)"
	If the designed circuit is invalid, you can't click **"Start"** button. please check [<u>this page</u>](./circuit-design.md#completing-valid-circuits) for about circuit validation.

!!! Tip "Info (API connection)"
    Check the :lucide-zap: icon at the simulation section to confirm that you’re connected to the backend API. If not connected, you can't click **"Start"** button.

    - :lucide-zap:{ .zap-on } : Connected to the API
    - :lucide-zap-off:{ .zap-off } : Not connected to the API

## Adjusting parameters

- In the simulation result section, parameter bars corresponding to each protein nodes appear.
- Sliding the parameter bar immediately updates the simulation results for that parameter.
- Parameter values can also be changed by entering directly to the value box.

!!! Note
	The parameter range is fixed at 1-20,000 for all parts, so if the entered value was over 20,000, it will automatically be modified to 20,000.

??? Tip  "Tip (When multiple protein nodes with the same name)"
	- If there are **multiple protein nodes with the same name**, numbering suffix are automatically attached to those part names (e.g: BM3R1 [1], BM3R1 [2], ...).
	- You can distinguish the correspondence by the color of the outer border of the protein node and the color next to the parameter bar.
	- However, the concentration(Y-axis) displayed in the simulation graph is the **sum of all the same name protein node**.
	![](../assets/imgs/guides/genetic-simulation/simulation_multiple_same_protein.png)

## Technical details

- Synergetica simulates time concentration changes of all protein for designed circuits.
- When the Start button of the simulation is pressed, a differential formulation is formulated according to the structure of the circuit, and an approximate solution is obtained by Euler's method.


### Formulation

-  In Synergetica, the equations and part parameters are based on [**Cello** (Nielsen, Alec AK, et al. Science, 2016)](https://www.science.org/doi/full/10.1126/science.aac7341), a leading study in genetic circuit design.
