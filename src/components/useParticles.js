import { useEffect } from "react";

const useParticles = (selector) => {
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.classList.contains(selector)) {
        createParticles(e.clientX, e.clientY);
      }
    };

    const createParticles = (x, y) => {
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${x + Math.random() * 50 - 25}px`;
        particle.style.top = `${y + Math.random() * 50 - 25}px`;
        particle.style.animationDelay = `${Math.random() * 1}s`;
        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 1000 + Math.random() * 1500);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [selector]);
};

export default useParticles;