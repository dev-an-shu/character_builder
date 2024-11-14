import React from "react";
import { Attributes } from "../types";

interface AttributeControlsProps {
  attributes: Attributes;
  onAttributeChange: (name: keyof Attributes, delta: number) => void;
  getModifier: (value: number) => number;
}

const AttributeControls: React.FC<AttributeControlsProps> = ({ attributes, onAttributeChange, getModifier }) => {
  const attributeSum = Object.values(attributes).reduce((sum, val) => sum + val, 0);
  const isMaxReached = attributeSum >= 70;

  return (
    <div>
      <h2>Attributes</h2>
      {Object.entries(attributes).map(([name, value]) => (
        <div key={name}>
          <span>{name}: {value}</span>
          <button
            onClick={() => onAttributeChange(name as keyof Attributes, 1)}
            disabled={isMaxReached && value < 10}
          >
            +
          </button>
          <button onClick={() => onAttributeChange(name as keyof Attributes, -1)}>-</button>
          <span>Modifier: {getModifier(value)}</span>
        </div>
      ))}
      {isMaxReached && <p>Max attribute points reached (70). Adjust other attributes to increase further.</p>}
    </div>
  );
};

export default AttributeControls;
