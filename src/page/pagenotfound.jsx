import AOS from 'aos';
import {motion} from 'framer-motion'
import { useEffect } from 'react';

const PageNotFound = () => {

   useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);
  const asciiArt = `
    ___    _______     ___   
   /   )  (  __   )   /   )  
  / /) |  | (  )  |  / /) |  
 / (_) (_ | | /   | / (_) (_ 
(____   _)| (/ /) |(____   _)
     ) (  |   / | |     ) (  
     | |  |  (__) |     | |  
     (_)  (_______)     (_) 

  `;

  return (
    <motion.section
      data-aos="fade-up"
      data-aos-delay="100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-primary flex flex-col gap-4 h-full px-4 py-4 

    "
    >
      <pre className="gap-2 flex h-full flex-col items-center justify-center  whitespace-pre-wrap  ">
        <code className="text-[4dvw] md:text-[2dvw] leading-[0.9] tracking-[-0.1em] lg:text-[1.4dvh] select-none">
          {asciiArt}
        </code>

        <code className="text-center text-sm md:text-base px-2 md:px-0">
          <p>Page not found</p>
          <p>Sorry, the page you are looking for could not be found.</p>
        </code>
      </pre>
    </motion.section>
  );
};

export default PageNotFound;
