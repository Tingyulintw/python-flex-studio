# Python Flex Studio

這是一個可直接部署到 GitHub Pages 的 LINE Flex Message 編輯器。

## 功能

- 編輯 10 堂 Python 課程的標題、說明、按鈕、網址與主題色
- 即時顯示 Carousel 近似預覽
- 自動儲存在目前瀏覽器的 `localStorage`
- 查看、修改、複製與下載 Flex JSON
- 使用 LIFF `shareTargetPicker()` 分享目前版本到 LINE

## 部署到 GitHub Pages

1. 把 `index.html`、`style.css`、`app.js` 放到 GitHub repository 根目錄。
2. 到 repository 的 **Settings → Pages**。
3. Source 選 **Deploy from a branch**，Branch 選 `main`，資料夾選 `/ (root)`。
4. 等待 GitHub Pages 網址產生。

## LINE Developers 設定

1. 建立或開啟一個 LINE Login Channel。
2. 新增 LIFF App，Endpoint URL 填 GitHub Pages 網址。
3. 啟用 Share Target Picker。
4. 開啟網站，按左下角「LIFF 設定」，貼上 LIFF ID。

LIFF ID 只會保存在使用者目前瀏覽器，不會寫入 GitHub repository。

## 本機預覽

直接開啟 `index.html` 可看版面；若要完整測試 LIFF，請部署到 HTTPS 網址並讓 Endpoint URL 與實際網址一致。
