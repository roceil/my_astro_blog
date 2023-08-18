interface SiteConfig {
	author: string
	title: string
	description: string
	lang: string
	ogLocale: string
	shareMessage: string
}

export const siteConfig: SiteConfig = {
	author: '哲樺｜Frank',
	title: 'Frankの程式世界',
	description:
		'這是一個程式開發記錄的網站，內容包括程式設計、開發工具、技術分享等。目標是為開發者提供有價值的資訊和資源，幫助他們成為更好的開發者。歡迎來訪，希望您能在這裡找到有用的資訊！',
	lang: 'zh-TW',
	ogLocale: 'zh_TW',
	shareMessage: 'Share this post' // Message to share a post on social media
}
