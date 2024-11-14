import React from "react";

interface Skill {
  name: string;
  points: number;
  modifier: number;
  total: number;
  attributeModifier: string;
}

interface SkillDisplayProps {
  skills: Skill[];
  skillPoints: number;
}

const SkillDisplay: React.FC<SkillDisplayProps> = ({ skills, skillPoints }) => {
  return (
    <div>
      <h2>Skills (Points Available: {skillPoints})</h2>
      {skills.map((skill) => (
        <div key={skill.name}>
          <span>
            {skill.name} - Points: {skill.points} Modifier: {skill.modifier} Total: {skill.total}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SkillDisplay;
