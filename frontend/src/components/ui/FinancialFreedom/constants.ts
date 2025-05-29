
import ic_banknotes from '../../../../public/svgs/ic_banknotes.svg';
import ic_circle_stack from '../../../../public/svgs/ic_circle_stack.svg';
import ic_arrows_left_right from '../../../../public/svgs/ic_arrows_right_left.svg';

// For desktop
export const desktopHeaderPhrase = ['Таны санхүүгийн эрх чөлөө'];

export const desktopParagraphPhrase = [
  'Санхүүгээ удирдах нь хүчин чармайлтгүй, зардал багатай байх ёстой гэдэгт бид итгэдэг.',
  "Тиймээс бид таны хүрэх ёстой эрх чөлөөг санал болгож байна.",
];
export const desktopBriefNotePhrase = [
  'Хөрөнгө оруулалт',
  'Үргэлжлүүл өргөжүүл',
  'Санхүүгийн аяллаа',
  'Хамт эхлүүлье.',
];


// For mobile
export const mobileHeaderPhrase = ['Таны санхүүгийн эрх чөлөө'];
export const mobileParagraphPhrase = [
  'Санхүүгээ удирдах нь хүчин чармайлтгүй, зардал багатай байх ёстой гэдэгт бид итгэдэг.',
  "Тиймээс бид таны хүрэх ёстой эрх чөлөөг санал болгож байна.",
];

export const mobileBriefNotePhrase = [
  'Хөрөнгө оруулалт',
  'Үргэлжлүүл өргөжүүл',
  'Санхүүгийн аяллаа',
  'Хамт эхлүүлье.',
];

export const edges = [
  {
    point: 'Хамгийн бага шимтгэл',
    details:
      'Таны данс, таны үлдэгдэл',
    icon: ic_banknotes,
  },
  {
    point: 'Сарын хураамж байхгүй',
    details:
      'Сарын шимтгэлийн талаар санаа зовохгүйгээр мөнгөө дансандаа хадгалаарай',
    icon: ic_circle_stack,
  },
  {
    point: 'Банкны шилжүүлгийн хураамжгүй',
    details:
      'Нэмэлт зардалгүйгээр мөнгө шилжүүлэх. Банкны шилжүүлгийн шимтгэлгүй мөнгө илгээх, хүлээн авах.',
    icon: ic_arrows_left_right,
  },
];
