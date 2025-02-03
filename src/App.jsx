import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Preloader from "./components/Preloader";
import Hero from "./page/Hero";
import Layout from "./page/Layout";
import GuestBook from "./page/GuestBook";
import Logout from "./components/Logout";
import { useEffect } from "react";
import Swal from "sweetalert2";
import PageNotFound from "./page/pagenotfound";
import Projects from "./page/Projects";

function App() {
  /*
   * login validation notification
   */
  const url = new URL(window.location.href);
  const loginStatus = url.searchParams.get("login");
  const logoutStatus = url.searchParams.get("logout");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);

  useEffect(() => {
    if (loginStatus === "true") {
      Swal.fire({
        title: "Login Success",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        background: "#000000",
        color: "#fff",
      });
      // delete value
      url.searchParams.delete("login");

      // update url to newly
      window.history.replaceState({}, "", url);
    }
  }, [loginStatus]);

  useEffect(() => {
    if (logoutStatus === "true") {
      Swal.fire({
        title: "Logout Success",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        background: "#000000",
        color: "#fff",
      });

      // delete value
      url.searchParams.delete("logout");

      // update url to newly
      window.history.replaceState({}, "", url);
    }
  }, [logoutStatus]);

  // disable keyboard shortcuts inspect :D
  useEffect(() => {
    const handleKeyDown = (e) => {
      // prevent F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // prevent Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }
      // prevent Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }
      // prevent Ctrl+U
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  //
  //
  //
  //
  //
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout className="overflow-y-hidden">
                <Hero />
              </Layout>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/guestbook"
            element={
              <Layout>
                <GuestBook />
              </Layout>
            }
          />
          <Route
            path="/projects"
            element={
              <Layout>
                <Projects />
              </Layout>
            }
          />
          <Route
            path="/*"
            element={
              <Layout className={`overflow-y-hidden`}>
                <PageNotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
      <Preloader />
    </>
  );
}

export default App;
