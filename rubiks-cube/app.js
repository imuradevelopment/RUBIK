/***************************************
 * グローバル変数
 ***************************************/
let scene;               // Three.jsシーン
let camera;              // Three.jsカメラ
let renderer;            // Three.jsレンダラー
let controls;            // OrbitControls
let cubePieces = [];     // キューブの各ピースを格納
let isAnimating = false; // アニメーション中フラグ

/***************************************
 * Three.js 初期化 & 描画関連
 ***************************************/

/**
 * Three.js のシーンを初期化する
 */
function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);

  const canvas = document.getElementById("cubeCanvas");
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;

  // 環境光 & 平行光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // ルービックキューブを作成
  createCube();

  // アニメーション開始
  animate();
}

/**
 * アニメーションループ
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * レンダラーとカメラのサイズなどを更新
 */
function updateRendererSize() {
  // 可変ヘッダーの高さをCSS変数に反映
  const mainHeader = document.getElementById("mainHeader");
  if (mainHeader) {
    const headerH = mainHeader.offsetHeight;
    document.documentElement.style.setProperty("--header-height", headerH + "px");
  }

  const cubeView = document.querySelector(".cube-view");
  const w = cubeView.clientWidth;
  const h = cubeView.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/***************************************
 * キューブ生成 & 基本操作関連
 ***************************************/

/**
 * キューブ（各ピース）を作成する
 */
function createCube() {
  const colors = [
    0xff0000, // 赤
    0xff8000, // オレンジ
    0xffffff, // 白
    0xffff00, // 黄
    0x00ff00, // 緑
    0x0000ff, // 青
  ];
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  // センターピース
  const centerPositions = [
    [0, 0, 1],
    [0, 0, -1],
    [0, 1, 0],
    [0, -1, 0],
    [1, 0, 0],
    [-1, 0, 0],
  ];
  for (const pos of centerPositions) {
    const mats = Array(6).fill().map(() =>
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 })
    );

    if (pos[1] === 1) mats[2].color.setHex(colors[2]);   // 上面
    if (pos[1] === -1) mats[3].color.setHex(colors[3]);  // 下面
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);   // 前面
    if (pos[2] === -1) mats[5].color.setHex(colors[5]);  // 背面
    if (pos[0] === 1) mats[0].color.setHex(colors[0]);   // 右面
    if (pos[0] === -1) mats[1].color.setHex(colors[1]);  // 左面

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }

  // エッジピース
  const edgePositions = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 0, -1], [-1, 0, -1], [0, 1, -1], [0, -1, -1],
    [1, 1, 0],  [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  ];
  for (const pos of edgePositions) {
    const mats = Array(6).fill().map(() =>
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 })
    );

    if (pos[0] === 1) mats[0].color.setHex(colors[0]);
    if (pos[0] === -1) mats[1].color.setHex(colors[1]);
    if (pos[1] === 1) mats[2].color.setHex(colors[2]);
    if (pos[1] === -1) mats[3].color.setHex(colors[3]);
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);
    if (pos[2] === -1) mats[5].color.setHex(colors[5]);

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }

  // コーナーピース
  const cornerPositions = [
    [1, 1, 1],  [-1, 1, 1],
    [1, -1, 1], [-1, -1, 1],
    [1, 1, -1], [-1, 1, -1],
    [1, -1, -1],[ -1, -1, -1],
  ];
  for (const pos of cornerPositions) {
    const mats = Array(6).fill().map(() =>
      new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 30 })
    );

    if (pos[0] === 1) mats[0].color.setHex(colors[0]);
    if (pos[0] === -1) mats[1].color.setHex(colors[1]);
    if (pos[1] === 1) mats[2].color.setHex(colors[2]);
    if (pos[1] === -1) mats[3].color.setHex(colors[3]);
    if (pos[2] === 1) mats[4].color.setHex(colors[4]);
    if (pos[2] === -1) mats[5].color.setHex(colors[5]);

    const piece = new THREE.Mesh(geometry, mats);
    piece.position.set(...pos);
    scene.add(piece);
    cubePieces.push(piece);
  }
}

