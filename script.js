const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const STAR_COUNT = 400;
const COLORS = [0, 60, 240];

let frame = 0;
const SPEED = 0.5;      // frame-units per 1/60s (same pace as before at 60Hz)
const DURATION = 320;   // frame-units per message
const OUTRO = 200;      // frame-units for the final fade to black
const FONT = '"Comic Sans MS", "Comic Neue", cursive, sans-serif';

let w = 0, h = 0, dpr = 1;
let finished = false;
let last = 0;

const messages = [
  " hì hnay ko phải ngày đặc biệt gì hết nhma…",

  "Dear my love",

  "Nếu một ngày em thấy mình nhỏ bé",
  "và nghĩ rằng mình không xứng đáng được yêu",

  "hãy nhớ rằng anh đã chọn em",
  "không phải vì em hoàn hảo",
  "mà vì em là em",
  "rất riêng và không ai có thể thay thế.",

  "Anh yêu cả những điều em cho là thiếu sót",
  "vì với anh tất cả những điều đó",
  "làm nên một em thật đặc biệt.",

  "Em không cần phải cố gắng trở thành ai khác",
  "chỉ cần là chính em thôi",
  "cũng đã đủ khiến anh muốn ở bên rồi.",

  "Với anh, em luôn là điều đáng trân trọng nhất.",

  "xnghi của anh cố lên nhá Chayo.",
  "Gang Gang.",
  " Luv my wf "
];

function resizeCanvas() {
  const oldW = w, oldH = h;
  w = window.innerWidth;
  h = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Buffer size = CSS size * DPR (sharp on retina), CSS size = exact viewport (no mobile 100vh mismatch)
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Keep stars where they were instead of re-rolling them on every resize
  if (oldW && oldH) {
    for (const s of stars) {
      s.x *= w / oldW;
      s.y *= h / oldH;
    }
  }

  if (finished) paintBlack();
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const hue = COLORS[Math.floor(Math.random() * COLORS.length)];
    const sat = rand(50, 100);
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2,
      color: `hsla(${hue}, ${sat.toFixed(0)}%, 88%, `, // opacity appended at draw time
      o: Math.random()
    });
  }
}

resizeCanvas();
createStars();
window.addEventListener("resize", resizeCanvas);

function drawStars() {
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.color + s.o.toFixed(2) + ")";
    ctx.fill();
  }
}

// dt in frame-units, so twinkle rate does not depend on the monitor refresh rate
function updateStars(dt) {
  const p = 0.01 * (dt / SPEED);
  for (const s of stars) {
    if (Math.random() < p) s.o = Math.random();
  }
}

function easeInOut(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function drawText() {
  const index = Math.floor(frame / DURATION);
  if (index >= messages.length) return;

  const local = (frame % DURATION) / DURATION;
  const opacity = local < 0.5
    ? easeInOut(local * 2)
    : easeInOut(1 - (local - 0.5) * 2);

  if (opacity < 0.01) return; // nothing visible: skip the expensive shadowBlur pass

  ctx.font = `${Math.min(30, w / 24)}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(45,45,255,1)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = `rgba(45,45,255,${opacity})`;
  ctx.fillText(messages[index], w / 2, h / 2);
  ctx.shadowBlur = 0;
}

function paintBlack() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
}

function drawOutroFade() {
  const totalFrames = messages.length * DURATION;
  if (frame > totalFrames) {
    const fade = Math.min((frame - totalFrames) / OUTRO, 1);
    ctx.fillStyle = `rgba(0,0,0,${fade})`;
    ctx.fillRect(0, 0, w, h);
    return fade >= 1;
  }
  return false;
}

function draw(now) {
  // Time-based animation; clamp so a background tab doesn't cause a huge jump
  const dtMs = last ? Math.min(now - last, 100) : 1000 / 60;
  last = now;
  const dt = (dtMs / (1000 / 60)) * SPEED;

  ctx.clearRect(0, 0, w, h);
  drawStars();
  updateStars(dt);
  drawText();
  const done = drawOutroFade();

  frame += dt;

  if (done) {
    // Screen is fully black: stop the loop instead of burning CPU/battery forever
    finished = true;
    return;
  }
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
