import { StaticImageData } from 'next/image';
import robert_fox from '../../../../public/images/robert_fox.png';
import esther_howard from '../../../../public/images/esther_howard.png';

export type Props = {
  testimony: string;
  person: string;
  avatar: StaticImageData;
};

export const testimonials = [
  {
    testimony:
      "PineBank миний санхүүгийн хандлагыг өөрчилсөн. Тэдний ухаалаг хөрөнгө оруулалтын сонголтууд нь миний баялгийг өсгөхөд тусалсан бөгөөд тэдний хэрэглэгчдэд ээлтэй платформ нь миний мөнгийг удирдахад хялбар болгодог. Би санхүүгийн ирээдүйдээ илүү итгэлтэй болсон.",
    person: 'Д. Түвшинтөгс',
    avatar: robert_fox,
  },
  {
    testimony:
      "Би PineBank-д ямар их талархаж байгаагаа үгээр илэрхийлэхийн аргагүй. Тэдний менежментийн үйлчилгээ нь миний гэр бүлийн санхүүгийн аюулгүй байдлыг эрс өөрчилсөн. хувь хүнд тохирсон стратеги нь сэтгэлийн амар амгаланг өгсөн.",
    person: 'С. Номингэрэл',
    avatar: esther_howard,
  },
  {
    testimony:
      "PineBank-ийн санхүүгийн төлөвлөлтийн үйлчилгээ нь миний хувьд амин дэм болсон. Би мөнгөө удирдаж чаддаг болсон. Энэ нь миний санхүүгийн мөрөөдлөө биелүүлэхэд маш их хувь нэмэр оруулсан",
    person: 'Ж. Элбэгтөгс',
    avatar: robert_fox,
  },
  {
    testimony:
      "Би Pinebank-д ямар их талархаж байгаагаа үгээр илэрхийлэхийн аргагүй. Тэд миний гэр бүлийн санхүүгийн аюулгүй байдлыг эрс өөрчилсөн. ",
    person: 'Э. Энхжин',
    avatar: esther_howard,
  },
];

export const desktopHeaderPhrase = ['Бидэнтэй нэгд', 'PineBank'];
