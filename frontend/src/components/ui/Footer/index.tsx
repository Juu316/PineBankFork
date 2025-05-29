import Image from "next/image";
import raft_footer_logo from "../../../../public/svgs/raft_footer_logo.svg";
import qr_code from "../../../../public/svgs/qr_code.svg";
import ic_google_playstore from "../../../../public/svgs/ic_google_playstore.svg";
import ic_baseline_apple from "../../../../public/svgs/ic_baseline_apple.svg";

const linksArr = [
  {
    title: "Бидний тухай",
    links: ["Манай компани", "Карьер", "Мэдээ мэдээлэл"],
  },
  {
    title: "Хууль эрх зүй",
    links: ["Хэрэглэх нөхцөл", "Нууцлалын бодлого", "SOFTmn"],
  },
  {
    title: "Бид",
    links: ["Холбоо барих", "FAQ"],
  },
];

import {
  Wrapper,
  Inner,
  FooterLogo,
  FooterMainContent,
  FooterMiddle,
  QRContainer,
  QRImageCtn,
  TextCtn,
  IconCtn,
  FooterNavigation,
  GridColumn,
  LinksContainer,
  FooterBottom,
  CopyRight,
} from "./styles";

const Footer = () => {
  return (
    <Wrapper>
      <Inner>
        <FooterLogo>
          <Image src={raft_footer_logo} alt="raft_footer_logo" />
        </FooterLogo>
        <FooterMainContent>
          <FooterMiddle>
            <QRContainer>
              <QRImageCtn>
                <Image src={qr_code} alt="qr_code" />
              </QRImageCtn>
              <TextCtn>
                <p>Уншуулаад шууд татаж аваарай.</p>
                <IconCtn>
                  <Image src={ic_google_playstore} alt="playstore icon" />
                  <Image src={ic_baseline_apple} alt="apple icon" />
                </IconCtn>
              </TextCtn>
            </QRContainer>
            <FooterNavigation>
              {linksArr.map((l, i) => (
                <GridColumn key={i}>
                  <h3>{l.title}</h3>
                  <LinksContainer>
                    {l.links.map((link, i) => (
                      <li key={i}>{link}</li>
                    ))}
                  </LinksContainer>
                </GridColumn>
              ))}
            </FooterNavigation>
          </FooterMiddle>
          <FooterBottom>
            <CopyRight className="flex justify-end">
              Бүх эрх хуулиар хамгаалагдсан © 2025. Pine банк
            </CopyRight>
          </FooterBottom>
        </FooterMainContent>
      </Inner>
    </Wrapper>
  );
};

export default Footer;
