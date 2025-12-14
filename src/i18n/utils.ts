import { ui, defaultLang, type Lang } from './ui'

export function getLangFromUrl(url: URL): Lang {
	const langLarge = url.pathname.split('/')[1]
	const lang = langLarge.split('-')[0]
	if (lang in ui) return lang as Lang
	return defaultLang
}

export function useTranslations(lang: Lang) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key]
	}
}
