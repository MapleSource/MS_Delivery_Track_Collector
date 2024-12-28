import { useState, useEffect } from "react";

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);

    // Establece el ancho inicial
    updateWidth();

    // Escucha cambios de tamaño de ventana
    window.addEventListener("resize", updateWidth);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return screenWidth;
};

export default useScreenWidth;
