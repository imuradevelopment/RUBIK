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

## リゾルバーライブラリが機能しない問題の修正プロンプト(o1では修正不可)
````
下記のindex.html, styles.css, app.jsでapp.jsのリゾルバーに渡す文字列生成のロジックが誤っています。どこが誤っているのか解析してapp.jsを修正してください。
index.html
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>3D Rubik's Cube</title>

  <!-- three.js, gsap -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.7.1/gsap.min.js"></script>
  <!-- リゾルバライブラリ -->
  <script src="https://cdn.jsdelivr.net/npm/rubiks-cube-solver@1.2.0/lib/index.common.min.js"></script>

  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <!-- ヘッダー（固定） -->
  <header class="main-header">
    <div class="header-left">
      <button id="toggleMenu" class="toggle-button">&#9776;</button>
      <h1>3D Rubik's Cube</h1>
    </div>
    <div class="header-right">
      <!-- ★ ここをプルダウン＋解法ボタンに変更 ★ -->
      <select id="solveMethod">
        <option value="o1">独自LBL(o1)</option>
        <option value="rubiks">rubiks-cube-solver</option>
      </select>
      <button id="solveButton">解法を表示</button>
      <!-- ★ ここまで修正 ★ -->

      <button id="scrambleButton">スクランブル</button>
      <button id="resetButton">リセット</button>
    </div>
  </header>

  <!-- サイドバー（固定・スクロール可） -->
  <nav class="control-panel closed" id="controlPanel">
    <div class="panel-content">
      <div class="controls">
        <div class="control-group">
          <h3>基本操作</h3>
          <button data-move="U">U (上面 時計回り)</button>
          <button data-move="Uprime">U' (上面 反時計回り)</button>
          <button data-move="D">D (下面 時計回り)</button>
          <button data-move="Dprime">D' (下面 反時計回り)</button>
          <button data-move="R">R (右面 時計回り)</button>
          <button data-move="Rprime">R' (右面 反時計回り)</button>
          <button data-move="L">L (左面 時計回り)</button>
          <button data-move="Lprime">L' (左面 反時計回り)</button>
          <button data-move="F">F (前面 時計回り)</button>
          <button data-move="Fprime">F' (前面 反時計回り)</button>
          <button data-move="B">B (後面 時計回り)</button>
          <button data-move="Bprime">B' (後面 反時計回り)</button>
        </div>
        <div class="control-group">
          <h3>中層操作</h3>
          <button data-move="M">M (中央縦 上向き)</button>
          <button data-move="Mprime">M' (中央縦 下向き)</button>
          <button data-move="E">E (中央横 時計回り)</button>
          <button data-move="Eprime">E' (中央横 反時計回り)</button>
          <button data-move="S">S (中央前後 時計回り)</button>
          <button data-move="Sprime">S' (中央前後 反時計回り)</button>
        </div>
        <div class="control-group">
          <h3>キューブ全体の回転</h3>
          <button data-move="x">x (右方向に全体回転)</button>
          <button data-move="xprime">x' (左方向に全体回転)</button>
          <button data-move="y">y (上方向に全体回転)</button>
          <button data-move="yprime">y' (下方向に全体回転)</button>
          <button data-move="z">z (前方向に全体回転)</button>
          <button data-move="zprime">z' (後方向に全体回転)</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- メイン表示領域 -->
  <div class="cube-view">
    <canvas id="cubeCanvas"></canvas>
  </div>
  <!-- メインスクリプト -->
  <script src="app.js"></script>
</body>
</html>
```
styles.css
```css
/* リセット */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  /* 全体 */
  html, body {
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #fff;
    font-family: Arial, sans-serif;
    overflow: hidden; /* 全画面を使う */
  }
  
  /* ヘッダー（固定） */
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #111;
    padding: 0 20px;
    height: 60px;
    border-bottom: 1px solid #333;
    z-index: 10;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .header-left h1 {
    font-size: 18px;
    margin: 0;
  }
  
  .header-right {
    display: flex;
    gap: 10px;
  }
  
  /* トグルボタン */
  .toggle-button {
    font-size: 20px;
    background: none;
    border: none;
    color: #eee;
    cursor: pointer;
    padding: 5px 10px;
  }
  .toggle-button:hover {
    background-color: #333;
  }
  
  /* ボタン（スクランブル・解法など） */
  .header-right button {
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 12px;
    transition: background-color 0.2s ease;
  }
  
  .header-right button:hover {
    background-color: #0056b3;
  }
  
  /* サイドバー */
  .control-panel {
    position: fixed;
    top: 60px; /* ヘッダー下 */
    left: 0;
    bottom: 0;
    width: 300px;
    background-color: rgba(0, 0, 0, 0.85);
    border-right: 1px solid #333;
    overflow-y: auto; /* スクロール可能 */
    transform: translateX(0);
    transition: transform 0.3s ease;
    z-index: 9;
  }
  
  .control-panel.closed {
    transform: translateX(-100%);
  }
  
  .panel-content {
    padding: 15px;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .control-group {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 5px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
  
  .control-group h3 {
    margin-bottom: 10px;
    font-size: 14px;
    color: #aaa;
    grid-column: 1 / -1;
  }
  
  /* 共通ボタン */
  button {
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    padding: 8px;
    transition: all 0.2s ease;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.2;
    text-align: center;
    word-break: keep-all;
  }
  button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  button:active {
    transform: scale(0.95);
  }
  
  /* キューブ表示領域 */
  .cube-view {
    position: absolute;
    top: 60px;     /* ヘッダー下 */
    left: 300px;   /* サイドバー分 */
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #000;
  }
  
  /* canvas を全域使う */
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
```
app.js
```js
// app.js

// グローバル変数
let scene, camera, renderer, controls;
let cubePieces = [];
let isAnimating = false;

/**
 * シーンやカメラ等の初期化
 */
function initScene() {
  scene = new THREE.Scene();

  // カメラを少し左斜め上あたりに配置
  // （front=緑、up=白、right=赤）が見える向き
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(-3, 4, 4);
  camera.lookAt(0, 0, 0);

  const canvas = document.getElementById("cubeCanvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // OrbitControls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;

  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // 方向性のあるライト
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  createCube();
  animate();
}

/**
 * キューブ生成
 * rubiks-cube-solver想定:
 *   front=緑, right=赤, up=白, down=黄, left=オレンジ, back=青
 *
 * 材質インデックス: 0=R(赤),1=L(オレンジ),2=U(白),3=D(黄),4=F(緑),5=B(青)
 */
function createCube() {
  const colors = [
    0xff0000, // R => 赤
    0xff8000, // L => オレンジ
    0xffffff, // U => 白
    0xffff00, // D => 黄
    0x00ff00, // F => 緑
    0x0000ff, // B => 青
  ];

  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  // センター（各面の中心）
  // front=緑(Z=1), back=青(Z=-1),
  // up=白(Y=1), down=黄(Y=-1),
  // right=赤(X=1), left=オレンジ(X=-1)
  const positions = [
    [0, 0, 1],   // F=緑
    [0, 0, -1],  // B=青
    [0, 1, 0],   // U=白
    [0, -1, 0],  // D=黄
    [1, 0, 0],   // R=赤
    [-1, 0, 0],  // L=オレンジ
  ];

  for (let pos of positions) {
    const mats = Array(6).fill().map(() => (
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 })
    ));

    // 上=白
    if (pos[1] === 1) mats[2].color.setHex(colors[2]);
    // 下=黄
    if (pos[1] === -1) mats[3].color.setHex(colors[3]);
    // 前=緑
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);
    // 後=青
    if (pos[2] === -1) mats[5].color.setHex(colors[5]);
    // 右=赤
    if (pos[0] === 1) mats[0].color.setHex(colors[0]);
    // 左=オレンジ
    if (pos[0] === -1) mats[1].color.setHex(colors[1]);

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }

  // エッジピース (2面色)
  const edgePositions = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 0, -1], [-1, 0, -1], [0, 1, -1], [0, -1, -1],
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  ];

  for (let pos of edgePositions) {
    const mats = [
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
    ];

    // 0=R(赤),1=L(オレンジ),2=U(白),3=D(黄),4=F(緑),5=B(青)
    if (pos[0] === 1) mats[0].color.setHex(colors[0]); // R=赤
    if (pos[0] === -1) mats[1].color.setHex(colors[1]); // L=オレンジ
    if (pos[1] === 1) mats[2].color.setHex(colors[2]);  // U=白
    if (pos[1] === -1) mats[3].color.setHex(colors[3]); // D=黄
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);  // F=緑
    if (pos[2] === -1) mats[5].color.setHex(colors[5]); // B=青

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }

  // コーナーピース (3面色)
  const cornerPositions = [
    [1, 1, 1],  [-1, 1, 1],
    [1, -1, 1], [-1, -1, 1],
    [1, 1, -1], [-1, 1, -1],
    [1, -1, -1],[ -1, -1, -1],
  ];

  for (let pos of cornerPositions) {
    const mats = [
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 }),
    ];

    if (pos[0] === 1) mats[0].color.setHex(colors[0]); // R=赤
    if (pos[0] === -1) mats[1].color.setHex(colors[1]); // L=オレンジ
    if (pos[1] === 1) mats[2].color.setHex(colors[2]);  // U=白
    if (pos[1] === -1) mats[3].color.setHex(colors[3]); // D=黄
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);  // F=緑
    if (pos[2] === -1) mats[5].color.setHex(colors[5]); // B=青

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }
}

/**
 * レンダリングループ
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * 画面サイズを .cube-view に合わせる
 */
function updateRendererSize() {
  const cubeView = document.querySelector(".cube-view");
  const w = cubeView.clientWidth;
  const h = cubeView.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/**
 * リセット
 */
function resetCube() {
  cubePieces.forEach((p) => scene.remove(p));
  cubePieces = [];
  createCube();
}

/**
 * スクランブル (20手ランダム)
 */
function scrambleCube() {
  if (isAnimating) return;
  const allMoves = [
    "U", "Uprime", "D", "Dprime", "R", "Rprime", "L", "Lprime",
    "F", "Fprime", "B", "Bprime", "M", "Mprime", "E", "Eprime",
    "S", "Sprime", "x", "xprime", "y", "yprime", "z", "zprime",
  ];
  const length = 20;
  const seq = [];
  for (let i = 0; i < length; i++) {
    seq.push(allMoves[Math.floor(Math.random() * allMoves.length)]);
  }

  let idx = 0;
  function nextMove() {
    if (idx >= seq.length) return;
    executeMove(seq[idx]);
    idx++;
    setTimeout(nextMove, 400);
  }
  nextMove();
}

/* -------------------------------------------------------------------
   ★ 修正： BFSで 「front=緑, up=白, right=赤」 に持っていく機能
   ------------------------------------------------------------------- */

/**
 * 現在のセンターの配列 [fColor, rColor, uColor, dColor, lColor, bColor] を取得
 */
function getCenterOrientation() {
  // f= (0,0,1), r= (1,0,0), u= (0,1,0), d= (0,-1,0), l= (-1,0,0), b= (0,0,-1)
  // それぞれの色を取得して配列に
  let result = ["","","","","",""]; // [f,r,u,d,l,b]
  const centerData = getCubeState().centers; // center data from user function

  // centerData: each => {pos:[x,y,z], colors:[{face, colorName}]}
  // pos( 0, 0, 1) => front
  // pos( 1, 0, 0) => right
  // pos( 0, 1, 0) => up
  // pos( 0,-1, 0) => down
  // pos(-1, 0, 0) => left
  // pos( 0, 0,-1) => back
  // we only store one color because each center has exactly 1 color

  for (let c of centerData) {
    let [x,y,z] = c.pos;
    let colName = c.colors[0]?.colorName || "unknown";
    if (x===0 && y===0 && z===1)  result[0] = colName; // front
    if (x===1 && y===0 && z===0)  result[1] = colName; // right
    if (x===0 && y===1 && z===0)  result[2] = colName; // up
    if (x===0 && y===-1&& z===0)  result[3] = colName; // down
    if (x===-1&&y===0 && z===0)  result[4] = colName; // left
    if (x===0 && y===0 && z===-1) result[5] = colName; // back
  }
  return result;
}

/**
 * BFSで、front=green, up=white, right=red になるまで最大深さ4で探索
 */
async function autoOrientCubeForSolver() {
  // 初期状態でチェック
  let startOrient = getCenterOrientation();
  if (checkOrientationGoal(startOrient)) {
    return; // もう合ってる
  }

  // BFSのキュー
  let queue = [];
  queue.push({ orient: startOrient, moves: [] });

  // 訪問済みセット
  let visited = new Set();
  visited.add( orientationKey(startOrient) );

  // 全体回転の6通り
  const possibleMoves = [
    { axis:'x', dir: 1,  notation:'x' },
    { axis:'x', dir: -1, notation:'xprime' },
    { axis:'y', dir: 1,  notation:'y' },
    { axis:'y', dir: -1, notation:'yprime' },
    { axis:'z', dir: 1,  notation:'z' },
    { axis:'z', dir: -1, notation:'zprime' },
  ];

  let maxDepth = 4; // 最大4回の全体回転で試みる

  while(queue.length > 0) {
    let { orient, moves } = queue.shift();

    // 深さが maxDepth 超えたら打ち切り
    if (moves.length >= maxDepth) {
      continue;
    }

    // 6方向の全体回転を試す
    for (let pm of possibleMoves) {
      // ↓ orient をシミュレートして得た新しい配列
      let newOrient = rotateOrientation(orient, pm.axis, pm.dir);
      if (checkOrientationGoal(newOrient)) {
        // 発見！ => moves + pm.notation で物理的に実際の回転を適用する
        let finalMoves = [...moves, pm.notation];
        // 回転を実際に再生
        for (let fm of finalMoves) {
          await rotateCube( fm[0], fm.includes("prime")? -1 : 1 );
        }
        return;
      }
      let key = orientationKey(newOrient);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ orient: newOrient, moves: [...moves, pm.notation] });
      }
    }
  }
  // 4手以内でできなかったら諦める
  console.warn("autoOrientCubeForSolver: cannot fix orientation within 4 moves..");
}

// [f,r,u,d,l,b] という配列を受け取り、front=green & up=white & right=red か判定
function checkOrientationGoal(arr) {
  // arr[0]=f, arr[1]=r, arr[2]=u
  return (arr[0]==="green" && arr[2]==="white" && arr[1]==="red");
}

// BFSで使うハッシュキー
function orientationKey(arr) {
  return arr.join("|");
}

/**
 * center配列 [fColor, rColor, uColor, dColor, lColor, bColor] に対して
 * "x,y,z" 回転を dir=±1（90度）だけシミュレートする
 */
function rotateOrientation(arr, axis, dir) {
  // arr = [f,r,u,d,l,b]
  // それぞれ 0:F,1:R,2:U,3:D,4:L,5:B
  // ここで x回転 => (U->B, B->D, D->F, F->U) みたいな入れ替え
  // ただし dir=1が "x", dir=-1が "xprime"
  const newArr = [...arr];

  if (axis==="x") {
    if (dir===1) {
      // x: (u->b, b->d, d->f, f->u), r,lはそのまま
      newArr[2] = arr[5]; // U->B
      newArr[5] = arr[3]; // B->D
      newArr[3] = arr[0]; // D->F
      newArr[0] = arr[2]; // F->U
      newArr[1] = arr[1]; // R->R
      newArr[4] = arr[4]; // L->L
    } else {
      // xprime
      newArr[5] = arr[2]; // B<-U
      newArr[3] = arr[5]; // D<-B
      newArr[0] = arr[3]; // F<-D
      newArr[2] = arr[0]; // U<-F
      newArr[1] = arr[1]; // R->R
      newArr[4] = arr[4]; // L->L
    }
  }
  else if (axis==="y") {
    if (dir===1) {
      // y: (f->r, r->b, b->l, l->f), u,dはそのまま
      newArr[0] = arr[4]; // F<-L
      newArr[1] = arr[0]; // R<-F
      newArr[5] = arr[1]; // B<-R
      newArr[4] = arr[5]; // L<-B
      newArr[2] = arr[2]; // U->U
      newArr[3] = arr[3]; // D->D
    } else {
      // yprime
      newArr[4] = arr[0]; // L<-F
      newArr[0] = arr[1]; // F<-R
      newArr[1] = arr[5]; // R<-B
      newArr[5] = arr[4]; // B<-L
      newArr[2] = arr[2]; // U->U
      newArr[3] = arr[3]; // D->D
    }
  }
  else if (axis==="z") {
    if (dir===1) {
      // z: (u->l, l->d, d->r, r->u), f,bはそのまま
      newArr[2] = arr[1]; // U<-R
      newArr[1] = arr[3]; // R<-D
      newArr[3] = arr[4]; // D<-L
      newArr[4] = arr[2]; // L<-U
      newArr[0] = arr[0]; // F->F
      newArr[5] = arr[5]; // B->B
    } else {
      // zprime
      newArr[1] = arr[2]; // R<-U
      newArr[3] = arr[1]; // D<-R
      newArr[4] = arr[3]; // L<-D
      newArr[2] = arr[4]; // U<-L
      newArr[0] = arr[0]; // F->F
      newArr[5] = arr[5]; // B->B
    }
  }
  return newArr;
}

