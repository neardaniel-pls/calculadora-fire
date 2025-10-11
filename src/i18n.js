import {
  atualizarTabelaDepositos,
  atualizarTabelaEventosUnicos,
  atualizarTabelaEventosRecorrentes,
  atualizarTabelaDespesasVariaveis,
  adicionarTooltips
} from './ui.js';

let translations = {};
let currentLanguage = 'pt';

async function loadTranslations(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations = await response.json();
    document.documentElement.lang = lang;
  } catch (error) {
    console.error(`Could not load ${lang}.json:`, error);
  }
}

function translate(key) {
  return translations[key] || key;
}

function setLanguage(lang) {
  currentLanguage = lang;
  loadTranslations(lang).then(() => {
    translateUI();
    updateLangSelector(lang);
    adicionarTooltips();
    // Re-render tables to apply translations
    atualizarTabelaDepositos();
    atualizarTabelaEventosUnicos();
    atualizarTabelaEventosRecorrentes();
    atualizarTabelaDespesasVariaveis();
  });
}

function updateLangSelector(lang) {
  const flagElement = document.getElementById('current-lang-flag');
  const textElement = document.getElementById('current-lang-text');
  if (lang === 'pt') {
    flagElement.textContent = '🇵🇹';
    textElement.textContent = 'PT';
  } else {
    flagElement.textContent = '🇬🇧';
    textElement.textContent = 'EN';
  }
}

function translateUI() {
  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    element.textContent = translate(key);
  });
}

export { setLanguage, translate, translateUI, currentLanguage };