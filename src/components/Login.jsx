


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import NavSub from "./NavSub";



/**
 * The Login component is a form that allows users to log in to the application.
 * However, this feature has been moved directly to the GuestBook component.
 */



const Login = () => {
  const images = [
    "https://i.pinimg.com/736x/24/63/93/2463933845278c3cb022f154c791a5d7.jpg",
    "https://i.pinimg.com/736x/7b/f0/62/7bf0624ca59083e2139c56020551b7dd.jpg",
    "https://i.pinimg.com/736x/6e/d2/d2/6ed2d2e3a4e02fc403faef5b26e3b82c.jpg",
    "https://i.pinimg.com/736x/99/da/2e/99da2eabe8d81779e9aa4a0dc39739be.jpg",
    "https://i.pinimg.com/736x/db/05/1d/db051d424e08192067497a52c5ab2a03.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("register") === "true") {
      Swal.fire({
        title: "Register Berhasil",
        text: "Silahkan login",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        window.history.replaceState({}, '', window.location.pathname);
      });
    }
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      Swal.fire({
        title: "Already Logged In",
        text: "You are already logged in. Redirecting to home page...",
        icon: "info",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      console.log(response);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        Swal.fire({
          title: "Login failed",
          text: "User data is missing in the response",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Login failed",
        text: error.response ? error.response.data.message : error.message,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavSub page="Login" black={false}/>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}

      
      className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
        <div className="flex bg-[#E4E4E7] rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
          <div
            className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
            style={{
              backgroundImage: `url(${images[currentImage]})`,
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <div className="flex items-center justify-between">
              <p className="text-xl text-gray-600">Welcome back!</p>
              <Link to="/">
                <button className="text-gray-600 hover:text-blue-700 focus:outline-none">
                  &larr; Kembali
                </button>
              </Link>
            </div>
            <div>
              <p className="text-gray-500 text-sm mt-2">
                * Username harus sesuai dengan yang anda registerkan, seperti abjad kapital, spasi, dan simbol lainnya
              </p>
              
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                </div>
                <input
                  className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-between mt-2">
                  <label className="text-xs text-gray-500 ">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-xs text-gray-900 underline"
                    >
                      Register here
                    </Link>
                  </label>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-gray-900 cursor-not-allowed"
                  >
                    Forget Password?
                  </a>
                </div>
              </div>
              <div className="mt-8">
                <motion.button
                  type="submit"
                  className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                  disabled={loading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  {loading ? "Loading..." : "Login"}
                </motion.button>
              </div>
            </form>
            <a
              href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
              className="flex items-center justify-center mt-4 text-black rounded-lg shadow-md hover:bg-gray-100"
            >
              <div className="flex px-5 justify-center w-full py-3">
                <div className="min-w-[30px]">
                  <svg className="h-6 w-6" viewBox="0 0 40 40">
                    <path
                      d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                      fill="#FFC107"
                    />
                    <path
                      d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                      fill="#FF3D00"
                    />
                    <path
                      d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                      fill="#4CAF50"
                    />
                    <path
                      d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 30.8092 32.6708 31.3483 32.1717C35.6617 28.2925 36.6667 24.1667 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                      fill="#1976D2"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium ml-4">
                  Sign in with Google
                </span>
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