function parseCubePieces() {
  console.log("=== cubePieces の内容をパースした結果 ===");
  
  cubePieces.forEach((piece, index) => {
    const position = {
      x: Math.round(piece.position.x * 100) / 100,
      y: Math.round(piece.position.y * 100) / 100,
      z: Math.round(piece.position.z * 100) / 100,
    };

    const materials = piece.material.map((mat, matIndex) => ({
      face: getFaceName(matIndex), // 面名を取得
      colorHex: mat.color.getHex().toString(16), // 色コード
      colorName: hexToColorName(mat.color.getHex()), // 色名
    }));

    console.log(`ピース ${index + 1}:`);
    console.log(`  位置: x=${position.x}, y=${position.y}, z=${position.z}`);
    console.log("  色:");
    materials.forEach((mat) => {
      console.log(`    面: ${mat.face}, 色コード: #${mat.colorHex}, 色名: ${mat.colorName}`);
    });
    console.log("-------------------------------");
  });
  alert("コンソールに状態を出力しました。");
}

/**
 * 面インデックスを面名に変換
 * 0: R, 1: L, 2: U, 3: D, 4: F, 5: B
 */
function getFaceName(index) {
  const faceNames = ["R", "L", "U", "D", "F", "B"];
  return faceNames[index] || "Unknown";
}

/**
 * 色コードを色名に変換
 */
function hexToColorName(hex) {
  switch (hex) {
    case 0x00ff00: return "green";  // 緑
    case 0xff0000: return "red";    // 赤
    case 0xffffff: return "white";  // 白
    case 0xffff00: return "yellow"; // 黄
    case 0xff8000: return "orange"; // オレンジ
    case 0x0000ff: return "blue";   // 青
    case 0x000000: return "black";  // 黒
    default: return "unknown";      // 未知の色
  }
}

/**
 * キューブをリセット（初期状態に戻す）
 */
function resetCube() {
  cubePieces.forEach((p) => scene.remove(p));
  cubePieces = [];
  createCube();
}

/**
 * ランダムにスクランブル
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
    setTimeout(nextMove, 1000);
  }
  nextMove();
}

/***************************************
 * キューブのムーブ実行 & 回転処理
 ***************************************/

/**
 * ムーブを1手実行
 */
function executeMove(moveType) {
  if (isAnimating) return;
  const moves = {
    U:      () => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", -1),
    Uprime: () => rotateLayer({ position: new THREE.Vector3(0, 1, 0) }, "y", 1),
    D:      () => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", 1),
    Dprime: () => rotateLayer({ position: new THREE.Vector3(0, -1, 0) }, "y", -1),
    R:      () => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", -1),
    Rprime: () => rotateLayer({ position: new THREE.Vector3(1, 0, 0) }, "x", 1),
    L:      () => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", 1),
    Lprime: () => rotateLayer({ position: new THREE.Vector3(-1, 0, 0) }, "x", -1),
    F:      () => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", -1),
    Fprime: () => rotateLayer({ position: new THREE.Vector3(0, 0, 1) }, "z", 1),
    B:      () => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", 1),
    Bprime: () => rotateLayer({ position: new THREE.Vector3(0, 0, -1) }, "z", -1),
    M:      () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", 1),
    Mprime: () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "x", -1),
    E:      () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", 1),
    Eprime: () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "y", -1),
    S:      () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", -1),
    Sprime: () => rotateLayer({ position: new THREE.Vector3(0, 0, 0) }, "z", 1),
    x:      () => rotateCube("x", -1),
    xprime: () => rotateCube("x", 1),
    y:      () => rotateCube("y", -1),
    yprime: () => rotateCube("y", 1),
    z:      () => rotateCube("z", -1),
    zprime: () => rotateCube("z", 1),
  };
  if (moves[moveType]) {
    moves[moveType]();
  }
}

/**
 * 特定層を回転
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

  // 回転対象ピースをグループ化
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
 * キューブ全体を回転
 */
function rotateCube(axis, direction) {
  if (isAnimating) {
    return new Promise((resolve) => resolve());
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
 * 回転にあわせてマテリアルの色を更新
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
    } else {
      materials[5].color.copy(temp[2]);
      materials[3].color.copy(temp[5]);
      materials[4].color.copy(temp[3]);
      materials[2].color.copy(temp[4]);
    }
  } else if (axis === "y") {
    if (direction === 1) {
      materials[0].color.copy(temp[4]);
      materials[5].color.copy(temp[0]);
      materials[1].color.copy(temp[5]);
      materials[4].color.copy(temp[1]);
    } else {
      materials[1].color.copy(temp[4]);
      materials[4].color.copy(temp[0]);
      materials[0].color.copy(temp[5]);
      materials[5].color.copy(temp[1]);
    }
  } else if (axis === "z") {
    if (direction === 1) {
      materials[1].color.copy(temp[2]);
      materials[3].color.copy(temp[1]);
      materials[0].color.copy(temp[3]);
      materials[2].color.copy(temp[0]);
    } else {
      materials[0].color.copy(temp[2]);
      materials[3].color.copy(temp[0]);
      materials[1].color.copy(temp[3]);
      materials[2].color.copy(temp[1]);
    }
  }
}

