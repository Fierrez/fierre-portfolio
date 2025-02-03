import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrambledText from "./ScrambledText";

const Preloader = () => {
  const [firstTextDone, setFirstTextDone] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const handleFirstTextComplete = () => {
    setFirstTextDone(true);
    setIsTextVisible(false);
  };

  useEffect(() => {
    if (firstTextDone) {
      const timer = setTimeout(() => {
        setShowSecondText(true);
        setIsTextVisible(false);
      }, 100); // delay before showing second text
      return () => clearTimeout(timer);
    }
  }, [firstTextDone]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000); // show preloader for 7 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          onContextMenu={(e) => e.preventDefault()}
          className=" flex items-center justify-center min-h-screen bg-black text-white flex-col absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <h1
            className={`text-2xl md:text-4xl font-bold text-center ${
              isTextVisible ? "block" : "hidden"
            }`}
          >
            <ScrambledText
              text="Welcome"
              speed={20}
              scrambleSpeed={500}
              onComplete={handleFirstTextComplete}
            />
          </h1>

          {showSecondText && (
            <motion.h1
              className="text-2xl md:text-4xl font-bold text-center mt-4 flex gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <ScrambledText text="Almost there" speed={20} scrambleSpeed={1} />
              <motion.div
                className="flex mt-6"
                initial={{ y: 0 }}
                animate={{
                  y: [0, -3, 3, -3, 0, 1, -1, 1, -1, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white rounded-full mr-2"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  ></motion.div>
                ))}
              </motion.div>
            </motion.h1>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
