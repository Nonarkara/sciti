// Smart City Thailand Index — i18n strings (TypeScript port)

export type Lang = "en" | "th";

export interface StatItem { v: string; l: string; }

export interface NavDict {
  home: string;
  rankings: string;
  map: string;
  methodology: string;
  sources: string;
  compare: string;
  bingo: string;
  about: string;
}

export interface I18nDict {
  brand_a: string;
  brand_b: string;
  edition: string;
  nav: NavDict;
  home_eyebrow: string;
  home_h: string;
  home_lede: string;
  stats: StatItem[];
  cta_h: string;
  cta_p: string;
  cta_button: string;
  cta_button2: string;
  leaders_label: string;
  leaders_h: string;
  region_label: string;
  region_h: string;
  featured_label: string;
  featured_h: string;
  grouped_label: string;
  grouped_h: string;
  updates_label: string;
  updates_h: string;
  rankings_h: string;
  rankings_sub: string;
  map_h: string;
  map_sub: string;
  method_h: string;
  method_sub: string;
  sources_h: string;
  sources_sub: string;
  compare_h: string;
  compare_sub: string;
  bingo_h: string;
  bingo_sub: string;
  about_h: string;
  about_p1: string;
  about_p2: string;
  pillar: string;
  indicators: string;
  rank: string;
  score: string;
  moves_h: string;
  pillars_h: string;
  verdict: string;
  highlights: string;
  sister: string;
  open: string;
  sort: string;
  filter: string;
  region: string;
  all: string;
  edition_l: string;
  updated_l: string;
  updated_v: string;
  cities_l: string;
  verified_l: string;
  operator_l: string;
  pillars_l: string;
  operating: string;
  building: string;
  paper: string;
  hero_chips: string[];
}

