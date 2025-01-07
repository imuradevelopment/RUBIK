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
  const controlPanel = document.getElementById("controlPanel");

  // スマホ用レイアウトを判定
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // スマホ: サイドバーが閉じている場合は上部に隠す
    const sidebarHeight = controlPanel.classList.contains("closed") ? 0 : controlPanel.offsetHeight;
    cubeView.style.top = `${60 + sidebarHeight}px`; // ヘッダー＋サイドバー高さ
    cubeView.style.left = "0";
  } else {
    // デスクトップ: サイドバーが左側に表示
    const sidebarWidth = controlPanel.classList.contains("closed") ? 0 : 300;
    cubeView.style.left = `${sidebarWidth}px`;
    cubeView.style.top = "60px"; // ヘッダー下
  }

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
    setTimeout(nextMove, 1000);
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
    // 末尾の数字を抽出
    const match = move.match(/(\d+)$/);
    if (match) {
      const count = parseInt(match[1]);
      const baseMove = move.slice(0, -1);
      return [...acc, ...Array(count).fill(baseMove)];
    }
    return [...acc, move];
  }, []);

  console.log(movesArray);

  // movesArray配列に小文字の「u」が含まれている場合、要素を二つに分割して「U」と「Eprime」に変換
  // movesArray配列に小文字の「uprime」が含まれている場合、要素を二つに分割して「Uprime」と「E」に変換
  // movesArray配列に小文字の「l」が含まれている場合、要素を二つに分割して「L」と「M」に変換
  // movesArray配列に小文字の「lprime」が含まれている場合、要素を二つに分割して「Lprime」と「Mprime」に変換
  // movesArray配列に小文字の「f」が含まれている場合、要素を二つに分割して「F」と「S」に変換
  // movesArray配列に小文字の「fprime」が含まれている場合、要素を二つに分割して「Fprime」と「Sprime」に変換
  // movesArray配列に小文字の「r」が含まれている場合、要素を二つに分割して「R」と「Mprime」に変換
  // movesArray配列に小文字の「rprime」が含まれている場合、要素を二つに分割して「Rprime」と「M」に変換
  // movesArray配列に小文字の「b」が含まれている場合、要素を二つに分割して「B」と「Sprime」に変換
  // movesArray配列に小文字の「bprime」が含まれている場合、要素を二つに分割して「Bprime」と「S」に変換
  // movesArray配列に小文字の「d」が含まれている場合、要素を二つに分割して「D」と「E」に変換
  // movesArray配列に小文字の「dprime」が含まれている場合、要素を二つに分割して「Dprime」と「Eprime」に変換
  movesArray = movesArray.reduce((acc, move) => {
    if (move === "u") {
      return [...acc, "U", "Eprime"];
    } else if (move === "uprime") {
      return [...acc, "Uprime", "E"];
    } else if (move === "l") {
      return [...acc, "L", "M"];
    } else if (move === "lprime") {
      return [...acc, "Lprime", "Mprime"];
    } else if (move === "f") {
      return [...acc, "F", "S"];
    } else if (move === "fprime") {
      return [...acc, "Fprime", "Sprime"];
    } else if (move === "r") {
      return [...acc, "R", "Mprime"];
    } else if (move === "rprime") {
      return [...acc, "Rprime", "M"];
    } else if (move === "b") {
      return [...acc, "B", "Sprime"];
    } else if (move === "bprime") {
      return [...acc, "Bprime", "S"];
    } else if (move === "d") {
      return [...acc, "D", "E"];
    } else if (move === "dprime") {
      return [...acc, "Dprime", "Eprime"];
    } else {
      return [...acc, move];
    }
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
    await waitMs(1000);
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
    U:   () => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", -1),
    "Uprime":() => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", 1),
    D:   () => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", 1),
    "Dprime":() => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", -1),
    R:   () => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", -1),
    "Rprime":() => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", 1),
    L:   () => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", 1),
    "Lprime":() => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", -1),
    F:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", -1),
    "Fprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", 1),
    B:   () => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", 1),
    "Bprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", -1),

    // 中層
    M:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", 1),
    "Mprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", -1),
    E:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", 1),
    "Eprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", -1),
    S:   () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", -1),
    "Sprime":() => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", 1),

    // 全体
    x:   () => rotateCube("x", -1),
    "xprime":() => rotateCube("x", 1),
    y:   () => rotateCube("y", -1),
    "yprime":() => rotateCube("y", 1),
    z:   () => rotateCube("z", -1),
    "zprime":() => rotateCube("z", 1),
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
  // キューブの状態を取得
  let cubeInfo = getCubeState();

  // 各面を取得
  let fStr = getFaceString(cubeInfo, "F");  // Front面
  let rStr = getFaceString(cubeInfo, "R");  // Right面
  let uStr = getFaceString(cubeInfo, "U");  // Up面
  let dStr = getFaceString(cubeInfo, "D");  // Down面
  let lStr = getFaceString(cubeInfo, "L");  // Left面
  let bStr = getFaceString(cubeInfo, "B");  // Back面

  // 各面のデバッグ出力
  console.log("Front面 (F):", fStr);
  console.log("Right面 (R):", rStr);
  console.log("Up面 (U):", uStr);
  console.log("Down面 (D):", dStr);
  console.log("Left面 (L):", lStr);
  console.log("Back面 (B):", bStr);

  // 最終的な54文字列
  let fullState = fStr + rStr + uStr + dStr + lStr + bStr;
  console.log("生成されたキューブ状態 (54文字):", fullState);

  return fullState;
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
  // サイドバー開閉
  toggleMenu.addEventListener("click", () => {
    controlPanel.classList.toggle("closed");
    updateRendererSize(); // サイドバーの状態変更後にキャンバスサイズを更新
  });
});
