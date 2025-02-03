import PropTypes from "prop-types";

const CommentLine = ({ username, content, createdAt }) => {

  const user = JSON.parse(localStorage.getItem("user"));


  return (
    <li className="flex flex-col md:flex-row items-start justify-between px-2 gap-2 md:gap-0 py-2 md:py-0.5 text-[16px] font-mono md:space-x-12">
      {/* left side: username + content */}
      <div className="flex  items-start flex-1 min-w-0  text-primary ">
        <p className="text-[#46A691] flex-shrink-0">~</p>
        <p className=" flex-shrink-0">/</p>
        <p className={`
          ${user?.name === username ? 'text-blue-400' : ''} 
          
          flex-shrink-0 `}>{username}</p>
        <p className="hidden md:block mx-2 flex-shrink-0">:</p>
        <p className="hidden md:block  break-all  overflow-hidden">
          {content}
        </p>
      </div>

      <p className="md:hidden text-primary break-all overflow-hidden">
          {content}
        </p>

      {/* right side: Timestamp */}
      <div className="hidden lg:block text-primary whitespace-nowrap ml-2">
        {new Date(createdAt).toLocaleString()}
      </div>
    </li>
  );
};



CommentLine.propTypes = {
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default CommentLine;
