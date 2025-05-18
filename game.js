
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const cols = 10;
const rows = 10;

const owlImg = new Image();
owlImg.src = "owl.png";
const wallImg = new Image();
wallImg.src = "wall.png";
const blockImg = new Image();
blockImg.src = "block.png";
const explosionImg = new Image();
explosionImg.src = "explosion.png";

let grid = [];
let owl = { x: 1, y: 1 };
let bombs = [];
let explosions = [];

function initGrid() {
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      if (x % 2 === 1 && y % 2 === 1) {
        grid[y][x] = 1;
      } else if (Math.random() < 0.3 && !(x === 1 && y === 1)) {
        grid[y][x] = 2;
      } else {
        grid[y][x] = 0;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) ctx.drawImage(wallImg, x * tileSize, y * tileSize, tileSize, tileSize);
      if (grid[y][x] === 2) ctx.drawImage(blockImg, x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.drawImage(owlImg, owl.x * tileSize, owl.y * tileSize, tileSize, tileSize);

  bombs.forEach(b => {
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.arc(b.x * tileSize + tileSize/2, b.y * tileSize + tileSize/2, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  explosions.forEach(e => {
    ctx.drawImage(explosionImg, e.x * tileSize, e.y * tileSize, tileSize, tileSize);
  });
}

function move(dx, dy) {
  let nx = owl.x + dx;
  let ny = owl.y + dy;
  if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && grid[ny][nx] === 0) {
    owl.x = nx;
    owl.y = ny;
  }
  draw();
}

function placeBomb() {
  const x = owl.x;
  const y = owl.y;
  bombs.push({ x, y });
  setTimeout(() => {
    bombs = bombs.filter(b => b.x !== x || b.y !== y);
    explode(x, y);
  }, 1500);
}

function explode(x, y) {
  const tiles = [{x,y}, {x:x+1,y}, {x:x-1,y}, {x,y:y+1}, {x,y:y-1}];
  tiles.forEach(t => {
    if (t.x >= 0 && t.y >= 0 && t.x < cols && t.y < rows) {
      if (grid[t.y][t.x] === 2) grid[t.y][t.x] = 0;
      explosions.push(t);
    }
  });
  draw();
  setTimeout(() => {
    explosions = [];
    draw();
  }, 500);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
  if (e.key === " ") placeBomb();
});

owlImg.onload = () => {
  initGrid();
  draw();
};
