## 概要
RESAS APIから取得したデータを可視化するアプリケーション。

### ワイヤーフレーム
https://www.notion.so/7646721865fa47e7b2c9b2a52c8c40ac

### RESAS API
都道府県、人工構成などのデータを取得できるAPI
- [概要](https://opendata.resas-portal.go.jp/docs/api/v1/index.html)
- [APIキーの使用方法](https://opendata.resas-portal.go.jp/docs/api/v1/detail/index.html)

### Recharts
グラフライブラリとしてRechartsを用いている
[RechartsのAPI](https://recharts.org/en-US/api)

## 環境構築
```
# ライブラリをインストール
yarn

# APIキーの設定
touch .env.local

# .env.localに書く内容
REACT_APP_API_KEY="foobar"
```

## `yarn start`
開発環境上でアプリケーションを起動する  
[http://localhost:3000](http://localhost:3000)
