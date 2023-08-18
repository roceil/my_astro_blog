---
title: 'Mock Service Worker (MSW)'
description: '
Mock Service Worker（MSW）是前端開發利器，能模擬API互動，提供虛擬後端環境。這有效降低依賴實際後端開發，增進開發效率。透過設定請求與響應，可以實現假數據測試及虛擬API互動，適用於Vue、React、Nuxt、Next等技術。 MSW整合於GitLab CICD，可以快速搭建流暢的開發流程。'
pubDate: '2023/08/18'
heroImage: '../../assets/msw/msw-banner.webp'
category: 'Testing'
tags: ['Mock API','Testing']
---

## MSW 安裝

---

- MSW 主程式
  - <code>npm install msw --save-dev</code>
- Client Side 主程式
  - `npx msw init public/ --save`
  - 依據環境不同，路徑名稱也不同
    | Project name                  | Public directory                                          |
    | ----------------------------- | --------------------------------------------------------- |
    | https://create-react-app.dev/ | ./public                                                  |
    | https://www.gatsbyjs.org/     | ./static                                                  |
    | https://nextjs.org/           | ./public                                                  |
    | https://vuejs.org/            | ./public                                                  |
    | https://angular.io/           | ./src (and add it to the assets of the angular.json file) |
    | https://preactjs.com/         | ./src/static                                              |
    | https://emberjs.com/          | ./public                                                  |
    | https://svelte.dev/           | ./public                                                  |
    | https://kit.svelte.dev/       | ./static                                                  |
    | https://vitejs.dev/           | ./public                                                  |

## 基本用法

---

- src 內建立 Mocks 資料夾
- 分別建立 browser.ts、server.ts、handlers.ts、index.ts
  - browser.ts ⇒ 攔截瀏覽器端發出的 API 請求
  - server.ts ⇒ 攔截 server 端發出的 API 請求
  - handlers.ts ⇒ 定義如果攔截到相同 Url 時，要回傳什麼東西給使用者
  - index.ts ⇒ 單純判斷何時要跑 server.ts 跟 browser.ts

## 範例程式碼（CSR）

---

> 💡 這裡示範 CSR 時攔截 API 的程式碼

- browser.ts
  ```jsx
  import { setupWorker } from 'msw'
  import { handlers } from './handlers'

  export const worker = setupWorker(...handlers)
  ```
- server.ts
  ```jsx
  import { setupServer } from 'msw/node'
  import { handlers } from './handlers'

  export const mswServer = setupServer(...handlers)
  ```
- handlers.ts
  ```jsx
  import { rest } from 'msw'

  export const handlers = [
  	rest.post('https://jsonplaceholder.typicode.com/users', (req, res, ctx) =>
  		res(
  			ctx.status(200),
  			ctx.json({
  				id: 'haha'
  			})
  		)
  	)
  ]
  ```
- index.ts ⇒ 這裡EsLint可能會要求用預設匯出（default），暫時採用Disable
  ```jsx
  const IS_BROWSER = typeof window !== 'undefined'

  export const setupMocks = async () => {
  	if (IS_BROWSER) {
  		const { worker } = await import('./browser')
  		worker.start()
  	} else {
  		const { mswServer } = await import('./server')
  		mswServer.listen()
  	}
  }
  ```
- enable MSW
  - 在 `_app.tsx` 內引入 mocks
  ```jsx
  import('../mocks').then(({ setupMocks }) => {
  	setupMocks()
  })
  ```

## 範例程式碼（SSR）

---

> 💡 這裡示範 SSR 時攔截 API 的程式碼

- browser.ts
  ```jsx
  import { setupWorker } from 'msw'
  import { handlers } from './handlers'

  export const worker = setupWorker(...handlers)
  ```
- server.ts
  ```jsx
  import { setupServer } from 'msw/node'
  import { handlers } from './handlers'

  export const mswServer = setupServer(...handlers)
  ```
- handlers.ts （回傳格式自訂用法）
  ```jsx
  import { rest } from 'msw'

  export const handlers = [
  	// 這裡會攔截 POST 請求
  	rest.post('https://jsonplaceholder.typicode.com/users', (req, res, ctx) =>
  		res(
  			ctx.status(200),
  			ctx.json({
  				id: 'haha'
  			})
  		)
  	),

  	// 這裡會攔截 GET 請求
  	rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) =>
  		res(
  			ctx.status(200),
  			ctx.json([
  				{ name: '家洋 7 號', rankTag: '熱門諮商師 TOP 1' },
  				{ name: '家洋 8 號', rankTag: '熱門諮商師 TOP 2' },
  				{ name: '家洋 9 號', rankTag: '熱門諮商師 TOP 3' },
  				{ name: '家洋 0 號', rankTag: '熱門諮商師 TOP 4' },
  				{ name: '家洋 5 號', rankTag: '熱門諮商師 TOP 5' },
  				{ name: '家洋 6 號', rankTag: '熱門諮商師 TOP 6' }
  			])
  		)
  	)
  ]
  ```
- handlers.ts （回傳格式 import 用法）
  ```jsx
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { rest } from 'msw'
  import { counselorRank } from '../lib/homeFilesRoute'

  export const handlers = [
  	rest.post('https://jsonplaceholder.typicode.com/users', (req, res, ctx) =>
  		res(
  			ctx.status(200),
  			ctx.json({
  				id: 'haha'
  			})
  		)
  	),

  	// 這裡會回傳引入的 counselorRank 陣列
  	rest.get('https://jsonplaceholder.typicode.com/users', (req, res, ctx) =>
  		res(ctx.status(200), ctx.json(counselorRank))
  	)
  ]
  ```
- index.ts ⇒ 這裡EsLint可能會要求用預設匯出（default），暫時採用Disable
  ```jsx
  const IS_BROWSER = typeof window !== 'undefined'

  export const setupMocks = async () => {
  	if (IS_BROWSER) {
  		const { mswWorker } = await import('./mswWorker')
  		mswWorker.start()
  	} else {
  		const { mswServer } = await import('./mswServer')
  		mswServer.listen()
  	}
  }
  ```
- enable MSW
  - 在 `_app.tsx` 內引入 mocks
  ```jsx
  import('../mocks').then(({ setupMocks }) => {
  	setupMocks()
  })
  ```
- pages / index.tsx（getServerSideProps）
  ```jsx
  export const getServerSideProps = async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users');
    const data = await res.data;

    return {
      props: { data },
    };
  };

  export default function Home({ data }: any) {
    console.log(data);
    return (
      <>
        <Head>
          <title>11T 諮商平台建置中</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Banner />
          <CustomTopic />
          <SuggestCounselor />
          <PlatformFeature />
          <UserComment />
          <ReservationTour />
        </main>
      </>
    );
  }
  ```

## 注意事項

---

- 在 API 尚未建立完成時，可使用 .env 建立假的 URL，方便之後更換
- 有 MSW 時，只要攔截的 URL 相同，即便 URL 是亂取的也沒關係
- 建議在建置 MSW 前將 API URL、回傳內容討論好，上線時直接拔掉 MSW 即可
