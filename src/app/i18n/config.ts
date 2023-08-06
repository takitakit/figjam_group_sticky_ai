import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 言語jsonファイルのimport
import translation_en from './en.js'
import translation_ja from './ja.js'

const resources = {
  ja: {
    translation: translation_ja,
  },
  en: {
    translation: translation_en,
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n