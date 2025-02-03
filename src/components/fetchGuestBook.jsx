// websocket comment tapi malas


import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CommentLine from './commentLine';

const GuestBook = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // fetch initial comments from the server
    fetch('/api/comments')
      .then((response) => response.json())
      .then((data) => setComments(data));

    // connect to WebSocket server
    const ws = new WebSocket('ws://localhost:5173');

    ws.onmessage = (event) => {
      const newComment = JSON.parse(event.data);
      setComments((prevComments) => [...prevComments, newComment]);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {comments.map((comment) => (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          key={comment._id}
          className=""
        >
          <CommentLine
            username={comment.username}
            content={comment.content}
            createdAt={comment.createdAt}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GuestBook;