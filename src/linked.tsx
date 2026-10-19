import type { ReactNode } from "react";
import type { Lang, Tr } from "./types";
import { tr } from "./text";

const DATE_RE =
  /(?:佛历\s*)?\d{4}(?:\s*[、和–—-]\s*\d{4})*\s*年(?:\s*第[一二三四]季度|\s*学年(?:第一学期)?)?(?:\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?)?(?:\s*[至到]\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?)?(?:\s+\d{1,2}:\d{2})?|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}(?:,\s*\d{1,2}:\d{2})?|\d{1,2}\s+(?:มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม)\s+\d{4}(?:\s+เวลา\s+\d{1,2}:\d{2}(?:\s*น\.)?)?|\d{1,2}:\d{2}\s*ICT/g;

function dateNodes(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const dates = new RegExp(DATE_RE.source, "g");
  let last = 0;
  for (const match of text.matchAll(dates)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(
      <span key={index} className="nowrap">
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  if (!nodes.length) nodes.push(text);
  return nodes;
}

export function DateText({ text }: { text: string }) {
  return <>{dateNodes(text)}</>;
}

const TITLES: Record<string, Tr> = {
  "https://mgronline.com/business/detail/9680000124855": {
    en: "Manager Online: Cambodia border trade was 0 baht in November 2025",
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
  const parts = text.split(/(https?:\/\/[^\s)）]+)/g);
  return (
    <>
      {parts.map((part, index) => {
        const title = /^https?:\/\//.test(part) ? TITLES[part] : undefined;
        if (!title) return <span key={index}>{dateNodes(part)}</span>;
        return (
          <a key={index} href={part}>
            {dateNodes(tr(lang, title))}
          </a>
        );
      })}
    </>
  );
}
