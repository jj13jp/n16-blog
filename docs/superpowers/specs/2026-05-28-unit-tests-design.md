# Unit Tests Design

**Date:** 2026-05-28  
**Scope:** 新規ユニットテスト追加 + 既存テストのカバレッジ改善

---

## Context

現在のテストカバレッジは主要UIコンポーネント（Button, Card, Header, BlogCard, ContactForm など10ファイル）をカバーしているが、ビジネスロジックを持つ関数（ページネーション計算・バリデーション・サーバーアクション・URL生成）が未テストの状態。これらは複数の分岐ロジックを持つため、ユニットテストによる仕様の文書化と回帰防止が必要。

---

## Architecture

### 方針

**純粋関数ユニットテスト中心**（アプローチA）を採用。コンポーネントを介さず関数・スキーマを直接テストすることで、高速・安定・読みやすいテストを実現する。

テストの言語は既存に合わせて**日本語**。  
テストパターンは既存に合わせて `describe/it` + `@testing-library/jest-dom` マッチャを使用。

---

## Files to Create / Modify

### 新規ファイル

#### 1. `src/features/blogs/utils/buildHref.ts`
`blogs/page.tsx` の `buildHref` 関数をユーティリティとして切り出す。

```ts
export function buildHref(page: number, isAsc: boolean): string
```

- `page > 1` なら `page` クエリパラメータを付与
- `isAsc` なら `order=asc` クエリパラメータを付与
- どちらもなければ `/blogs` のみ返す

#### 2. `src/features/blogs/utils/buildHref.test.ts`
`buildHref()` のユニットテスト。

| テストケース | 期待結果 |
|-------------|---------|
| page=1, isAsc=false | `/blogs` |
| page=2, isAsc=false | `/blogs?page=2` |
| page=1, isAsc=true | `/blogs?order=asc` |
| page=3, isAsc=true | `/blogs?order=asc&page=3` |

#### 3. `src/features/blogs/components/Pagination.test.tsx`
`pageNumbers()` 関数のユニットテスト（内部関数のためコンポーネントファイルから直接インポートはできないため、関数をエクスポートするか、コンポーネントをレンダリングしてページ番号を検証する）。

> **注:** `pageNumbers` は現在 `export` されていない。テストのためにファイル内で `export function pageNumbers` に変更する。

| テストケース | 期待結果 |
|-------------|---------|
| total=1〜7 | すべてのページ番号（ellipsis なし） |
| total=10, current=1 | `[1, 2, ..., 10]` |
| total=10, current=5 | `[1, ..., 4, 5, 6, ..., 10]` |
| total=10, current=10 | `[1, ..., 9, 10]` |
| total=10, current=3 | `[1, 2, 3, 4, ..., 10]`（ellipsis なし先頭側） |
| total=10, current=8 | `[1, ..., 7, 8, 9, 10]`（ellipsis なし末尾側） |

また `Pagination` コンポーネントのレンダリングテストも含める：
- `totalPages <= 1` のとき `null` を返す
- 前へ/次へリンクの `aria-disabled` 状態
- `aria-current="page"` が現在ページに付与される

#### 4. `src/features/contact/types/schema.test.ts`
`contactSchema` のバリデーションロジックのユニットテスト。

| テストケース | 期待結果 |
|-------------|---------|
| 全フィールド正常 | `success: true` |
| name が空文字 | `"名前を入力してください"` |
| email が無効な形式 | `"有効なメールアドレスを入力してください"` |
| message が9文字以下 | `"メッセージは10文字以上で入力してください"` |
| message が10文字以上 | `success: true` |

#### 5. `src/features/contact/actions/serverActions.test.ts`
`sendContact()` のユニットテスト。`resend` モジュールをモック。

| テストケース | 期待結果 |
|-------------|---------|
| バリデーション失敗 | `{ success: false, message: "名前を入力してください" }` |
| 環境変数 `CONTACT_TO_EMAIL` が未設定 | `{ success: false, message: "送信先が設定されていません" }` |
| Resend API エラー | `{ success: false, message: "送信に失敗しました。..." }` |
| 正常送信 | `{ success: true }` |

モック戦略：
```ts
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn() },
  })),
}))
```

---

### 既存テストの改善

#### `src/shared/Card.test.tsx`
- `tags` が空配列のときタグ要素が表示されないことを確認するケースを追加

#### `src/features/blogs/components/BlogCard.test.tsx`
- `eyecatch` が指定されたとき `img` が表示されるケースを追加

#### `src/features/contact/components/ContactForm.test.tsx`
- `mockResolvedValueOnce` の引数を型定義 `{ success: true }` に合わせて修正（現在 `message: ""` が混入している）

---

### 変更が必要な既存ファイル

#### `src/features/blogs/components/Pagination.tsx`
- `pageNumbers` 関数を `export` する（テスト可能にするため）

#### `src/app/blogs/page.tsx`
- `buildHref` 関数を `@/features/blogs/utils/buildHref` からインポートするように変更

---

## Verification

1. `pnpm test` を実行してすべてのテストが通ることを確認
2. `pnpm exec tsc --noEmit` で型エラーがないことを確認
3. `pnpm lint` で lint エラーがないことを確認
4. 新規テストがすべて green であることを確認（red → green の順で書く）
