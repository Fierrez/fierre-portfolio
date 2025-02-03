"use client";



import gsap from "gsap";
import { useEffect, useState } from "react";
import Particles from "../components/Particles";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import PropTypes from "prop-types";
import useParticles from "../components/useParticles";
import BoxLine from "../components/BoxLine";
import useGridSize from "../components/useGridSize";
import CustomCursor from "../components/CustomCursor";
import { SignOut } from "@phosphor-icons/react";

// Twinkling Star
import StarrySky from "../components/StarrySky";
import { Outlet } from "react-router-dom";


const Layout = ({ children, className }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 7099); // 7 seconds
  }, []);

  // particle
  useParticles("custom-scrollbar");
  useParticles("hover-particle");

  // draggable
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    });
  };

  // handling responsive position
  useEffect(() => {
    const handleResize = () => {
      if (isFullscreen) {
        setPosition({ top: 0, left: 0 }); // revert position
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, isFullscreen]);

  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (isDragging) {
        setPosition({
          top: e.clientY - offset.y,
          left: e.clientX - offset.x,
        });
      }
    };

    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("mouseup", handleMouseUpGlobal);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [isDragging, offset]);

  // noise (grainy)

  useEffect(() => {
    const noiseEffect = document.querySelector(".noise-effect");
    gsap.to(noiseEffect, {
      duration: 0.5,
      x: "+=10",
      y: "+=10",
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  // console.log(token)

  const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
  // console.log(decodedToken);

  if (token) {
    localStorage.setItem("user", JSON.stringify(decodedToken));
    localStorage.setItem("token", token);

    // console.log(token);
    // console.log(decodedToken);
    // console.log(JSON.stringify(decodedToken));

    // delete token parameter
    window.history.replaceState({}, "", window.location.pathname);
  }

  const handleActiveTab = (path) => {
    return location.pathname == path ? "bg-half-white text-secondary " : "";
  };

  console.log(isFullscreen);

  // use this to get the grid size, and handle laggy performance, before i fix this the columns and  rows value is customizeable and that make the page laggy
  const { columns, rows } = useGridSize();

  return (
    <>
      {!isLoading && (
        <div
          className=" h-screen 


          bg-[#3b3b3b]
          relative flex justify-center items-center overflow-x-hidden overflow-y-hidden "
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (
              e.ctrlKey &&
              e.shiftKey &&
              (e.key === "I" || e.key === "J" || e.key === "C")
            ) {
              e.preventDefault();
            }
          }}
        >
          <CustomCursor />

          <BoxLine
            boxSize={55}
            color="#898989"
            opacity={0.1}
            columns={columns}
            rows={rows}
          />

          {/* particles */}
          <div className="hidden lg:block">
            <Particles quantity={500} size={0.4} vx={0.1} vy={0.1} />
          </div>

          {/* Twinnkle Star*/}
          <div className="hidden lg:block">
            <StarrySky />
          </div>
          
          {/* grainy effects */}
          <div
            className={`hidden lg:block  fixed h-[300%] w-[300%] bg-grain-noise opacity-5 animate-grain pointer-events-none top-0`}
            aria-hidden="true"
          />

          <motion.div
            initial={{ y: 100 }}
            animate={{
              y: [100, -10, 0, -10, 0, -5, 0, -3, 0, -1, 0],
            }}
            transition={{ duration: 10, ease: "easeInOut" }}
            className={`z-30  flex flex-col  
              ${
                isFullscreen
                  ? "lg:h-dvh lg:w-dvw lg:rounded-none"
                  : "lg:h-[75dvh] lg:w-[70dvw]"
              }
 bg-[#131313] m-auto relative overflow-hidden lg:rounded-[2vh] bg-gradient-to-tr from-[#090909] to-[#252525]`}
            // className="z-30 h-dvh w-dvw flex flex-col overflow-hidden text-[#898989]/90 lg:h-[75dvh] lg:w-[70dvw] animate-wave-shadow lg:rounded-xl bg-gradient-to-tr from-[#080808] to-[#242424]"
            // shadow
            style={{
              userSelect: "none",

              position: "absolute",
              top: position.top,
              left: position.left,
              bottom: 0,
              right: 0,
              boxShadow:
                "0px 0px 0px 1px rgba(165, 165, 165, 0.04), -9px 9px 9px -0.5px rgba(0, 0, 0, 0.04), -18px 18px 18px -1.5px rgba(0, 0, 0, 0.08), -37px 37px 37px -3px rgba(0, 0, 0, 0.16), -75px 75px 75px -6px rgba(0, 0, 0, 0.24), -150px 150px 150px -12px rgba(0, 0, 0, 0.48)",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
              // className="absolute top-0 right-0 left-0"
            >
              {/* Top nAv */}
              <nav
                className=" flex border-none border-[#282828] justify-between items-center p-2
             
           
          "
                onMouseDown={(e) => {
                  if (!isFullscreen) {
                    handleMouseDown(e);
                  }
                }}
                style={{
                  cursor: isDragging ? "grabbing" : "grab",
                }}
              >
                <div className="flex gap-2 items-center ">
                  <img
                    src="/profileicon.png"
                    className="w-11 p-2 hover:bg-[#191919] hover:rounded-xl duration-300 rounded-md cursor-pointer hover-particle"
                    draggable="false"
                    alt=""
                    onClick={() => {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                        setIsFullscreen(false);
                      } else {
                        setIsFullscreen(true);
                        document.documentElement.requestFullscreen();
                      }
                    }}
                  />

                  {user && (
                    <Link className="" to={"/logout"}>
                      <SignOut
                        size={32}
                        className="w-7 h-7 p-1.5 hover:bg-[#2e2e2e] hover:text-white bg-white text-[#191919] hover:rounded-xl duration-300 rounded-full cursor-pointer hover-particle"
                        weight="bold"
                      />
                    </Link>
                  )}
                </div>

                <Link
                  to={"/"}
                  className="hover-particle items-center text-center text-md text-primary"
                >
                  Fierre's Portfolio
                </Link>

                <div>
                  <div className="flex items-center absolute top-[10px] right-0 ">
                    <a
                      href="https://github.com/Fierrez"
                      target="_blank"
                      rel="noreferrer"
                      className="z-100"
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        className="w-10 mr-2 invert hover:bg-[#dadada] hover:rounded-xl duration-300 rounded-md p-2 hover-particle"
                        alt=""
                      />
                    </a>
                    <a
                      href="https://discordapp.com/users/1021660374732378162"
                      target="_blank"
                      rel="noreferrer"
                      className="z-100"
                    >
                      <img
                        src="/discord.png"
                        className="w-10 mr-2 invert hover:bg-[#dadada] hover:rounded-xl duration-300 rounded-md p-2 hover-particle"
                        alt=""
                      />
                    </a>
                    <a
                      href="https://www.tiktok.com/@fei.ye.er"
                      target="_blank"
                      rel="noreferrer"
                      className="z-100"
                    >
                      <img
                        src="/tik-tok.png"
                        className="w-10 mr-2 invert hover:bg-[#dadada] hover:rounded-xl duration-300 rounded-md p-2 hover-particle"
                        alt=""
                      />
                    </a>
                  </div>
                  <img
                    src="/profileicon.png"
                    className="w-11 cursor pointer-events-none opacity-0 -z-50 "
                    alt=""
                  />
                </div>
              </nav>
            </motion.div>

            <div
              className={`${className} relative flex-1 overflow-y-auto  custom-scrollbar`}
            >
              {children}
            </div>

            <nav className="flex flex-col gap-1 border-[#282828] text-primary px-4 py-4">
              <div className="flex justify-start items-center gap-1">
                <div className="w-1 h-4 bg-half-white"></div>
                <svg
                  className=" h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="6" x2="6" y1="3" y2="15"></line>
                  <circle cx="18" cy="6" r="3"></circle>
                  <circle cx="6" cy="18" r="3"></circle>
                  <path d="M18 9a9 9 0 0 1-9 9"></path>
                </svg>
                <p className="text-sm">master</p>
              </div>

              <div className="bg-gradient-to-t from-[#090909] to-[#1f1f1f]/10 absolute inset-x bottom-0 z-10"></div>

              <div className="flex justify-between">
                <div className="flex  justify-start gap-2 ">
                  <Link
                    className=" text-sm bg-half-white text-secondary px-2"
                    to={"/"}
                  >
                    mingw64
                  </Link>
                  <Link
                    className={`${handleActiveTab(
                      "/"
                    )} text-sm hover-particle px-2`}
                    to={"/"}
                  >
                    Home
                  </Link>
                  <Link
                    className={`${handleActiveTab(
                      "/guestbook"
                    )} text-sm hover-particle truncate  px-2`}
                    to={"/guestbook"}
                  >
                    guest-book
                  </Link>

                  <Link
                    className={`${handleActiveTab(
                      "/Projects"
                    )} text-sm hover-particle  px-2`}
                    to={"/Projects"}
                  >
                    Projects
                  </Link>

                  <Link
                    className={`${handleActiveTab(
                      "/Social"
                    )} text-sm hover-particle  px-2`}
                    to={"/Social"}
                  >
                    Social
                  </Link>

                  <Link
                    className={`${handleActiveTab(
                      "/services"
                    )} text-sm hover-particle  px-2`}
                    to={"/services"}
                  >
                    Services
                  </Link>

                </div>

                <div className="hidden md:block flex items-end justify-end">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 10, repeatType: "reverse" }}
                    className="flex items-center text-[12px] gap-1 text-sm"
                  >
                    footer left
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      )
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
};

/**
 * a home page container component that displays a centered header with the
 * developer's name and a link to their email address.
 *
 * @returns {React.ReactElement} The home page container element.
 */
// const HomeContainer = () => {
//   return (
//     <section className="h-screen bg-black">
//       <div className="container mx-auto h-full flex justify-center items-center">
//         <div className="text-center">
//           <h1 className="text-6xl font-bold text-white">Nabildzr</h1>
//           <p className="text-2xl text-white mt-5">Frontend Developer</p>
//           <a
//             href="mailto:nabildzr@gmail.com"
//             className="bg-white text-black px-8 py-3 rounded-full mt-10"
//           >
//             Hire Me
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

Layout.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};

export default Layout;
