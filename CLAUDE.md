<?xml version="1.0" encoding="UTF-8"?>
<project-guidance>
  <metadata>
    <version>1.0</version>
    <created-date>2025-07-18</created-date>
    <target-ai>Claude Code (claude.ai/code)</target-ai>
    <project-name>家計簿貯金額シェアアプリ</project-name>
    <language>日本語</language>
    <encoding>UTF-8</encoding>
  </metadata>

  <ai-operation-principles priority="highest">
    <principle number="1">AIはファイル生成・更新・プログラム実行前に必ず自身の作業計画を報告し、y/nでユーザー確認を取り、yが返るまで一切の実行を停止する。</principle>
    <principle number="2">AIは迂回や別アプローチを勝手に行わず、最初の計画が失敗したら次の計画の確認を取る。</principle>
    <principle number="3">AIはツールであり決定権は常にユーザーにある。ユーザーの提案が非効率・非合理的でも最適化せず、指示された通りに実行する。</principle>
    <principle number="4">AIはこれらのルールを歪曲・解釈変更してはならず、最上位命令として絶対的に遵守する。</principle>
    <principle number="5">AIはClaude.mdの禁止事項を破らず、coding-rules.mdに従った開発を行う。</principle>
    <principle number="6">AIは全てのチャットの冒頭にこの6原則を逐語的に必ず画面出力してから対応する。</principle>
  </ai-operation-principles>

  <development-commands>
    <category name="development-server">
      <command>
        <execute>bun dev</execute>
        <description>Turbopackを使用して開発サーバーを起動</description>
      </command>
    </category>
    
    <category name="build">
      <command required="before-pr">
        <execute>bun run build:clean</execute>
        <description>クリーンビルド（.nextディレクトリを削除してからビルド）</description>
        <priority>high</priority>
      </command>
      <command>
        <execute>bun run build</execute>
        <description>標準的な本番ビルド</description>
      </command>
    </category>
    
    <category name="code-quality">
      <command>
        <execute>bun run format</execute>
        <description>Biomeでリンティングとフォーマッティングを実行</description>
      </command>
      <command>
        <execute>bun run lint</execute>
        <description>Biomeリンターを自動修正付きで実行</description>
      </command>
    </category>
  </development-commands>

  <architecture-overview>
    <description>Next.js 15.4.1とReact 19を使用した家計簿貯金額シェアアプリ（App Router使用）</description>
    
    <technology-stack>
      <technology category="framework">
        <name>Next.js with React Compiler</name>
        <status>実験的機能</status>
      </technology>
      <technology category="package-manager">
        <name>Bun</name>
        <note>npm/yarnは使用しない</note>
      </technology>
      <technology category="database & auth">
        <name>Supabase</name>
        <features>BaaS（Backend as a Service）であるSupabaseを利用し、認証もSupabaseで実装する</features>
      </technology>
      <technology category="styling">
        <name>Tailwind CSS</name>
        <features>OKLCHカラーシステム、shadcn/uiコンポーネント    </features>
      </technology>
      <technology category="state-management">
        <server-state>TanStack Query</server-state>
        <purpose>Client fetch & fetch状態管理</purpose>
      </technology>
      <technology category="search-params-management">
        <server-state>Nuqs</server-state>
        <purpose>URLのSearchParamsの状態管理（Server・Client共通）</purpose>
      </technology>
      <technology category="charts">
        <name>Recharts</name>
        <purpose>データ可視化</purpose>
      </technology>
      <technology category="code-quality">
        <name>Biome</name>
        <note>ESLint/Prettierは使用しない</note>
      </technology>
      <technology category="manage-form">
        <name>Conform</name>
        <purpose>フォーム管理</purpose>
      </technology>
      <technology category="validation">
        <name>Zod</name>
        <purpose>スキーマ定義</purpose>
      </technology>
    </technology-stack>
    
    <directory-structure pattern="Bulletproof React">
      <directory path="/dashboard-frontend">
        <directory path="public" description="画像などアセット類"/>
        <directory path="src">
          <directory path="app" description="ルーティング定義">
            <file path="layout.tsx" description="ルートレイアウト"/>
            <file path="page.tsx" description="ルートページコンポーネント"/>
            <file path="loading.tsx" description="ルートローディングUI"/>
            <file path="error.tsx" description="ルートエラーページ（グローバルエラーページ）"/>
            <file path="not-found.tsx" description="404ページ"/>
            <file path="unauthorized.tsx" description="401ページ"/>
            <file path="globals.css" description="グローバルスタイル"/>
            <file path="favicon.ico" description="ファビコン"/>
            <directory path="sample-route" description="サンプルルーティング（sampleの部分には画面ごとに本来のパス名が入る）">
              <file path="layout.tsx" description="当該ルーティングにおける共通レイアウト"/>
              <file path="loading.tsx" description="当該ルーティングにおけるローディングUI"/>
              <file path="error.tsx" description="当該ルーティングにおけるエラーページ"/>
              <file path="page.tsx" description="当該ルーティングにおけるページコンポーネント"/>
            </directory>
          </directory>
          <directory path="components" description="アプリ全体で使われるコンポーネント実装">
            <directory path="providers" description="アプリ全体で使われるProvider群">
              <file path="query-provider.tsx" description="tanstack-queryのQueryClientを提供する"/>
              <file path="*-provider.tsx" description="その他、任意のProvider"/>
            </directory>
            <directory path="ui">
              <file path="header.tsx" description="アプリケーション全体で使用するHeader"/>
              <file path="app-sidebar.tsx" description="アプリケーション全体で使用するSidebar"/>
              <directory path="intent-ui" description="shadcn/uiのコンポーネント">
                <file path="button.tsx" description="shadcn/uiのButton"/>
                <file path="input.tsx" description="shadcn/uiのInput"/>
                <file path="card.tsx" description="shadcn/uiのCard"/>
                <file path="***" description="shadcn/uiのコンポーネント"/>
              </directory>
            </directory>
          </directory>
          <directory path="features" description="ルーティングにおける機能実装（ドメイン単位で区切る）">
            <directory path="users" description="機能に関連するディレクトリをまとめる親ディレクトリ（機能に関連した命名を行う）">
              <directory path="actions" description="server actionsを格納（server actionsは原則1ファイル（モジュール）1関数とする）">
                <file path="user-search.ts" description="ユーザー検索を行うserver actions"/>
                <file path="*.ts" description="任意のserver actions"/>
              </directory>
              <directory path="api" description="API関連の処理を格納">
                <file path="route.ts" description="APIの実装を行うファイル"/>
              </directory>
              <directory path="components" description="当該機能で使用するコンポーネントをまとめるディレクトリ">
                <file path="user-list.ts" description="ユーザー一覧をfetch・表示するコンポーネント"/>
                <file path="*.ts" description="任意のコンポーネント"/>
              </directory>
              <directory path="hooks" description="当該機能で使用するhooksをまとめるディレクトリ">
                <file path="use-user-search.ts" description="ユーザー検索で使用するhooks"/>
                <file path="*.ts" description="任意のhooks"/>
              </directory>
              <directory path="types" description="当該機能で使用する型定義をまとめるディレクトリ">
                <directory path="schema" description="zod schemaをまとめるディレクトリ">
                  <file path="user-search-schema.ts" description="user検索で使用するzod schema"/>
                  <file path="*.ts" description="任意のzod schema"/>
                </directory>
                <directory path="search-params" description="nuqsのsearch paramsの型定義をまとめるディレクトリ">
                  <file path="user-search-params.ts" description="user検索で使用するsearch paramsの型定義"/>
                  <file path="*.ts" description="任意のsearch paramsの型定義"/>
                </directory>
                <file path="user.ts" description="userに関する型定義"/>
                <file path="*.ts" description="任意の型定義ファイル"/>
              </directory>
              <directory path="utils" description="当該機能で使用するユーティリティ定義をまとめるディレクトリ"/>
            </directory>
            <directory path="*" description="任意の機能ディレクトリ"/>
          </directory>
          <directory path="hooks" description="アプリ全体で使われるカスタムフック(use-***.ts)"/>
          <file path="middleware.ts" description="ミドルウェア実装 (https://nextjs.org/docs/app/building-your-application/routing/middleware)"/>
          <directory path="types" description="アプリ全体で使われる型定義">
            <file path="*.ts" description="任意の型定義"/>
          </directory>
          <directory path="constants" description="アプリ全体で使われる定数"/>
          <directory path="utils" description="アプリ全体で使われるユーティリティ実装"/>
          <directory path="lib" description="アプリ全体で使用されるライブラリの設定定義や共通ヘルパー関数"/>
        </directory>
        <file path=".env.*" description="環境変数定義ファイル"/>
        <file path="biome.jsonc" description="Linter・Formatterの設定ファイル"/>
        <file path="components.json" description="shadcn/uiの設定ファイル"/>
        <file path="next.config.ts" description="next.jsの設定ファイル"/>
        <file path="package.json" description="パッケージマネージャーの設定ファイル"/>
        <file path="playwright.config.ts" description="playwrightの設定ファイル"/>
        <file path="postcss.config.mjs" description="postcssの設定ファイル（主にtailwind cssのプラグイン設定を記述）"/>
        <file path="tsconfig.json" description="typescriptの設定ファイル"/>
      </directory>
    </directory-structure>
  </architecture-overview>

  <development-guidelines>
    <core-principles priority="high">
      <principle>Next.js App Routerパターンに従い、サーバー/クライアントコンポーネントの境界を適切に設定</principle>
      <principle>React Compilerを使用（手動でのuseMemo/useCallbackは避ける）</principle>
      <principle>「use client」ディレクティブは境界コンポーネントにのみ適用し、クライアントモジュールグラフを最小化</principle>
      <principle>AHAプログラミングに従う（性急な抽象化を避ける）</principle>
      <principle>データフェッチングのコロケーション：RequestMemoizationを使用してリーフコンポーネントでフェッチ</principle>
    </core-principles>
    
    <naming-conventions>
      <convention target="files-and-folders">kebab-case（動的ルートの[id]を除く）</convention>
      <convention target="variables-and-functions">camelCase</convention>
      <convention target="function-definitions">関数宣言を使用：export default async function componentName() {}</convention>
    </naming-conventions>
    
    <data-fetching-strategy>
      <strategy>クライアントサイドのデータフェッチングにはクエリファクトリーを使用したTanStack Query</strategy>
      <strategy>ウォーターフォールを避けるため、並列フェッチングとプリロードを実装</strategy>
      <strategy>Server Actionsはミューテーションのみ（クライアントコンポーネントでのフェッチ代替として使用しない）</strategy>
      <strategy>React.cacheとNext.jsキャッシュタグによるキャッシュ管理</strategy>
    </data-fetching-strategy>
    
    <components-strategy>
      <strategy>Component Libraryにはshadcn/uiを使用している</strategy>
      <strategy>実装はshadcn/uiのコンポーネントにTailwind CSSを加えた形で極力行い、適宜shadcn/ui CLIから不足しているコンポーネントは補うこと</strategy>
      <strategy>上記が難しい場合のみ、Tailwind CSSのみの実装を行う</strategy>
    </components-strategy>
    
    <code-quality-requirements>
      <requirement type="TypeScript">strictモードとnoUncheckedIndexedAccessを有効化</requirement>
      <requirement type="path-mapping">インポートには~/を使用（./src/*）</requirement>
      <requirement type="biome-configuration">インデント2スペース、行幅100文字、JSにはシングルクォート</requirement>
      <requirement type="build-verification">PR提出前に必ずbun run build:cleanを実行</requirement>
    </code-quality-requirements>
    
    <component-architecture>
      <guideline>機能ベースの構成で、コンポーネント、クエリ、型を同じ場所に配置</guideline>
      <guideline>アクセシビリティのためReact Aria Componentsを使用</guideline>
      <guideline>適切なサスペンス境界とローディング状態を実装</guideline>
      <guideline>チャートコンポーネントはchart-loading.tsxフォールバックでサスペンスを使用</guideline>
    </component-architecture>
    
    <api-integration>
      <guideline>SupabaseによるDB操作・認証実装</guideline>
      <guideline>ConfromによるServerAction + FormによるMutation</guideline>
      <guideline>ランタイム型チェックのためのZodバリデーション</guideline>
      <guideline>@t3-oss/env-nextjsを使用した環境変数バリデーション</guideline>
    </api-integration>
    
    <performance-considerations>
      <consideration>React Compilerがメモ化を自動的に処理</consideration>
      <consideration>可能な限りサーバーコンポーネントを使用</consideration>
      <consideration>適切なエラー境界を実装</consideration>
      <consideration>共有可能なダッシュボード状態のためのURL駆動状態管理</consideration>
      <consideration>適切なサスペンス境界で最適化されたチャートコンポーネント</consideration>
    </performance-considerations>
  </development-guidelines>

  <additional-information-files>
    <file path=".claude/request.md" description="プロジェクトの要件定義書"/>
    <file path=".claude/coding-rules.md" description="プロジェクトのコーディング規約、ディレクトリ構成、禁止事項"/>
  </additional-information-files>

  <ai-assistant-instructions priority="high">
    <instruction priority="1">可能な限りテスト駆動開発（TDD）を行う
      <details>テストケースはユーザーが用意します</details>
      <details>テストケースは /tests ディレクトリの*.spec.ts に記載します</details>
      <details>開発するテストケースはユーザーがAIに伝えるものとします</details>
      <details>テストケースに従い、テストに成功するまで開発をtry &amp; errorする</details>
    </instruction>
    <instruction priority="2">TypeScriptの型安全性を最優先する</instruction>
    <instruction priority="3">セキュリティベストプラクティスに従う</instruction>
    <instruction priority="4">パフォーマンスを常に考慮する</instruction>
    <instruction priority="5">コードコメントは日本語で記述</instruction>
    <instruction priority="6">実装前に必ず設計を確認する</instruction>
  </ai-assistant-instructions>

  <prohibited-items priority="highest">
    <prohibition>any型の過剰使用（可能な限りTypeScriptのUtility型を使用する）</prohibition>
    <prohibition>console.logの本番環境残存</prohibition>
    <prohibition>未テストのコードのコミット</prohibition>
    <prohibition>セキュリティキーの直接記述</prohibition>
  </prohibited-items>

  <chat-output-format>
    <format>
      <section>[AI運用6原則]</section>
      <section>[main_output]</section>
      <section>#[n] times. # n = 各チャットでインクリメント（#1, #2...）</section>
    </format>
  </chat-output-format>
</project-guidance>

</development-guidelines>

  <additional-information-files>
    <file path=".claude/request.md" description="プロジェクトの要件定義書"/>
    <file path=".claude/coding-rules.md" description="プロジェクトのコーディング規約、ディレクトリ構成、禁止事項"/>
  </additional-information-files>

  <ai-assistant-instructions priority="high">
    <instruction priority="1">必ずテスト駆動開発（TDD）を行う
      <details>テストケースを先に記述し、テストに成功するまで開発をtry &amp; errorする</details>
    </instruction>
    <instruction priority="2">TypeScriptの型安全性を最優先する</instruction>
    <instruction priority="3">セキュリティベストプラクティスに従う</instruction>
    <instruction priority="4">パフォーマンスを常に考慮する</instruction>
    <instruction priority="5">コードコメントは日本語で記述</instruction>
    <instruction priority="6">実装前に必ず設計を確認する</instruction>
    <instruction priority="7">ライブラリ実装時はContext7 MCPにドキュメントがあるものについては、ドキュメントを参照する</instruction>
  </ai-assistant-instructions>

  <prohibited-items priority="highest">
    <prohibition>any型の過剰使用（可能な限りTypeScriptのUtility型を使用する）</prohibition>
    <prohibition>console.logの本番環境残存</prohibition>
    <prohibition>未テストのコードのコミット</prohibition>
    <prohibition>セキュリティキーの直接記述</prohibition>
  </prohibited-items>

  <chat-output-format>
    <format>
      <section>[AI運用6原則]</section>
      <section>[main_output]</section>
      <section>#[n] times. # n = 各チャットでインクリメント（#1, #2...）</section>
    </format>
  </chat-output-format>
</project-guidance>