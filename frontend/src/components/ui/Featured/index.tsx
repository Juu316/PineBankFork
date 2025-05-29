"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import big_banner from "../../../../public/images/big_banner.png";
import featured_mobile_banner from "../../../../public/images/featured_mobile_banner.png";
import { Wrapper, Inner, ImageContainer, Div } from "./styles";
import RevealCover from "@/components/Common/RevealCover";
import { useIsMobile } from "../../../lib/useIsMobile";

export const imageVariants = {
  hidden: { scale: 1.6 },
  visible: {
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.6, 0.05, -0.01, 0.9],
      delay: 0.2,
    },
  },
};

const Featured = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile(); // ✅ still called unconditionally

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // ✅ gate rendering only, not the hook

  return (
    <Wrapper>
      <Inner>
        <ImageContainer>
          <RevealCover />
          <Div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: true }}
          >
            <Image
              src={isMobile ? featured_mobile_banner : big_banner}
              alt={isMobile ? "featured_mobile_banner" : "big_banner"}
              fill
            />
          </Div>
        </ImageContainer>
      </Inner>
    </Wrapper>
  );
};

export default Featured;
