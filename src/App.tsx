import React, { useEffect, useState } from "react";
import AttributeControls from "./components/AttributeControls";
import ClassDisplay from "./components/ClassDisplay";
import SkillDisplay from "./components/SkillDisplay";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST, MAX_ATTRIBUTE_SUM } from "./consts";
import { Attributes, Class } from "./types";
import { fetchCharacters, saveCharacter } from "./api";

interface Character {
  id: string;
  name: string;
  attributes: Attributes;
  selectedClass: Class | null;
  skillPoints: { [skillName: string]: number };
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string>(SKILL_LIST[0].name);
  const [dc, setDC] = useState<number>(10);
  const [rollResult, setRollResult] = useState<string | null>(null);
  const [partyRollResult, setPartyRollResult] = useState<string | null>(null);

  
  useEffect(() => {
      const initializeCharacters = async () => {
          const fetchedCharacters = await fetchCharacters();
          setCharacters(fetchedCharacters.length ? fetchedCharacters : [createNewCharacter("Character 1")]);
        };
        initializeCharacters();
    }, []);
    
    // Create new character with default attributes and skill points
    const createNewCharacter = (name: string): Character => ({
        id: `${Date.now()}`,
        name,
        attributes: ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 10 }), {} as Attributes),
        selectedClass: null,
        skillPoints: SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {}),
    });

    const currentCharacter = characters[currentCharacterIndex] || createNewCharacter("Temporary");

  // Updated character attributes and update character state
  const updateCharacterAttribute = (name: keyof Attributes, delta: number) => {
    const attributeSum = Object.values(currentCharacter.attributes).reduce((sum, val) => sum + val, 0);
    const newAttributeValue = currentCharacter.attributes[name] + delta;

    if (newAttributeValue >= 0 && (delta < 0 || attributeSum + delta <= MAX_ATTRIBUTE_SUM)) {
      const updatedCharacters = [...characters];
      updatedCharacters[currentCharacterIndex].attributes[name] = newAttributeValue;
      setCharacters(updatedCharacters);
    }
  };

  // Check result based on roll
  const performSkillCheck = () => {
    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const skill = SKILL_LIST.find((s) => s.name === selectedSkill);
    if (!skill) return;

    const skillTotal = currentCharacter.skillPoints[selectedSkill] + Math.floor((currentCharacter.attributes[skill.attributeModifier as keyof Attributes] - 10) / 2);
    const total = skillTotal + randomRoll;
    const success = total >= dc;

    setRollResult(`Roll: ${randomRoll}, Total: ${total} - ${success ? "Success" : "Failure"}`);
  };


  // Select character and show result based on roll 
  const performPartySkillCheck = () => {
    const randomRoll = Math.floor(Math.random() * 20) + 1;
    const skill = SKILL_LIST.find((s) => s.name === selectedSkill);
    if (!skill) return;

    // Find character with highest total skill for the selected skill
    let bestCharacter = characters[0];
    let highestSkillTotal = 0;

    characters.forEach((character) => {
      const skillTotal = character.skillPoints[selectedSkill] + Math.floor((character.attributes[skill.attributeModifier as keyof Attributes] - 10) / 2);
      if (skillTotal > highestSkillTotal) {
        bestCharacter = character;
        highestSkillTotal = skillTotal;
      }
    });

    const total = highestSkillTotal + randomRoll;
    const success = total >= dc;

    setPartyRollResult(
      `Character: ${bestCharacter.name}, Roll: ${randomRoll}, Total: ${total} - ${success ? "Success" : "Failure"}`
    );
  };

  return (
    <div className="App">
      <h1>Character Builder</h1>
      <div>
        {characters.map((char, index) => (
          <button key={char.id} style={{ backgroundColor: (currentCharacterIndex === index) ? "green" : "white" }} onClick={() => setCurrentCharacterIndex(index)}>
            {char.name}
          </button>
        ))}
        <button onClick={() => setCharacters([...characters, createNewCharacter(`Character ${characters.length + 1}`)])}>
          + Add Character
        </button>
        <button onClick={async () => await saveCharacter(currentCharacter)}>Save Character</button>
      </div>
      {currentCharacter && (
        <>
          <h2>{currentCharacter.name}</h2>
          <AttributeControls
            attributes={currentCharacter.attributes}
            onAttributeChange={updateCharacterAttribute}
            getModifier={(value) => Math.floor((value - 10) / 2)}
          />
          <ClassDisplay
            classes={CLASS_LIST}
            attributes={currentCharacter.attributes}
            onSelectClass={(cls) => {
              const updatedCharacters = [...characters];
              updatedCharacters[currentCharacterIndex].selectedClass = cls;
              setCharacters(updatedCharacters);
            }}
            selectedClass={currentCharacter.selectedClass}
          />
          <SkillDisplay
            skills={SKILL_LIST.map((skill) => {
              const attrValue = currentCharacter.attributes[skill.attributeModifier as keyof Attributes];
              return {
                ...skill,
                points: currentCharacter.skillPoints[skill.name],
                modifier: Math.floor((attrValue - 10) / 2),
                total: currentCharacter.skillPoints[skill.name] + Math.floor((attrValue - 10) / 2),
              };
            })}
            skillPoints={10 + Math.floor((currentCharacter.attributes.Intelligence - 10) / 2) * 4}
          />

          <div className="SkillCheckSection">
            <h2>Skill Check</h2>
            <label>
              Skill:
              <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                {SKILL_LIST.map((skill) => (
                  <option key={skill.name} value={skill.name}>{skill.name}</option>
                ))}
              </select>
            </label>
            <label>
              DC:
              <input type="number" value={dc} onChange={(e) => setDC(parseInt(e.target.value, 10))} />
            </label>
            <button onClick={performSkillCheck}>Roll</button>
            {rollResult && <p>{rollResult}</p>}
          </div>

          <div className="PartySkillCheckSection">
            <h2>Party Skill Check</h2>
            <button onClick={performPartySkillCheck}>Roll for Party</button>
            {partyRollResult && <p>{partyRollResult}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
