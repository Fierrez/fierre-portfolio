import  { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [outlinePos, setOutlinePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // track cursor position
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // use requestAnimationFrame to continuously update outline position
    let animationFrameId;
    const animateOutline = () => {
      setOutlinePos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(animateOutline);
    };
    animationFrameId = requestAnimationFrame(animateOutline);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
    // no dependencies, so this effect runs once and keeps animating
  }, [position]);

  return (
    <>
      {/* main Cursor Circle */}
      <div
        className="pointer-events-none fixed z-[99999]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-3 h-3 bg-white hover:bg-black rounded-full" />
      </div>

      {/* outline (large circle) */}
      <div
        className="pointer-events-none fixed z-[99998]"
        style={{
          left: outlinePos.x,
          top: outlinePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-12 h-12 border border-white rounded-full" />
      </div>
    </>
  );
};

export default CustomCursor;