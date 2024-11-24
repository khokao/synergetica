/*
This code is base on https://github.com/soranoo/reactflow-better-bezier-edge, with modifications.

MIT License

Copyright (c) 2024 Freeman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Position, getBezierPath } from "@xyflow/react";

interface GetBetterBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  offset?: number;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const getControl = ({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] => {
  return pos === Position.Left || pos === Position.Right ? [(x1 + x2) / 2, y1] : [x1, (y1 + y2) / 2];
};

const getOffsetControl = (pos: Position, x: number, y: number, offset: number): [number, number] => {
  switch (pos) {
    case Position.Top:
      return [x, y - offset];
    case Position.Bottom:
      return [x, y + offset];
    case Position.Left:
      return [x - offset, y];
    case Position.Right:
      return [x + offset, y];
    default:
      return [x + offset, y];
  }
};

export const getBetterBezierPath = ({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  offset = 0,
}: GetBetterBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] => {
  let [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  let [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });

  if (offset) {
    [sourceControlX, sourceControlY] = getOffsetControl(sourcePosition, sourceX, sourceY, offset);
    [targetControlX, targetControlY] = getOffsetControl(targetPosition, targetX, targetY, offset);
  }

  const [, labelX, labelY, offsetX, offsetY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;

  return [path, labelX, labelY, offsetX, offsetY];
};
