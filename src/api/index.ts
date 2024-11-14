const API_BASE_URL = "https://recruiting.verylongdomaintotestwith.ca/api/{{github_username}}/character";

export const fetchCharacters = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch characters");
    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    return [];
  }
};

export const saveCharacter = async (characterData: any) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });
    if (!response.ok) throw new Error("Failed to save character");
    return await response.json();
  } catch (error) {
    console.error("Error saving character:", error);
  }
};
