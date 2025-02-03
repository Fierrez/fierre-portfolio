import { useState, useEffect } from 'react';

const useGridSize = () => {
  const [gridSize, setGridSize] = useState({ columns: 35, rows: 30 });

  useEffect(() => {
    const calculateGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // calculate based on viewport size
      const boxSize = 55; // box size
      const columns = Math.ceil(width / boxSize);
      const rows = Math.ceil(height / boxSize);
      
      setGridSize({ columns, rows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  return gridSize;
};

export default useGridSize;