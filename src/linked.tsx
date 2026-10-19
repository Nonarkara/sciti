import type { Lang, Tr } from "./types";
import { tr } from "./text";

const TITLES: Record<string, Tr> = {
  "https://mgronline.com/business/detail/9680000124855": {
    en: "Manager Online: Cambodia border trade was 0 baht in November 2568",
    th: "ผู้จัดการออนไลน์: ค้าชายแดนกัมพูชาเป็นศูนย์บาทในเดือนพฤศจิกายน 2568",
    zh: "Manager Online：佛历 2568 年 11 月对柬埔寨边境贸易为零铢",
  },
  "https://policywatch.thaipbs.or.th/article/investment-102": {
    en: "Thai PBS Policy Watch: the Cambodia border is not what it was",
    th: "ไทยพีบีเอส โพลิซีวอตช์: ค้าชายแดนไทย–กัมพูชาไม่เหมือนเดิม",
    zh: "泰国公共广播政策观察：泰柬边境贸易已不同于以往",
  },
};

export function LinkedText({ lang, text }: { lang: Lang; text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, index) => {
        const title = /^https?:\/\//.test(part) ? TITLES[part] : undefined;
        if (!title) return <span key={index}>{part}</span>;
        return (
          <a key={index} href={part}>
            {tr(lang, title)}
          </a>
        );
      })}
    </>
  );
}
