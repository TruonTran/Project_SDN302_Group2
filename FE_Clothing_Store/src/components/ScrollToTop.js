import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// dùng chung cho cả home page và product page, khi chuyển trang sẽ tự động scroll về đầu trang
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
