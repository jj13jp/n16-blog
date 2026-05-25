# n16-blog Claude Code ガイド

このガイドは、Claude Codeアシスタントがn16-blog Next.jsプロジェクトで効果的に作業するのを支援します。

## プロジェクト概要

- **フレームワーク**: Next.js 16.2.6 with React 19.2.4
- **言語**: TypeScript 5（厳密な型チェック）
- **スタイリング**: Tailwind CSS 4（ユーティリティファースト）
- **リント・フォーマット**: Biome 2.2.0（ファイル変更時に自動フォーマット）
- **テスト**: Vitest 4（カバレッジサポート付き）
- **フォーム処理**: React Hook Form 7.76.1
- **バリデーション**: Zod 4.4.3
- **メール**: Resend 6.12.3

## ディレクトリ構造

```
src/
├── app/              # Next.js App Routerのページとレイアウト
├── features/         # 機能固有のコンポーネントとロジック
├── shared/           # 共有・再利用可能なコンポーネント（作成予定）
├── types/            # TypeScript型定義
└── utils/            # ユーティリティ関数
```

## 主要な規約

### コンポーネント配置

- **共有コンポーネント**（機能間で再利用）: `src/shared/ComponentName.tsx`
- **機能コンポーネント**: `src/features/<feature-name>/ComponentName.tsx`
- **ページルート**: `src/app/<route>/page.tsx`

### コンポーネント構造

- **名前付きエクスポート**を使用（デフォルトエクスポートではなく）
- 型安全性のために`Props`インターフェースを定義
- デフォルトで**サーバーコンポーネント**を使用（React 19パターン）
- インタラクティビティが必要な場合のみ`'use client'`を追加
- **Tailwind CSSユーティリティクラス**でスタイリング

例：

```tsx
interface Props {
  title: string;
  count?: number;
}

export function MyComponent({ title, count }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      {count && <span className="text-sm text-zinc-600">{count}</span>}
    </div>
  );
}
```

### TypeScript

- 厳密モード有効化: すべてのコードが型チェックを通す必要がある
- パスエイリアス使用: `@/`は`src/`に解決される
- 共有型は`src/types/`に定義
- `any`を避ける; 必要に応じて`unknown`を使用してから型を絞る

### スタイリング

- Tailwind CSS 4: ユーティリティクラスを使用
- ダークモード: `dark:`プレフィックスで組み込み対応
- レスポンシブ: `sm:`, `md:`, `lg:`ブレークポイントを使用
- カラー: ニュートラルカラーにはZincパレットを推奨

### テスト

- ユニットテストはソースファイルと同じディレクトリに配置（例: `Button.test.tsx`は`Button.tsx`の隣）
- VitestとReactテスティングユーティリティを使用
- 実装詳細ではなく動作に焦点
- カバレッジ目標: 80%以上を目指す

### リント・フォーマット

- Biomeはファイル編集時に自動フォーマット（Claude Codeフック経由）
- `pnpm lint`で問題をチェック
- `pnpm format`で手動フォーマット
- **リントエラー付きのコードはコミットしない**

## よくあるタスク

### 新しいコンポーネントを作成

`/new-component`スキルを使用：

```bash
/new-component
```

プロンプトに従って、適切な位置に適切な構造のコンポーネントを作成します。

### 開発サーバーを実行

```bash
pnpm dev
```

サーバーは`http://localhost:3000`で実行されます

### 本番用にビルド

```bash
pnpm build
pnpm start
```

### テストを実行

```bash
pnpm test
```

### 型チェック

```bash
pnpm exec tsc --noEmit
```

## コード品質基準

1. **型安全性**: すべてのコードはTypeScript厳密モードを通す必要がある
2. **フォーマット**: Biomeはファイル変更時に自動フォーマット
3. **命名**: 明確で説明的な名前を使用
   - コンポーネント: PascalCase（例: `UserProfile`）
   - 関数・変数: camelCase（例: `getUserData`）
   - 定数: UPPER_SNAKE_CASE（例: `MAX_ATTEMPTS`）
4. **コメント**: **何**ではなく**なぜ**についてのコメントのみ追加
   - 良い例: `// レート制限を避けるために指数バックオフ後に再試行`
   - 避けるべき: `// ユーザーデータを取得` （コードが既に説明している）
5. **インポート**: 相対インポートではなくパスエイリアス（`@/`）を使用
6. **エラーハンドリング**: システム境界（ユーザー入力、外部API）で検証
7. **パッケージマネージャー**: 依存関係管理には`pnpm`を使用

## React Hook Form + Zodでのフォーム処理

React Hook Formで状態管理、Zodでバリデーション：

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('無効なメールアドレスです'),
  message: z.string().min(10, 'メッセージは10文字以上である必要があります'),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // 送信処理
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input {...register('email')} type="email" className="border px-3 py-2" />
      {errors.email && <span className="text-red-600">{errors.email.message}</span>}
      
      <textarea {...register('message')} className="border px-3 py-2" />
      {errors.message && <span className="text-red-600">{errors.message.message}</span>}
      
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        送信
      </button>
    </form>
  );
}
```

## 環境変数

- `.env.local`: ローカル開発のシークレット（コミットしない）
- `.env`: 共有環境変数
- ページでアクセス: クライアント側変数には`process.env.NEXT_PUBLIC_*`を使用

**重要**: Claude Codeには`.env*`ファイルへの偶発的な編集を防ぐセーフティフックがあります。環境変数を編集する前に必ず確認してください。

## APIルート・サーバーアクション

- APIルート: `src/app/api/[route]/route.ts`
- TypeScriptのリクエスト・レスポンス型を使用
- 受信データはすべてZodで検証
- 適切なステータスコードでJSONレスポンスを返す

## デバッグ

- クライアント側デバッグにはブラウザDevToolsを使用
- 開発中は意味のあるラベル付きで`console.log()`を使用
- テスト実行時はVitest UIを`http://localhost:51204/__vitest__/`で使用
- コミット前にデバッグログを削除

## ヘルプを求める前に

1. `pnpm lint`を実行してフォーマット・スタイル問題をキャッチ
2. `pnpm test`を実行してテストがパスするか確認
3. `tsconfig.json`でTypeScriptが適切に設定されているか確認
4. コンポーネント構造が合理的か確認
5. エラーメッセージを注意深く読む — 通常は問題を指摘している

## クイックリファレンス

| タスク | コマンド |
|------|---------|
| 開発サーバーを起動 | `pnpm dev` |
| リント問題をチェック・修正 | `pnpm lint` |
| コードをフォーマット | `pnpm format` |
| テストを実行 | `pnpm test` |
| 本番用にビルド | `pnpm build` |
| 型チェック | `pnpm exec tsc --noEmit` |

## 利用可能なスキル

- `/new-component` — 適切な構造と位置で新しいReactコンポーネントを作成
