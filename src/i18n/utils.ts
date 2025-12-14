import { ui, defaultLang } from './ui'

export function getLangFromUrl(url: URL) {
	const langLarge = url.pathname.split('/')[1]
	const lang = langLarge.split('-')[0]
	if (lang in ui) return lang as keyof typeof ui
	return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key]
	}
}