/* -------------------------------------------------------------------
   rubiks-cube-solver を使った解法
   ------------------------------------------------------------------- */

/**
 * rubiks-cube-solver を使った解法 (Fridrich Method)
 * - BFSでキューブを "front=緑, up=白, right=赤" に自動調整し
 * - 54文字をビルドして解法取得
 * - 取得した手順を順番に実行
 */
async function solveCubeRubiks() {
  if (isAnimating) return;
  
  // front=緑 & up=白 & right=赤 に自動回転
  await autoOrientCubeForSolver();

  // getCubeState() の結果をもとに文字列(全54文字)を生成
  let cubeStateString = buildCubeStateString();
  console.log("現在のキューブ状態(54文字) =", cubeStateString);

  // rubiks-cube-solver を呼び出す
  let solveMoves;
  try {
    solveMoves = window.rubiksCubeSolver(cubeStateString);
    // solveMoves = window.RubiksCubeSolver.solve(cubeStateString);
  } catch (e) {
    console.error("rubiks-cube-solver の呼び出しでエラー:", e);
    alert("rubiks-cube-solver の解法に失敗しました。");
    return;
  }

  console.log("rubiks-cube-solver の解答手順:", solveMoves);

  // 解答手順を順番に実行
  let movesArray = solveMoves.split(/\s+/);
  
  // movesArrayの要素内の末尾が数字の場合、末尾の数字分だけ要素を追加
  movesArray = movesArray.reduce((acc, move) => {
    // 小文字で始まる場合は大文字に変換（例: fprime => Fprime）
    move = move[0].toUpperCase() + move.slice(1);
    
    // 末尾の数字を抽出
    const match = move.match(/(\d+)$/);
    if (match) {
      const count = parseInt(match[1]);
      const baseMove = move.slice(0, -1);
      return [...acc, ...Array(count).fill(baseMove)];
    }
    return [...acc, move];
  }, []);

  console.log("rubiks-cube-solver の解答手順（parse）:", movesArray);

  for (let move of movesArray) {
    await doAlgorithm(move);
  }

  alert("rubiks-cube-solver による解法が完了しました！");
}

/* -------------------------------------------------------------------
   独自LBL（Layer-by-Layer）解法
   ------------------------------------------------------------------- */

async function solveCube() {
  if (isAnimating) return;

  console.log("Solving the cube with unlimited tries...");

  const MAX_ATTEMPTS = 999;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`=== Solve Attempt: ${attempt} / ${MAX_ATTEMPTS} ===`);

    // 1) キューブ状態を取得
    let state = getCubeState();
    // もしすでに完成なら終了
    if (checkIfSolved(state)) {
      alert("すでに完成しています！");
      return;
    }

    // 手順を格納する配列（デバッグ用）
    const solutionMoves = [];

    // ---- ステップ1: 白クロス (up=white + 周囲[赤,緑,オレンジ,青]) ----
    await solveWhiteCross(solutionMoves);

    // ---- ステップ2: 白面 + 第一層コーナー ----
    await solveWhiteCorners(solutionMoves);

    // ---- ステップ3: 中段エッジ (赤/緑/青/オレンジ) ----
    await solveMiddleEdges(solutionMoves);

    // ---- ステップ4: 上面(黄)クロス ----
    await solveYellowCross(solutionMoves);

    // ---- ステップ5: OLL(上面コーナーの向き) ----
    await solveOLL(solutionMoves);

    // ---- ステップ6: PLL(最終層のコーナー&エッジ入替) ----
    await solvePLL(solutionMoves);

    // 完成チェック
    let finalState = getCubeState();
    if (checkIfSolved(finalState)) {
      alert("キューブが完成しました！");
      console.log("Solution Moves:", solutionMoves.join(" "));
      return;
    } else {
      console.log(`Attempt ${attempt} finished but not solved. Re-trying...`);
    }
  }

  alert("解けませんでした… もう一度挑戦してください。");
}

/* ===================================================================================
   以下、Layer-by-Layerの各ステップ＋補助関数
   (1) 白クロス
   (2) 白面+第一層コーナー
   (3) 中段エッジ
   (4) 上面(黄)クロス
   (5) OLL
   (6) PLL
   および (getCubeState, checkIfSolved, doAlgorithm, waitMs など)
   =================================================================================== */

/**
 * キューブ状態を読み取り、内部表現として返す
 * - U=白, D=黄, R=赤, L=オレンジ, F=緑, B=青
 */
function getCubeState() {
  const cubeInfo = {
    centers: [],
    edges: [],
    corners: [],
  };

  for (let piece of cubePieces) {
    const px = Math.round(piece.position.x);
    const py = Math.round(piece.position.y);
    const pz = Math.round(piece.position.z);

    const cArr = piece.material.map(m => m.color.getHex());
    const colorInfo = [];

    // 0=R(赤),1=L(オレンジ),2=U(白),3=D(黄),4=F(緑),5=B(青)
    if (cArr[0] !== 0x000000) colorInfo.push({ face: "R", colorName: hexToColorName(cArr[0]) });
    if (cArr[1] !== 0x000000) colorInfo.push({ face: "L", colorName: hexToColorName(cArr[1]) });
    if (cArr[2] !== 0x000000) colorInfo.push({ face: "U", colorName: hexToColorName(cArr[2]) });
    if (cArr[3] !== 0x000000) colorInfo.push({ face: "D", colorName: hexToColorName(cArr[3]) });
    if (cArr[4] !== 0x000000) colorInfo.push({ face: "F", colorName: hexToColorName(cArr[4]) });
    if (cArr[5] !== 0x000000) colorInfo.push({ face: "B", colorName: hexToColorName(cArr[5]) });

    const pieceData = {
      pos: [px, py, pz],
      colors: colorInfo,
    };

    const sumAbs = Math.abs(px) + Math.abs(py) + Math.abs(pz);
    if (sumAbs === 1) {
      cubeInfo.centers.push(pieceData);
    } else if (sumAbs === 2) {
      cubeInfo.edges.push(pieceData);
    } else if (sumAbs === 3) {
      cubeInfo.corners.push(pieceData);
    }
  }

  return cubeInfo;
}

/** ヘックス色を "white","yellow","red","blue","green","orange","black" に変換 */
function hexToColorName(hex) {
  switch (hex) {
    case 0xffffff: return "white";
    case 0xffff00: return "yellow";
    case 0xff0000: return "red";
    case 0x0000ff: return "blue";
    case 0x00ff00: return "green";
    case 0xff8000: return "orange";
    default:       return "black";
  }
}

/**
 * 現在のキューブが完成しているかどうか(センター色で簡易チェック)
 * - up=white(0,1,0), right=red(1,0,0), front=green(0,0,1),
 *   down=yellow(0,-1,0), left=orange(-1,0,0), back=blue(0,0,-1)
 */
function checkIfSolved(cubeInfo) {
  let centerColors = {};
  for (let c of cubeInfo.centers) {
    if (c.colors.length > 0) {
      centerColors[`${c.pos[0]},${c.pos[1]},${c.pos[2]}`] = c.colors[0].colorName;
    }
  }
  const expected = {
    "0,1,0": "white",
    "1,0,0": "red",
    "0,0,1": "green",
    "0,-1,0": "yellow",
    "-1,0,0": "orange",
    "0,0,-1": "blue",
  };
  for (let k in expected) {
    if (!centerColors[k] || centerColors[k] !== expected[k]) {
      return false;
    }
  }
  return true;
}

/**
 * 手順をまとめて実行 (1手ごとに実行 + ウェイト)
 */
async function doAlgorithm(alg) {
  const moves = alg.trim().split(/\s+/);
  for (let m of moves) {
    executeMove(m);
    await waitMs(300);
  }
}

/** msミリ秒待つ */
function waitMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * (1) 白クロス (U=white + [R=赤, F=緑, L=オレンジ, B=青])
 */
async function solveWhiteCross(solutionMoves) {
  const targetPairs = [
    ["white", "red"],    // U+R
    ["white", "green"],  // U+F
    ["white", "orange"], // U+L
    ["white", "blue"],   // U+B
  ];
  for (let pair of targetPairs) {
    await placeWhiteEdge(pair, solutionMoves);
  }
  console.log("[Step1] 白クロス（ある程度）");
}

async function placeWhiteEdge(colors, solutionMoves) {
  for (let i = 0; i < 10; i++) {
    let st = getCubeState();
    let edge = findEdgeByColors(st.edges, colors);
    if (!edge) return; 
    if (isWhiteEdgeCorrectU(edge)) return;

    await moveWhiteEdgeToDown(edge, solutionMoves);
    await liftWhiteEdgeFromDown(colors, solutionMoves);

    let st2 = getCubeState();
    let edge2 = findEdgeByColors(st2.edges, colors);
    if (edge2 && isWhiteEdgeCorrectU(edge2)) {
      return;
    }
  }
}

function findEdgeByColors(edgeArray, twoColors) {
  return edgeArray.find(e => {
    let cSet = e.colors.map(c => c.colorName);
    return twoColors.every(col => cSet.includes(col));
  });
}

function isWhiteEdgeCorrectU(edgeData) {
  if (edgeData.pos[1] === 1) {
    let whiteFace = edgeData.colors.find(c => c.colorName === "white");
    if (whiteFace && whiteFace.face === "U") {
      return true;
    }
  }
  return false;
}

async function moveWhiteEdgeToDown(edgeData, solutionMoves) {
  let [px, py, pz] = edgeData.pos;
  if (py === -1) return;

  if (py === 1) {
    await doAlgorithm("F2");
    solutionMoves.push("F2");
  } else if (py === 0) {
    if (pz === 1) {
      await doAlgorithm("Fprime");
      solutionMoves.push("Fprime");
    } else if (pz === -1) {
      await doAlgorithm("B");
      solutionMoves.push("B");
    } else if (px === 1) {
      await doAlgorithm("R");
      solutionMoves.push("R");
    } else if (px === -1) {
      await doAlgorithm("Lprime");
      solutionMoves.push("Lprime");
    }
  }
}

async function liftWhiteEdgeFromDown(twoColors, solutionMoves) {
  let color2 = twoColors.find(c => c !== "white");
  let faceMap = { red:"R", green:"F", orange:"L", blue:"B" };
  let face = faceMap[color2] || "F";

  let cornerToPos = {
    R: [1, -1, 0],
    F: [0, -1, 1],
    B: [0, -1, -1],
    L: [-1, -1, 0],
  };

  for (let i=0; i<4; i++) {
    let st = getCubeState();
    let edge = findEdgeByColors(st.edges, ["white", color2]);
    if (!edge) return;

    let [px, py, pz] = edge.pos;
    let desired = cornerToPos[face];
    if (px === desired[0] && py === desired[1] && pz === desired[2]) {
      await doAlgorithm(face + "2");
      solutionMoves.push(face + "2");
      return;
    } else {
      await doAlgorithm("D");
      solutionMoves.push("D");
    }
  }
}

/**
 * (2) 白面 + 第一層コーナー
 */
async function solveWhiteCorners(solutionMoves) {
  const cornerColorsList = [
    ["white","green","red"],
    ["white","red","blue"],
    ["white","blue","orange"],
    ["white","orange","green"],
  ];
  for (let colors of cornerColorsList) {
    await placeWhiteCorner(colors, solutionMoves);
  }
  console.log("[Step2] 白面＆第一層コーナー完了（ある程度）");
}

async function placeWhiteCorner(threeColors, solutionMoves) {
  for (let i=0; i<10; i++) {
    let st = getCubeState();
    let corner = findCornerByColors(st.corners, threeColors);
    if (!corner) return;
    if (isWhiteCornerCorrectU(corner)) return;

    await moveWhiteCornerToDown(corner, solutionMoves);
    await liftWhiteCornerFromDown(threeColors, solutionMoves);

    let st2 = getCubeState();
    let corner2 = findCornerByColors(st2.corners, threeColors);
    if (corner2 && isWhiteCornerCorrectU(corner2)) {
      return;
    }
  }
}

function findCornerByColors(cornerArray, threeColors) {
  return cornerArray.find(c => {
    let cSet = c.colors.map(cc => cc.colorName);
    return threeColors.every(col => cSet.includes(col));
  });
}

function isWhiteCornerCorrectU(corner) {
  if (corner.pos[1] === 1) {
    let whitePart = corner.colors.find(cc => cc.colorName==="white");
    if (whitePart && whitePart.face==="U") {
      return true;
    }
  }
  return false;
}

async function moveWhiteCornerToDown(cornerData, solutionMoves) {
  let [px, py] = cornerData.pos;
  if (py === -1) return;
  await doAlgorithm("Rprime D R");
  solutionMoves.push("Rprime","D","R");
}

async function liftWhiteCornerFromDown(threeColors, solutionMoves) {
  let pair = threeColors.filter(c => c!=="white").sort().join(",");
  let cornerPosMap = {
    "green,red": "FR",
    "red,blue": "RB",
    "blue,orange": "BL",
    "green,orange": "LF",
  };
  let targetCorner = cornerPosMap[pair];
  if (!targetCorner) return;

  let cornerToPos = {
    FR: [1, -1, 1],
    RB: [1, -1, -1],
    BL: [-1, -1, -1],
    LF: [-1, -1, 1],
  };
  let cornerToAlg = {
    FR: "Rprime Dprime R",
    RB: "Bprime Dprime B",
    BL: "Lprime Dprime L",
    LF: "Fprime Dprime F",
  };
  let desired = cornerToPos[targetCorner];
  let alg = cornerToAlg[targetCorner];

  for (let i=0; i<4; i++) {
    let st = getCubeState();
    let c = findCornerByColors(st.corners, threeColors);
    if (!c) return;

    let [px, py, pz] = c.pos;
    if (px === desired[0] && py === desired[1] && pz === desired[2]) {
      await doAlgorithm(alg);
      solutionMoves.push(...alg.split(" "));
      return;
    } else {
      await doAlgorithm("D");
      solutionMoves.push("D");
    }
  }
}

/**
 * (3) 中段エッジ
 */
async function solveMiddleEdges(solutionMoves) {
  const middleEdges = [
    ["red","green"],
    ["red","blue"],
    ["orange","green"],
    ["orange","blue"],
  ];
  for (let pair of middleEdges) {
    await placeMiddleEdge(pair, solutionMoves);
  }
  console.log("[Step3] 中段エッジ完了（ある程度）");
}

async function placeMiddleEdge(twoColors, solutionMoves) {
  for (let i=0; i<8; i++) {
    let st = getCubeState();
    let edge = findEdgeByColors(st.edges, twoColors);
    if (!edge) return;

    if (isMiddleEdgeCorrect(edge)) return;

    await moveEdgeToDown(edge, solutionMoves);
    await insertEdgeToMiddle(twoColors, solutionMoves);

    let st2 = getCubeState();
    let edge2 = findEdgeByColors(st2.edges, twoColors);
    if (edge2 && isMiddleEdgeCorrect(edge2)) {
      return;
    }
  }
}

function isMiddleEdgeCorrect(edge) {
  if (edge.pos[1] === 0) {
    let hasWhiteOrYellow = edge.colors.some(c => c.colorName==="white" || c.colorName==="yellow");
    if (!hasWhiteOrYellow) {
      return true;
    }
  }
  return false;
}

