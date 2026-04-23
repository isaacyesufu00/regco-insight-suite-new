import { useEffect, useRef } from "react";

/**
 * DotHandsCanvas — full-bleed canvas that renders two symmetric
 * dot-matrix hands (palms facing up). Dots scatter away from the
 * cursor with a spring-back physics simulation.
 *
 * Pure presentational; no business logic.
 */
const DotHandsCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    type Dot = {
      hx: number; // home x
      hy: number; // home y
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    };

    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    /**
     * Generate a dot field shaped like an open hand (palm + 5 fingers)
     * within a bounding box. `mirror` flips horizontally.
     */
    const buildHand = (cx: number, cy: number, scale: number, mirror: boolean): Dot[] => {
      const out: Dot[] = [];
      const spacing = 10 * scale;

      // Palm: rounded rectangle area
      const palmW = 90 * scale;
      const palmH = 110 * scale;
      const palmX0 = cx - palmW / 2;
      const palmY0 = cy - palmH / 2 + 30 * scale;

      for (let y = 0; y <= palmH; y += spacing) {
        for (let x = 0; x <= palmW; x += spacing) {
          // Round the corners by skipping corner cells outside an ellipse mask
          const dx = (x - palmW / 2) / (palmW / 2);
          const dy = (y - palmH / 2) / (palmH / 2);
          if (dx * dx + dy * dy > 1.05) continue;
          const px = palmX0 + x;
          const py = palmY0 + y;
          out.push(makeDot(px, py));
        }
      }

      // Five fingers — vertical strips with slight angle and varying length
      const fingers = [
        { dx: -36, dy: -50, len: 110, w: 18, angle: -0.18 }, // pinky
        { dx: -18, dy: -75, len: 140, w: 20, angle: -0.07 }, // ring
        { dx:   2, dy: -85, len: 150, w: 22, angle:  0.0  }, // middle
        { dx:  22, dy: -75, len: 140, w: 20, angle:  0.07 }, // index
        { dx:  46, dy:   5, len:  85, w: 22, angle:  0.55 }, // thumb (out to side)
      ];

      for (const f of fingers) {
        const sign = mirror ? -1 : 1;
        const fx0 = cx + f.dx * scale * sign;
        const fy0 = cy + f.dy * scale;
        const fLen = f.len * scale;
        const fW = f.w * scale;
        const ang = f.angle * sign;
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        for (let t = 0; t <= fLen; t += spacing) {
          for (let s = -fW / 2; s <= fW / 2; s += spacing) {
            // Rounded fingertip
            if (t > fLen - fW / 2) {
              const tt = t - (fLen - fW / 2);
              if (s * s + tt * tt > (fW / 2) * (fW / 2)) continue;
            }
            const lx = s;
            const ly = -t; // grow upward
            const wx = fx0 + lx * cos - ly * sin;
            const wy = fy0 + lx * sin + ly * cos;
            out.push(makeDot(wx, wy));
          }
        }
      }

      return out;
    };

    const makeDot = (x: number, y: number): Dot => ({
      hx: x,
      hy: y,
      x,
      y,
      vx: 0,
      vy: 0,
      r: 2.4 + Math.random() * 1.2,
      a: 0.55 + Math.random() * 0.4,
    });

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Position one hand on left third, one on right third, both vertically centered.
      const scale = Math.min(width / 1200, height / 700) * 1.1;
      const cy = height / 2;
      const leftCx = width * 0.22;
      const rightCx = width * 0.78;

      dots = [
        ...buildHand(leftCx, cy, Math.max(0.6, scale), false),
        ...buildHand(rightCx, cy, Math.max(0.6, scale), true),
      ];
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const SPRING = 0.08;
    const DAMP = 0.85;
    const REPEL_RADIUS = 90;
    const REPEL_STRENGTH = 1.4;

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      for (const d of dots) {
        // Spring back to home
        const sx = (d.hx - d.x) * SPRING;
        const sy = (d.hy - d.y) * SPRING;
        d.vx = (d.vx + sx) * DAMP;
        d.vy = (d.vy + sy) * DAMP;

        // Repulsion from cursor
        if (mouse.active) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < REPEL_RADIUS * REPEL_RADIUS) {
            const dist = Math.sqrt(dist2) || 0.001;
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
          }
        }

        d.x += d.vx;
        d.y += d.vy;

        ctx.beginPath();
        ctx.fillStyle = `rgba(26, 26, 26, ${d.a})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    setup();
    tick();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
    />
  );
};

export default DotHandsCanvas;
