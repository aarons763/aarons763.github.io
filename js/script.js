// script.js — nav toggle + animated circuit-trace background

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("active"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("active"))
    );
  }
});

(function circuitBackground() {
  const canvas = document.getElementById("board");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GRID = 34;
  const COPPER = "201, 138, 75";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, cols, rows;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.ceil(w / GRID) + 1;
    rows = Math.ceil(h / GRID) + 1;
  }
  resize();
  window.addEventListener("resize", resize);

  const DIRS = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  function randomStart() {
    return {
      gx: Math.floor(Math.random() * cols),
      gy: Math.floor(Math.random() * rows),
    };
  }

  function makeTrace() {
    const start = randomStart();
    let dir = DIRS[Math.floor(Math.random() * DIRS.length)];
    const points = [{ x: start.gx, y: start.gy }];
    const segments = 5 + Math.floor(Math.random() * 7);

    for (let i = 0; i < segments; i++) {
      // occasionally turn 90 degrees
      if (i > 0 && Math.random() < 0.55) {
        const perp = dir.x !== 0 ? [{ x: 0, y: 1 }, { x: 0, y: -1 }] : [{ x: 1, y: 0 }, { x: -1, y: 0 }];
        dir = perp[Math.floor(Math.random() * perp.length)];
      }
      const len = 1 + Math.floor(Math.random() * 4);
      const last = points[points.length - 1];
      let nx = last.x + dir.x * len;
      let ny = last.y + dir.y * len;
      nx = Math.max(0, Math.min(cols, nx));
      ny = Math.max(0, Math.min(rows, ny));
      points.push({ x: nx, y: ny });
    }

    return {
      points,
      state: "growing", // growing -> complete -> pulsing -> done
      growIndex: 1,
      growT: 0,
      pulseT: 0,
      life: 0,
    };
  }

  const MAX_TRACES = reduceMotion ? 0 : 9;
  const traces = [];
  for (let i = 0; i < MAX_TRACES; i++) {
    const t = makeTrace();
    t.growIndex = t.points.length; // start fully drawn, staggered
    t.state = "complete";
    t.life = Math.random() * 400;
    traces.push(t);
  }

  function toPx(p) {
    return { x: p.x * GRID, y: p.y * GRID };
  }

  function pathLength(points) {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      total += Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
    }
    return total;
  }

  function pointAtDistance(points, dist) {
    let remaining = dist;
    for (let i = 1; i < points.length; i++) {
      const segLen = Math.abs(points[i].x - points[i - 1].x) + Math.abs(points[i].y - points[i - 1].y);
      if (remaining <= segLen) {
        const f = segLen === 0 ? 0 : remaining / segLen;
        return {
          x: points[i - 1].x + (points[i].x - points[i - 1].x) * f,
          y: points[i - 1].y + (points[i].y - points[i - 1].y) * f,
        };
      }
      remaining -= segLen;
    }
    return points[points.length - 1];
  }

  function drawTrace(t) {
    const pts = t.points.slice(0, t.growIndex).map(toPx);
    if (pts.length < 2) return;

    ctx.strokeStyle = `rgba(${COPPER}, 0.22)`;
    ctx.lineWidth = 1.4;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // vias at bends
    ctx.fillStyle = `rgba(${COPPER}, 0.35)`;
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // traveling pulse
    if (t.state === "pulsing") {
      const total = pathLength(t.points);
      const pos = toPx(pointAtDistance(t.points, t.pulseT * total));
      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
      grad.addColorStop(0, `rgba(${COPPER}, 0.9)`);
      grad.addColorStop(1, `rgba(${COPPER}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function updateTrace(t) {
    t.life += 1;

    if (t.state === "growing") {
      t.growT += 0.06;
      if (t.growT >= 1) {
        t.growT = 0;
        t.growIndex++;
        if (t.growIndex >= t.points.length) t.state = "complete";
      }
    } else if (t.state === "complete") {
      if (t.life > 120 + Math.random() * 200) {
        t.state = "pulsing";
        t.pulseT = 0;
      }
    } else if (t.state === "pulsing") {
      t.pulseT += 0.012;
      if (t.pulseT >= 1) t.state = "done";
    } else if (t.state === "done") {
      Object.assign(t, makeTrace());
      t.life = 0;
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    traces.forEach((t) => {
      updateTrace(t);
      drawTrace(t);
    });
    requestAnimationFrame(frame);
  }

  if (!reduceMotion) {
    requestAnimationFrame(frame);
  }
})();