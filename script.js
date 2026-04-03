const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const STAR_COUNT = 400;
const COLORS = [0, 60, 240];

let frame = 0;
const SPEED = 0.5;
const DURATION = 320;

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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      hue: COLORS[Math.floor(Math.random() * COLORS.length)],
      sat: rand(50, 100),
      o: Math.random()
    });
  }
}
createStars();

function drawStars() {
  for (let s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 88%, ${s.o})`;
    ctx.fill();
  }
}

function updateStars() {
  for (let s of stars) {
    if (Math.random() > 0.99) s.o = Math.random();
  }
}

function easeInOut(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function drawText() {
  const fontSize = Math.min(30, window.innerWidth / 24);
  const centerY = canvas.height / 2;

  ctx.font = `${fontSize}px Comic Sans MS`;
  ctx.textAlign = "center";

  ctx.shadowColor = "rgba(45,45,255,1)";
  ctx.shadowBlur = 12;

  const index = Math.floor(frame / DURATION);
  const local = (frame % DURATION) / DURATION;

  let opacity = 0;

  if (local < 0.5) {
    opacity = easeInOut(local * 2);
  } else {
    opacity = easeInOut(1 - (local - 0.5) * 2);
  }

  if (index < messages.length) {
    ctx.fillStyle = `rgba(45,45,255,${opacity})`;
    ctx.fillText(messages[index], canvas.width / 2, centerY);
  }

  ctx.shadowBlur = 0;
}

function drawOutroFade() {
  const totalFrames = messages.length * DURATION;
  if (frame > totalFrames) {
    const fade = Math.min((frame - totalFrames) / 200, 1);
    ctx.fillStyle = `rgba(0,0,0,${fade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  updateStars();
  drawText();
  drawOutroFade();

  frame += SPEED;
  requestAnimationFrame(draw);
}

draw();
