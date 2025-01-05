# 3D Rubik's Cube

Three.js を使用したブラウザ上で動作するルービックキューブシミュレーター

## LLMベンチマークの例
````
下記のapp.jsの解法をリゾルバーのライブラリなしで回転回数、試行回数、時間無制限で解けるようにしてください。今のままでは全然解けない。回答はapp.jsのコード全文を省略なしでお願いします。
```js
// app.jsのコードを下記に添付
```
````

## インストール

1. リポジトリをクローン
    ```bash
    git clone git@github.com:imuradevelopment/RUBIK.git
    ```
2. index.html を開く

## 機能

- ルービックキューブの3D表示
- マウスによる視点操作
- 基本操作 (U, U', D, D', R, R', L, L', F, F', B, B')
- 中層操作 (M, M', E, E', S, S')
- キューブ全体回転 (x, x', y, y', z, z')
- スクランブル機能
- Layer-by-Layer法による自動解法
- サイドパネルの開閉

## 使用技術

- Three.js (3D描画)
- OrbitControls (カメラ制御)
- GSAP (アニメーション)

## 操作方法

### 視点操作
- マウスドラッグ: 視点回転
- マウスホイール: ズームイン/アウト

### ボタン操作
- スクランブル: キューブをランダムに20手シャッフル
- リセット: 完成状態に戻す
- 解法表示: Layer-by-Layer法で自動的に解く

### キーボードショートカット
なし（すべてボタン操作）

## 開発者向け情報
ファイル構成

```
rubiks-cube/
  |  ├── index.html     # メインHTML
  |  ├── styles.css     # スタイル定義
  |  ├── app.js         # メインロジック
  └── README.md      # 本ファイル
```

キューブの内部表現

- 色の定義:
  - 上面(U): 白
  - 下面(D): 黄
  - 前面(F): 赤
  - 後面(B): 青
  - 右面(R): 緑
  - 左面(L): オレンジ
- 座標系:
  - x軸: 左(-) → 右(+)
  - y軸: 下(-) → 上(+)
  - z軸: 後(-) → 前(+)
- Layer-by-Layer法による解法
  - 白クロス
  - 白面＆第一層コーナー
  - 中段エッジ
  - 黄クロスの完成
  - 上面コーナーの向き(OLL)
  - 最終層のコーナー＆エッジ配置(PLL)

### ライセンス
MIT License

### 作者
imura