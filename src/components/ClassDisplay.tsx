import React from "react";
import { Attributes, Class } from "../types";

interface ClassDisplayProps {
  classes: Record<Class, Attributes>;
  attributes: Attributes;
  onSelectClass: (characterClass: Class) => void;
  selectedClass: Class | null;
}

const ClassDisplay: React.FC<ClassDisplayProps> = ({ classes, attributes, onSelectClass, selectedClass }) => {
  const qualifiesForClass = (characterClass: Attributes) => {
    return Object.entries(characterClass).every(
      ([attrName, minVal]) =>
        attributes[attrName as keyof Attributes] >= minVal
    );
  };

  return (
    <div>
      <h2>Classes</h2>
      {Object.entries(classes).map(([className, classRequirements]) => (
        <div key={className} style={{ color: qualifiesForClass(classRequirements) ? "green" : "grey" }}>
          <span onClick={() => onSelectClass(className as Class)}>{className}</span>
        </div>
      ))}
      {selectedClass && (
        <div>
          <h3>Requirements for {selectedClass}</h3>
          <ul>
            {Object.entries(classes[selectedClass]).map(([attr, val]) => (
              <li key={attr}>{attr}: {val}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassDisplay;
