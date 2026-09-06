import { useEffect, useRef } from "react";
import "./HeroCanvas.css";

const COLORS = ["#65c7f2", "#7aa2ff", "#9b8cff", "#35d0b1"];
const LINK_DIST = 152;

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function HeroCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, nodes = [];
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const build = () => {
      const count = Math.max(30, Math.min(74, Math.round((w * h) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 1.1, c: COLORS[(Math.random() * COLORS.length) | 0],
        depth: Math.random() * 0.6 + 0.4, sx: 0, sy: 0,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const px = pointer.x - 0.5, py = pointer.y - 0.5;

      for (const n of nodes) {
        if (!reduce) { n.x += n.vx; n.y += n.vy; }
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        n.sx = n.x + px * 34 * n.depth;
        n.sy = n.y + py * 34 * n.depth;
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
          if (d > LINK_DIST) continue;
          const alpha = (1 - d / LINK_DIST) * 0.42;
          ctx.strokeStyle = hexToRgba(a.c, alpha);
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
          if ((i + j) % 3 === 0) {
            const tt = (t * 0.00013 * (0.6 + a.depth) + i * 0.137) % 1;
            const qx = a.sx + (b.sx - a.sx) * tt, qy = a.sy + (b.sy - a.sy) * tt;
            ctx.fillStyle = hexToRgba(b.c, Math.min(0.85, alpha + 0.4));
            ctx.beginPath(); ctx.arc(qx, qy, 1.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = hexToRgba(n.c, 0.1);
        ctx.beginPath(); ctx.arc(n.sx, n.sy, n.r * 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = hexToRgba(n.c, 0.92);
        ctx.beginPath(); ctx.arc(n.sx, n.sy, n.r, 0, Math.PI * 2); ctx.fill();
      }
    };

    const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      pointer.ty = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    if (reduce) draw(0); else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="jn-bg-canvas" aria-hidden="true" />;
}
