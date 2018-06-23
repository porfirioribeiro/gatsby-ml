export const languageMap = {
    br: /^pt-BR$/i,
    pt: /^pt/i,
    es: /^es/i,
    en: /^en/i,
  };
  
  export const defaultLanguage = 'en';
  
  export const languages = Object.keys(languageMap);
  
  export function getLanguageForNavigator() {
    const navLanguages = navigator.languages || [navigator.language];
    for (let i = 0; i <= navLanguages.length; i++) {
      for (let j = 0; j <= languages.length; j++) {
        if (languageMap[languages[j]].test(navLanguages[i])) return languages[j];
      }
    }
    return defaultLanguage;
  }
  