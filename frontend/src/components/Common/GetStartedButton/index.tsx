import { LinkTo } from "./styles";
import { useEffect, useState } from "react";

const GetStartedButton = ({ padding }: { padding: string }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // md breakpoint
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LinkTo
      style={{
        padding: padding,
        display: isMobile ? "none" : "block",
      }}
      href="/sign-up"
    >
      Бүртгүүлэх
    </LinkTo>
  );
};

export default GetStartedButton;
