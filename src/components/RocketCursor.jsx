import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 30;

const RocketCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const scheduledRef = useRef(false);
  const angleRef = useRef(0);
  const trailRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const next = { x: e.clientX, y: e.clientY };
      // compute angle from previous position to next
      const dx = next.x - prevPosRef.current.x;
      const dy = next.y - prevPosRef.current.y;
      // speed (px per frame)
      const speed = Math.sqrt(dx * dx + dy * dy);
      // angle in degrees, rotate so rocket points toward movement
      const ang = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      angleRef.current = ang;
      prevPosRef.current = next;
      setPosition(next);

      // map speed -> color (orange -> blue)
      const max = 80;
      const t = Math.min(speed / max, 1);
      const hue = 40 + (200 - 40) * t; // 40=orange,200=blue
      const color = `hsl(${hue},100%,60%)`;

      // push to trail (capped) and schedule a RAF update
      trailRef.current.unshift({ x: next.x, y: next.y, color });
      if (trailRef.current.length > TRAIL_LENGTH) trailRef.current.length = TRAIL_LENGTH;
      if (!scheduledRef.current) {
        scheduledRef.current = true;
        rafRef.current = requestAnimationFrame(() => {
          scheduledRef.current = false;
          // copy the ref-like trail into state for rendering
          setTrail(trailRef.current.slice());
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* trail elements (fading blobs behind the rocket) */}
      {trail.map((p, idx) => {
        const alpha = (1 - idx / TRAIL_LENGTH) * 0.6; // fade out
        const size = 8 * (1 - idx / TRAIL_LENGTH) + 4; // shrink
        return (
          <div
            key={`${p.x}-${p.y}-${idx}`}
            className="pointer-events-none fixed z-[99997] rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: size,
              height: size,
              transform: "translate(-50%, -50%)",
              opacity: alpha,
              filter: "blur(4px)",
              background: p.color,
            }}
          />
        );
      })}

      {/* Rocket cursor at pointer (rotates toward movement) */}
      <div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) rotate(${angleRef.current}deg)`,
          width: 28,
          height: 28,
        }}
      >
        {/* simple rocket SVG */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* body */}
          <path d="M12 2 L14.5 8 L12 7 L9.5 8 Z" fill="#FFFFFF" />
          <rect x="10" y="7" width="4" height="7" rx="1" fill="#FFFFFF" />
          {/* fins */}
          <path d="M10 12 L6 14 L8 16 Z" fill="#FFFFFF" />
          <path d="M14 12 L18 14 L16 16 Z" fill="#FFFFFF" />
          {/* window */}
          <circle cx="12" cy="10.5" r="0.9" fill="#000" opacity="0.85" />
          {/* flame */}
          <path d="M12 17 L11 20 L12 22 L13 20 Z" fill="#FF6B35" />
        </svg>
      </div>
    </>
  );
};

export default RocketCursor;
