"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrapper,
  Inner,
  LogoContainer,
  Nav,
  CallToActions,
  BurgerMenu,
} from "./styles";
import raft_logo from "../../../../public/svgs/raft_logo.svg";
import ic_bars from "../../../../public/svgs/ic_bars.svg";
import { GetStartedButton } from "@/components";
import AnimatedLink from "@/components/Common/AnimatedLink";
import { motion } from "framer-motion";
import { menu } from "./constants";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const callToActionsRef = useRef<HTMLDivElement | null>(null);
  const burgerMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        burgerMenuRef.current &&
        !burgerMenuRef.current.contains(event.target as Node) &&
        callToActionsRef.current &&
        !callToActionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Wrapper>
      <Inner>
        <LogoContainer>
          <Image src={raft_logo} alt="raft_logo" priority />
          <BurgerMenu
            ref={burgerMenuRef}
            className="flex "
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              className="flex items-center justify-center"
              variants={menu}
              animate={isOpen ? "open" : "closed"}
              initial="closed"
            >
              <CallToActions
                ref={callToActionsRef}
                className={`${isOpen ? "active" : ""} flex flex-col`}
              >
                <Link className="font-bold uppercase" href="sign-in">
                  Нэвтрэх
                </Link>

                <Link className="font-bold uppercase" href="sign-up">
                  Бүртгүүлэх
                </Link>
              </CallToActions>
            </motion.div>

            <Image src={ic_bars} alt="bars" />
          </BurgerMenu>
        </LogoContainer>
        <Nav className={isOpen ? "active" : ""}></Nav>
        <CallToActions className={`${isOpen ? "active" : ""} flex `}>
          <Link href="/sign-in" passHref className="max-md:hidden">
            <AnimatedLink title="Нэвтрэх" />
          </Link>
          <GetStartedButton padding="0.5rem 0.75rem" />
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;
