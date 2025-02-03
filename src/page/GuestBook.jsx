import axios from "axios";


import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CommentLine from "../components/commentLine";
import useParticles from "../components/useParticles";





const GuestBook = () => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [fetching, setFetching] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/comments`
      );
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  //   result:
  //   console.log(user)
  // {"id":"6776d046808ea42d601938ed","name":"Nabildzr","username":"ezvarlgvdg","email":"muhammadnbills@gmail.com","iat":1735840672,"exp":1735844272}

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments/create`,
        {
          username: user.name,
          content,
        },
        // we need this for post to the backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(user);
        Swal.fire({
          title: "Comment posted",
          text: "Your comment has been posted successfully",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
        setContent("");
        // refresh comments to show new comment with auto-incremented commentId
        await fetchComments();
      }
    } catch (error) {
      console.log("Failed to post comment:", error);
      //   this sweetalert2 for debug when user failed to post comment

      // check if token is invalid (e.g., 401)
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Invalid or expired token, Login ",
          text: "Please log in again to post a comment",
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        });

        // optionally, clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // history.push('/login'); // or a similar redirection

        location.reload();
      }

      Swal.fire({
        title: "Failed to post comment",
        text: error.response?.data?.message || error.message,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  useParticles("hover-particle");

  return (
    <div
      className={`relative flex-1 overflow-x-hidden ${
        fetching ? "" : ""
      } flex-wrap max-w-full px-2 md:px-3 lg:px-4`}
    >
      {fetching ? (
        <ul className=" h-screen overflow-hidden py-2">
          {Array.from({ length: 130 }).map(
            (_, i) => (
              <li
                key={i}
                className="flex flex-col md:flex-row items-start justify-between px-2 gap-2 md:gap-0 py-2 md:py-0.5 text-[16px] font-mono "
              >
                {/* Left side: Username + Content */}
                <div className="flex  items-start flex-1 min-w-0  text-primary ">
                  <p className="bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f] animate-pulse text-[#46A691]  flex-shrink-0">
                    <span className="opacity-0">/</span>
                  </p>
                  <p className="bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f] animate-pulse flex-shrink-0">
                    <span className="opacity-0">/</span>
                  </p>
                  <p
                    className={`bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f] animate-pulse flex-shrink-0 `}
                  >
                    <span className="opacity-0">guest</span>
                  </p>
                  <p className="bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f] animate-pulse hidden md:block mx-2  ">
                    <span className="opacity-0">:</span>
                  </p>
                  <p
                    style={{
                      width: `${Math.floor(Math.random() * 1000) + 50}px`,
                    }}
                    className="overflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f]  animate-pulse"
                  >
                    {Array.from({
                      length: Math.floor(Math.random() * 10) + 1,
                    }).map((_, i) => (
                      <span
                        key={i}
                        className="mr-1 opacity-0  
                    "
                      >
                        {String.fromCharCode(
                          Math.floor(Math.random() * 75) + 100
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <p className="md:hidden text-primary break-all o  verflow-hidden bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f]  animate-pulse">
                  {Array.from({
                    length: Math.floor(Math.random() * 10) + 1,
                  }).map((_, i) => (
                    <span
                      key={i}
                      className=" opacity-0  
                    "
                    >
                      {String.fromCharCode(Math.floor(Math.random() * 75) + 9)}
                    </span>
                  ))}
                </p>

                {/* Right side: Timestamp */}
                <div className="hidden lg:block text-primary whitespace-nowrap ml-2 bg-gradient-to-b from-[#1f1f1f] to-[#1f1f1f]   animate-pulse">
                  <span className="opacity-0">12-12-2024 09:56 PM</span>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="md:flex space-y-1.5  px-2 py-2 mt-2 text-sm flex-row lg:items-center text-primary"
          >
            <span className="text-sm text-[#46A691]">~</span>
            <span className="text-sm text-primary">/</span>

            <span className="text-sm text-blue-400 truncate overflow-hidden">
              {user ? user.name.slice(0, 10) : "guest"}
            </span>
            <span className="text-sm mx-2">:</span>
            <input
              id="content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="text-sm bg-transparent outline-none focus:bg-transparent hover:bg-transparent placeholder:text-primary placeholder:duration-300 duration-300 w-full 
          focus:hover:bg-transparent
          "
              placeholder="Write your thoughts here..."
              autoComplete="off"
            />

            {user ? (
              <button
                className="text-sm ml-auto w-full md:w-auto bg-half-white text-secondary px-2 hover-particle"
                type="submit"
              >
                post
              </button>
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL}/api/auth/google`}
                className="text-sm ml-auto bg-half-white text-secondary px-2 hover-particle"
              >
                Sign-in with Google
              </a>
            )}
          </form>

          <ul className="flex flex-col  divide-y divide-[#898989]/20 text-sm lg:divide-y-0">
            {comments
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((comment) => (
                <CommentLine
                  key={comment._id}
                  username={comment.username}
                  content={comment.content}
                  createdAt={comment.createdAt}
                />
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GuestBook;
