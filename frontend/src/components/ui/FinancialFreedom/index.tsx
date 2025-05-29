"use client";
import Image from "next/image";
import {
  Wrapper,
  Inner,
  Header,
  BannerCtn,
  Edges,
  Edge,
  Title,
  BriefNote,
} from "./styles";
import MaskText from "@/components/Common/MaskText";
import RevealCover from "@/components/Common/RevealCover";
import { Div } from "../Featured/styles";
import { imageVariants } from "../Featured";
import { useIsMobile } from "../../../lib/useIsMobile";
import { useHasMounted } from "../../../lib/useHasMounted";

import financial_freedom_banner from "../../../../public/images/financial_freedom_banner.png";
import freedom_mobile_banner from "../../../../public/images/freedom_mobile_banner.png";
import {
  desktopBriefNotePhrase,
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  edges,
  mobileBriefNotePhrase,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
} from "./constants";

const FinancialFreedom = () => {
  const hasMounted = useHasMounted();
  const isMobile = useIsMobile();

  // Prevent SSR/CSR mismatch
  if (!hasMounted) return null;

  return (
    <Wrapper>
      <Inner>
        <Header>
          {isMobile ? (
            <>
              <MaskText phrases={mobileHeaderPhrase} tag="h1" />
              <MaskText phrases={mobileParagraphPhrase} tag="p" />
            </>
          ) : (
            <>
              <MaskText phrases={desktopHeaderPhrase} tag="h1" />
              <MaskText phrases={desktopParagraphPhrase} tag="p" />
            </>
          )}
        </Header>
        <BannerCtn>
          <RevealCover />
          <Div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: true }}
          >
            <Image
              src={isMobile ? freedom_mobile_banner : financial_freedom_banner}
              alt="banner_img"
              fill
            />
          </Div>
        </BannerCtn>
        <Edges>
          {edges.map((edge, i) => (
            <Edge key={i}>
              <Title>
                <Image src={edge.icon} alt="icon" />
                <MaskText phrases={[edge.point]} tag="h3" />
              </Title>
              <MaskText phrases={[edge.details]} tag="p" />
            </Edge>
          ))}
        </Edges>
      </Inner>
      <BriefNote className="flex items-center justify-center text-center text-xl">
        <MaskText
          phrases={isMobile ? mobileBriefNotePhrase : desktopBriefNotePhrase}
          tag="p"
        />
      </BriefNote>
    </Wrapper>
  );
};

export default FinancialFreedom;
