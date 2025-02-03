import { useState, useEffect } from "react";
import anime from "animejs";
import "../index.css"; // Import styles

const StarrySky = () => {
  const [numStars, setNumStars] = useState(60);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const randomRadius = () => Math.random() * 0.7 + 0.6;
  const getRandomX = () => Math.floor(Math.random() * viewport.width);
  const getRandomY = () => Math.floor(Math.random() * viewport.height);

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    anime({
      targets: "#sky .star",
      opacity: [{ duration: 700, value: 0 }, { duration: 700, value: 1 }],
      easing: "linear",
      loop: true,
      delay: (_, i) => 50 * i,
    });

    anime({
      targets: "#shootingstars .wish",
      easing: "linear",
      loop: true,
      delay: (_, i) => 1000 * i,
      opacity: [{ duration: 700, value: 1 }],
      width: [{ value: "150px" }, { value: "0px" }],
      translateX: 350,
    });
  }, []);

  return (
    <div id="starry-background">
      <svg id="sky">
        {[...Array(numStars)].map((_, i) => (
          <circle
            key={i}
            cx={getRandomX()}
            cy={getRandomY()}
            r={randomRadius()}
            fill="white"
            className="star"
          />
        ))}
      </svg>
      <div id="shootingstars">
        {[...Array(numStars)].map((_, i) => (
          <div
            key={i}
            className="wish"
            style={{ left: `${getRandomX()}px`, top: `${getRandomY()}px` }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarrySky;
