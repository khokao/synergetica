const createAdjacencyList = (nds, eds) => {
  const adjacencyList = {};

  const nodeSet = new Set(nds.map((n) => n.id));

  for (const n of nds) {
    adjacencyList[n.id] = [];
  }

  for (const e of eds) {
    if (nodeSet.has(e.source) && nodeSet.has(e.target)) {
      adjacencyList[e.source].push(e.target);
      adjacencyList[e.target].push(e.source);
    }
  }

  return adjacencyList;
};

const dfs = (nodeId, adjacencyList, visited, group, nodeMap) => {
  visited.add(nodeId);
  group.push(nodeMap[nodeId]);

  for (const neighbor of adjacencyList[nodeId]) {
    if (!visited.has(neighbor)) {
      dfs(neighbor, adjacencyList, visited, group, nodeMap);
    }
  }
};

export const divideNodesByEdges = (nds, eds) => {
  const adjacencyList = createAdjacencyList(nds, eds);
  const visited = new Set();
  const groups = [];

  const nodeMap = {};
  for (const n of nds) {
    nodeMap[n.id] = n;
  }

  for (const n of nds) {
    if (!visited.has(n.id)) {
      const group = [];
      dfs(n.id, adjacencyList, visited, group, nodeMap);
      groups.push(group);
    }
  }

  return groups;
};
