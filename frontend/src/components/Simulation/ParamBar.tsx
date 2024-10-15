import type React from "react";

export const paramMinValue = 1;
export const paramMaxValue = 20000;

type ParamInputProps = {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ParamInput: React.FC<ParamInputProps> = ({ label, value, onChange }) => (
  <label className="flex items-center mb-2">
    <span className="inline-block w-16">{label}</span>
    <input
      type="range"
      min={paramMinValue}
      max={paramMaxValue}
      step="1"
      value={value}
      onChange={onChange}
      className="h-1 bg-gray-200 accent-red-500 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
    <input
      type="number"
      min={paramMinValue}
      max={paramMaxValue}
      step="1"
      value={value}
      onChange={onChange}
      className="w-14 text-right"
    />
  </label>
);