export const I18N: Record<Lang, I18nDict> = {
  en: {
    brand_a: "Smart City",
    brand_b: "Thailand Index",
    edition: "SCITI 2026",
    nav: { home: "Home", rankings: "Rankings", map: "Map", methodology: "Methodology", sources: "Sources", compare: "Compare", bingo: "Bingo", about: "About" },
    home_eyebrow: "SCITI 2026 — Reality Check",
    home_h: "We rank what works.\nNot what was announced.",
    home_lede: "Thailand has 118 self-declared smart-zones. Only 37 have enough verifiable data to score. This index covers those 37 — and is unusually direct about the rest.",
    stats: [
      { v: "118", l: "Self-declared zones" },
      { v: "37",  l: "Made the cut" },
      { v: "81",  l: "Did not" },
      { v: "7",   l: "Outcome pillars" },
    ],
    cta_h: "Don't see your city?",
    cta_p: "We rank only cities with enough independently-verifiable data. If yours is doing real work, send us the data.",
    cta_button: "Submit a city →",
    cta_button2: "Read methodology",
    leaders_label: "ONE LEADER PER PILLAR",
    leaders_h: "One city, one pillar.",
    region_label: "REGIONAL LEADERS",
    region_h: "Regional leaders across Thailand",
    featured_label: "FEATURED CITIES",
    featured_h: "Closer look at the top five.",
    grouped_label: "PEER GROUPS",
    grouped_h: "Cities clustered by what they actually do.",
    updates_label: "THIS WEEK",
    updates_h: "What changed this week.",
    rankings_h: "Full rankings",
    rankings_sub: "Sortable. Filterable. 37 cities, scored across 7 outcome pillars.",
    map_h: "The index, mapped",
    map_sub: "Tap a pin to read the verdict.",
    method_h: "How we rank — and what we refuse to count",
    method_sub: "We score outcomes. We refuse press releases.",
    sources_h: "Where the data comes from",
    sources_sub: "Government, multilateral, local — and our own field reporting.",
    compare_h: "Side by side",
    compare_sub: "Compare any two cities across all seven pillars and headline indicators.",
    bingo_h: "Smart-City Bingo",
    bingo_sub: "Drink a glass of water every time you spot one of these phrases at a smart-city expo.",
    about_h: "About the index",
    about_p1: "The Smart City Thailand Index is an independent, annually-updated ranking of cities and zones in Thailand that have moved beyond rhetoric. Run by analysts, journalists, and field researchers — not vendors.",
    about_p2: "We are not affiliated with depa, MOI, NESDC, or any city we rank. We accept no payment from cities or vendors to be ranked. Methodology is open. Disagreements are welcomed.",
    pillar: "Pillar",
    indicators: "Indicators",
    rank: "Rank",
    score: "Score",
    moves_h: "What this city is actually doing",
    pillars_h: "Pillar breakdown",
    verdict: "Verdict",
    highlights: "Headline numbers",
    sister: "Peer cities",
    open: "Open profile",
    sort: "Sort by",
    filter: "Filter",
    region: "Region",
    all: "All",
    edition_l: "Edition",
    updated_l: "Updated",
    updated_v: "2 weeks ago",
    cities_l: "Cities ranked",
    verified_l: "Verified by DEPA",
    operator_l: "Field-visited",
    pillars_l: "Outcome pillars",
    operating: "Operating", building: "Building", paper: "Paper plan",
    hero_chips: ["Independent", "Annually updated", "Methodology open"],
  },
  th: {
    brand_a: "ดัชนี",
    brand_b: "เมืองอัจฉริยะไทย",
    edition: "SCITI 2569",
    nav: { home: "หน้าแรก", rankings: "อันดับ", map: "แผนที่", methodology: "ระเบียบวิธี", sources: "แหล่งข้อมูล", compare: "เปรียบเทียบ", bingo: "บิงโก", about: "เกี่ยวกับ" },
    home_eyebrow: "SCITI 2569 — ตรวจของจริง",
    home_h: "เราจัดอันดับ\nสิ่งที่ทำงานจริง",
    home_lede: "ประเทศไทยมีเขตประกาศตัวเองว่า 'สมาร์ท' 118 แห่ง แต่มีเพียง 37 แห่งที่มีข้อมูลตรวจสอบได้เพียงพอ ดัชนีนี้จัดอันดับเฉพาะ 37 แห่งนั้น — และพูดตรง ๆ เกี่ยวกับที่เหลือ",
    stats: [
      { v: "118", l: "เขตประกาศตัวเอง" },
      { v: "37",  l: "ผ่านเกณฑ์" },
      { v: "81",  l: "ไม่ผ่าน" },
      { v: "7",   l: "เสาหลักผลลัพธ์" },
    ],
    cta_h: "เมืองของคุณยังไม่อยู่ในดัชนี?",
    cta_p: "เราจัดอันดับเฉพาะเมืองที่มีข้อมูลตรวจสอบได้อย่างเป็นอิสระ หากเมืองคุณทำงานจริง ส่งข้อมูลมาให้เรา",
    cta_button: "ส่งเมืองของคุณ →",
    cta_button2: "อ่านระเบียบวิธี",
    leaders_label: "ผู้นำต่อหนึ่งเสา",
    leaders_h: "หนึ่งเมือง หนึ่งเสาหลัก",
    region_label: "ผู้นำแต่ละภูมิภาค",
    region_h: "เมืองผู้นำของแต่ละภูมิภาคในประเทศไทย",
    featured_label: "เมืองเด่น",
    featured_h: "5 อันดับแรก ดูใกล้ ๆ",
    grouped_label: "กลุ่มเมืองคล้ายกัน",
    grouped_h: "เมืองไทยจัดกลุ่มตามสิ่งที่ทำจริง",
    updates_label: "สัปดาห์นี้",
    updates_h: "อัปเดตล่าสุด",
    rankings_h: "อันดับทั้งหมด",
    rankings_sub: "เรียง กรอง ค้น 37 เมือง ใน 7 เสาหลัก",
    map_h: "ดัชนีบนแผนที่",
    map_sub: "แตะหมุดเพื่อดูคำตัดสิน",
    method_h: "เราจัดอันดับอย่างไร — และเราปฏิเสธอะไร",
    method_sub: "เราให้คะแนนผลลัพธ์ เราปฏิเสธใบประกาศข่าว",
    sources_h: "ข้อมูลมาจากไหน",
    sources_sub: "รัฐ องค์กรพหุภาคี ท้องถิ่น และการลงพื้นที่ของเราเอง",
    compare_h: "เปรียบเทียบแบบเคียงข้าง",
    compare_sub: "เลือกสองเมือง เทียบทั้ง 7 เสา และตัวเลขสำคัญ",
    bingo_h: "บิงโก สมาร์ทซิตี้",
    bingo_sub: "ดื่มน้ำหนึ่งแก้วทุกครั้งที่ได้ยินวลีเหล่านี้ในงาน smart city",
    about_h: "เกี่ยวกับดัชนี",
    about_p1: "ดัชนีเมืองอัจฉริยะไทย เป็นการจัดอันดับอิสระประจำปีของเมืองและเขตในไทยที่ขยับเกินกว่าคำพูด ดำเนินการโดยนักวิเคราะห์ นักข่าว และนักวิจัยภาคสนาม ไม่ใช่ผู้ขายเทคโนโลยี",
    about_p2: "เราไม่ได้สังกัด depa, มท., สศช. หรือเมืองใดที่จัดอันดับ เราไม่รับเงินจากเมืองหรือผู้ขายเพื่อให้อยู่ในรายการ ระเบียบวิธีของเราเปิดเผย ความเห็นต่างยินดีรับ",
    pillar: "เสาหลัก",
    indicators: "ตัวชี้วัด",
    rank: "อันดับ",
    score: "คะแนน",
    moves_h: "เมืองนี้ทำอะไรอยู่จริง ๆ",
    pillars_h: "คะแนนแต่ละเสา",
    verdict: "คำตัดสิน",
    highlights: "ตัวเลขสำคัญ",
    sister: "เมืองคล้ายกัน",
    open: "ดูโปรไฟล์",
    sort: "เรียงตาม",
    filter: "กรอง",
    region: "ภูมิภาค",
    all: "ทั้งหมด",
    edition_l: "รุ่น",
    updated_l: "อัปเดต",
    updated_v: "2 สัปดาห์ก่อน",
    cities_l: "เมืองที่จัดอันดับ",
    verified_l: "depa รับรอง",
    operator_l: "ลงพื้นที่",
    pillars_l: "เสาหลักผลลัพธ์",
    operating: "ดำเนินการแล้ว", building: "กำลังก่อสร้าง", paper: "แผนกระดาษ",
    hero_chips: ["อิสระ", "อัปเดตประจำปี", "ระเบียบวิธีเปิด"],
  },
};
