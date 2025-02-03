import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ScrambledText = ({ text, speed = 100, scrambleSpeed = 30, onComplete, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const characters = text;

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;

    const scrambleLetter = (targetLetter, index) => {
      let scrambleCount = 0;
      const interval = setInterval(() => {
        if (scrambleCount > 5) {
          currentText = currentText.substring(0, index) + targetLetter + currentText.substring(index + 1);
          setDisplayedText(currentText);
          clearInterval(interval);
          if (index === text.length - 1 && onComplete) {
            onComplete();
          }
        } else {
          const randomChar = characters[Math.floor(Math.random() * characters.length)];
          currentText = currentText.substring(0, index) + randomChar + currentText.substring(index + 1);
          setDisplayedText(currentText);
          scrambleCount++;
        }
      }, scrambleSpeed);
    };

    const typeLetter = () => {
      if (currentIndex < text.length) {
        scrambleLetter(text[currentIndex], currentIndex);
        currentIndex++;
        setTimeout(typeLetter, speed);
      }
    };

    typeLetter();
  }, [text, speed, scrambleSpeed, characters, onComplete]);

  return (
    <h1  className={className}>
      {displayedText}
    </h1>
  );
};

ScrambledText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  speed: PropTypes.number,
  scrambleSpeed: PropTypes.number,
  onComplete: PropTypes.func,
};

export default ScrambledText;