async function moveEdgeToDown(edge, solutionMoves) {
  let [px, py] = edge.pos;
  if (py === -1) return;
  await doAlgorithm("Rprime Dprime R");
  solutionMoves.push("Rprime","Dprime","R");
}

async function insertEdgeToMiddle(twoColors, solutionMoves) {
  await doAlgorithm("U R Uprime Rprime Uprime Fprime U F");
  solutionMoves.push("U","R","Uprime","Rprime","Uprime","Fprime","U","F");
}

/**
 * (4) 上面(黄)クロス
 */
async function solveYellowCross(solutionMoves) {
  for (let i=0; i<8; i++) {
    let st = getCubeState();
    if (yellowCrossDone(st)) {
      console.log("[Step4] 黄クロス完成");
      return;
    }
    await doAlgorithm("F R U Rprime Uprime Fprime");
    solutionMoves.push("F","R","U","Rprime","Uprime","Fprime");
  }
}

function yellowCrossDone(st) {
  let count = 0;
  for (let e of st.edges) {
    if (e.pos[1] === -1) {
      if (e.colors.find(cc => cc.face==="D" && cc.colorName==="yellow")) {
        count++;
      }
    }
  }
  return (count === 4);
}

/**
 * (5) OLL
 */
async function solveOLL(solutionMoves) {
  for (let i=0; i<12; i++) {
    let st = getCubeState();
    if (allLastLayerOriented(st)) {
      console.log("[Step5] OLL完了");
      return;
    }
    await doAlgorithm("R U Rprime U R U2 Rprime");
    solutionMoves.push("R","U","Rprime","U","R","U2","Rprime");
  }
}

function allLastLayerOriented(st) {
  let count = 0;
  for (let c of st.corners) {
    if (c.pos[1] === -1) {
      if (c.colors.find(cc => cc.face==="D" && cc.colorName==="yellow")) {
        count++;
      }
    }
  }
  return (count === 4);
}

/**
 * (6) PLL
 */
async function solvePLL(solutionMoves) {
  // コーナーPLL
  for (let i=0; i<6; i++) {
    let st = getCubeState();
    if (lastLayerCornersOk(st)) break;
    await doAlgorithm("x Rprime U Rprime D2 R Uprime Rprime D2 R2 xprime");
    solutionMoves.push("x","Rprime","U","Rprime","D2","R","Uprime","Rprime","D2","R2","xprime");
  }

  // エッジPLL
  for (let i=0; i<6; i++) {
    let st = getCubeState();
    if (lastLayerEdgesOk(st)) {
      console.log("[Step6] PLL完了");
      return;
    }
    await doAlgorithm("R2 U R U Rprime Uprime Rprime Uprime Rprime U Rprime");
    solutionMoves.push("R2","U","R","U","Rprime","Uprime","Rprime","Uprime","Rprime","U","Rprime");
  }
}

function lastLayerCornersOk(st) {
  let match = 0;
  for (let c of st.corners) {
    if (c.pos[1] === -1) {
      match++;
    }
  }
  return match === 4;
}

function lastLayerEdgesOk(st) {
  let match = 0;
  for (let e of st.edges) {
    if (e.pos[1] === -1) {
      match++;
    }
  }
  return match === 4;
}

/* -------------------------------------------------------------------
   回転系 (レイヤー回転、全体回転など)
   ------------------------------------------------------------------- */

/**
 * 指定の手を１手実行
 */
function executeMove(moveType) {
  if (isAnimating) return;

  console.log("Move:", moveType);

  const moves = {
    U:   () => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", 1),
    "Uprime":() => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", -1),
    D:   () => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", -1),
    "Dprime":() => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", 1),
    R:   () => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", 1),
    "Rprime":() => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", -1),
    L:   () => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", -1),
    "Lprime":() => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", 1),
    F:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", 1),
    "Fprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", -1),
    B:   () => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", -1),
    "Bprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", 1),

    // 中層
    M:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", -1),
    "Mprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", 1),
    E:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", -1),
    "Eprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", 1),
    S:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", 1),
    "Sprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", -1),

    // 全体
    x:   () => rotateCube("x", 1),
    "xprime":() => rotateCube("x", -1),
    y:   () => rotateCube("y", 1),
    "yprime":() => rotateCube("y", -1),
    z:   () => rotateCube("z", 1),
    "zprime":() => rotateCube("z", -1),
  };

  if (moves[moveType]) {
    moves[moveType]();
  }
}

/**
 * 特定レイヤー回転
 */
function rotateLayer(dummyPiece, axis, direction) {
  if (isAnimating) return;
  isAnimating = true;

  const pos = dummyPiece.position.clone();
  let layerPieces = [];

  if (axis === "x") {
    layerPieces = cubePieces.filter((p) => Math.abs(p.position.x - pos.x) < 0.1);
  } else if (axis === "y") {
    layerPieces = cubePieces.filter((p) => Math.abs(p.position.y - pos.y) < 0.1);
  } else if (axis === "z") {
    layerPieces = cubePieces.filter((p) => Math.abs(p.position.z - pos.z) < 0.1);
  }

  const rotationMatrix = new THREE.Matrix4();
  const rotationAngle = (Math.PI / 2) * direction;
  switch (axis) {
    case "x": rotationMatrix.makeRotationX(rotationAngle); break;
    case "y": rotationMatrix.makeRotationY(rotationAngle); break;
    case "z": rotationMatrix.makeRotationZ(rotationAngle); break;
  }

  const group = new THREE.Group();
  layerPieces.forEach((p) => {
    scene.remove(p);
    group.add(p);
  });
  scene.add(group);

  const targetQ = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

  gsap.to(group.quaternion, {
    x: targetQ.x, y: targetQ.y, z: targetQ.z, w: targetQ.w,
    duration: 0.3, ease: "power1.inOut",
    onComplete: () => {
      layerPieces.forEach((p) => {
        group.remove(p);
        scene.add(p);
        p.position.applyMatrix4(rotationMatrix);
        p.updateMatrix();
        rotateColors(p.material, axis, direction);
      });
      scene.remove(group);
      isAnimating = false;
    },
  });
}

/**
 * キューブ全体回転
 */
function rotateCube(axis, direction) {
  if (isAnimating) {
    // もし何か回転中なら待たずにすぐ終わらせる
    return new Promise(resolve => resolve());
  }

  return new Promise((resolve) => {
    isAnimating = true;
    const rotationMatrix = new THREE.Matrix4();
    const rotationAngle = (Math.PI / 2) * direction;
    switch (axis) {
      case "x": rotationMatrix.makeRotationX(rotationAngle); break;
      case "y": rotationMatrix.makeRotationY(rotationAngle); break;
      case "z": rotationMatrix.makeRotationZ(rotationAngle); break;
    }

    const cubeGroup = new THREE.Group();
    cubePieces.forEach((p) => {
      scene.remove(p);
      cubeGroup.add(p);
    });
    scene.add(cubeGroup);

    gsap.to(cubeGroup.rotation, {
      [axis]: cubeGroup.rotation[axis] + rotationAngle,
      duration: 0.3, ease: "power1.inOut",
      onComplete: () => {
        cubePieces.forEach((p) => {
          cubeGroup.remove(p);
          scene.add(p);
          p.position.applyMatrix4(rotationMatrix);
          p.updateMatrix();
          rotateColors(p.material, axis, direction);
        });
        scene.remove(cubeGroup);
        isAnimating = false;
        resolve();
      },
    });
  });
}

/**
 * 色回転 (center / edge / corner すべて同じインデックス順)
 * index: 0=R(赤),1=L(オレンジ),2=U(白),3=D(黄),4=F(緑),5=B(青)
 */
function rotateColors(materials, axis, direction) {
  if (!materials || !Array.isArray(materials)) return;
  const temp = materials.map((m) => m.color.clone());

  if (axis === "x") {
    if (direction === 1) {
      materials[2].color.copy(temp[5]);
      materials[4].color.copy(temp[2]);
      materials[3].color.copy(temp[4]);
      materials[5].color.copy(temp[3]);
      materials[0].color.copy(temp[0]);
      materials[1].color.copy(temp[1]);
    } else {
      materials[5].color.copy(temp[2]);
      materials[3].color.copy(temp[5]);
      materials[4].color.copy(temp[3]);
      materials[2].color.copy(temp[4]);
      materials[0].color.copy(temp[0]);
      materials[1].color.copy(temp[1]);
    }
  }
  else if (axis === "y") {
    if (direction === 1) {
      materials[0].color.copy(temp[4]);
      materials[5].color.copy(temp[0]);
      materials[1].color.copy(temp[5]);
      materials[4].color.copy(temp[1]);
      materials[2].color.copy(temp[2]);
      materials[3].color.copy(temp[3]);
    } else {
      materials[1].color.copy(temp[4]);
      materials[4].color.copy(temp[0]);
      materials[0].color.copy(temp[5]);
      materials[5].color.copy(temp[1]);
      materials[2].color.copy(temp[2]);
      materials[3].color.copy(temp[3]);
    }
  }
  else if (axis === "z") {
    if (direction === 1) {
      materials[1].color.copy(temp[2]);
      materials[3].color.copy(temp[1]);
      materials[0].color.copy(temp[3]);
      materials[2].color.copy(temp[0]);
      materials[4].color.copy(temp[4]);
      materials[5].color.copy(temp[5]);
    } else {
      materials[0].color.copy(temp[2]);
      materials[3].color.copy(temp[0]);
      materials[1].color.copy(temp[3]);
      materials[2].color.copy(temp[1]);
      materials[4].color.copy(temp[4]);
      materials[5].color.copy(temp[5]);
    }
  }
}

/**
 * rubiks-cube-solver が要求する 54文字列を生成
 * 「front(緑) → right(赤) → up(白) → down(黄) → left(オレンジ) → back(青)」の順に各9文字
 */
function buildCubeStateString() {
  let cubeInfo = getCubeState();
  let fStr = getFaceString(cubeInfo, "F");
  let rStr = getFaceString(cubeInfo, "R");
  let uStr = getFaceString(cubeInfo, "U");
  let dStr = getFaceString(cubeInfo, "D");
  let lStr = getFaceString(cubeInfo, "L");
  let bStr = getFaceString(cubeInfo, "B");

  return fStr + rStr + uStr + dStr + lStr + bStr;
}

const faceIndicesMap = {
  F: [
    [-1, 1, 1], [0, 1, 1], [1, 1, 1],
    [-1, 0, 1], [0, 0, 1], [1, 0, 1],
    [-1, -1, 1],[0, -1, 1],[1, -1, 1],
  ],
  R: [
    [1, 1, 1], [1, 1, 0], [1, 1, -1],
    [1, 0, 1], [1, 0, 0], [1, 0, -1],
    [1, -1, 1],[1, -1, 0],[1, -1, -1],
  ],
  U: [
    [-1, 1, -1], [0, 1, -1], [1, 1, -1],
    [-1, 1, 0],  [0, 1, 0],  [1, 1, 0],
    [-1, 1, 1],  [0, 1, 1],  [1, 1, 1],
  ],
  D: [
    [-1, -1, 1],[0, -1, 1],[1, -1, 1],
    [-1, -1, 0],[0, -1, 0],[1, -1, 0],
    [-1, -1, -1],[0, -1, -1],[1, -1, -1],
  ],
  L: [
    [-1, 1, -1], [-1, 1, 0], [-1, 1, 1],
    [-1, 0, -1], [-1, 0, 0], [-1, 0, 1],
    [-1, -1, -1],[-1, -1, 0],[-1, -1, 1],
  ],
  B: [
    [1, 1, -1], [0, 1, -1], [-1, 1, -1],
    [1, 0, -1], [0, 0, -1], [-1, 0, -1],
    [1, -1, -1],[0, -1, -1],[-1, -1, -1],
  ],
};

/**
 * face="F"|"R"|"U"|"D"|"L"|"B" の9マス文字列
 */
function getFaceString(cubeInfo, face) {
  const coords = faceIndicesMap[face];
  let faceStr = "";
  for (let posArr of coords) {
    let piece = findPieceByPosition(cubeInfo, posArr[0], posArr[1], posArr[2]);
    if (!piece) {
      faceStr += "x";
      continue;
    }
    let colorObj = piece.colors.find(c => c.face === face);
    if (!colorObj) {
      faceStr += "x";
      continue;
    }
    faceStr += colorNameToSolverChar(colorObj.colorName);
  }
  return faceStr;
}

function findPieceByPosition(cubeInfo, px, py, pz) {
  let allPieces = [...cubeInfo.centers, ...cubeInfo.edges, ...cubeInfo.corners];
  return allPieces.find(p => {
    return p.pos[0] === px && p.pos[1] === py && p.pos[2] === pz;
  });
}

/**
 * "white"|"yellow"|"red"|"green"|"orange"|"blue" を
 *   rubiks-cube-solver の文字 (f,r,u,d,l,b) にマッピング
 */
function colorNameToSolverChar(colorName) {
  switch (colorName) {
    case "green":  return "f";
    case "red":    return "r";
    case "white":  return "u";
    case "yellow": return "d";
    case "orange": return "l";
    case "blue":   return "b";
    default:       return "x";
  }
}

// ---------------------------
// イベントリスナー
// ---------------------------
window.addEventListener("load", () => {
  initScene();
  updateRendererSize();
});

window.addEventListener("resize", updateRendererSize);

