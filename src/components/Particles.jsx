'use client'

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const Particles = ({ quantity = 500, size = 0.4, vx = 0.1, vy = 0.1 }) => {
  const circles = useRef([]);
  const rafID = useRef(null);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const context = useRef(null);
  const canvasSize = useRef({ w: 0, h: 0 });

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  const createCircleParams = () => {
    const { w, h } = canvasSize.current;
    return {
      x: Math.floor(Math.random() * w),
      y: Math.floor(Math.random() * h),
      translateX: 0,
      translateY: 0,
      size: Math.max(1, Math.floor(Math.random() * 2) + size),
      alpha: 0,
      targetAlpha: Number((Math.random() * 0.5 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2
    };
  };

  const drawCircle = (circle, update = false) => {
    const ctx = context.current;
    if (!ctx) return;

    ctx.save();
    ctx.translate(circle.translateX, circle.translateY);
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${circle.alpha})`;
    ctx.fill();
    ctx.restore();

    if (!update) circles.current.push(circle);
  };

  const initCanvas = () => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !container) return;

    // reset circles
    circles.current = [];

    // set canvas dimensions
    canvasSize.current = {
      w: container.offsetWidth,
      h: container.offsetHeight
    };

    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    context.current = ctx;

    // init particle generation
    for (let i = 0; i < quantity; i++) {
      const circle = createCircleParams();
      drawCircle(circle);
    }
  };

  const animate = () => {
    const ctx = context.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

    for (let i = circles.current.length - 1; i >= 0; i--) {
      const circle = circles.current[i];

      // calculate edge distances
      const edgeDistances = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size
      ];

      const closestEdge = Math.min(...edgeDistances);
      const alphaModifier = Math.max(Math.min(closestEdge / 20, 1), 0);

      // smooth alpha transition
      circle.alpha += alphaModifier > 0.5 ? (circle.alpha < circle.targetAlpha ? 0.02 : 0) : circle.targetAlpha * alphaModifier;

      // update position
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;

      drawCircle(circle, true);

      // replace out-of-bounds particles
      if (circle.x < -circle.size || circle.x > canvasSize.current.w + circle.size || circle.y < -circle.size || circle.y > canvasSize.current.h + circle.size) {
        circles.current.splice(i, 1);
        const newCircle = createCircleParams();
        drawCircle(newCircle);
      }
    }

    rafID.current = window.requestAnimationFrame(animate);
  };

  // effect for canvas initialization and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    initCanvas();
    animate();

    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafID.current != null) window.cancelAnimationFrame(rafID.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='cursor-none pointer-events-none w-dvw h-dvh absolute left-0 top-0 overflow-x-hidden overflow-y-hidden' ref={canvasContainerRef} aria-hidden='true'>
      <canvas ref={canvasRef} className='size-full' />
    </div>
  );
};

Particles.propTypes = {
  quantity: PropTypes.number,
  size: PropTypes.number,
  dpr: PropTypes.number,
  vx: PropTypes.number,
  vy: PropTypes.number
};

Particles.defaultProps = {
  quantity: 100,
  size: 1,
  dpr: window.devicePixelRatio || 1,
  vx: 0,
  vy: 0
};

export default Particles;