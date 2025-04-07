import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const loc = pathname.split("/").filter(Boolean)[0];
  // const [x, y] = pathname.scrollCoords || [0, 0];

  useEffect(() => {
    if (["home"].includes(loc)) {
      const savedScrollPos = sessionStorage.getItem(loc + "ScrollPos");
      window.scrollTo(0, parseInt(savedScrollPos || "0", 10));
    }

    return () => {
      if (["home"].includes(loc))
        sessionStorage.setItem(loc + "ScrollPos", window.scrollY);
    };
  }, [loc]);

  return null;
}

export default ScrollToTop;
