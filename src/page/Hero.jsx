import { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const asciiArt = `

                                                                                 
  _|_|_|_|          _|      _|      _|              _|_|_|_|                      
  _|        _|_|              _|  _|    _|_|        _|        _|  _|_|  _|  _|_|  
  _|_|_|  _|_|_|_|  _|          _|    _|_|_|_|      _|_|_|    _|_|      _|_|      
  _|      _|        _|          _|    _|            _|        _|        _|        
  _|        _|_|_|  _|          _|      _|_|_|      _|_|_|_|  _|        _|        
                                                                                  
                                                                                  
 
`;

  return (
    <>
      <motion.section
        data-aos="fade-up"
        data-aos-delay="100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-primary flex flex-col gap-4 h-full px-4 py-4 

        "
      >
        <pre className="gap-2 flex h-full flex-col items-center justify-center  whitespace-pre-wrap md:space-y-5 ">
          <code className="text-[2dvw] leading-[0.9] tracking-[-0.1em] lg:text-[1.4dvh] select-none">
            {asciiArt}
          </code>

          <code className="text-center text-sm md:text-base px-2 md:px-0">
            <p className="">Currently diving into both front-end and back-end development </p>
            <p className="">

            </p>
          </code>
        </pre>
      </motion.section>
    </>
  );
};

export default Hero;
