This section explains how to customize genetic parts in your database.

![](../assets/imgs/guides/customize-parts/parts_database.png)

The following five buttons let you manage your parts database:

- :material-plus-circle-outline: : **Add** a new part not currently registered
- :material-minus-circle-outline: : **Delete** an existing part from your collection
- :material-pencil-outline: : **Edit** the parameters of a registered part
- :material-arrow-collapse-down: : **Import** a complete collection of parts
- :material-arrow-collapse-up: : **Export** your current collection of parts

## Add parts

Click the :material-plus-circle-outline: button to open a form for entering details about a new part. After filling out the form, click **"Save"** to add the part to your database.

!!! tip
    If you click **"Fill form with existing part"**, you can select an existing part and automatically load its information into the form. This is useful when creating a new part that closely resembles an existing one.

### Common parameters

The following parameters apply to all parts:

| Parameter    | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| Name         | The part’s name. Must be unique in the database.                           |
| Description  | A brief explanation of the part.                                           |
| Category     | The part's category (Promoter, Protein, Terminator).                       |
| DNA sequence | The DNA sequence for the part, containing only the letters A, T, G, and C. |

### Promoter-specific parameters

Promoters have one additional parameter:

| Parameter    | Description |
| ------------ | ----------- |
| Ydef      | The expression strength of the gate in the absence of transcriptional regulators (in [RPU]). For a repressive promoter, this value is the same as Ymax; for an activating promoter, it is the same as Ymin. |

#### Interaction parameters

If a promoter interacts with a specific protein, configure the interaction in the **"Controlled By"** section:

| Parameter    | Description |
| ------------ | ----------- |
| name      | The name of the protein (must already exist in the database).                                                                       |
| type      | The type of interaction (Repression or Activation).                                                                                 |
| Ymax      | The maximum expression rate of the gate (in [RPU]).                                                                                 |
| Ymin      | The minimum expression rate of the gate (in [RPU]), indicating leakage expression.                                                  |
| K         | The Michaelis–Menten constant, i.e., the protein expression level at which the gate’s expression is half of its maximum (in [RPU]). |
| n         | The Hill coefficient of the gate.                                                                                                   |

### Protein-specific parameters

Proteins have additional parameters:

| Parameter | Description                                                                                                                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dp        | The protein degradation rate (in [RPU]). Default values are theoretical, calculated from the steady-state condition when gate expression is at its maximum. Whenever possible, use actual measured values.                                                                          |
| TIRb      | The Translation Initiation Rate measured in baseline experiments to determine parameter values. This represents RBS strength. For more details on Translation Initiation Rate, see <u>[H. M. Salis, C. A. Voigt, Nat. Biotech. 2009](https://www.nature.com/articles/nbt.1568>)</u> |

!!! note
    If any parameters are invalid, an error message will appear. Check the message and correct your input accordingly.

## Delete parts

Click the :material-minus-circle-outline: button to see a list of registered parts. Select the part you want to remove, then confirm to delete it from your database.

## Edit parts

Click the :material-pencil-outline: button to see a list of registered parts. Select the part you want to edit, then modify its settings in the same type of form used for adding parts.

## Import parts collection

Click the :material-arrow-collapse-down: button to import a collection of parts in bulk. The file you import must have the same format as the export file described below.

!!! warning
    This action overwrites your existing parts database.

## Export parts collection

Click the :material-arrow-collapse-up: button to export your current parts database as a JSON file.

!!! note
    The parts database resets whenever the application is restarted. To avoid losing your data, export it beforehand. You can then restore it later by importing the saved JSON file.
