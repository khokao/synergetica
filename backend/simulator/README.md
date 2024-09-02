# Simulator

## 1. Set up a server with FastAPI (dev)

```zsh
poetry run fastapi dev simulator/api/main.py
```

## Using ode solver independently

```python
import numpy as np
from euler import solve_ode_with_euler


# define ode to solve following like this.
def sample_ode(var:list[float],t:float,const1:float,const2:float):
	da = var[1] * const1
	db = var[0] * const2
	return (da,db)

times = np.arange(0,30,0.1) # define time steps. (start,end,interval)
var_init = [0.1,0.2] # len(var_init) have to match to len(var)
args = {'const1':3,'const2':5} # key have to match to parameter of ode function 

solution = solve_ode_with_euler(sample_ode,times,var_init,args) # solution.shape = [len(var),len(times)]

```

