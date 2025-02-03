import { motion, AnimatePresence } from "framer-motion";

import PropTypes from "prop-types";

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Notification = ({ message, type, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-lg shadow-lg
            ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          onAnimationComplete={() => {
            setTimeout(onClose, 3000);
          }}
        >
          <p className="text-white text-sm">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