document.addEventListener("DOMContentLoaded", () => {
  // リセット
  document.getElementById("resetButton").addEventListener("click", resetCube);
  // スクランブル
  document.getElementById("scrambleButton").addEventListener("click", scrambleCube);

  // solveMethod の選択に応じて解法を切り替え
  document.getElementById("solveButton").addEventListener("click", () => {
    const method = document.getElementById("solveMethod").value;
    if (method === "o1") {
      // 独自LBL
      solveCube();
    } else {
      // rubiks-cube-solver
      solveCubeRubiks();
    }
  });

  // Move ボタン (単手操作)
  document.querySelectorAll("button[data-move]").forEach((btn) => {
    btn.addEventListener("click", () => {
      executeMove(btn.dataset.move);
    });
  });

  // サイドバー開閉
  const toggleMenu = document.getElementById("toggleMenu");
  const controlPanel = document.getElementById("controlPanel");
  toggleMenu.addEventListener("click", () => {
    controlPanel.classList.toggle("closed");
  });
});
```
リゾルバーライブラリの内容
<script src="https://cdn.jsdelivr.net/npm/rubiks-cube-solver@1.2.0/lib/index.common.min.js"></script>
```js
/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/rubiks-cube-solver@1.2.0/lib/index.common.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.rubiksCubeSolver=r():e.rubiksCubeSolver=r()}(this,function(){return function(e){function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}var t={};return r.m=e,r.c=t,r.i=function(e){return e},r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=34)}([function(e,r,t){"use strict";function o(e){var r={};return Object.keys(e).forEach(function(t){r[t.toLowerCase()]=e[t].toLowerCase()}),r}function n(e,r){var t=Object.keys(e);if(t.length<=1&&["front","back"].includes(t[0]))throw new Error('Orientation object "'+e+'" is ambiguous. Please specify one of these faces: "up", "right", "down", "left"');var o=e;return e={},t.forEach(function(r){["front","back"].includes(r)||(e[r]=o[r])}),e.front=r.toLowerCase(),e}function i(e){if(Object.keys(e)<=1)throw new Error('Orientation object "'+e+'" is ambiguous. Please specify 2 faces.');var r=Object.keys(e),t=r.map(function(r){return new l.Face(e[r])}),o=r.map(function(e){return new l.Face(e)}),n=f.Vector.getRotationFromNormals(t[0].normal(),t[0].orientTo(o[0]).normal());t[1].rotate(n.axis,n.angle);var i=f.Vector.getRotationFromNormals(t[1].normal(),t[1].orientTo(o[1]).normal());if(Math.abs(i.angle)===Math.PI){var a=new l.Face(r[0]).vector.getAxis();i.axis=a}return[n,i]}function a(e,r){var t=!0,o=!1,n=void 0;try{for(var i,a=e[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value,c=!0,s=!1,l=void 0;try{for(var f,v=r[Symbol.iterator]();!(c=(f=v.next()).done);c=!0){var m=f.value;u.rotate(m.axis,m.angle)}}catch(e){s=!0,l=e}finally{try{!c&&v.return&&v.return()}finally{if(s)throw l}}}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}}function u(e){var r=[],t=!0,o=!1,n=void 0;try{for(var i,a=e[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value;u=u.includes("prime")?u[0]:u[0]+"prime",r.push(u)}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}return"string"==typeof moves?r.join(" "):r}Object.defineProperty(r,"__esModule",{value:!0}),r.orientMoves=r.getRotationFromTo=r.getFaceFromDirection=r.getDirectionFromFaces=r.normalizeNotations=r.transformNotations=r.getFaceMatchingMiddle=r.getMiddleMatchingFace=r.getMoveOfFace=r.getFaceOfMove=void 0;var c=t(7),s=function(e){return e&&e.__esModule?e:{default:e}}(c),l=t(10),f=t(4),v={f:"s",r:"mprime",u:"eprime",d:"e",l:"m",b:"sprime"},m=r.getFaceOfMove=function(e){if("string"!=typeof e)throw new TypeError("move must be a string");var r=e[0].toLowerCase();return"f"===r?"front":"r"===r?"right":"u"===r?"up":"d"===r?"down":"l"===r?"left":"b"===r?"back":void 0},h=r.getMoveOfFace=function(e){if("string"!=typeof e)throw new TypeError("face must be a string");if(e=e.toLowerCase(),!["front","right","up","down","left","back"].includes(e))throw new Error(e+" is not valid face");return e[0]},p=r.getMiddleMatchingFace=function(e){return e=e.toLowerCase()[0],v[e]},g=r.getFaceMatchingMiddle=function(e){e=e.toLowerCase();var r=!0,t=!1,o=void 0;try{for(var n,i=Object.keys(v)[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var a=n.value;if(e===v[a])return a}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}},d=r.transformNotations=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=y(e);return r.upperCase&&(t=t.map(function(e){return e[0].toUpperCase()+e.slice(1)})),r.orientation&&(t=w(t,r.orientation)),r.reverse&&(t=u(t)),"string"==typeof e?t.join(" "):t},y=r.normalizeNotations=function(e){return"string"==typeof e&&(e=e.split(" ")),e=e.filter(function(e){return""!==e}),e.map(function(e){var r=e.toLowerCase().includes("prime"),t=e.includes("2");return e=e[0],t?e=e[0]+"2":r&&(e+="prime"),e})},P=r.getDirectionFromFaces=function(e,r,t){t=o(t),t=n(t,e);var u=new l.Face(e),c=new l.Face(r);a([u,c],i(t));var v=new f.Vector((0,s.default)([],u.normal(),c.normal())).getAxis(),m=f.Vector.getAngle(u.normal(),c.normal());return"x"===v&&m>0?"down":"x"===v&&m<0?"up":"y"===v&&m>0?"right":"y"===v&&m<0?"left":0===m?"front":m===Math.PI?"back":void 0},b=r.getFaceFromDirection=function(e,r,t){t=o(t),t=n(t,e);var u=new l.Face(e),c=i(t);a([u],c);var s=new l.Face(r),v=f.Vector.getRotationFromNormals(u.normal(),s.normal()),m=v.axis,h=v.angle;return u.rotate(m,h),a([u],c.map(function(e){return f.Vector.reverseRotation(e)}).reverse()),u.toString()},F=r.getRotationFromTo=function(e,r,t){var o=new l.Face(e),n=new l.Face(r),i=new l.Face(t),a=o.vector.getAxis(),u=[n.vector.getAxis(),i.vector.getAxis()],c=u[0],s=u[1];if([c.toLowerCase(),s.toLowerCase()].includes(a.toLowerCase()))throw new Error("moving "+o+" from "+n+" to "+i+" is not possible.");var v=h(e).toUpperCase(),m=f.Vector.getAngle(n.normal(),i.normal());return o.vector.getMagnitude()<0&&(m*=-1),0===m?"":Math.abs(m)===Math.PI?v+" "+v:m<0?""+v:m>0?v+"Prime":void 0},w=r.orientMoves=function(e,r){r=o(r);var t=i(r);return t.reverse().map(function(e){return f.Vector.reverseRotation(e)}),e.map(function(e){var r=e.toLowerCase().includes("prime"),o=e.includes("2"),n=e[0]===e[0].toLowerCase(),i=["m","e","s"].includes(e[0].toLowerCase());o&&(e=e.replace("2",""));var u=void 0;if(i){var c=m(g(e));u=new l.Face(c)}else{var s=m(e[0]);u=new l.Face(s)}a([u],t);var f=void 0;return f=i?p(u.toString()):u.toString()[0],n||(f=f.toUpperCase()),o&&(f+="2"),r&&!i&&(f+="prime"),f})};r.default={getFaceOfMove:m,getMoveOfFace:h,getMiddleMatchingFace:p,getFaceMatchingMiddle:g,transformNotations:d,normalizeNotations:y,getDirectionFromFaces:P,getRotationFromTo:F,getFaceFromDirection:b,orientMoves:w}},function(e,r,t){"use strict";function o(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.RubiksCube=void 0;var i=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),a=t(9),u=t(3),c=t(0),s="fffffffffrrrrrrrrruuuuuuuuudddddddddlllllllllbbbbbbbbb",l=function(){function e(r){if(n(this,e),54!==r.length)throw new Error("Wrong number of colors provided");this._notationToRotation={f:{axis:"z",mag:-1},r:{axis:"x",mag:-1},u:{axis:"y",mag:-1},d:{axis:"y",mag:1},l:{axis:"x",mag:1},b:{axis:"z",mag:1},m:{axis:"x",mag:1},e:{axis:"y",mag:1},s:{axis:"z",mag:-1}},this._build(r)}return i(e,null,[{key:"Solved",value:function(){return new e(s)}},{key:"FromMoves",value:function(r){var t=e.Solved();return t.move(r),t}},{key:"Scrambled",value:function(){var r=e.Solved(),t=e.getRandomMoves(25);return r.move(t),r}},{key:"reverseMoves",value:function(r){return e.transformMoves(r,{reverse:!0})}},{key:"transformMoves",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return(0,c.transformNotations)(e,r)}},{key:"getRandomMoves",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:25,r=[],t=["F","Fprime","R","Rprime","U","Uprime","D","Dprime","L","Lprime","B","Bprime"];r.length<e;){for(var o=0;o<e-r.length;o++){var n=~~(Math.random()*t.length);r.push(t[n])}r=(0,u.algorithmShortener)(r).split(" ")}return r.join(" ")}}]),i(e,[{key:"getFace",value:function(e){if("string"!=typeof e)throw new Error('"face" must be a string (received: '+e+")");e=e.toLowerCase()[0];var r=void 0,t=void 0,o=void 0,n=void 0,i=void 0;if("f"===e)r="Y",t="X",o=-1,n=1,i=this._cubies.filter(function(e){return 1===e.getZ()});else if("r"===e)r="Y",t="Z",o=-1,n=-1,i=this._cubies.filter(function(e){return 1===e.getX()});else if("u"===e)r="Z",t="X",o=1,n=1,i=this._cubies.filter(function(e){return 1===e.getY()});else if("d"===e)r="Z",t="X",o=-1,n=1,i=this._cubies.filter(function(e){return-1===e.getY()});else if("l"===e)r="Y",t="Z",o=-1,n=1,i=this._cubies.filter(function(e){return-1===e.getX()});else if("b"===e)r="Y",t="X",o=-1,n=-1,i=this._cubies.filter(function(e){return-1===e.getZ()});else if(["m","e","s"].includes(e))return this._getMiddleCubiesForMove(e);return i.sort(function(e,i){var a=e["get"+r]()*o,u=e["get"+t]()*n,c=i["get"+r]()*o,s=i["get"+t]()*n;return a<c?-1:a>c?1:u<s?-1:1})}},{key:"getCubie",value:function(e){return this._cubies.find(function(r){if(e.length!=r.faces().length)return!1;var t=!0,o=!1,n=void 0;try{for(var i,a=e[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value;if(!r.faces().includes(u))return!1}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}return!0})}},{key:"corners",value:function(){return this._cubies.filter(function(e){return e.isCorner()})}},{key:"edges",value:function(){return this._cubies.filter(function(e){return e.isEdge()})}},{key:"middles",value:function(){return this._cubies.filter(function(e){return e.isMiddle()})}},{key:"move",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"string"==typeof e&&(e=e.split(" ")),e=(0,c.transformNotations)(e,r);var t=!0,n=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(t=(a=u.next()).done);t=!0){var s=a.value,l=s[0];if(l){var f=s.toLowerCase().includes("prime"),v=l===l.toLowerCase(),m=s.includes("2"),h=this._getRotationForFace(l),p=h.axis,g=h.mag,d=this.getFace(l);if(f&&(g*=-1),m&&(g*=2),v){var y=(0,c.getMiddleMatchingFace)(l),P=this._getMiddleCubiesForMove(y);d=[].concat(o(d),o(P))}var b=!0,F=!1,w=void 0;try{for(var R,C=d[Symbol.iterator]();!(b=(R=C.next()).done);b=!0){R.value.rotate(p,g)}}catch(e){F=!0,w=e}finally{try{!b&&C.return&&C.return()}finally{if(F)throw w}}}}}catch(e){n=!0,i=e}finally{try{!t&&u.return&&u.return()}finally{if(n)throw i}}}},{key:"isSolved",value:function(){return this.toString()===s}},{key:"toString",value:function(){var e="",r=["front","right","up","down","left","back"],t=!0,o=!1,n=void 0;try{for(var i,a=r[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value,c=this.getFace(u),s=!0,l=!1,f=void 0;try{for(var v,m=c[Symbol.iterator]();!(s=(v=m.next()).done);s=!0){e+=v.value.getColorOfFace(u)}}catch(e){l=!0,f=e}finally{try{!s&&m.return&&m.return()}finally{if(l)throw f}}}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}return e}},{key:"clone",value:function(){return new e(this.toString())}},{key:"_build",value:function(e){this._cubies=[],this._populateCube();var r=this._parseColors(e),t=!0,o=!1,n=void 0;try{for(var i,a=Object.keys(r)[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value,c=r[u];this._colorFace(u,c)}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}}},{key:"_populateCube",value:function(){for(var e=-1;e<=1;e++)for(var r=-1;r<=1;r++)for(var t=-1;t<=1;t++)if(0!==e||0!==r||0!==t){var o=new a.Cubie({position:[e,r,t]});this._cubies.push(o)}}},{key:"_parseColors",value:function(e){for(var r={front:[],right:[],up:[],down:[],left:[],back:[]},t=void 0,o=0;o<e.length;o++){var n=e[o];t=o<9?"front":o<18?"right":o<27?"up":o<36?"down":o<45?"left":"back",r[t].push(n)}return r}},{key:"_colorFace",value:function(e,r){for(var t=this.getFace(e),o=0;o<r.length;o++)t[o].colorFace(e,r[o])}},{key:"_getRotationForFace",value:function(e){if("string"!=typeof e)throw new Error('"face" must be a string (received: '+e+")");return e=e.toLowerCase(),{axis:this._notationToRotation[e].axis,mag:this._notationToRotation[e].mag*Math.PI/2}}},{key:"_getMiddleCubiesForMove",value:function(e){e=e[0].toLowerCase();var r=void 0;return"m"===e?r=["left","right"]:"e"===e?r=["up","down"]:"s"===e&&(r=["front","back"]),this._cubies.filter(function(e){return!e.hasFace(r[0])&&!e.hasFace(r[1])})}}]),e}();r.RubiksCube=l},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.BaseSolver=void 0;var n=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),i=t(1),a=t(0),u=function(){function e(r){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.cube="string"==typeof r?new i.RubiksCube(r):r,this.options=t,this.partition={},this.partitions=[],this.totalMoves=[],this._afterEachCallbacks=[]}return n(e,[{key:"move",value:function(e,r){"string"==typeof e&&(e=e.split(" ")),this.cube.move(e,r),e=(0,a.transformNotations)(e,r);var t=!0,o=!1,n=void 0;try{for(var i,u=e[Symbol.iterator]();!(t=(i=u.next()).done);t=!0){var c=i.value;this.totalMoves.push(c)}}catch(e){o=!0,n=e}finally{try{!t&&u.return&&u.return()}finally{if(o)throw n}}}},{key:"afterEach",value:function(e){this._afterEachCallbacks.push(e)}},{key:"_triggerAfterEach",value:function(){for(var e=arguments.length,r=Array(e),t=0;t<e;t++)r[t]=arguments[t];this._afterEachCallbacks.forEach(function(e){return e.apply(void 0,r)})}},{key:"_solve",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.partition={},this.partition.cubies=e;var r=e.corner,t=e.edge;return this.partition.caseNumber=this._getCaseNumber({corner:r,edge:t}),this._solveCase(this.partition.caseNumber,{corner:r,edge:t}),this.partition.moves=this.totalMoves,this.totalMoves=[],this._overrideAfterEach||this._triggerAfterEach(this.partition,this.phase),this.partition}},{key:"_solveCase",value:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=r.corner,o=r.edge;this["_solveCase"+e]({corner:t,edge:o})}}]),e}();r.BaseSolver=u},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.algorithmShortener=void 0;var o=t(19),n=function(e){return e&&e.__esModule?e:{default:e}}(o),i={F:"B",R:"L",U:"D"},a=function(e){"string"==typeof e&&(e=e.split(" "));var r={compare:function(e,r){return e[0]===r[0]},combine:function(e,r){var t=e.includes("2")?2:e.includes("prime")?-1:1,o=r.includes("2")?2:r.includes("prime")?-1:1,n=t+o;if(4===n&&(n=0),-2===n&&(n=2),3===n&&(n=-1),0===n)return"";var i=2===n?"2":-1===n?"prime":"";return""+e[0]+i},cancel:function(e){return""===e},ignore:function(e,r){return i[e[0]]===r[0]||i[r[0]]===e[0]}};return(0,n.default)(e,r).join(" ")};r.algorithmShortener=a},function(e,r,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.Vector=void 0;var i=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),a=t(22),u=o(a),c=t(7),s=o(c),l=t(26),f=o(l),v=t(27),m=o(v),h=t(28),p=o(h),g={x:f.default,y:m.default,z:p.default},d=function(){function e(r){n(this,e),this.set(r)}return i(e,null,[{key:"FromString",value:function(r){return new e(r.split(" ").map(function(e){return parseInt(e)}))}},{key:"areEqual",value:function(e,r){return e[0]===r[0]&&e[1]===r[1]&&e[2]===r[2]}},{key:"getAngle",value:function(r,t){var o=(0,u.default)(r,t),n=(0,s.default)([],r,t),i=new e(n).getMagnitude();return i?o*i:o}},{key:"getRotationFromNormals",value:function(r,t){var o=new e((0,s.default)([],r,t)).getAxis(),n=e.getAngle(r,t);if(!o){var i=["x","y","z"];i.splice(i.indexOf(new e(r).getAxis()),1),o=i[0]}return{axis:o,angle:n}}},{key:"reverseRotation",value:function(e){return e.angle*=-1,e}}]),i(e,[{key:"toArray",value:function(){return this.vector}},{key:"set",value:function(e){void 0!==e&&(this.vector=e.map(function(e){return Math.round(e)}))}},{key:"setX",value:function(e){this.vector[0]=e}},{key:"setY",value:function(e){this.vector[1]=e}},{key:"setZ",value:function(e){this.vector[2]=e}},{key:"getX",value:function(){return this.toArray()[0]}},{key:"getY",value:function(){return this.toArray()[1]}},{key:"getZ",value:function(){return this.toArray()[2]}},{key:"isAxis",value:function(){var e=0,r=!0,t=!1,o=void 0;try{for(var n,i=this.vector[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){0===n.value&&(e+=1)}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}return 2===e}},{key:"getAxis",value:function(){if(this.isAxis())return 0!==this.vector[0]?"x":0!==this.vector[1]?"y":0!==this.vector[2]?"z":void 0}},{key:"getMagnitude",value:function(){if(this.isAxis())return this["get"+this.getAxis().toUpperCase()]()}},{key:"rotate",value:function(e,r){return e=e.toLowerCase(),this.set(g[e]([],this.vector,[0,0,0],r)),this}}]),e}();r.Vector=d},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.F2LCaseBaseSolver=void 0;var a=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),u=t(12),c=function(e){function r(){return o(this,r),n(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return i(r,e),a(r,[{key:"solve",value:function(e){var r=e.corner,t=e.edge;return this._solve({corner:r,edge:t})}}]),r}(u.F2LBaseSolver);r.F2LCaseBaseSolver=c},function(e,r,t){"use strict";e.exports=function(){return/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g}},function(e,r,t){"use strict";function o(e,r,t){var o=r[0],n=r[1],i=r[2],a=t[0],u=t[1],c=t[2];return e[0]=n*c-i*u,e[1]=i*a-o*c,e[2]=o*u-n*a,e}e.exports=o},function(e,r,t){"use strict";function o(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function i(e){if(f===setTimeout)return setTimeout(e,0);if((f===o||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(r){try{return f.call(null,e,0)}catch(r){return f.call(this,e,0)}}}function a(e){if(v===clearTimeout)return clearTimeout(e);if((v===n||!v)&&clearTimeout)return v=clearTimeout,clearTimeout(e);try{return v(e)}catch(r){try{return v.call(null,e)}catch(r){return v.call(this,e)}}}function u(){g&&h&&(g=!1,h.length?p=h.concat(p):d=-1,p.length&&c())}function c(){if(!g){var e=i(u);g=!0;for(var r=p.length;r;){for(h=p,p=[];++d<r;)h&&h[d].run();d=-1,r=p.length}h=null,g=!1,a(e)}}function s(e,r){this.fun=e,this.array=r}function l(){}var f,v,m=e.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:o}catch(e){f=o}try{v="function"==typeof clearTimeout?clearTimeout:n}catch(e){v=n}}();var h,p=[],g=!1,d=-1;m.nextTick=function(e){var r=new Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];p.push(new s(e,r)),1!==p.length||g||i(c)},s.prototype.run=function(){this.fun.apply(null,this.array)},m.title="browser",m.browser=!0,m.env={},m.argv=[],m.version="",m.versions={},m.on=l,m.addListener=l,m.once=l,m.off=l,m.removeListener=l,m.removeAllListeners=l,m.emit=l,m.prependListener=l,m.prependOnceListener=l,m.listeners=function(e){return[]},m.binding=function(e){throw new Error("process.binding is not supported")},m.cwd=function(){return"/"},m.chdir=function(e){throw new Error("process.chdir is not supported")},m.umask=function(){return 0}},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.Cubie=void 0;var n=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),i=t(4),a=t(10),u=function(){function e(r){var t=this,n=r.position,i=r.colorMap,a=void 0===i?{}:i;o(this,e),this.position(n),this.colorMap={},Object.keys(a).forEach(function(e){var r=a[e];t.colorFace(e,r)})}return n(e,null,[{key:"FromFaces",value:function(r){var t=new i.Vector([0,0,0]),o={},n=!0,u=!1,c=void 0;try{for(var s,l=r[Symbol.iterator]();!(n=(s=l.next()).done);n=!0){var f=s.value;if(f){var v=new a.Face(f);t["set"+v.vector.getAxis().toUpperCase()](v.vector.getMagnitude()),o[f.toLowerCase()]=v.toString()[0].toLowerCase()}}}catch(e){u=!0,c=e}finally{try{!n&&l.return&&l.return()}finally{if(u)throw c}}return new e({position:t.toArray(),colorMap:o})}}]),n(e,[{key:"clone",value:function(){return new e({position:this.position(),colorMap:this.colorMap})}},{key:"position",value:function(e){if(void 0===e)return this.vector?this.vector.toArray():this.vector;this.vector=new i.Vector(e)}},{key:"getX",value:function(){return this.vector.getX()}},{key:"getY",value:function(){return this.vector.getY()}},{key:"getZ",value:function(){return this.vector.getZ()}},{key:"isCorner",value:function(){return 3===Object.keys(this.colorMap).length}},{key:"isEdge",value:function(){return 2===Object.keys(this.colorMap).length}},{key:"isMiddle",value:function(){return 1===Object.keys(this.colorMap).length}},{key:"colors",value:function(){var e=this;return Object.keys(this.colorMap).map(function(r){return e.colorMap[r]})}},{key:"hasColor",value:function(e){e=e.toLowerCase();var r=!0,t=!1,o=void 0;try{for(var n,i=Object.keys(this.colorMap)[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var a=n.value;if(this.colorMap[a]===e)return!0}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}return!1}},{key:"hasFace",value:function(e){return e=e.toLowerCase(),Object.keys(this.colorMap).includes(e)}},{key:"colorFace",value:function(e,r){return e=e.toLowerCase(),r=r.toLowerCase(),this.colorMap[e]=r,this}},{key:"getColorOfFace",value:function(e){return e=e.toLowerCase(),this.colorMap[e]}},{key:"getFaceOfColor",value:function(e){var r=this;return e=e.toLowerCase(),Object.keys(this.colorMap).find(function(t){return r.colorMap[t]===e})}},{key:"faces",value:function(){return Object.keys(this.colorMap)}},{key:"rotate",value:function(e,r){var t=this;this.vector.rotate(e,r);var o={},n=!0,i=!1,u=void 0;try{for(var c,s=Object.keys(this.colorMap)[Symbol.iterator]();!(n=(c=s.next()).done);n=!0){var l=c.value,f=this.colorMap[l],v=new a.Face(l),m=v.rotate(e,r).normal().join(" "),h=a.Face.FromNormal(m).toString().toLowerCase();o[h]=f}}catch(e){i=!0,u=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw u}}this.colorMap={},Object.keys(o).forEach(function(e){return t.colorFace(e,o[e])})}}]),e}();r.Cubie=u},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.Face=void 0;var n=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),i=t(4),a={front:"0 0 1",right:"1 0 0",up:"0 1 0",down:"0 -1 0",left:"-1 0 0",back:"0 0 -1"},u=function(){function e(r){if(o(this,e),"string"!=typeof r)throw new Error('"face" must be a string (received: '+r+")");r=r.toLowerCase(),this.vector=i.Vector.FromString(a[r])}return n(e,null,[{key:"FromNormal",value:function(r){return"string"==typeof r&&(r=i.Vector.FromString(r).toArray()),new e(e.getFace(r))}},{key:"getNormal",value:function(e){return i.Vector.FromString(a[e]).toArray()}},{key:"getFace",value:function(e){"string"==typeof e&&(e=i.Vector.FromString(e).toArray());var r=!0,t=!1,o=void 0;try{for(var n,u=Object.keys(a)[Symbol.iterator]();!(r=(n=u.next()).done);r=!0){var c=n.value;if(e.join(" ")===a[c])return c}}catch(e){t=!0,o=e}finally{try{!r&&u.return&&u.return()}finally{if(t)throw o}}}}]),n(e,[{key:"normal",value:function(){return this.vector.toArray()}},{key:"toString",value:function(){return e.getFace(this.normal())}},{key:"orientTo",value:function(r){"string"==typeof r&&(r=new e(r));var t=i.Vector.getRotationFromNormals(this.normal(),r.normal()),o=t.axis,n=t.angle;return this.vector.rotate(o,n),this}},{key:"rotate",value:function(e,r){return this.vector.rotate(e,r),this}}]),e}();u.FRONT=new u("FRONT"),u.RIGHT=new u("RIGHT"),u.UP=new u("UP"),u.DOWN=new u("DOWN"),u.LEFT=new u("LEFT"),u.BACK=new u("BACK"),r.Face=u},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.CrossSolver=void 0;var a=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),u=t(2),c=t(1),s=t(0),l=function(e){return c.RubiksCube.reverseMoves(e)},f=function(e){function r(){var e;o(this,r);for(var t=arguments.length,i=Array(t),a=0;a<t;a++)i[a]=arguments[a];var u=n(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i)));return u.phase="cross",u}return i(r,e),a(r,[{key:"solve",value:function(){var e=this._getCrossEdges(),r=!0,t=!1,o=void 0;try{for(var n,i=e[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var a=n.value,u=this._solve({edge:a});this.partitions.push(u)}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}return this.partitions}},{key:"isSolved",value:function(){var e=this._getCrossEdges(),r=!0,t=!1,o=void 0;try{for(var n,i=e[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var a=n.value;if(!this.isEdgeSolved(a))return!1}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}return!0}},{key:"isEdgeSolved",value:function(e){var r=e.colors().find(function(e){return"u"!==e}),t=e.faces().find(function(e){return"up"!==e}),o=t[0]===r;return"u"===e.getColorOfFace("up")&&o}},{key:"_getCrossEdges",value:function(){return this.cube.edges().filter(function(e){return e.hasColor("u")})}},{key:"_getCaseNumber",value:function(e){var r=e.edge;if("u"===r.getColorOfFace("up"))return 1;if("u"===r.getColorOfFace("down"))return 2;if(r.faces().includes("up"))return 3;if(r.faces().includes("down"))return 4;var t=r.getFaceOfColor("u"),o=r.getFaceOfColor(r.colors().find(function(e){return"u"!==e})),n=(0,s.getDirectionFromFaces)(t,o,{up:"up"});return"right"===n?5:"left"===n?6:void 0}},{key:"_solveCase1",value:function(e){var r=e.edge;if(!this.isEdgeSolved(r)){var t=r.faces().find(function(e){return"up"!==e});this.move(t+" "+t,{upperCase:!0}),this._solveCase2({edge:r})}}},{key:"_solveCase2",value:function(e){var r=e.edge,t=this._case1And2Helper({edge:r},2);this.move(t,{upperCase:!0})}},{key:"_solveCase3",value:function(e){var r=e.edge,t=this._case3And4Helper({edge:r},3);this.move(t,{upperCase:!0}),this._solveCase5({edge:r})}},{key:"_solveCase4",value:function(e){var r=e.edge,t=(0,s.getRotationFromTo)("down",r.getFaceOfColor("u"),(0,s.getFaceOfMove)(r.getColorOfFace("down")));this.move(t,{upperCase:!0});var o=l(r.getFaceOfColor("u"));this.move(o,{upperCase:!0}),this._solveCase5({edge:r})}},{key:"_solveCase5",value:function(e){var r=e.edge,t=this._case5And6Helper({edge:r},5);this.move(t,{upperCase:!0})}},{key:"_solveCase6",value:function(e){var r=e.edge,t=this._case5And6Helper({edge:r},6);this.move(t,{upperCase:!0})}},{key:"_case1And2Helper",value:function(e,r){var t=e.edge,o=1===r?"up":"down",n=t.faces().find(function(e){return e!==o}),i=(0,s.getFaceOfMove)(t.getColorOfFace(n)),a=(0,s.getRotationFromTo)(o,n,i);if(2===r){var u=(0,s.getMoveOfFace)(i);a+=" "+u+" "+u}return a}},{key:"_case3And4Helper",value:function(e,r){var t=e.edge,o=t.faces().find(function(e){return!["up","down"].includes(e)});return 4===r&&(o=l(o)),o}},{key:"_case5And6Helper",value:function(e,r){var t=e.edge,o=t.colors().find(function(e){return"u"!==e}),n=t.getFaceOfColor(o),i=(0,s.getFaceOfMove)(o),a=(0,s.getRotationFromTo)("up",n,i),u=(0,s.getMoveOfFace)(n);return 6===r&&(u=l(u)),l(a)+" "+u+" "+a}},{key:"_getPartitionBefore",value:function(e){return{edge:e.edge.clone()}}},{key:"_getPartitionAfter",value:function(e){return{edge:e.edge}}}]),r}(u.BaseSolver);r.CrossSolver=f},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.F2LBaseSolver=void 0;var a=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),u=t(2),c=t(1),s=t(0),l=function(e){return c.RubiksCube.reverseMoves(e)},f=function(e){function r(){var e;o(this,r);for(var t=arguments.length,i=Array(t),a=0;a<t;a++)i[a]=arguments[a];var u=n(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(i)));return u.phase="f2l",u}return i(r,e),a(r,[{key:"colorsMatch",value:function(e){var r=e.corner,t=e.edge,o=t.colors();return!(!r.colors().includes(o[0])||!r.colors().includes(o[1]))}},{key:"isPairSolved",value:function(e){var r=e.corner,t=e.edge;if(!this.isPairMatched({corner:r,edge:t}))return!1;if("up"!==r.getFaceOfColor("u"))return!1;var o=!0,n=!1,i=void 0;try{for(var a,u=t.colors()[Symbol.iterator]();!(o=(a=u.next()).done);o=!0){var c=a.value;if(t.getFaceOfColor(c)!==(0,s.getFaceOfMove)(c))return!1}}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return!0}},{key:"isPairMatched",value:function(e){var r=e.corner,t=e.edge;if(!this.colorsMatch({corner:r,edge:t}))return!1;var o=!0,n=!1,i=void 0;try{for(var a,u=t.colors()[Symbol.iterator]();!(o=(a=u.next()).done);o=!0){var c=a.value;if(r.getFaceOfColor(c)!==t.getFaceOfColor(c))return!1}}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return!0}},{key:"isPairSeparated",value:function(e){var r=e.corner,t=e.edge;if(!this.colorsMatch({corner:r,edge:t}))return!1;if(["up","down"].includes(r.getFaceOfColor("u")))return!1;if(!t.faces().includes("down"))return!1;var o=r.colors().find(function(e){return"u"!==e&&"down"!==r.getFaceOfColor(e)});return"down"===t.getFaceOfColor(o)&&"back"===(0,s.getDirectionFromFaces)(r.getFaceOfColor(o),t.getFaceOfColor(r.getColorOfFace("down")),{up:"up"})}},{key:"solveMatchedPair",value:function(e){var r=e.corner,t=e.edge;if(!this.isPairMatched({corner:r,edge:t}))throw new Error("Pair is not matched");var o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n="left"===(0,s.getDirectionFromFaces)(t.getFaceOfColor(o),r.getFaceOfColor("u"),{up:"down"}),i=(0,s.getFaceOfMove)(o),a=r.getFaceOfColor(o),u=(0,s.getFaceFromDirection)(i,n?"left":"right",{up:"down"}),c=(0,s.getRotationFromTo)("down",a,u),f=n?i:l(i),v=n?"DPrime":"D",m=[c,f,v,l(f)].join(" ");return this.move(m,{upperCase:!0}),m}},{key:"solveSeparatedPair",value:function(e){var r=e.corner,t=e.edge;if(!this.isPairSeparated({corner:r,edge:t}))throw new Error("Pair is not separated");var o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n="LEFT"===(0,s.getDirectionFromFaces)(r.getFaceOfColor("u"),t.getFaceOfColor(o),{up:"down"}).toUpperCase(),i=r.getFaceOfColor("u"),a=(0,s.getFaceOfMove)(o),u=(0,s.getRotationFromTo)("down",i,a),c=(0,s.getMoveOfFace)(a);c=n?l(c):c;var f=n?"DPrime":"D",v=[u,c,f,l(c)].join(" ");return this.move(v,{upperCase:!0}),v}},{key:"_getPartitionBefore",value:function(e){var r=e.corner,t=e.edge;return{corner:r.clone(),edge:t.clone()}}},{key:"_getPartitionAfter",value:function(e){return{corner:e.corner,edge:e.edge}}}]),r}(u.BaseSolver);r.F2LBaseSolver=f},function(e,r,t){"use strict";function o(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function i(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function a(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.F2LSolver=void 0;var u=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),c=t(1),s=t(12),l=t(35),f=t(36),v=t(37),m=t(0),h=function(e){return c.RubiksCube.reverseMoves(e)},p=function(e){function r(){var e;n(this,r);for(var t=arguments.length,o=Array(t),a=0;a<t;a++)o[a]=arguments[a];var u=i(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(o)));return u.subCaseOptions=Object.assign(u.options,{_overrideAfterEach:!0}),u}return a(r,e),u(r,[{key:"solve",value:function(){var e=this;return this.partitions=[],this.getAllPairs().forEach(function(r){var t=r.corner,o=r.edge,n=e._solve({corner:t,edge:o});e.partitions.push(n)}),this.partitions}},{key:"isSolved",value:function(){var e=this.getAllPairs(),r=!0,t=!1,o=void 0;try{for(var n,i=e[Symbol.iterator]();!(r=(n=i.next()).done);r=!0){var a=n.value;if(!this.isPairSolved(a))return!1}}catch(e){t=!0,o=e}finally{try{!r&&i.return&&i.return()}finally{if(t)throw o}}return!0}},{key:"getAllPairs",value:function(){var e=this.cube.corners().filter(function(e){return e.hasColor("u")}),r=this.cube.edges().filter(function(e){return!e.hasColor("u")&&!e.hasColor("d")}),t=[],o=!0,n=!1,i=void 0;try{for(var a,u=r[Symbol.iterator]();!(o=(a=u.next()).done);o=!0)!function(){var r=a.value,o=e.find(function(e){var t=r.colors();return e.hasColor(t[0])&&e.hasColor(t[1])});t.push({edge:r,corner:o})}()}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return t}},{key:"_getCaseNumber",value:function(e){var r=e.corner,t=e.edge;if(r.faces().includes("down")){if(t.faces().includes("down"))return 1;if(!t.faces().includes("down")&&!t.faces().includes("up"))return 2}if(r.faces().includes("up")){if(t.faces().includes("down"))return 3;if(!t.faces().includes("down")&&!t.faces().includes("up"))return 4}throw new Error("Could not find a top level F2L case")}},{key:"_solveCase1",value:function(e){var r=e.corner,t=e.edge,o=new l.Case1Solver(this.cube,this.subCaseOptions),n=o.solve({corner:r,edge:t});this.totalMoves=n.moves,this.partition.caseNumber=[this.partition.caseNumber,n.caseNumber]}},{key:"_solveCase2",value:function(e){var r=e.corner,t=e.edge,o=new f.Case2Solver(this.cube,this.subCaseOptions),n=o.solve({corner:r,edge:t});this.totalMoves=n.moves,this.partition.caseNumber=[this.partition.caseNumber,n.caseNumber]}},{key:"_solveCase3",value:function(e){var r=e.corner,t=e.edge,o=new v.Case3Solver(this.cube,this.subCaseOptions),n=o.solve({corner:r,edge:t});this.totalMoves=n.moves,this.partition.caseNumber=[this.partition.caseNumber,n.caseNumber]}},{key:"_solveCase4",value:function(e){var r=e.corner,t=e.edge;if(!this.isPairSolved({corner:r,edge:t})){var n=void 0;n=r.faces().includes(t.faces()[0])&&r.faces().includes(t.faces()[1])?new l.Case1Solver(this.cube,this.subCaseOptions):new f.Case2Solver(this.cube,this.subCaseOptions);var i=r.faces().filter(function(e){return"up"!==e}),a=(0,m.getDirectionFromFaces)(i[0],i[1],{up:"down"}),u="right"===a?i[1]:i[0];this.move(u+" D "+h(u),{upperCase:!0});var c=n.solve({corner:r,edge:t});this.partition.caseNumber=[this.partition.caseNumber,c.caseNumber],this.totalMoves=[].concat(o(this.totalMoves),o(c.moves))}}}]),r}(s.F2LBaseSolver);r.F2LSolver=p},function(e,r,t){"use strict";function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function i(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function a(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.OLLSolver=void 0;var u=function(){function e(e,r){var t=[],o=!0,n=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(o=(a=u.next()).done)&&(t.push(a.value),!r||t.length!==r);o=!0);}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),s=(t(1),t(2)),l=t(0),f="00000000",v=function(e){function r(){var e,t;n(this,r);for(var a=arguments.length,u=Array(a),c=0;c<a;c++)u[c]=arguments[c];var s=i(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(u)));return s.phase="oll",s.algorithms=(t={},o(t,f,""),o(t,"21000110","F R U RPrime UPrime FPrime"),o(t,"21211010","F R U RPrime UPrime FPrime F R U RPrime UPrime FPrime"),o(t,"10201020","R U2 RPrime UPrime R U RPrime UPrime R UPrime RPrime"),o(t,"01112000","F U R UPrime RPrime FPrime"),o(t,"11102120","F U R UPrime RPrime U R UPrime RPrime FPrime"),o(t,"11210000","RPrime UPrime FPrime U F R"),o(t,"11102021","FPrime LPrime UPrime L U LPrime UPrime L U F"),o(t,"10011110","R L2 BPrime L BPrime LPrime B2 L BPrime L RPrime"),o(t,"00202121","LPrime R2 B RPrime B R B2 RPrime B RPrime L"),o(t,"01111111","F U R UPrime RPrime FPrime L F U FPrime UPrime LPrime"),o(t,"21212101","F U R UPrime RPrime FPrime R B U BPrime UPrime RPrime"),o(t,"21211111","F R U RPrime UPrime FPrime B U L UPrime LPrime BPrime"),o(t,"20201010","R U2 R2 UPrime R2 UPrime R2 U2 R"),o(t,"01101110","R B RPrime L U LPrime UPrime R BPrime RPrime"),o(t,"21002120","LPrime BPrime L RPrime UPrime R U LPrime B L"),o(t,"21001100","RPrime F R U RPrime UPrime FPrime U R"),o(t,"01000100","R U RPrime UPrime MPrime U R UPrime rPrime"),o(t,"01010101","M U R U RPrime UPrime M2 U R UPrime rPrime"),o(t,"10211021","F R U RPrime UPrime R U RPrime UPrime FPrime B U L UPrime LPrime BPrime"),o(t,"11000120","R U RPrime UPrime RPrime F R FPrime"),o(t,"10000020","LPrime BPrime R B L BPrime RPrime B"),o(t,"20001000","B LPrime BPrime R B L BPrime RPrime"),o(t,"00112001","RPrime UPrime RPrime F R FPrime U R"),o(t,"21112111","R U2 RPrime RPrime F R FPrime U2 RPrime F R FPrime"),o(t,"10002101","R U2 RPrime RPrime F R FPrime R U2 RPrime"),o(t,"21110101","M U R U RPrime UPrime MPrime RPrime F R FPrime"),o(t,"11212010","F LPrime U2 L U2 L F2 LPrime F"),o(t,"01110020","R U RPrime U R UPrime RPrime UPrime RPrime F R FPrime"),o(t,"10012100","RPrime UPrime R UPrime RPrime U R U R BPrime RPrime B"),o(t,"10112021","RPrime UPrime R UPrime RPrime U FPrime U F R"),o(t,"01110121","F U R UPrime RPrime FPrime F U FPrime UPrime FPrime L F LPrime"),o(t,"01112101","F U R UPrime RPrime FPrime B U BPrime UPrime SPrime U B UPrime bPrime"),o(t,"21212000","lPrime U2 L U LPrime U l"),o(t,"01212020","r U RPrime U R U2 rPrime"),o(t,"00202020","R U RPrime U R U2 RPrime"),o(t,"10101000","RPrime UPrime R URprime RPrime U2 R"),o(t,"01001021","RPrime U R U2 RPrime UPrime FPrime U F U R"),o(t,"10200101","R UPrime RPrime U2 R U B UPrime BPrime UPrime RPrime"),o(t,"21102011","r U RPrime U R UPrime RPrime U R U2 rPrime"),o(t,"21112010","lPrime UPrime L UPrime LPrime U L UPrime LPrime U2 l"),o(t,"11100011","r U2 RPrime UPrime R UPrime rPrime"),o(t,"11012000","F R UPrime RPrime UPrime R U RPrime FPrime"),o(t,"11001011","lPrime UPrime L UPrime LPrime U2 l"),o(t,"01010000","r U RPrime UPrime M U R UPrime RPrime"),o(t,"01002110","R U RPrime UPrime BPrime RPrime F R FPrime B"),o(t,"01202120","L FPrime LPrime UPrime L F LPrime FPrime U F"),o(t,"11001110","RPrime F R U RPrime FPrime R F UPrime FPrime"),o(t,"10200000","R2 D RPrime U2 R DPrime RPrime U2 RPrime"),o(t,"20112011","RPrime U2 R2 U RPrime U R U2 BPrime RPrime B"),o(t,"10000121","R U BPrime UPrime RPrime U R B RPrime"),o(t,"11000021","RPrime UPrime F U R UPrime RPrime FPrime R"),o(t,"01100120","L FPrime LPrime UPrime L U F UPrime LPrime"),o(t,"11112020","RPrime F R2 FPrime U2 FPrime U2 F RPrime"),o(t,"20110100","BPrime RPrime B LPrime BPrime R R BPrime RPrime B2 L"),o(t,"20100101","B L BPrime R B L2 B L B2 RPrime"),o(t,"01101011","FPrime UPrime F L FPrime LPrime U L F LPrime"),o(t,"21012020","F U FPrime RPrime F R UPrime RPrime FPrime R"),t),s}return a(r,e),c(r,[{key:"isSolved",value:function(){return this.getOllString()===f}},{key:"solve",value:function(){return this._solve()}},{key:"_getCaseNumber",value:function(){return this.getOllString()}},{key:"_solveCase",value:function(e){var r=this.findPattern(e),t=this.getAlgorithm(r),o=this._getFrontFace(e,r);this.move(t,{orientation:{up:"down",front:o}})}},{key:"getOllString",value:function(){var e=this,r=[];return this._getOllCubies().forEach(function(t){var o=e._getCubieOrientation(t);r.push(o)}),r.join("")}},{key:"findPattern",value:function(e){void 0===e&&(e=this.getOllString());for(var r=0;r<4;r++){if("string"==typeof this.algorithms[e])return e;e=this._rotateOllStringLeft(e)}throw new Error('No pattern found for oll string "'+e+'"')}},{key:"getAlgorithm",value:function(e){if(void 0===e&&(e=this.getPattern(e)),void 0===this.algorithms[e])throw new Error('No algorithm found for pattern "'+e+'"');return this.algorithms[e]}},{key:"_getOllCubies",value:function(){var e=this;return[["front","down","right"],["front","down"],["front","down","left"],["left","down"],["left","down","back"],["back","down"],["back","down","right"],["right","down"]].map(function(r){return e.cube.getCubie(r)})}},{key:"_getCubieOrientation",value:function(e){if("d"===e.getColorOfFace("down"))return 0;if(e.isEdge())return 1;var r=e.faces().filter(function(e){return"down"!==e}),t=u(r,2),o=t[0],n=t[1],i=(0,l.getDirectionFromFaces)(o,n,{up:"down"}),a="right"===i?n:o;return"d"===e.getColorOfFace(a)?1:2}},{key:"_getFrontFace",value:function(e,r){for(var t=["front","left","back","right"],o=0;o<4;o++){if(e===r)return t[o];e=this._rotateOllStringLeft(e)}throw new Error('OLL string "'+e+'" does not resolve to the pattern "'+r+'"')}},{key:"_rotateOllStringLeft",value:function(e){return e.slice(2)+e.slice(0,2)}},{key:"_getPartitionBefore",value:function(){return this.getOllString()}},{key:"_getPartitionAfter",value:function(){return null}}]),r}(s.BaseSolver);r.OLLSolver=v},function(e,r,t){"use strict";function o(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function a(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function u(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.PLLSolver=void 0;var c=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),s=t(2),l=t(0),f="0 0 0 0 0 0 0 0",v=function(e){function r(){var e,t;i(this,r);for(var o=arguments.length,u=Array(o),c=0;c<o;c++)u[c]=arguments[c];var s=a(this,(e=r.__proto__||Object.getPrototypeOf(r)).call.apply(e,[this].concat(u)));return s.phase="pll",s.algorithms=(t={},n(t,f,""),n(t,"2 -1 1 -1 1 0 0 2","R2 F2 RPrime BPrime R F2 RPrime B RPrime"),n(t,"-1 1 -1 2 2 0 0 1","R BPrime R F2 RPrime B R F2 R2"),n(t,"1 -1 2 2 0 0 1 -1","R UPrime R U R U R UPrime RPrime UPrime R2"),n(t,"-1 1 -1 1 0 0 2 2","R2 U R U RPrime UPrime RPrime UPrime RPrime U RPrime"),n(t,"2 2 2 2 2 2 2 2","M M U M M U2 M M U M M"),n(t,"0 1 1 1 1 0 2 2","R U RPrime UPrime RPrime F R2 UPrime RPrime UPrime R U RPrime FPrime"),n(t,"1 0 2 0 1 0 0 0","R U2 RPrime UPrime R U2 LPrime U RPrime UPrime L"),n(t,"0 2 2 0 1 1 1 1","F R UPrime RPrime UPrime R U RPrime FPrime R U RPrime UPrime RPrime F R FPrime"),n(t,"1 -1 -1 2 -1 -1 1 0","RPrime U2 R U2 RPrime F R U RPrime UPrime RPrime FPrime R2"),n(t,"0 1 -1 -1 2 -1 -1 1","R UPrime RPrime UPrime R U R D RPrime UPrime R DPrime RPrime U2 RPrime"),n(t,"0 2 -1 -1 -1 -1 2 0","RPrime U RPrime UPrime BPrime D BPrime DPrime B2 RPrime BPrime R B R"),n(t,"2 -1 -1 -1 -1 2 0 0","RPrime UPrime FPrime R U RPrime UPrime RPrime F R2 UPrime RPrime UPrime R U RPrime U R"),n(t,"-1 2 2 2 -1 2 0 2","L U LPrime B2 uPrime B UPrime BPrime U BPrime u B2"),n(t,"2 -1 2 0 2 -1 2 2","RPrime UPrime R B2 u BPrime U B UPrime B uPrime B2"),n(t,"2 -1 1 1 0 1 1 -1","R2 uPrime R UPrime R U RPrime u R2 B UPrime BPrime"),n(t,"1 0 1 1 -1 2 -1 1","R2 u RPrime U RPrime UPrime R uPrime R2 FPrime U F"),n(t,"1 -1 -1 1 1 -1 -1 1","U RPrime UPrime R UPrime R U R UPrime RPrime U R U R2 UPrime RPrime"),n(t,"0 1 0 0 0 1 0 2","LPrime U2 L U LPrime U2 R UPrime L U RPrime"),n(t,"1 1 -1 -1 1 1 -1 -1","R BPrime RPrime F R B RPrime FPrime R B RPrime F R BPrime RPrime FPrime"),n(t,"2 0 2 0 2 0 2 0","R U RPrime U R U RPrime FPrime R U RPrime UPrime RPrime F R2 UPrime RPrime U2 R UPrime RPrime"),n(t,"0 2 0 2 0 2 0 2","RPrime U R UPrime RPrime FPrime UPrime F R U RPrime F RPrime FPrime R UPrime R"),t),s}return u(r,e),c(r,[{key:"solve",value:function(){return this._solve()}},{key:"_getCaseNumber",value:function(){return this.getPllString()}},{key:"_solveCase",value:function(e){var r=this.findPattern(e),t=this.getAlgorithm(r),o=this._getFrontFace(e,r);this.move(t,{orientation:{up:"down",front:o}});var n=this.cube.getCubie(["down","front"]),i=(0,l.getFaceOfMove)(n.getColorOfFace("front")),a=(0,l.getRotationFromTo)("down","front",i);this.move(a)}},{key:"isSolved",value:function(){return this.cube.isSolved()}},{key:"getPllString",value:function(){for(var e=[],r=this._getPllCubies(),t=["front","left","back","right"],o=0;o<r.length;o++){var n=r[o],i=r[o+1],a=t[~~(o/2)],u=n.getColorOfFace(a);i||(i=r[0]);var c=i.getColorOfFace(a),s=(0,l.getFaceOfMove)(u),f=(0,l.getFaceOfMove)(c),v=(0,l.getDirectionFromFaces)(s,f,{up:"down"});"front"===v&&(v=0),"right"===v&&(v=1),"left"===v&&(v=-1),"back"===v&&(v=2),e.push(v)}return e.join(" ")}},{key:"findPattern",value:function(e){var r=e;void 0===e&&(e=this.getPllString());for(var t=0;t<4;t++){if("string"==typeof this.algorithms[e])return e;e=this._rotatePllStringLeft(e)}throw new Error('No pattern found for pll string "'+r+'"')}},{key:"getAlgorithm",value:function(e){if(void 0===e&&(e=this.findPattern(e)),void 0===this.algorithms[e])throw new Error('No algorithm found for pattern "'+e+'"');return this.algorithms[e]}},{key:"_getPllCubies",value:function(){var e=this;return[["front","down","right"],["front","down"],["front","down","left"],["left","down"],["left","down","back"],["back","down"],["back","down","right"],["right","down"]].map(function(r){return e.cube.getCubie(r)})}},{key:"_getCubiePermutation",value:function(e){var r=e.faces().find(function(e){return"down"!==e}),t=(0,l.getFaceOfMove)(e.getColorOfFace(r)),o=(0,l.getRotationFromTo)("down",r,t);o=o.toLowerCase();return""===o?0:o.includes("prime")?1:o.split(" ").length>1?2:-1}},{key:"_rotatePllStringLeft",value:function(e){var r=e.split(" ").map(function(e){return parseInt(e)});return[].concat(o(r.slice(2)),o(r.slice(0,2))).join(" ")}},{key:"_getFrontFace",value:function(e,r){for(var t=["front","left","back","right"],o=0;o<4;o++){if(e===r)return t[o];e=this._rotatePllStringLeft(e)}throw new Error('OLL string "'+e+'" does not resolve to the pattern "'+r+'"')}}]),r}(s.BaseSolver);r.PLLSolver=v},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.algorithmShortener=r.PLLSolver=r.OLLSolver=r.F2LSolver=r.CrossSolver=r.RubiksCube=r.Cubie=r.Solver=void 0;var o=t(9);Object.defineProperty(r,"Cubie",{enumerable:!0,get:function(){return o.Cubie}});var n=t(1);Object.defineProperty(r,"RubiksCube",{enumerable:!0,get:function(){return n.RubiksCube}});var i=t(11);Object.defineProperty(r,"CrossSolver",{enumerable:!0,get:function(){return i.CrossSolver}});var a=t(13);Object.defineProperty(r,"F2LSolver",{enumerable:!0,get:function(){return a.F2LSolver}});var u=t(14);Object.defineProperty(r,"OLLSolver",{enumerable:!0,get:function(){return u.OLLSolver}});var c=t(15);Object.defineProperty(r,"PLLSolver",{enumerable:!0,get:function(){return c.PLLSolver}});var s=t(3);Object.defineProperty(r,"algorithmShortener",{enumerable:!0,get:function(){return s.algorithmShortener}});var l=t(33);r.Solver=l.Solver,r.default=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=new l.Solver(e,r);return t.solve(),r.partitioned?t.getPartitions():(0,s.algorithmShortener)(t.getMoves())}},function(e,r,t){"use strict";(function(e){function r(){var e={modifiers:{reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29]},colors:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39]},bgColors:{bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49]}};return e.colors.grey=e.colors.gray,Object.keys(e).forEach(function(r){var t=e[r];Object.keys(t).forEach(function(r){var o=t[r];e[r]=t[r]={open:"["+o[0]+"m",close:"["+o[1]+"m"}}),Object.defineProperty(e,r,{value:t,enumerable:!1})}),e}Object.defineProperty(e,"exports",{enumerable:!0,get:r})}).call(r,t(32)(e))},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e){u&&e&&e()}var i=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),a=void 0,u=void 0,c={cancel:function(){return!1},ignore:function(){return!1}},s=function(){function e(r,n){o(this,e),this.options=Object.assign({},c,n),this.options.DEBUG&&(a=t(20),u=n.DEBUG),this.input=r.slice(),this.output=[]}return i(e,[{key:"run",value:function(){var e=this;if(this.input.length<=1)return this.input;this.temp=[this.input.shift()];for(var r=void 0,t=void 0,o=void 0;this.temp.length>0;){n(function(){console.log(a.bold("========= START =========")),e._logInfo(),console.log()});var i=void 0,u=void 0;if(1===this.temp.length){for(i=0,u=this.input[i];i<this.input.length&&this.options.ignore(this.temp[0],u);)u=this.input[++i];i<this.input.length&&this.temp.push(u)}if(n(function(){return o=e.temp.slice()}),0===this.temp.length){n(function(){console.log(a.green("breaking")),console.log(a.bold("========= END =========")),console.log()});break}1!==this.temp.length?(this.options.compare(this.temp[0],this.temp[1])?function(){void 0!==i&&e.input.splice(i,1);var o=e.options.combine(e.temp[0],e.temp[1]);n(function(){r="Combining:",t=o}),e.temp=e.options.cancel(o)?[]:[o],e.populateTempBackward(),0===e.temp.length&&e.populateTempForward()}():(this.output.push(this.temp.shift()),void 0!==i&&(i>0?this.temp=this.input.splice(0,1):this.input.splice(i,1)),n(function(){return r="Skipping:"})),n(function(){console.log(a.green(r),o),console.log(a.green("value:"),t),console.log(),e._logInfo(),console.log(a.bold("========= END =========")),console.log(),r=null,t=null,o=null})):(this.output.push(this.temp.pop()),this.populateTempForward(),n(function(){console.log(a.green("continuing")),e._logInfo(),console.log(a.bold("========= END =========")),console.log()}))}return n(function(){console.log(a.bold.green("========= FINAL =========")),e._logInfo(),console.log(a.bold.green("========= FINAL =========")),console.log()}),this.output}},{key:"populateTempBackward",value:function(){this.output.length>0&&this.temp.unshift(this.output.pop())}},{key:"populateTempForward",value:function(){this.input.length>0&&this.temp.push(this.input.shift())}},{key:"_logInfo",value:function(){console.log(a.bold("output"),this.output),console.log(a.bold("temp"),this.temp),console.log(a.bold("input"),this.input)}}]),e}();e.exports=s},function(e,r,t){"use strict";function o(e,r){if(!e)throw new Error("Why are you even importing this.");if(!r.compare)throw new Error("options.compare callback must be present");if(!r.combine)throw new Error("options.combine callback must be present")}var n=t(18);e.exports=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return o(e,r),new n(e,r).run()}},function(e,r,t){"use strict";(function(r){function o(e){this.enabled=e&&void 0!==e.enabled?e.enabled:l}function n(e){var r=function e(){return i.apply(e,arguments)};return r._styles=e,r.enabled=this.enabled,r.__proto__=h,r}function i(){var e=arguments,r=e.length,t=0!==r&&String(arguments[0]);if(r>1)for(var o=1;o<r;o++)t+=" "+e[o];if(!this.enabled||!t)return t;var n=this._styles,i=n.length,a=u.dim.open;for(!v||-1===n.indexOf("gray")&&-1===n.indexOf("grey")||(u.dim.open="");i--;){var c=u[n[i]];t=c.open+t.replace(c.closeRe,c.open)+c.close}return u.dim.open=a,t}var a=t(21),u=t(17),c=t(30),s=t(29),l=t(31),f=Object.defineProperties,v="win32"===r.platform&&!/^xterm/i.test(r.env.TERM);v&&(u.blue.open="[94m");var m=function(){var e={};return Object.keys(u).forEach(function(r){u[r].closeRe=new RegExp(a(u[r].close),"g"),e[r]={get:function(){return n.call(this,this._styles.concat(r))}}}),e}(),h=f(function(){},m);f(o.prototype,function(){var e={};return Object.keys(m).forEach(function(r){e[r]={get:function(){return n.call(this,[r])}}}),e}()),e.exports=new o,e.exports.styles=u,e.exports.hasColor=s,e.exports.stripColor=c,e.exports.supportsColor=l}).call(r,t(8))},function(e,r,t){"use strict";var o=/[|\\{}()[\]^$+*?.]/g;e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected a string");return e.replace(o,"\\$&")}},function(e,r,t){"use strict";function o(e,r){var t=n(e[0],e[1],e[2]),o=n(r[0],r[1],r[2]);i(t,t),i(o,o);var u=a(t,o);return u>1?0:Math.acos(u)}e.exports=o;var n=t(24),i=t(25),a=t(23)},function(e,r,t){"use strict";function o(e,r){return e[0]*r[0]+e[1]*r[1]+e[2]*r[2]}e.exports=o},function(e,r,t){"use strict";function o(e,r,t){var o=new Float32Array(3);return o[0]=e,o[1]=r,o[2]=t,o}e.exports=o},function(e,r,t){"use strict";function o(e,r){var t=r[0],o=r[1],n=r[2],i=t*t+o*o+n*n;return i>0&&(i=1/Math.sqrt(i),e[0]=r[0]*i,e[1]=r[1]*i,e[2]=r[2]*i),e}e.exports=o},function(e,r,t){"use strict";function o(e,r,t,o){var n=t[1],i=t[2],a=r[1]-n,u=r[2]-i,c=Math.sin(o),s=Math.cos(o);return e[0]=r[0],e[1]=n+a*s-u*c,e[2]=i+a*c+u*s,e}e.exports=o},function(e,r,t){"use strict";function o(e,r,t,o){var n=t[0],i=t[2],a=r[0]-n,u=r[2]-i,c=Math.sin(o),s=Math.cos(o);return e[0]=n+u*c+a*s,e[1]=r[1],e[2]=i+u*s-a*c,e}e.exports=o},function(e,r,t){"use strict";function o(e,r,t,o){var n=t[0],i=t[1],a=r[0]-n,u=r[1]-i,c=Math.sin(o),s=Math.cos(o);return e[0]=n+a*s-u*c,e[1]=i+a*c+u*s,e[2]=r[2],e}e.exports=o},function(e,r,t){"use strict";var o=t(6),n=new RegExp(o().source);e.exports=n.test.bind(n)},function(e,r,t){"use strict";var o=t(6)();e.exports=function(e){return"string"==typeof e?e.replace(o,""):e}},function(e,r,t){"use strict";(function(r){var t=r.argv,o=t.indexOf("--"),n=function(e){e="--"+e;var r=t.indexOf(e);return-1!==r&&(-1===o||r<o)};e.exports=function(){return"FORCE_COLOR"in r.env||!(n("no-color")||n("no-colors")||n("color=false"))&&(!!(n("color")||n("colors")||n("color=true")||n("color=always"))||!(r.stdout&&!r.stdout.isTTY)&&("win32"===r.platform||("COLORTERM"in r.env||"dumb"!==r.env.TERM&&!!/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(r.env.TERM))))}()}).call(r,t(8))},function(e,r,t){"use strict";e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,r,t){"use strict";function o(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0}),r.Solver=void 0;var i=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),a=t(1),u=t(11),c=t(13),s=t(14),l=t(15),f=t(0),v=t(3),m=function(){function e(r,t){var o=this;if(n(this,e),r instanceof a.RubiksCube)this.cube=r;else{if("string"!=typeof r)throw new Error('"cubeState" is not a valid cubeState. Please provide a list of scramble moves or a string representing a cube state');r.split(" ").length>1||r.length<=6?(this.cube=a.RubiksCube.Solved(),this.cube.move(r)):this.cube=new a.RubiksCube(r)}this.options=t,this.phases=["cross","f2l","oll","pll"],this.progress={},this.phases.forEach(function(e){return o.progress[e]=[]});var i=function(e,r){o._updateProgress(e,r)};this.currentPhase=null,this.currentSolver=null,this.crossSolver=new u.CrossSolver(this.cube,this.options),this.f2lSolver=new c.F2LSolver(this.cube,this.options),this.ollSolver=new s.OLLSolver(this.cube,this.options),this.pllSolver=new l.PLLSolver(this.cube,this.options),this.afterEach("all",i)}return i(e,[{key:"afterEach",value:function(e,r){if("function"==typeof e?(r=e,e="all"):"string"==typeof e&&(e="all"===e?this.phases.slice():[e]),"function"!=typeof r)throw new Error('"afterEach" callback is not a function.');var t=!0,o=!1,n=void 0;try{for(var i,a=e[Symbol.iterator]();!(t=(i=a.next()).done);t=!0){var u=i.value;if(!this.phases.includes(u))throw new Error('Phase "'+u+'" isn\'t recognized. Please specify "cross", "f2l", "oll", "pll", or "all".')}}catch(e){o=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(o)throw n}}var c=!0,s=!1,l=void 0;try{for(var f,v=e[Symbol.iterator]();!(c=(f=v.next()).done);c=!0){this[f.value+"Solver"].afterEach(r)}}catch(e){s=!0,l=e}finally{try{!c&&v.return&&v.return()}finally{if(s)throw l}}}},{key:"solve",value:function(){this.currentPhase="cross",this.currentSolver=this.crossSolver,this.crossSolver.solve(),this.currentPhase="f2l",this.currentSolver=this.f2lSolver,this.f2lSolver.solve(),this.currentPhase="oll",this.currentSolver=this.ollSolver,this.ollSolver.solve(),this.currentPhase="pll",this.currentSolver=this.pllSolver,this.pllSolver.solve()}},{key:"getMoves",value:function(){var e=this,r=[];return Object.keys(this.progress).forEach(function(t){e.progress[t].forEach(function(e){var t;return(t=r).push.apply(t,o(e.moves))})}),r=(0,f.normalizeNotations)(r),r.join(" ")}},{key:"getPartitions",value:function(){var e=this,r={};return Object.keys(this.progress).forEach(function(t){var o=e.progress[t];if(1===o.length)r[t]=(0,v.algorithmShortener)(o[0].moves);else{var n=[];e.progress[t].forEach(function(e){n.push((0,v.algorithmShortener)(e.moves))}),r[t]=n}}),r}},{key:"isCrossEdgeSolved",value:function(e){return this.crossSolver.isEdgeSolved(e)}},{key:"isF2LPairSolved",value:function(e){var r=e.corner,t=e.edge;return this.f2lSolver.isPairSolved({corner:r,edge:t})}},{key:"isOLLSolved",value:function(){return this.ollSolver.isSolved()}},{key:"isPLLSolved",value:function(){return this.pllSolver.isSolved()}},{key:"_updateProgress",value:function(e,r){this.progress[r].push(e)}}]),e}();r.Solver=m},function(e,r,t){"use strict";var o=t(16),n=function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(r[t]=e[t]);return r.default=e,r}(o),i=n.default;delete n.default,Object.assign(i,n),e.exports=i},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.Case1Solver=void 0;var a=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),u=t(1),c=t(5),s=t(0),l=function(e){return u.RubiksCube.reverseMoves(e)},f=function(e){function r(){return o(this,r),n(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return i(r,e),a(r,[{key:"_getCaseNumber",value:function(e){var r=e.corner,t=e.edge;if(this.isPairMatched({corner:r,edge:t}))return 1;if(this.isPairSeparated({corner:r,edge:t}))return 2;var o=void 0;t.faces().forEach(function(e){r.faces().includes(e)&&"down"!==e&&(o=e)});var n=r.colors().find(function(e){return"u"!==e&&e!==r.getColorOfFace("down")}),i=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)});return"down"===r.getFaceOfColor("u")?o?r.getColorOfFace(o)===t.getColorOfFace(o)?3:4:5:n===i?o?6:7:o?o===r.getFaceOfColor("u")?8:9:10}},{key:"_solveCase1",value:function(e){var r=e.corner,t=e.edge;return this.solveMatchedPair({corner:r,edge:t})}},{key:"_solveCase2",value:function(e){var r=e.corner,t=e.edge;return this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase3",value:function(e){var r=e.corner,t=e.edge,o=t.faces().find(function(e){return"down"!==e}),n=(0,s.getFaceOfMove)(t.getColorOfFace("down")),i=(0,s.getFaceFromDirection)(n,"back",{up:"down"}),a=r.getFaceOfColor(t.getColorOfFace("down")),u="left"===(0,s.getFaceFromDirection)(o,a,{up:"down"}),c=(0,s.getRotationFromTo)("down",o,i),f=(0,s.getFaceOfMove)(t.getColorOfFace(o)),v=u?"D":"DPrime";f=u?f:l(f);var m=c+" "+f+" "+f+" D D ";m+=f+" "+v+" "+l(f)+" "+v+" "+f+" "+f,this.move(m,{upperCase:!0})}},{key:"_solveCase4",value:function(e){var r=e.corner,t=e.edge,o=t.faces().find(function(e){return"down"!==e}),n=(0,s.getFaceOfMove)(t.getColorOfFace(o)),i=r.faces().find(function(e){return!t.faces().includes(e)}),a="left"===(0,s.getFaceFromDirection)(i,o,{up:"down"}),u=(0,s.getRotationFromTo)("down",o,n),c=(0,s.getMoveOfFace)(n);c=a?l(c):c,this.move(u+" "+c+" D D "+l(c),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase5",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n=t.colors().find(function(e){return"down"===t.getFaceOfColor(e)}),i="right"===(0,s.getFaceFromDirection)((0,s.getFaceOfMove)(o),(0,s.getFaceOfMove)(n),{up:"down"}),a=t.getFaceOfColor(o),u=(0,s.getFaceOfMove)(o),c=(0,s.getRotationFromTo)("down",a,u);this.move(c,{upperCase:!0});var f=r.getFaceOfColor(o),v=u,m=(0,s.getRotationFromTo)("down",f,v),h=i?l(u):u;this.move(h+" "+m+" "+l(h),{upperCase:!0}),this.solveMatchedPair({corner:r,edge:t})}},{key:"_solveCase6",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n=t.getFaceOfColor(o),i=(0,s.getFaceOfMove)(t.getColorOfFace("down")),a="left"===(0,s.getDirectionFromFaces)(n,r.getFaceOfColor(o),{up:"down"}),u=(0,s.getRotationFromTo)("down",n,i),c=a?i:l(i),f=a?"DPrime":"D";this.move(u+" "+c+" "+f+" "+l(c),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase7",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n=r.getFaceOfColor("u"),i=(0,s.getFaceOfMove)(o),a="left"===(0,s.getDirectionFromFaces)(r.getFaceOfColor(o),r.getFaceOfColor("u"),{up:"down"}),u=(0,s.getRotationFromTo)("down",n,i);this.move(u,{upperCase:!0});var c=t.getFaceOfColor(o),f=r.getFaceOfColor(o),v=a?r.getFaceOfColor("u"):l(r.getFaceOfColor("u")),m=(0,s.getRotationFromTo)("down",c,f);this.move(v+" "+m+" "+l(v),{upperCase:!0}),this.solveMatchedPair({corner:r,edge:t})}},{key:"_solveCase8",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n=t.colors().find(function(e){return"down"===t.getFaceOfColor(e)}),i=r.getFaceOfColor(n),a=(0,s.getFaceOfMove)(o),u="left"===(0,s.getDirectionFromFaces)(i,r.getFaceOfColor("u"),{up:"down"}),c=(0,s.getRotationFromTo)("down",i,a),f=u?l(a):a,v=u?"D":"DPrime";this.move(c+" "+f+" "+v+" "+l(f),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase9",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"===t.getFaceOfColor(e)}),n=r.getFaceOfColor("u"),i=(0,s.getFaceOfMove)(o),a="left"===(0,s.getDirectionFromFaces)(r.getFaceOfColor(o),n,{up:"down"}),u=(0,s.getRotationFromTo)("down",n,i),c=a?i:l(i);this.move(u+" "+c+" D D "+l(c),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase10",value:function(e){var r=e.corner,t=e.edge,o=t.colors().find(function(e){return"down"!==t.getFaceOfColor(e)}),n=t.colors().find(function(e){return"down"===t.getFaceOfColor(e)}),i=r.getFaceOfColor("u"),a=(0,s.getFaceOfMove)(n),u="left"===(0,s.getDirectionFromFaces)(r.getFaceOfColor(n),r.getFaceOfColor("u"),{up:"down"}),c=(0,s.getRotationFromTo)("down",i,a);this.move(c,{upperCase:!0});var f=t.getFaceOfColor(o),v=(0,s.getFaceOfMove)(o),m=u?a:l(a),h=(0,s.getRotationFromTo)("down",f,v);this.move(m+" "+h+" "+l(m),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}}]),r}(c.F2LCaseBaseSolver);r.Case1Solver=f},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.Case2Solver=void 0;var a=function(){function e(e,r){var t=[],o=!0,n=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(o=(a=u.next()).done)&&(t.push(a.value),!r||t.length!==r);o=!0);}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),c=t(1),s=t(5),l=t(0),f=function(e){return c.RubiksCube.reverseMoves(e)},v=function(e){function r(){return o(this,r),n(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return i(r,e),u(r,[{key:"_getCaseNumber",value:function(e){var r=e.corner,t=e.edge,o=r.faces().filter(function(e){return"down"!==e}),n=t.faces(),i=(0,l.getDirectionFromFaces)(o[0],o[1],{up:"down"}),a=(0,l.getDirectionFromFaces)(n[0],n[1],{up:"down"}),u="right"===i?o[1]:o[0],c="right"===a?n[1]:n[0];if("down"===r.getFaceOfColor("u"))return r.getColorOfFace(u)===t.getColorOfFace(c)?1:2;var s=r.colors().find(function(e){return"u"!==e&&e!==r.getColorOfFace("down")});return s===("left"===(0,l.getDirectionFromFaces)(r.getFaceOfColor(s),r.getFaceOfColor("u"),{up:"down"})?t.getColorOfFace(c):t.colors().find(function(e){return t.getFaceOfColor(e)!==c}))?3:4}},{key:"_solveCase1",value:function(e){var r=e.corner,t=e.edge,o=t.colors()[0],n=r.getFaceOfColor(o),i=t.getFaceOfColor(o),u=(0,l.getRotationFromTo)("down",n,i);this.move(u,{upperCase:!0});var c=t.faces(),s=a(c,2),v=s[0],m=s[1],h=(0,l.getDirectionFromFaces)(v,m,{up:"down"}),p="right"===h?m:v;this.move(p+" DPrime "+f(p),{upperCase:!0}),this.solveMatchedPair({corner:r,edge:t})}},{key:"_solveCase2",value:function(e){var r=e.corner,t=e.edge,o=r.getFaceOfColor(t.colors()[0]),n=t.getFaceOfColor(t.colors()[1]),i=(0,l.getRotationFromTo)("down",o,n);this.move(i,{upperCase:!0});var a=(0,l.getDirectionFromFaces)(t.faces()[0],t.faces()[1],{up:"down"}),u=t.faces()["right"===a?1:0];this.move(u+" D "+f(u)+" DPrime",{upperCase:!0}),this.move(u+" D "+f(u),{upperCase:!0}),this.solveSeparatedPair({corner:r,edge:t})}},{key:"_solveCase3",value:function(e){var r=e.corner,t=e.edge;this._case3And4Helper({corner:r,edge:t},3)}},{key:"_solveCase4",value:function(e){var r=e.corner,t=e.edge;this._case3And4Helper({corner:r,edge:t},4)}},{key:"_case3And4Helper",value:function(e,r){var t=e.corner,o=e.edge,n=t.getColorOfFace("down"),i=t.colors().find(function(e){return![n,"u"].includes(e)}),a=3===r?i:n,u="left"===(0,l.getDirectionFromFaces)(t.getFaceOfColor(i),t.getFaceOfColor("u"),{up:"down"}),c=t.getFaceOfColor("u"),s=o.getFaceOfColor(a),v=(0,l.getRotationFromTo)("down",c,s),m=u?s:f(s),h=u?"DPrime":"D";h=4===r?f(h):h,this.move(v+" "+m+" "+h+" "+f(m),{upperCase:!0}),this["solve"+(3===r?"Matched":"Separated")+"Pair"]({corner:t,edge:o})}}]),r}(s.F2LCaseBaseSolver);r.Case2Solver=v},function(e,r,t){"use strict";function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!r||"object"!=typeof r&&"function"!=typeof r?e:r}function i(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function, not "+typeof r);e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r&&(Object.setPrototypeOf?Object.setPrototypeOf(e,r):e.__proto__=r)}Object.defineProperty(r,"__esModule",{value:!0}),r.Case3Solver=void 0;var a=function(){function e(e,r){var t=[],o=!0,n=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(o=(a=u.next()).done)&&(t.push(a.value),!r||t.length!==r);o=!0);}catch(e){n=!0,i=e}finally{try{!o&&u.return&&u.return()}finally{if(n)throw i}}return t}return function(r,t){if(Array.isArray(r))return r;if(Symbol.iterator in Object(r))return e(r,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,r){for(var t=0;t<r.length;t++){var o=r[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(r,t,o){return t&&e(r.prototype,t),o&&e(r,o),r}}(),c=t(1),s=t(5),l=t(0),f=function(e){return c.RubiksCube.reverseMoves(e)},v=function(e){function r(){return o(this,r),n(this,(r.__proto__||Object.getPrototypeOf(r)).apply(this,arguments))}return i(r,e),u(r,[{key:"_getCaseNumber",value:function(e){var r=e.corner;e.edge;return"u"===r.getColorOfFace("up")?1:2}},{key:"_solveCase1",value:function(e){var r=e.corner,t=e.edge,o=r.faces().filter(function(e){return"up"!==e}),n=(0,l.getDirectionFromFaces)(o[0],o[1],{up:"down"}),i="right"===n?o:o.reverse(),u=a(i,2),c=u[0],s=u[1],v=t.faces().find(function(e){return"down"!==e}),m=t.getColorOfFace(v),h=(0,l.getFaceFromDirection)(r.getFaceOfColor(m),m===r.getColorOfFace(s)?"right":"left",{up:"down"}),p=m===r.getColorOfFace(c),g=(0,l.getRotationFromTo)("down",v,h),d=p?s:f(c),y=p?"DPrime":"D";this.move(g+" "+d+" "+y+" "+f(d),{upperCase:!0}),this.solveMatchedPair({corner:r,edge:t})}},{key:"_solveCase2",value:function(e){var r=e.corner,t=e.edge,o=r.colors().find(function(e){return"u"!==e&&"up"!==r.getFaceOfColor(e)}),n=t.faces().find(function(e){return"down"!==e}),i=t.getColorOfFace(n),a=o!==i,u=r.getFaceOfColor(a?o:"u"),c=(0,l.getRotationFromTo)("down",n,u),s="left"===(0,l.getDirectionFromFaces)(r.getFaceOfColor(o),r.getFaceOfColor("u"),{up:"down"}),v=s?"DPrime":"D",m=r.getFaceOfColor("u");m=s?f(m):m,this.move(c+" "+m+" "+v+" "+f(m),{upperCase:!0}),this["solve"+(a?"Matched":"Separated")+"Pair"]({corner:r,edge:t})}}]),r}(s.F2LCaseBaseSolver);r.Case3Solver=v}])});
```
リゾルバーライブラリのドキュメント
```md
# `rubiks-cube-solver`
> 3x3x3

