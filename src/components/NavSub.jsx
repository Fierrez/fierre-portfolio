import { motion } from "framer-motion";
import { Link,} from "react-router-dom";
import icon from "../assets/images/icon.png";
import PropTypes from "prop-types";



const NavSub = ({ page, black }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      className={`z-40 p-5 border-b-2 border-${
        black ? "hidden" : "slate-700"
      } fixed w-full bg-${
        black ? "transparent" : "white"
      }`}
    >
      <div className="container flex justify-between">
        <Link to={"/"}>
          <div className="flex">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              src={`${icon}`}
              className="w-10 h-10 bg-white rounded-full"
              alt="fingerprint-icon"
            />
            <div className="ml-6 flex justify-center content-center items-center gap-2">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={`text-3xl font-bold text-${black ? "white" : "black"} `}
              >
                Nabildzr
              </motion.h1>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-blue-600 text-3xl font-bold dark:text-blue-500 hidden md:block"
              >
                ~ {page}
              </motion.span>
            </div>
          </div>
        </Link>
        <div className="hidden lg:flex items-center ">
          <Link to={"/"} className={`bg-${black ? "white" : "black"} hover:bg-transparent text-${black ? "black" : "white"} hover:text-${black ? "white" : "black"} font-bold py-2 px-8 rounded-full border hover:border-${black ? "white" : "black"}`}>
            Back to Home
          </Link>
          
        </div>
      </div>
    </motion.header>
  );
};


NavSub.propTypes = {
  black: PropTypes.any,
  page: PropTypes.any,
}

export default NavSub;
