import { useEffect, useState } from "react";
import anime from "animejs";
import PropTypes from "prop-types";
import "../index.css";

const CelestialSky = ({
  numStars = 80,
  numComets = 10,
  numSatellites = 10,
  cometTrailScale = 1, // multiply trail sizes/blur; pass 10 for ~10x larger
}) => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // create arrays for items
  // stars start off-screen to the left so they travel left->right
  const stars = Array.from({ length: numStars }).map(() => ({
    // place the circle itself somewhere within the viewport and use translateX
    // to move it from an off-screen start to the far right. This avoids using
    // negative `cx` which can cause rendering/transform issues in some cases.
    cx: Math.random() * viewport.width,
    startX: -(Math.random() * 300 + 20), // translate start offset (px)
    y: Math.random() * viewport.height,
    r: Math.random() * 1.2 + 0.4,
    alpha: Math.random() * 0.9 + 0.1,
    duration: Math.random() * 8000 + 8000,
    delay: Math.random() * 5000,
  }));

  const comets = Array.from({ length: numComets }).map((_, i) => {
    const motion = ["ltr", "rtl", "arc-up", "arc-down", "top-right"][Math.floor(Math.random() * 5)];
    const length = Math.random() * 180 + 200;
    const delay = i * 1000 + Math.random() * 2000;
    const duration = Math.random() * 4000 + 3000;
    // if motion is 'top-right', start slightly above the viewport so it comes from the top
    const startY = motion === "top-right" ? -(Math.random() * 200 + 20) : Math.random() * viewport.height;
    const endY = Math.random() * viewport.height;
    const arcHeight = Math.random() * 180 + 60;
    let startX;
    let endX;
    if (motion === "ltr") {
      startX = -(Math.random() * 400 + 200);
      endX = viewport.width + 600;
    } else if (motion === "rtl") {
      startX = viewport.width + (Math.random() * 400 + 200);
      endX = -600;
    } else if (motion === "top-right") {
      startX = viewport.width + (Math.random() * 200 + 100);
      endX = -600;
    } else {
      // arc-up / arc-down: default left->right for variety
      startX = -(Math.random() * 400 + 200);
      endX = viewport.width + 600;
    }

    return {
      id: `comet-${i}`,
      motion,
      length,
      delay,
      duration,
      startY,
      endY,
      arcHeight,
      startX,
      endX,
    };
  });

  const satellites = Array.from({ length: numSatellites }).map((_, i) => {
    const motion = ["ltr", "rtl", "arc-up", "arc-down"][Math.floor(Math.random() * 4)];
    const startY = Math.random() * viewport.height;
    const endY = Math.random() * viewport.height;
    const arcHeight = Math.random() * 120 + 30;
    let startX, endX;
    if (motion === "ltr") {
      startX = -(Math.random() * 400 + 100);
      endX = viewport.width + 500;
    } else if (motion === "rtl") {
      startX = viewport.width + (Math.random() * 400 + 100);
      endX = -500;
    } else {
      startX = -(Math.random() * 400 + 100);
      endX = viewport.width + 500;
    }

    return {
      id: `sat-${i}`,
      motion,
      startY,
      endY,
      arcHeight,
      delay: i * 1200 + Math.random() * 1200,
      duration: Math.random() * 8000 + 6000,
      startX,
      endX,
    };
  });

  useEffect(() => {
    let mounted = true;
    // animate stars individually (allow varied motion types)
    anime.remove(".celest-star");
    const starEls = Array.from(document.querySelectorAll(".celest-star"));
    stars.forEach((s, i) => {
      const el = starEls[i];
      if (!el) return;
      // random small vertical wobble or arc
      const motion = Math.random() > 0.8 ? "arc" : "linear";
      let translateY;
      if (motion === "arc") {
        translateY = [s.y, s.y - (Math.random() * 40 + 10), s.y];
      } else {
        translateY = [s.y, s.y + (Math.random() - 0.5) * 20];
      }

      // place initial transform offscreen
      el.style.transform = `translate(${s.startX}px, ${s.y}px)`;
      el.style.opacity = `${s.alpha * 0.2}`;

      anime({
        targets: el,
        translateX: [s.startX, viewport.width + 400],
        translateY,
        opacity: [0.1, 1, 0.1],
        easing: "linear",
        duration: s.duration,
        delay: s.delay,
        loop: true,
      });
    });

    // animate comets (one instance per comet so each can use its own path/direction)
    anime.remove(".celest-comet");
    const cometEls = Array.from(document.querySelectorAll(".celest-comet"));
    comets.forEach((c, i) => {
      const el = cometEls[i];
      if (!el) return;
      // Y path is handled by the motion SVG path (anime.path)

      // set initial opacity
      el.style.opacity = "0";
      // use motion path defined in a hidden SVG below
      const pathSelector = `#motionPath-comet-${i}`;
      const pathFn = anime.path(pathSelector);

      // recursive runner so we can occasionally flip direction mid-flight
      const runComet = (dir = 'normal') => {
        anime({
          targets: el,
          translateX: pathFn('x'),
          translateY: pathFn('y'),
          rotate: pathFn('angle'),
          opacity: [0, 1, 0],
          easing: 'linear',
          duration: c.duration,
          delay: c.delay,
          autoplay: true,
          loop: false,
          direction: dir,
          complete: () => {
            // 25% chance to flip direction next run
            const flip = Math.random() < 0.25;
            const nextDir = flip ? (dir === 'normal' ? 'reverse' : 'normal') : 'normal';
            // small random rest before next launch
            const t = setTimeout(() => {
              if (!mounted) return;
              runComet(nextDir);
            }, Math.random() * 1500);
            // store timeout on element so we can clear it if needed
            el._satTimeout = t;
          },
        });
      };

      runComet();
    });

    // animate satellites (slow traverse across the sky)
    // Use one anime instance per satellite so each element loops independently
    anime.remove(".celest-sat");
    const satEls = Array.from(document.querySelectorAll(".celest-sat"));
    satellites.forEach((sat, i) => {
      const el = satEls[i];
      if (!el) return;
      // Y path is handled by the motion SVG path (anime.path)

      el.style.opacity = '0';
      const pathSelector = `#motionPath-sat-${i}`;
      const pathFn = anime.path(pathSelector);

      const runSat = (dir = 'normal') => {
        anime({
          targets: el,
          translateX: pathFn('x'),
          translateY: pathFn('y'),
          rotate: pathFn('angle'),
          opacity: [0, 1, 0],
          easing: 'linear',
          duration: sat.duration,
          delay: sat.delay,
          autoplay: true,
          loop: false,
          direction: dir,
          complete: () => {
            // 12% chance to flip direction next run
            const flip = Math.random() < 0.12;
            const nextDir = flip ? (dir === 'normal' ? 'reverse' : 'normal') : 'normal';
            const t = setTimeout(() => {
              if (!mounted) return;
              runSat(nextDir);
            }, Math.random() * 2000);
            el._satTimeout = t;
          },
        });
      };

      runSat();
      // add a small independent random rotation to the inner group so satellites
      // appear to tumble/rotate randomly while following their motion path
      try {
        // small inner tumble (alternate subtle rotation)
        const inner = el.querySelector('.sat-inner');
        if (inner) {
          const a = (Math.random() * 40) - 20; // -20..20
          const b = (Math.random() * 60) - 30; // -30..30
          const dur = Math.random() * 3000 + 2000;
          anime({
            targets: inner,
            rotate: [a, b],
            duration: dur,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
            autoplay: true,
            transformOrigin: 'center',
          });
        }

        // continuous spin of the whole satellite while it travels
        const spin = el.querySelector('.sat-spin');
        if (spin) {
          const spinDur = Math.random() * 4000 + 3000; // 3-7s per rotation
          anime({
            targets: spin,
            rotate: '+=360',
            duration: spinDur,
            easing: 'linear',
            loop: true,
            autoplay: true,
            transformOrigin: 'center',
          });
        }
      } catch {
        // ignore
      }
    });

    // --- collision detection / crash handling ---
    let rafId = null;
    const collisionThreshold = 18; // pixels, adjust sensitivity

    const getCenter = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
    };

    const handleCrash = (a, b) => {
      if (a.dataset.crashed || b.dataset.crashed) return;
      a.dataset.crashed = "1";
      b.dataset.crashed = "1";

      // stop their path animations and any scheduled restarts
      anime.remove(a);
      anime.remove(b);
      if (a._satTimeout) clearTimeout(a._satTimeout);
      if (b._satTimeout) clearTimeout(b._satTimeout);

      // simple crash: scale up and fade out, then hide
      anime.timeline({ easing: 'easeOutQuad' })
        .add({
          targets: [a, b],
          scale: [1, 1.6],
          opacity: [1, 0],
          duration: 600,
          complete: () => {
            try {
              a.style.display = 'none';
              b.style.display = 'none';
            } catch (e) { void e; }
          },
        });

      // tiny particle burst (SVG circles appended to body)
      const pos = getCenter(a);
      for (let i = 0; i < 8; i++) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.setAttribute('r', '1.5');
        p.setAttribute('fill', 'rgba(255,200,0,0.95)');
        p.style.position = 'absolute';
        p.style.left = `${pos.x}px`;
        p.style.top = `${pos.y}px`;
        p.style.pointerEvents = 'none';
        document.body.appendChild(p);
        anime({
          targets: p,
          translateX: (Math.random() - 0.5) * 60,
          translateY: (Math.random() - 0.5) * 60,
          opacity: [1, 0],
          duration: 600 + Math.random() * 400,
          easing: 'easeOutQuad',
          complete: () => p.remove(),
        });
      }
    };

    const collisionLoop = () => {
      const els = Array.from(document.querySelectorAll('.celest-sat')).filter(el => el.offsetParent !== null && !el.dataset.crashed);
      for (let i = 0; i < els.length; i++) {
        for (let j = i + 1; j < els.length; j++) {
          const a = els[i];
          const b = els[j];
          const A = getCenter(a);
          const B = getCenter(b);
          const dx = A.x - B.x;
          const dy = A.y - B.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = (Math.max(A.w, A.h) + Math.max(B.w, B.h)) / 4;
          if (dist < Math.max(collisionThreshold, radius)) {
            handleCrash(a, b);
          }
        }
      }
      rafId = requestAnimationFrame(collisionLoop);
    };

    // start collision loop
    rafId = requestAnimationFrame(collisionLoop);

    return () => {
      // prevent scheduling new runs
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      anime.remove(".celest-star");
      anime.remove(".celest-comet");
      anime.remove(".celest-sat");
      // remove inner-group rotation animations and continuous spin
      anime.remove('.sat-inner');
      anime.remove('.sat-spin');
      // clear any scheduled timeouts on comet/sat elements
      const all = Array.from(document.querySelectorAll('.celest-comet, .celest-sat'));
      all.forEach((el) => {
        if (el._satTimeout) clearTimeout(el._satTimeout);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.width, viewport.height]);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 w-full h-full"
      aria-hidden
    >
      <svg className="w-full h-full" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle
            key={i}
            className="celest-star"
            cx={s.cx}
            cy={s.y}
            r={s.r}
            fill={`rgba(255,0,0,${s.alpha})`} // red stars
          />
        ))}
      </svg>

      {/* comets: rendered as inline SVG (head + gradient trail) */}
      <div>
        {comets.map((c, idx) => (
          <svg
            key={c.id}
            className="celest-comet"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
              overflow: "visible",
              transformOrigin: "left center",
              transform: `translate(${c.startX}px, ${c.startY}px)`,
              opacity: 0,
            }}
            width={c.length + 20}
            height={16}
            viewBox={`-${c.length + 10} -8 ${c.length + 40} 16`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`trail-grad-${idx}`} x1="0" x2="1">
                {/* brighter, warmer cyan trail */}
                  <stop offset="0%" stopColor="#8BE9FF" stopOpacity="1" />
                  <stop offset="50%" stopColor="#8BE9FF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8BE9FF" stopOpacity="0" />
              </linearGradient>
              <filter
                id={`glow-${idx}`}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                {/* stronger blur for a brighter trail; scaled by cometTrailScale */}
                <feGaussianBlur stdDeviation={12 * cometTrailScale} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

              {/* trail (bloom layer + core) */}
            <path
              d={`M ${-c.length} 0 L 0 0`}
              stroke={`url(#trail-grad-${idx})`}
              strokeWidth={18 * cometTrailScale}
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
              filter={`url(#glow-${idx})`}
            />
            <path
              d={`M ${-c.length} 0 L 0 0`}
              stroke={`url(#trail-grad-${idx})`}
              strokeWidth={8 * cometTrailScale}
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
              filter={`url(#glow-${idx})`}
            />
            <path
              d={`M ${-c.length} 0 L 0 0`}
              stroke={`url(#trail-grad-${idx})`}
              strokeWidth={4 * cometTrailScale}
              strokeLinecap="round"
              fill="none"
              opacity="1"
            />

            {/* head */}
            <circle
              cx={0}
              cy={0}
              r={4}
              fill="#8BE9FF" // brighter cyan comet head
              filter={`url(#glow-${idx})`}
            />
          </svg>
        ))}
      </div>

      {/* satellites: small rectangular elements */}
      <div>
        {satellites.map((s, i) => (
          <svg
            key={s.id}
            className="celest-sat"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
              overflow: "visible",
              color: "rgba(255,215,0,0.95)", // sets currentColor for stroke/fill
              width: 28,
              height: 28,
              transformOrigin: "center",
              transform: `translate(${s.startX}px, ${s.startY}px)`, // place at its randomized start immediately
              opacity: 0, // start hidden until its delay fires
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="sat-spin" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
              <g className="sat-inner" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
            {/* cycle through a few satellite icon variants */}
            {i % 4 === 0 && (
              <>
                <rect x="9" y="9" width="6" height="6" rx="1" />
                <path d="M2 10h7v4H2z" />
                <path d="M15 10h7v4h-7z" />
                <path d="M5.5 10v4" strokeWidth="1" opacity="0.5" />
                <path d="M18.5 10v4" strokeWidth="1" opacity="0.5" />
                <path d="M12 9V6" />
                <circle cx="12" cy="5" r="1" fill="currentColor" />
              </>
            )}
            {i % 4 === 1 && (
              <>
                <rect x="7" y="10" width="10" height="4" rx="1" />
                <path d="M12 10V5h7v5h-7z" />
                <path d="M12 14v5h-7v-5h7z" />
                <path d="M5 12a7 7 0 0 1 0-4" />
                <path d="M3 10l2 0" />
              </>
            )}
            {i % 4 === 2 && (
              <>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9V3" />
                <rect x="9" y="3" width="6" height="2" rx="0.5" />
                <path d="M12 15v6" />
                <rect x="9" y="19" width="6" height="2" rx="0.5" />
                <path d="M9 12H6" />
                <path d="M15 12h3" />
              </>
            )}
            {i % 4 === 3 && (
              <>
                <rect x="10" y="10" width="4" height="4" rx="0.5" />
                <path d="M10 10L4 4" />
                <rect x="2" y="2" width="4" height="4" rx="0.5" transform="rotate(-45 4 4)" />
                <path d="M14 14l6 6" />
                <rect x="18" y="18" width="4" height="4" rx="0.5" transform="rotate(-45 20 20)" />
                <path d="M14 10l6-6" />
                <rect x="18" y="2" width="4" height="4" rx="0.5" transform="rotate(45 20 4)" />
                <path d="M10 14l-6 6" />
                <rect x="2" y="18" width="4" height="4" rx="0.5" transform="rotate(45 4 20)" />
              </>
            )}
              </g>
            </g>
          </svg>
        ))}
      </div>
        {/* hidden motion paths used for smooth bezier motion via anime.path */}
        <svg
          width={viewport.width}
          height={viewport.height}
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
          aria-hidden
        >
          {comets.map((c, i) => {
            const cp1x = c.startX + (c.endX - c.startX) * 0.25;
            const cp2x = c.startX + (c.endX - c.startX) * 0.75;
            const sign = c.motion === "arc-up" ? -1 : 1;
            const cp1y = c.startY + sign * c.arcHeight;
            const cp2y = c.endY + sign * c.arcHeight;
            const d = `M ${c.startX} ${c.startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${c.endX} ${c.endY}`;
            return <path key={`mpc-${i}`} id={`motionPath-comet-${i}`} d={d} fill="none" stroke="none" />;
          })}

          {satellites.map((s, i) => {
            const cp1x = s.startX + (s.endX - s.startX) * 0.25;
            const cp2x = s.startX + (s.endX - s.startX) * 0.75;
            const sign = s.motion === "arc-up" ? -1 : 1;
            const cp1y = s.startY + sign * s.arcHeight;
            const cp2y = s.endY + sign * s.arcHeight;
            const d = `M ${s.startX} ${s.startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${s.endX} ${s.endY}`;
            return <path key={`mps-${i}`} id={`motionPath-sat-${i}`} d={d} fill="none" stroke="none" />;
          })}
        </svg>
    </div>
  );
};

CelestialSky.propTypes = {
  numStars: PropTypes.number,
  numComets: PropTypes.number,
  numSatellites: PropTypes.number,
  cometTrailScale: PropTypes.number,
};

export default CelestialSky;