Takes a string representing a [Rubik's Cube state](#rubiks-cube-state) as input and outputs a string of [Rubik's Cube notations](#rubiks-cube-notations) for the solution, following the [Fridrich Method](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/).

# Usage
```js
const solver = require('rubiks-cube-solver');

let cubeState = [
  'flulfbddr', // front
  'rudrruddl', // right
  'dbbburrfb', // up
  'llffdrubf', // down
  'rludlubrf', // left
  'lubfbfudl' // back
].join('');

let solveMoves = solver(cubeState);
let options = { partitioned: false };
console.log(solveMoves, options);
```

## Options
### `partitioned` <small>boolean</small>
Returns an object with the four phases as keys (`cross`, `f2l`, `oll`, `pll`) and a string or array of strings for their solve moves.

The `cross` and `f2l` keys each point to an array of 4 strings -- the moves to get each cross edge and f2l pair into place.

The `oll` and `pll` keys each point to an algorithm string.

# <a name="rubiks-cube-state"></a>Rubik's Cube State
A cube state is a string containing a total of (6 faces) * (9 colors per face) = 54 characters, with no spaces. Each character represents the "color" for your chosen orientation (more on this below), and must be one of these 6: `f`, `r`, `u`, `d`, `l`, `b`. Instead of characters representing actual colors, like `g` for `green`, they represent the color of each face. The character `r` stands for "the middle color on the right face".

There is a specific process you must follow to correctly turn a Rubik's Cube into a string.

## Step 1: Choose an orientation
Any orientation can work. This starting orientation will be the same as the one you must use for the outputted solution. For example, the official default orientation is when the **front** face is **green**, the **up** face is **white**, and the **right** face is **red**. (Each face can be identified by their middle color)

## Step 2: Provide colors
Go through all the faces in this order: **front**, **right**, **up**, **down**, **left**, **back**, and provide the colors on each face, in order. To provide colors in the correct order, you must orient the cube correctly for each face.

When providing colors for the **front**, **right**, **back**, and **left** faces, orient the cube such that that face is facing you and the **up** face (the up face that you chose for your orientation!) is facing upward.

When providing colors for the **up** face, orient the cube such that the **up** face is facing toward you and your chosen **front** face is facing down.

When providing colors for the **down** face, orient the cube such that the **down** face is facing toward you and your chosen **front** face is facing up.

Once you've oriented the cube correctly for each face, provide colors starting from the upper left, moving horizontally to the right, and ending up on the bottom right -- like reading a book.

## Example
If you have a Rubik's Cube in front of you, you can follow along! I will take a solved cube and make these moves (when the **green** face is facing toward you and the **white** face is facing up)
```
R' U L B U F L2 D R D U' R
```
...and then determine the cube state.

1) Orientation
* We'll go with the default orientation -- **front** is **green** and **up** is **white**.

