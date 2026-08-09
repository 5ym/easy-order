# easy-order

木更津高専 文化祭「退学願Tシャツ」の注文フォーム。

注文するとサーバーが 4 桁の確認番号を発行し、`/pay/<token>` の控えページを返します。
購入者はそのページを学生に提示して当日現金でお支払いいただきます。

## 構成

| | |
| --- | --- |
| ランタイム | [Bun](https://bun.sh) 1.3 |
| フレームワーク | [SvelteKit](https://svelte.dev/docs/kit) 2 / [Svelte](https://svelte.dev) 5 (runes) |
| UI | [Tailwind CSS](https://tailwindcss.com) 4 + [daisyUI](https://daisyui.com) 5 |
| DB | SQLite (`bun:sqlite`, WAL) |
| ビルド | Vite 8 + `@sveltejs/adapter-node` |
| 型チェック | TypeScript 7 (`svelte-check --tsgo`) |

**ランタイム依存パッケージはありません。** SQLite は Bun 組み込み、バリデーションは
[`src/lib/order.ts`](src/lib/order.ts) の手書き、サーバーは adapter-node が単一バンドルに
まとめます。`node_modules` なしで `bun ./build/index.js` が動きます。

## 開発

```sh
bun install
bun run dev          # http://localhost:5173
```

DB ファイルは初回アクセス時に `./data/easy-order.sqlite` へ自動生成され、
マイグレーションはサーバー起動時に適用されます（[`src/hooks.server.ts`](src/hooks.server.ts)）。

| コマンド | 内容 |
| --- | --- |
| `bun run dev` | 開発サーバー |
| `bun run build` | 本番ビルド (`./build`) |
| `bun run start` | ビルド済みサーバーを起動 |
| `bun run check` | `svelte-check --tsgo` による型チェック |
| `bun test` | ユニットテスト（バリデーション / DB) |
| `bun run test:e2e` | ビルドして HTTP 経由の疎通テスト |
| `bun run db:migrate` | マイグレーションを手動適用 |

## TypeScript 7 (tsgo)

型チェックは TypeScript 7 のネイティブ実装 (tsgo) で行います。`svelte-check` 自身の
言語サービスはまだ TypeScript 6 を要求し、7 が入っていると起動を拒否するため、
2 バージョンを併存させています。

- `typescript` … 6 系。`svelte-check` の言語サービス用
- `@typescript/native` … `npm:typescript@7` のエイリアス。`--tsgo` が診断に使う

そのため **`typescript` を 7 に上げないでください。** `bun run check` が起動しなくなります。
`renovate.json` で `typescript` を `<7` に固定してあります。
`svelte-check` の peer 範囲が 7 に広がったら、この 2 本立てとピン留めは解消できます。

## 環境変数

`.env.example` を参照。すべて任意です。

| 変数 | 既定値 | 内容 |
| --- | --- | --- |
| `DATABASE_PATH` | `./data/easy-order.sqlite` | SQLite ファイルのパス。親ディレクトリは自動作成 |
| `HOST` / `PORT` | `0.0.0.0` / `3000` | 本番サーバーの待ち受け |
| `ORIGIN` | — | リバースプロキシ配下で必須。SvelteKit の CSRF オリジン判定に使用 |

## デプロイ

```sh
ORIGIN=https://eo.example.com docker compose up -d --build
```

SQLite は名前付きボリューム `easyo-data` の `/data` に置かれます。
バックアップは稼働中でも安全に取れます。

```sh
docker compose exec easyo bun -e \
  'new (require("bun:sqlite").Database)(process.env.DATABASE_PATH).exec("VACUUM INTO \x27/data/backup.sqlite\x27")'
```

TLS とドメインの終端はこのリポジトリの範囲外です。前段のリバースプロキシ
(Caddy / nginx / Cloudflare など) で行い、`ORIGIN` を実際の公開 URL に合わせてください。

## スキーマ変更

[`src/lib/server/db.ts`](src/lib/server/db.ts) の `MIGRATIONS` 配列に SQL を **追記** します。
適用済み数は SQLite の `user_version` で管理しているため、既存要素の編集・並べ替えは
しないでください。

## データモデル

`orders` テーブル 1 つのみ。

| カラム | 内容 |
| --- | --- |
| `token` | 控えページ URL に使う推測不能な公開 ID |
| `confirm` | 購入者が提示する 4 桁の確認番号 |
| `data` | 検証済みの注文内容 (JSON) |
| `paid` | 支払い済みフラグ |
