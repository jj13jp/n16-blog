# Card エコシステム リファクタリング設計

## Context

Card.tsx は BlogCard と WorkCard という性質の異なる2種類のカードを1つのコンポーネントで吸収しようとしてきた結果、以下の問題が生じていた：

- `orientation` prop が存在するが BlogCard・WorkCard どちらも渡しておらず、常にデフォルト値 `horizontal` のまま（YAGNI 違反）
- BlogCard の `excerpt` が `children` 経由で渡されているが、Card には `excerpt` prop も存在する二重管理
- `publishedAt` と `readingTime` のレンダリング条件が「両方必須」になっており、片方だけ存在するケースで表示されない
- Card のテストが CSS クラス名（`flex-row`）に依存しており壊れやすい
- BlogCard のユニットテストが存在しない

**目的:** Card を「UI 層（レイアウト・見た目）」に絞り、BlogCard・WorkCard が「ドメイン固有のデータ変換とロジック」を担う明確な役割分担を実現する。

---

## 設計

### 役割の分担

| コンポーネント | 責務 |
|---|---|
| `Card` | サムネイル・タイトル・メタデータ・タグ・抜粋・actions の**表示レイアウト** |
| `BlogCard` | BlogListItem → Card props への変換（HTML ストリップ、読了時間計算、日付フォーマット） |
| `WorkCard` | Work → Card props への変換、GitHub/Demo リンクを actions として組み立て |

---

### Card.tsx の変更

**削除:**
- `orientation` prop（誰も使っていない。レイアウトは SP 縦・sm+ 横にハードコード）
- `children` prop（`actions` に名前を変えて意図を明確化）

**追加:**
- `actions?: ReactNode` — 本文の下に表示する任意スロット（WorkCard の外部リンクに使用）

**修正:**
- `publishedAt` と `readingTime` の表示条件を `&&`（両方必須）から `||`（片方でも表示）に緩和

**変更後の Props:**
```ts
interface Props {
  title: string
  thumbnail?: string
  publishedAt?: string
  tags: string[]
  excerpt?: string
  readingTime?: number
  href?: string
  actions?: ReactNode
}
```

---

### BlogCard.tsx の変更

- `children` で渡していた excerpt を廃止し、`excerpt` prop に一本化
- `hidden sm:block` を削除し、SP でも excerpt を表示（シンプル化）

**変更前:**
```tsx
<Card ...>
  <p className="hidden text-sm text-zinc-600 sm:block dark:text-zinc-400">{excerpt}</p>
</Card>
```

**変更後:**
```tsx
<Card ... excerpt={excerpt} />
```

---

### WorkCard.tsx の変更

- `children` で渡していた GitHub/Demo リンクを `actions` prop 経由に変更

**変更前:**
```tsx
<Card title={work.title} tags={work.techStack} excerpt={work.description}>
  {(work.githubUrl || work.demoUrl) && (
    <div className="flex gap-4">...</div>
  )}
</Card>
```

**変更後:**
```tsx
<Card
  title={work.title}
  tags={work.techStack}
  excerpt={work.description}
  actions={
    (work.githubUrl || work.demoUrl) ? (
      <div className="flex gap-4">...</div>
    ) : undefined
  }
/>
```

---

### テストの変更

#### Card.test.tsx

- `orientation` 関連テスト（CSS クラス名アサーション）を削除
- `actions` prop のレンダリングテストを追加
- `publishedAt` のみ / `readingTime` のみの場合に表示されることを確認するテスト追加

#### BlogCard.test.tsx（新規作成）

テスト対象：
- `stripHtml` が HTML タグを除去すること
- `calcReadingTime` が文字数から正しく計算されること
- 日付が `ja-JP` ロケールでフォーマットされること
- カテゴリがない場合にタグが空配列であること

#### WorkCard.test.tsx

- GitHub リンクが `actions` 経由で正しく表示されること（既存テストの更新）
- Demo リンクが `actions` 経由で正しく表示されること（既存テストの更新）

---

## 変更ファイル

| ファイル | 変更種別 |
|---|---|
| `src/shared/Card.tsx` | 修正（props 変更） |
| `src/shared/Card.test.tsx` | 修正（テスト更新） |
| `src/features/blogs/components/BlogCard.tsx` | 修正（children → excerpt prop） |
| `src/features/blogs/components/BlogCard.test.tsx` | 新規作成 |
| `src/features/works/components/WorkCard.tsx` | 修正（children → actions prop） |
| `src/features/works/components/WorkCard.test.tsx` | 修正（actions 対応） |

---

## 検証

1. `pnpm test` — 全テストがパスすること
2. `pnpm exec tsc --noEmit` — 型エラーがないこと
3. `pnpm dev` でブログ一覧（`/blogs`）・作品一覧（`/works`）を確認
   - BlogCard: サムネイル・タイトル・日付・読了時間・カテゴリ・抜粋が表示される
   - WorkCard: タイトル・技術スタック・説明・GitHub リンクが表示される