/**
 * rubiks-cube-solver での解法（START）
 */

/**
 * キューブを solver 用に正しい向きに整える
 * → solveCubeRubiks から呼ばれる
 */
async function autoOrientCubeForSolver() {
  const startOrient = getCenterOrientation();
  if (checkOrientationGoal(startOrient)) {
    return;
  }

  let queue = [];
  queue.push({ orient: startOrient, moves: [] });
  let visited = new Set();
  visited.add(orientationKey(startOrient));

  const possibleMoves = [
    { axis:'x', dir: 1,  notation:'x' },
    { axis:'x', dir: -1, notation:'xprime' },
    { axis:'y', dir: 1,  notation:'y' },
    { axis:'y', dir: -1, notation:'yprime' },
    { axis:'z', dir: 1,  notation:'z' },
    { axis:'z', dir: -1, notation:'zprime' },
  ];

  const maxDepth = 4;
  while (queue.length > 0) {
    let { orient, moves } = queue.shift();
    if (moves.length >= maxDepth) continue;

    for (let pm of possibleMoves) {
      let newOrient = rotateOrientation(orient, pm.axis, pm.dir);
      if (checkOrientationGoal(newOrient)) {
        // 最短経路で回転
        let finalMoves = [...moves, pm.notation];
        for (let fm of finalMoves) {
          await rotateCube(fm[0], fm.includes("prime") ? -1 : 1);
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
}

/**
 * solveCubeRubiks で使用
 */
function checkOrientationGoal(arr) {
  // arr[0]==="green" && arr[2]==="white" && arr[1]==="red"
  return (arr[0]==="green" && arr[2]==="white" && arr[1]==="red");
}

/**
 * solveCubeRubiks で使用
 */
function orientationKey(arr) {
  return arr.join("|");
}

/**
 * solveCubeRubiks で使用
 */
function rotateOrientation(arr, axis, dir) {
  const newArr = [...arr];
  if (axis==="x") {
    if (dir===1) {
      newArr[2] = arr[5];
      newArr[5] = arr[3];
      newArr[3] = arr[0];
      newArr[0] = arr[2];
    } else {
      newArr[5] = arr[2];
      newArr[3] = arr[5];
      newArr[0] = arr[3];
      newArr[2] = arr[0];
    }
  }
  else if (axis==="y") {
    if (dir===1) {
      newArr[0] = arr[4];
      newArr[1] = arr[0];
      newArr[5] = arr[1];
      newArr[4] = arr[5];
    } else {
      newArr[4] = arr[0];
      newArr[0] = arr[1];
      newArr[1] = arr[5];
      newArr[5] = arr[4];
    }
  }
  else if (axis==="z") {
    if (dir===1) {
      newArr[2] = arr[1];
      newArr[1] = arr[3];
      newArr[3] = arr[4];
      newArr[4] = arr[2];
    } else {
      newArr[1] = arr[2];
      newArr[3] = arr[1];
      newArr[4] = arr[3];
      newArr[2] = arr[4];
    }
  }
  return newArr;
}

/**
 * solveCubeRubiks が呼ぶ: キューブのセンターの色配置を取得
 */
function getCenterOrientation() {
  const centerData = getCubeState().centers;
  // [F, R, U, D, L, B] の順で結果を詰める想定
  let result = ["","","","","",""];
  for (let c of centerData) {
    let [x,y,z] = c.pos;
    let colName = c.colors[0]?.colorName || "unknown";
    if (x===0 && y===0 && z===1)  result[0] = colName;  // Front
    if (x===1 && y===0 && z===0)  result[1] = colName;  // Right
    if (x===0 && y===1 && z===0)  result[2] = colName;  // Up
    if (x===0 && y===-1&& z===0)  result[3] = colName;  // Down
    if (x===-1&&y===0 && z===0)  result[4] = colName;   // Left
    if (x===0 && y===0 && z===-1) result[5] = colName;  // Back
  }
  return result;
}

/**
 * solveCubeRubiks が呼ぶ: キューブの状態を取得し文字列化
 */
function buildCubeStateString() {
  const cubeInfo = getCubeState();
  const fStr = getFaceString(cubeInfo, "F");
  const rStr = getFaceString(cubeInfo, "R");
  const uStr = getFaceString(cubeInfo, "U");
  const dStr = getFaceString(cubeInfo, "D");
  const lStr = getFaceString(cubeInfo, "L");
  const bStr = getFaceString(cubeInfo, "B");
  return fStr + rStr + uStr + dStr + lStr + bStr;
}

/**
 * rubiks-cube-solver でのみ使用
 * → 面(F, R, U, D, L, B)の9つのパネルの色を文字列化
 */
function getFaceString(cubeInfo, face) {
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

  const coords = faceIndicesMap[face];
  let faceStr = "";
  for (let posArr of coords) {
    const piece = findPieceByPosition(cubeInfo, posArr[0], posArr[1], posArr[2]);
    if (!piece) {
      faceStr += "x";
      continue;
    }
    const colorObj = piece.colors.find((c) => c.face === face);
    if (!colorObj) {
      faceStr += "x";
      continue;
    }
    faceStr += colorNameToSolverChar(colorObj.colorName);
  }
  return faceStr;
}

/**
 * rubiks-cube-solver でのみ使用
 * → 位置(px,py,pz)から該当ピースを検索
 */
function findPieceByPosition(cubeInfo, px, py, pz) {
  const allPieces = [...cubeInfo.centers, ...cubeInfo.edges, ...cubeInfo.corners];
  return allPieces.find((p) => {
    return p.pos[0] === px && p.pos[1] === py && p.pos[2] === pz;
  });
}

/**
 * rubiks-cube-solver でのみ使用
 * → 色名をソルバーの文字に変換
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

/**
 * rubiks-cube-solver でのみ使用
 * → 現在のキューブ状態を取得（センター・エッジ・コーナー）
 */
function getCubeState() {
  const cubeInfo = {
    centers: [],
    edges: [],
    corners: [],
  };
  for (const piece of cubePieces) {
    const px = Math.round(piece.position.x);
    const py = Math.round(piece.position.y);
    const pz = Math.round(piece.position.z);

    // マテリアル配列から色名を抽出
    const cArr = piece.material.map((m) => m.color.getHex());
    const colorInfo = [];
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

/**
 * 16進色コード → 色名
 */
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
 * rubiks-cube-solver: 解法実行
 */
async function solveCubeRubiks() {
  if (isAnimating) return;
  // ソルバー用に向きを自動調整
  await autoOrientCubeForSolver();

  // キューブ状態を文字列に
  let cubeStateString = buildCubeStateString();
  let solveMoves;

  try {
    // rubiks-cube-solverライブラリで解法を取得
    solveMoves = window.rubiksCubeSolver(cubeStateString);
  } catch (e) {
    alert("rubiks-cube-solver の解法に失敗しました。");
    return;
  }

  let movesArray = solveMoves.split(/\s+/);
  // 末尾の数字 (2,3など) を展開
  movesArray = movesArray.reduce((acc, move) => {
    const match = move.match(/(\d+)$/);
    if (match) {
      const count = parseInt(match[1]);
      const baseMove = move.slice(0, -1);
      return [...acc, ...Array(count).fill(baseMove)];
    }
    return [...acc, move];
  }, []);

  // 小文字系 (u, l, f, r, b, dなど) を分解して対応
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

  // 最終的なムーブ列を順次実行
  for (let move of movesArray) {
    await doAlgorithm(move);
  }

  alert("rubiks-cube-solver による解法が完了しました！");
}

/**
 * 指定のアルゴリズム(スペース区切り)を実行
 * → rubiks-cube-solver の最終手順で呼ばれる
 */
async function doAlgorithm(alg) {
  const moves = alg.trim().split(/\s+/);
  for (let m of moves) {
    executeMove(m);
    // 1秒ウェイト
    await waitMs(1000);
  }
}

/**
 * ミリ秒待機
 */
function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * rubiks-cube-solver での解法（END）
 */

/**
 * solveCube_o1 での解法（START）
 */
// LLMへの要望：下記にのっとってo1resolver関数の実装をお願いします。
// アルゴリズムを実装して、下記のムーブの記号をスペースで区切って返す
// 例：U Uprime D Dprime R Rprime L Lprime F Fprime B Bprimeなど
// ### 標準の面回転ムーブ
// | ムーブ名           | 記号     | 説明                                      |
// |--------------------|----------|-------------------------------------------|
// | 上面時計回り         | `U`      | **Up**（上面）を時計回りに90度回転               |
// | 上面反時計回り       | `Uprime` | **Up**（上面）を反時計回りに90度回転             |
// | 下面時計回り         | `D`      | **Down**（下面）を時計回りに90度回転             |
// | 下面反時計回り       | `Dprime` | **Down**（下面）を反時計回りに90度回転           |
// | 右面時計回り         | `R`      | **Right**（右面）を時計回りに90度回転             |
// | 右面反時計回り       | `Rprime` | **Right**（右面）を反時計回りに90度回転           |
// | 左面時計回り         | `L`      | **Left**（左面）を時計回りに90度回転             |
// | 左面反時計回り       | `Lprime` | **Left**（左面）を反時計回りに90度回転           |
// | 前面時計回り         | `F`      | **Front**（前面）を時計回りに90度回転             |
// | 前面反時計回り       | `Fprime` | **Front**（前面）を反時計回りに90度回転           |
// | 背面時計回り         | `B`      | **Back**（背面）を時計回りに90度回転             |
// | 背面反時計回り       | `Bprime` | **Back**（背面）を反時計回りに90度回転           |

// ### ミドルレイヤームーブ

// | ムーブ名                     | 記号      | 説明                                            |
// |------------------------------|-----------|-------------------------------------------------|
// | ミドルレイヤー時計回り         | `M`       | **Middle**（ミドルレイヤー）を時計回りに90度回転               |
// | ミドルレイヤー反時計回り       | `Mprime`  | **Middle**（ミドルレイヤー）を反時計回りに90度回転             |
// | 平行レイヤー時計回り           | `E`       | **Equatorial**（平行レイヤー）を時計回りに90度回転               |
// | 平行レイヤー反時計回り         | `Eprime`  | **Equatorial**（平行レイヤー）を反時計回りに90度回転             |
// | スタンディングスライス時計回り   | `S`       | **Standing**（スタンディングスライス）を時計回りに90度回転       |
// | スタンディングスライス反時計回り | `Sprime`  | **Standing**（スタンディングスライス）を反時計回りに90度回転     |

// ### 全体回転ムーブ

// | ムーブ名               | 記号      | 説明                                           |
// |------------------------|-----------|------------------------------------------------|
// | x軸時計回り回転           | `x`       | キューブ全体をx軸に沿って時計回りに90度回転           |
// | x軸反時計回り回転         | `xprime`  | キューブ全体をx軸に沿って反時計回りに90度回転         |
// | y軸時計回り回転           | `y`       | キューブ全体をy軸に沿って時計回りに90度回転           |
// | y軸反時計回り回転         | `yprime`  | キューブ全体をy軸に沿って反時計回りに90度回転         |
// | z軸時計回り回転           | `z`       | キューブ全体をz軸に沿って時計回りに90度回転           |
// | z軸反時計回り回転         | `zprime`  | キューブ全体をz軸に沿って反時計回りに90度回転         |
function o1resolver(cubeStateString) {
  alert("まだo1resolver関数は実装されていません。");
}
async function solveCube_o1() {
  if (isAnimating) return;
  // Upが白、Frontが緑、Rightが赤になるように向きを自動調整
  await autoOrientCubeForSolver();

  // キューブ状態を文字列に
  let cubeStateString = buildCubeStateString();
  let solveMoves;

  try {
    // o1resolver関数で解法を取得
    solveMoves = o1resolver(cubeStateString);
  } catch (e) {
    alert("solveCube_o1 の解法に失敗しました。");
    return;
  }

  let movesArray = solveMoves.split(/\s+/);

  // 最終的なムーブ列を順次実行
  for (let move of movesArray) {
    await doAlgorithm(move);
  }

  alert("solveCube_o1 による解法が完了しました！");
}
/**
 * solveCube_o1 での解法（END）
 */

/***************************************
 * イベントリスナー
 ***************************************/
window.addEventListener("load", () => {
  initScene();
  updateRendererSize();
});

window.addEventListener("resize", updateRendererSize);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resetButton")?.addEventListener("click", resetCube);
  document.getElementById("scrambleButton")?.addEventListener("click", scrambleCube);
  document.getElementById("parseCubePieces")?.addEventListener("click", parseCubePieces);

  // 解法ボタン
  document.getElementById("solveButton")?.addEventListener("click", () => {
    const method = document.getElementById("solveMethod")?.value;
    if (method === "solveCube_o1") {
      solveCube_o1();
    } else if (method === "rubiks_cube_solver") {
      solveCubeRubiks();
    } else {
      alert("未実装の解法メソッドです。");
    }
  });

  // 各ムーブボタン
  document.querySelectorAll("button[data-move]").forEach((btn) => {
    btn.addEventListener("click", () => {
      executeMove(btn.dataset.move);
    });
  });

  // サイドバー開閉
  const toggleMenu = document.getElementById("toggleMenu");
  const controlPanel = document.getElementById("controlPanel");
  toggleMenu?.addEventListener("click", () => {
    controlPanel?.classList.toggle("closed");
    updateRendererSize();
  });
});
