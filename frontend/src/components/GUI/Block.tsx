/** @jsxImportSource @emotion/react */
import React from 'react';
import {css} from '@emotion/react';

interface BlockProps {
  name: string;
  color: string;
}


const blockStyle = css`
  display: inline-block;
	padding: 20px 20px;
	margin: 5px;
	color: white;
	font-weight: bold;
	border-radius: 5px;
	cursor: pointer;
	white-space: nowrap;
`

const Block: React.FC<BlockProps> = ({ name, color }) => {
  return (
    <div css={blockStyle} style={{ backgroundColor: color }}>
      {name}
    </div>
  );
}

export default Block;
