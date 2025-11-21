import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};



export function formatmessageDate(date) {

    const option={ hour:"2-digit", minute:"2-digit",hour12:false}
    return new Date(date).toLocaleTimeString("en-US",option)
}
