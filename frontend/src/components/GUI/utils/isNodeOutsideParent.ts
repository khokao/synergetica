export const isNodeOutsideParent = (childNode, parentNode) => {
  const px = parentNode.position.x;
  const py = parentNode.position.y;
  const pw = Number(parentNode.style.width);
  const ph = Number(parentNode.style.height);
  const cx = px + childNode.position.x;
  const cy = py + childNode.position.y;
  const cw = Number(childNode.width);
  const ch = Number(childNode.height);
  return cx + cw <= px || cx >= px + pw || cy + ch <= py || cy >= py + ph;
};
