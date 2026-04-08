import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

// default charset for scrambling (letters, numbers and some symbols)
const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?~";

const ScrambledText = ({
  text,
  speed = 100,
  scrambleSpeed = 30,
  onComplete,
  className = "",
  charset = DEFAULT_CHARSET,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const intervalsRef = useRef([]);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    let cancelled = false;
    let currentText = Array.from(text).map(() => " ").join("");
    let currentIndex = 0;

    const scrambleLetter = (targetLetter, index) => {
      let scrambleCount = 0;
      const interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval);
          return;
        }
        if (scrambleCount > 5) {
          currentText =
            currentText.substring(0, index) + targetLetter + currentText.substring(index + 1);
          setDisplayedText(currentText);
          clearInterval(interval);
          if (index === text.length - 1 && onComplete) {
            onComplete();
          }
        } else {
          const randomChar = charset[Math.floor(Math.random() * charset.length)];
          currentText =
            currentText.substring(0, index) + randomChar + currentText.substring(index + 1);
          setDisplayedText(currentText);
          scrambleCount++;
        }
      }, scrambleSpeed);
      intervalsRef.current.push(interval);
    };

    const typeLetter = () => {
      if (cancelled) return;
      if (currentIndex < text.length) {
        scrambleLetter(text[currentIndex], currentIndex);
        currentIndex++;
        const t = setTimeout(typeLetter, speed);
        timeoutsRef.current.push(t);
      }
    };

    // initialize displayed text with spaces to avoid undefined behavior
    setDisplayedText(currentText);
    typeLetter();

    return () => {
      cancelled = true;
      // clear intervals and timeouts
      intervalsRef.current.forEach((id) => clearInterval(id));
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      intervalsRef.current = [];
      timeoutsRef.current = [];
    };

  }, [text, speed, scrambleSpeed, charset, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

ScrambledText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  speed: PropTypes.number,
  scrambleSpeed: PropTypes.number,
  onComplete: PropTypes.func,
  charset: PropTypes.string,
};

export default ScrambledText;