2) Providing colors
* First, we will provide the colors of the **front** face. Because of our chosen orientation, this face is **green**.
  * Then we will orient the cube such that the **green** face is facing us and our chosen **up** face (white) is facing up. (This orientation is the same as our default orientation)
  * Going through each color in the correct order, we end up with the colors: `green orange white orange green blue yellow yellow red`.
  * Knowing that **orange** is our **l**eft face, **green** is our **f**ront face, **yellow** is our **d**own face, etc., we translate these colors to the characters used for the state: `flulfbddr`
* Next, we move on the the **right** face -- red.
  * Then we orient the cube so that the **red** face is facing us and the **up** face (white) faces up.
  * And we get these colors: `red white yellow red red white yellow yellow orange`. The state string for these colors is `rudrruddl`.
* Next is **up** -- white. At this point, our cube state is (state for **front**) + (state for **right**) = `flulfbddrrudrruddl`
  * For this face, we will orient such that our chosen **up** face (white) faces us and our chosen **front** face (green) faces down.
  * We get the colors `yellow blue blue blue white red red green blue` which translates to `dbbburrfb`.
* Continuing this process we get:
  * **down** face as `llffdrubf`.
  * **left** face as `rludlubrf`.
  * **back** face as `lubfbfudl`.

Done! Now we just add them all up in order -- **front right up down left back** -- and our Rubik's Cube state becomes
```
flulfbddrrudrruddldbbburrfbllffdrubfrludlubrflubfbfudl
```

