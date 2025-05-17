
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;
const cols = 10;
const rows = 10;
let owl = { x: 1, y: 1 };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeStyle = "#222";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  ctx.fillStyle = "#0ff";
  ctx.fillRect(owl.x * tileSize, owl.y * tileSize, tileSize, tileSize);
}

function move(dir) {
  if (dir === "ArrowUp" && owl.y > 0) owl.y--;
  if (dir === "ArrowDown" && owl.y < rows - 1) owl.y++;
  if (dir === "ArrowLeft" && owl.x > 0) owl.x--;
  if (dir === "ArrowRight" && owl.x < cols - 1) owl.x++;
  draw();
}

document.addEventListener("keydown", (e) => move(e.key));
draw();
