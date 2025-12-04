export const translations = {
  fi: {
    addWorkout: "Lisää treeni",
    history: "Historia",
    coach: "Valmentaja",
    settings: "Asetukset",
    ageQuestion: "Mikä on ikäsi?",
    weightQuestion: "Mikä on painosi (kg)?",
    fitnessLevel: "Kuntotasosi?",
  },

  en: {
    addWorkout: "Add workout",
    history: "History",
    coach: "Coach",
    settings: "Settings",
    ageQuestion: "What is your age?",
    weightQuestion: "What is your weight (kg)?",
    fitnessLevel: "Your fitness level?",
  }
};

export function t(lang, key) {
  return translations[lang]?.[key] || key;
}
