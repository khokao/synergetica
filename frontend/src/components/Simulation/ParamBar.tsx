import type React from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 1000;

type ParamInputProps = {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ParamInput: React.FC<ParamInputProps> = ({ label, value, onChange }) => (
  <label className="flex items-center mb-2">
    <span className="inline-block w-16">{label}</span>
    <input type="range" min={MIN_VALUE} max={MAX_VALUE} step="1" value={value} onChange={onChange} className="mx-2" />
    <input
      type="number"
      min={MIN_VALUE}
      max={MAX_VALUE}
      step="1"
      value={value}
      onChange={onChange}
      className="w-14 text-right"
    />
  </label>
);
