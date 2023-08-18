/** @type {import("prettier").Config} */
module.exports = {
	// i am just using the standard config, change if you need something else
	...require('prettier-config-standard'),
	printWidth: 100,
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	tabWidth: 2,
	useTabs: true,

	plugins: [require.resolve('prettier-plugin-astro')],
	overrides: [
		{
			files: ['*.astro', '*.mdx'], // 添加了 *.mdx 擴展名
			options: {
				parser: 'mdx' // 使用 MDX 解析器
			}
		}
	]
}
