/** @jsxImportSource @emotion/react */
import React from "react";
import type { FC } from "react";
import {css} from "@emotion/react";
import Block from "@/components/GUI/Block";

export const Tray: FC = () => {
  return (
      <div className="App" css={appStyle}>
        <div css={scrollContainerStyle}>
          <Block name="Constitutive" color="#2E86C1" />
          <Block name="Repressor repressed" color="#1F618D" />
          <Block name="Blue-light activated" color="#2874A6" />
          <Block name="GFP gene" color="#8E44AD" />
          <Block name="Repressor A gene" color="#D35400" />
          <Block name="Blue-light-s gene" color="#DC7633" />
          <Block name="Terminator" color="#C0392B" />
          <Block name="Recombinase I gene" color="#E74C3C" />
          <Block name="Recognition I" color="#27AE60" />
          <Block name="Kill Switch" color="#E74C3C" />
        </div>
      </div>
    );
};


/* styles */
const appStyle = css`
  position: relative;
  height: 100vh;
`;

const scrollContainerStyle = css`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  position: absolute;
  bottom: 0;
  width: 97.5%;
  height: 30%; 

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
