
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const cols = 10;
const rows = 10;

let owl = { x: 1, y: 1 };
let bombs = [];
let explosions = [];
let worms = [];
let mice = [];

const owlImg = new Image();
owlImg.src = "owl.png";
const wormImg = new Image();
wormImg.src = "worm.png";
const mouseImg = new Image();
mouseImg.src = "mouse.png";
const explosionImg = new Image();
explosionImg.src = "explosion.png";

function getRandomTile(exclude) {
  let x, y, isOccupied;
  do {
    x = Math.floor(Math.random() * cols);
    y = Math.floor(Math.random() * rows);
    isOccupied = exclude.some(e => e.x === x && e.y === y);
  } while (isOccupied);
  return { x, y };
}

function spawnEnemies() {
  worms = [];
  mice = [];
  let occupied = [{ ...owl }];

  for (let i = 0; i < 3; i++) {
    let pos = getRandomTile(occupied);
    worms.push(pos);
    occupied.push(pos);
  }

  for (let i = 0; i < 2; i++) {
    let pos = getRandomTile(occupied);
    mice.push(pos);
    occupied.push(pos);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.drawImage(owlImg, owl.x * tileSize, owl.y * tileSize, tileSize, tileSize);
  worms.forEach(w => ctx.drawImage(wormImg, w.x * tileSize, w.y * tileSize, tileSize, tileSize));
  mice.forEach(m => ctx.drawImage(mouseImg, m.x * tileSize, m.y * tileSize, tileSize, tileSize));
  bombs.forEach(b => ctx.fillStyle = "#f00", ctx.fillRect(b.x * tileSize + 8, b.y * tileSize + 8, 16, 16));
  explosions.forEach(e => ctx.drawImage(explosionImg, e.x * tileSize, e.y * tileSize, tileSize, tileSize));
}

function move(dir) {
  if (dir === "ArrowUp" && owl.y > 0) owl.y--;
  if (dir === "ArrowDown" && owl.y < rows - 1) owl.y++;
  if (dir === "ArrowLeft" && owl.x > 0) owl.x--;
  if (dir === "ArrowRight" && owl.x < cols - 1) owl.x++;
  draw();
}

function placeBomb() {
  let bomb = { x: owl.x, y: owl.y };
  bombs.push(bomb);
  draw();
  setTimeout(() => {
    bombs = bombs.filter(b => !(b.x === bomb.x && b.y === bomb.y));
    createExplosion(bomb.x, bomb.y);
  }, 1500);
}

function createExplosion(x, y) {
  const explosionTiles = [
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
  explosions = explosionTiles;
  worms = worms.filter(w => !explosionTiles.some(e => e.x === w.x && e.y === w.y));
  mice = mice.filter(m => !explosionTiles.some(e => e.x === m.x && e.y === m.y));
  draw();
  setTimeout(() => {
    explosions = [];
    draw();
  }, 500);
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    move(e.key);
  }
  if (e.key === " ") {
    placeBomb();
  }
});

owlImg.onload = () => {
  spawnEnemies();
  draw();
};
