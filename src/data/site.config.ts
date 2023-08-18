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
		'這是一個程式開發記錄的網站，內容包括程式設計、開發工具、技術分享等。希望能為程式開發貢獻一點小小的心力！',
	lang: 'zh-TW',
	ogLocale: 'zh_TW',
	shareMessage: 'Share this post' // Message to share a post on social media
}
