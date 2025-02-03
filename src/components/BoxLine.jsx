import PropTypes from "prop-types";

const BoxLine = ({
  boxSize = 40, // default
  color = "#282828", // default
  opacity = 0.2, // default
  columns = 10, // default
  rows = 10, // default
}) => {
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      {/* generate a grid of boxes */}
      {[...Array(rows * columns)].map((_, i) => (
        <div
          key={i}
          className="absolute border"
          style={{
            borderColor: color,
            width: boxSize,
            height: boxSize,
            left: `${(i % columns) * boxSize}px`,
            top: `${Math.floor(i / columns) * boxSize}px`,
          }}
        />
      ))}
    </div>
  );
};

BoxLine.propTypes = {
  boxSize: PropTypes.number,
  color: PropTypes.string,
  opacity: PropTypes.number,
  columns: PropTypes.number,
  rows: PropTypes.number,
};

export default BoxLine;