The solution to this is:
```
Cross:
Uprime F U B Uprime L U2 Lprime
Uprime R Uprime B U

F2L:
Dprime Bprime Dprime B Rprime
Dprime R D B D Bprime Dprime
B D Bprime Dprime B D Bprime
Fprime Dprime F D2 R Dprime
Rprime D2 R Dprime Rprime

OLL:
b D Bprime D B D2 bprime

PLL:
B2 dprime B Dprime B D Bprime
d B2 R Dprime Rprime Dprime
```
When making these moves, be sure to have the cube oriented in your chosen orientation from earlier.

# <a name="rubiks-cube-notations"></a>Rubik's Cube Notations
[This](https://ruwix.com/the-rubiks-cube/notation/) is a list of all the different notations, but I'll try to explain here as well.

There are notations for moving each face on a Rubik's Cube: either clockwise, counter-clockwise, or a 180 degree turn. For example, `F` denotes a clockwise rotation of the `front` face, `F'` for a counter-clockwise rotation, and `F2` for the 180 degree turn. Each face has their own notation: **F**ront, **R**ight, **U**p, **D**own, **L**eft, **B**ack. There are also notations for middle moves: `M`, `E`, and `S`. I don't know why those letters are used.

Notation is case-sensitive: upper-case denotes a single-layer turn and lower-case denotes a double-layer turn. A double-layer turn is a turn of a middle slice on top of a single-layer turn (in the context of a 3x3x3). For example, the move `r` is the same as `R M'` and `b'` is the same as `B' S`. The middle moves `M`, `E`, and `S` cannot be lower-case otherwise they would be ambiguous.

As an aside, official notation uses `'` (apostrophe) to denote a counter-clockwise rotation, but since we're in JavaScript instead append `prime` (e.g. replace `R'` with `Rprime`). Also, this solver does not recognize the moves `X`, `Y`, or `Z`.
```

app.jsを修正してコピペで動かせるように省略なしで全文示してください。
````