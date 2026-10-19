import type { Indicator, Lang, Lens, Observation, Part, ScoreRow, Tr } from "./types";
import { publisherName } from "./lib/publishers.mjs";

export function tr(lang: Lang, text: Tr): string {
  return text[lang] || text.en;
}

export function placeName(place: { en: string; th: string; zh: string } | undefined, lang: Lang): string {
  if (!place) return "";
  if (lang === "th") return place.th || place.en;
  if (lang === "zh") return place.zh || place.en;
  return place.en;
}

const MONTHS: Record<Lang, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  th: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
  zh: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

function dateParts(year: string, month: string, date: string | undefined, hour: string | undefined, lang: Lang): string {
  const monthName = MONTHS[lang][Number(month) - 1] || month;
  const y = lang === "th" ? String(Number(year) + 543) : year;
  if (lang === "zh") {
    const day = date ? `${y}年${Number(month)}月${Number(date)}日` : `${y}年${Number(month)}月`;
    return hour ? `${day} ${hour}:00` : day;
  }
  if (!date) return lang === "th" ? `${monthName} ${y}` : `${monthName} ${y}`;
  const day = lang === "th" ? `${Number(date)} ${monthName} ${y}` : `${Number(date)} ${monthName} ${y}`;
  if (!hour) return day;
  return lang === "th" ? `${day} เวลา ${hour}:00` : `${day}, ${hour}:00`;
}

export function whenPhrase(lang: Lang, value: string | undefined): string {
  if (!value) return "";
  const raw = String(value).trim();
  if (raw.includes(" / ")) return raw.split(" / ").map((part) => whenPhrase(lang, part) || part).join(" / ");
  if (raw.includes(" to ")) {
    const joiner = lang === "th" ? " ถึง " : lang === "zh" ? "至" : " to ";
    return raw.split(" to ").map((part) => whenPhrase(lang, part) || part).join(joiner);
  }
  const hourly = /^(\d{4})-(\d{2})-(\d{2})T(\d{2})/.exec(raw);
  if (hourly) return dateParts(hourly[1], hourly[2], hourly[3], hourly[4], lang);
  const daily = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (daily) return dateParts(daily[1], daily[2], daily[3], undefined, lang);
  const month = /^(\d{4})-(\d{2})$/.exec(raw);
  if (month) return dateParts(month[1], month[2], undefined, undefined, lang);
  if (lang === "th" && /^(19|20)\d{2}$/.test(raw)) return String(Number(raw) + 543);
  return raw;
}

export function day(value: string | undefined): string {
  return whenPhrase("en", value);
}

export function num(value: number, digits = 1): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

const chrome = {
  menu: { en: "Menu", th: "เมนู", zh: "菜单" },
  cities: { en: "Cities", th: "เมือง", zh: "城市" },
  compare: { en: "Compare", th: "เทียบ", zh: "对照" },
  firstPlace: { en: "First place", th: "จังหวัดที่หนึ่ง", zh: "第一个府" },
  secondPlace: { en: "Second place", th: "จังหวัดที่สอง", zh: "第二个府" },
  coverage: { en: "Coverage", th: "ครอบคลุม", zh: "覆盖" },
  methods: { en: "Methods", th: "วิธี", zh: "方法" },
  about: { en: "About", th: "เกี่ยวกับ", zh: "关于" },
  question: { en: "Which cities?", th: "เมืองไหน", zh: "哪些城市？" },
  tenetShort: {
    en: "Cities are the economy. A better economy is built by building better cities, and the hard question is which cities.",
    th: "เมืองคือเศรษฐกิจ เศรษฐกิจที่ดีขึ้นเกิดจากการทำให้เมืองดีขึ้น และคำถามที่ยากคือเมืองไหน",
    zh: "城市就是经济。要有更好的经济，就得把城市建得更好，难的是选哪一座。",
  },
  tenetLong: {
    en: "Reputation is loud. The figures that already exist are quieter. This page lines those figures up so you can see who the numbers favour, and it leaves a blank where a number was never published. It is not a government index, and it does not price a city that has not been measured.",
    th: "ชื่อเสียงดังกว่าตัวเลข หน้านี้เรียงตัวเลขที่มีอยู่แล้วให้เห็นว่าตัวเลขเข้าข้างใคร และเว้นว่างไว้ตรงที่ไม่เคยมีการเผยแพร่ ที่นี่ไม่ใช่ดัชนีของทางราชการ และไม่ตีราคาเมืองที่ยังไม่ได้วัด",
    zh: "名声很响，已经公布的数字比较安静。这一页把这些数字排开，让人看见数字偏向谁。没有公布的，就空着。这不是政府指数，也不会给还没测过的城市标价。",
  },
  proposed: { en: "proposed", th: "ข้อเสนอ", zh: "提议" },
  lensLabel: { en: "Lens", th: "เลนส์", zh: "镜头" },
  weights: { en: "Adjust the weights", th: "ปรับน้ำหนัก", zh: "调整权重" },
  reset: { en: "Reset weights", th: "คืนน้ำหนักเดิม", zh: "恢复默认权重" },
  weightOf: { en: "weight", th: "น้ำหนัก", zh: "权重" },
  chooseProvince: { en: "Choose a province", th: "เลือกจังหวัด", zh: "选择一个府" },
  notScored: { en: "Not scored", th: "ไม่ได้จัดลำดับ", zh: "没有排名" },
  source: { en: "Source", th: "แหล่ง", zh: "来源" },
  gapNone: {
    en: "No reputation series is in the file. The comparison below uses the Treasury land appraisal, which is not a market price.",
    th: "ยังไม่มีชุดชื่อเสียงในไฟล์ การเทียบด้านล่างใช้ราคาประเมินที่ดินของกรมธนารักษ์ ซึ่งไม่ใช่ราคาตลาด",
    zh: "文件里没有名声序列。下面的比较用的是国库厅土地评估价，那不是市场价。",
  },
  appraisalCaveat: {
    en: "The price in this comparison is the Treasury Department's median official land appraisal, in baht per square wah. It is not a sale and it is not a rent. A province is called undervalued for its fundamentals only when its lens mark sits at least 5 points above that appraisal's percentile. There is still no reputation series.",
    th: "ราคาในการเทียบนี้คือมัธยฐานราคาประเมินที่ดินราชการของกรมธนารักษ์ หน่วยบาทต่อตารางวา ไม่ใช่ราคาซื้อขาย และไม่ใช่ค่าเช่า จะเรียกจังหวัดว่าปัจจัยพื้นฐานสูงกว่าราคาประเมิน ก็ต่อเมื่อคะแนนเลนส์สูงกว่าเปอร์เซ็นไทล์ของราคาประเมินนั้นอย่างน้อย 5 คะแนน ยังไม่มีชุดชื่อเสียง",
    zh: "这个比较里的价格，是国库厅官方土地评估价的中位数，单位是铢/平方哇。不是成交价，也不是租金。只有镜头分数比该评估价的百分位至少高出 5 分，才把一个府称为基本面高于评估价。名声序列仍然没有。",
  },
  undervalued: {
    en: "Undervalued for its fundamentals",
    th: "ปัจจัยพื้นฐานสูงกว่าราคาประเมิน",
    zh: "基本面高于评估价",
  },
  sourcesTitle: { en: "Sources", th: "แหล่ง", zh: "来源" },
  stillMissing: { en: "Still missing", th: "ยังขาด", zh: "仍然没有" },
  notDepa: {
    en: "This weighting is not the official depa smart-city index.",
    th: "น้ำหนักชุดนี้ไม่ใช่ดัชนีเมืองอัจฉริยะอย่างเป็นทางการของดีป้า",
    zh: "这组权重不是 depa 的官方智慧城市指数。",
  },
  depaRenewed: {
    en: "depa: a project here was renewed, or newly labelled, in the 2025 announcement. Sixteen labels were renewed and Phuket Tinicon Valley was added. A label that the announcement does not renew is marked renewal not found. That is not a finding that it expired.",
    th: "ดีป้า: โครงการที่นี่ถูกต่ออายุ หรือได้ป้ายใหม่ ในประกาศปี 2568 มีการต่ออายุสิบหกป้าย และเพิ่มภูเก็ตทินิคอนวัลเลย์ ป้ายที่ประกาศนั้นไม่ได้ต่ออายุ จะถูกกำกับว่ายังไม่พบการต่ออายุ นั่นไม่ใช่ข้อสรุปว่าป้ายหมดอายุ",
    zh: "depa：这里的一个项目在佛历 2568 年的公告里续期，或是新授牌。续了十六块牌子，并新增普吉 Tinicon Valley。公告没有续的牌子，标成没有找到续期。这不是认定它已经过期。",
  },
  depaNotFound: {
    en: "depa: a project here was labelled in 2021–2023. A renewal was not found in the 2025 announcements. That is not the same as expired.",
    th: "ดีป้า: โครงการที่นี่ได้ป้ายในปี 2564–2566 ไม่พบการต่ออายุในประกาศปี 2568 นั่นไม่เหมือนกับหมดอายุ",
    zh: "depa：这里的一个项目在佛历 2564–2566 年授过牌。2568 年的公告里没有找到续期。这不等于过期。",
  },
  localitiesNote: {
    en: "The city file also names municipalities and depa project areas. They are not ranked on this province map. Apart from a registered-population count on the municipality itself, other figures were published for the province. They are not copied onto the municipality.",
    th: "ไฟล์เมืองยังระบุเทศบาลและพื้นที่โครงการของดีป้า สิ่งเหล่านี้ไม่ได้ถูกจัดลำดับบนแผนที่จังหวัด นอกจากจำนวนประชากรตามทะเบียนของตัวเทศบาลเอง ตัวเลขอื่นถูกเผยแพร่ระดับจังหวัด และไม่ได้ถูกคัดลอกไปใส่เทศบาล",
    zh: "城市文件里还有市镇和 depa 项目片区。它们不在这张府地图上排名。除了市镇自己的户籍人口，其他数字是按府公布的，没有被抄到市镇头上。",
  },
  renewalShort: { en: "renewal not found", th: "ยังไม่พบการต่ออายุ", zh: "未找到续期" },
  renewedShort: { en: "renewed or new in 2025", th: "ต่ออายุหรือป้ายใหม่ในปี 2568", zh: "2568 年续期或新授牌" },
  eecHere: {
    en: "This province is in the Eastern Economic Corridor.",
    th: "จังหวัดนี้อยู่ในระเบียงเศรษฐกิจพิเศษภาคตะวันออก",
    zh: "这个府在东部经济走廊里。",
  },
  yes: { en: "yes", th: "ใช่", zh: "是" },
  no: { en: "no", th: "ไม่", zh: "否" },
  withheldProxy: {
    en: "This lens does not publish a ranking yet. The figure that would be allowed to order the map is not in the file, and a stand-in is not used.",
    th: "เลนส์นี้ยังไม่เผยแพร่ลำดับ ตัวเลขที่จะได้รับอนุญาตให้จัดลำดับบนแผนที่ยังไม่อยู่ในไฟล์ และไม่ใช้ตัวเลขแทน",
    zh: "这个镜头还不公布排名。允许给地图排序的数字还不在文件里，也不用替代数字。",
  },
  withheldEmpty: {
    en: "This lens does not publish a ranking. The figures it needs are not in the file.",
    th: "เลนส์นี้ไม่เผยแพร่ลำดับ ตัวเลขที่ต้องการยังไม่อยู่ในไฟล์",
    zh: "这个镜头不公布排名。它需要的数字还不在文件里。",
  },
  dashed: {
    en: "A darker province sits higher on this lens. A dashed edge is not scored.",
    th: "จังหวัดที่เข้มกว่าอยู่สูงกว่าในเลนส์นี้ เส้นประคือไม่ได้จัดลำดับ",
    zh: "在这个镜头里，颜色更深的府排得更靠前。虚线表示没有排名。",
  },
  notInFile: { en: "Not in the file", th: "ยังไม่อยู่ในไฟล์", zh: "还不在文件里" },
  notHere: { en: "Not published for this province", th: "ไม่ได้เผยแพร่สำหรับจังหวัดนี้", zh: "这个府没有公布" },
  oneProvince: {
    en: "Only one province has this figure, so its percentile sits in the middle.",
    th: "มีจังหวัดเดียวที่มีตัวเลขนี้ เปอร์เซ็นไทล์จึงอยู่ตรงกลาง",
    zh: "只有一个府有这个数字，所以它的百分位落在中间。",
  },
  lastGood: {
    en: "Last good copy. The refresh failed.",
    th: "สำเนาล่าสุดที่ใช้ได้ การดึงใหม่ไม่สำเร็จ",
    zh: "这是上一份还能用的副本。这次刷新失败了。",
  },
  coverageLine: { en: "inputs", th: "ตัวป้อน", zh: "项输入" },
  decreeMark: { en: "Emergency decree", th: "ประกาศฉุกเฉิน", zh: "紧急状态" },
  cambodiaMark: { en: "Cambodia border paused", th: "ชายแดนกัมพูชาหยุด", zh: "柬埔寨边境暂停" },
  noAirStation: { en: "No air station", th: "ไม่มีสถานีอากาศ", zh: "没有空气站点" },
  noCurrentReading: { en: "No current reading", th: "ไม่มีค่าปัจจุบัน", zh: "没有当前读数" },
  boiAbsent: { en: "Not in the BOI table", th: "ไม่อยู่ในตารางบีโอไอ", zh: "不在 BOI 表上" },
  boiJobsUnreported: { en: "Jobs not reported", th: "ไม่รายงานตำแหน่งงาน", zh: "岗位未报告" },
  boiZero: { en: "Published zero in the BOI table", th: "ศูนย์ที่ตารางบีโอไอเผยแพร่", zh: "BOI 表上公布的零" },
  noCheckpoint: { en: "No checkpoint, scored 0 on this lens. The file does not store a zero.", th: "ไม่มีด่าน ได้ 0 ในเลนส์นี้ ไฟล์ไม่ได้เก็บศูนย์", zh: "没有关口，在这个镜头里记 0。文件里不存零。" },
  zeroWeight: { en: "Weight zero, so it stays out", th: "น้ำหนักเป็นศูนย์ จึงไม่เข้าผลรวม", zh: "权重为零，所以不进总和" },
  reading: { en: "Reading the file.", th: "กำลังอ่านไฟล์", zh: "正在读取文件。" },
  failed: { en: "The baseline file did not load.", th: "ไฟล์ฐานไม่โหลด", zh: "基线文件没有载入。" },
  missingPage: { en: "This page is not on the site.", th: "หน้านี้ไม่มีบนเว็บ", zh: "这个页面不在站上。" },
  home: { en: "Back to the map", th: "กลับไปที่แผนที่", zh: "回到地图" },
  skip: { en: "Skip to the map", th: "ข้ามไปที่แผนที่", zh: "跳到地图" },
  mapLabel: { en: "Thailand by province", th: "ประเทศไทยรายจังหวัด", zh: "按府划分的泰国" },
  profile: { en: "Baseline", th: "ฐาน", zh: "基线" },
  why: { en: "Why this place", th: "ทำไมจังหวัดนี้", zh: "为什么是这里" },
  areasLabel: { en: "A label for the region, not a figure.", th: "ป้ายชื่อภาค ไม่ใช่ตัวเลข", zh: "这是区域的名称，不是一个数字。" },
  higher: { en: "Higher is better", th: "ยิ่งสูงยิ่งดี", zh: "越高越好" },
  lower: { en: "Lower is better", th: "ยิ่งต่ำยิ่งดี", zh: "越低越好" },
  asOf: { en: "as of", th: "ณ วันที่", zh: "截至" },
  provinces: { en: "provinces", th: "จังหวัด", zh: "个府" },
  json: { en: "Download JSON", th: "ดาวน์โหลด JSON", zh: "下载 JSON" },
  csv: { en: "Download CSV", th: "ดาวน์โหลด CSV", zh: "下载 CSV" },
  compareWith: { en: "Compare", th: "เทียบ", zh: "对照" },
  samePlace: { en: "Choose two different provinces.", th: "เลือกสองจังหวัดที่ไม่ซ้ำกัน", zh: "请选择两个不同的府。" },
  and: { en: "and", th: "กับ", zh: "和" },
  openMethods: { en: "How this lens is built", th: "เลนส์นี้สร้างอย่างไร", zh: "这个镜头怎么做的" },
  normalisationTitle: { en: "How a lens becomes an order", th: "เลนส์กลายเป็นลำดับอย่างไร", zh: "镜头如何变成名次" },
  airCert: {
    en: "The air feed was read even though its certificate did not verify. The numbers are the feed's numbers.",
    th: "อ่านค่าอากาศทั้งที่ใบรับรองไม่ผ่านการตรวจ ตัวเลขคือตัวเลขของฟีดนั้น",
    zh: "空气数据是在证书未能核验的情况下读取的。数字是该数据源自己的数字。",
  },
  geoCredit: {
    en: "Boundaries: geoBoundaries ADM1, built from OpenStreetMap (ODbL). Simplified for display.",
    th: "ขอบเขต: geoBoundaries ระดับจังหวัด สร้างจาก OpenStreetMap (ODbL) ย่อเพื่อการแสดงผล",
    zh: "边界：geoBoundaries 府级，基于 OpenStreetMap（ODbL）。为显示做了简化。",
  },
} as const;

export function t(lang: Lang, key: keyof typeof chrome): string {
  return tr(lang, chrome[key]);
}

export const methodParagraphs: Tr[] = [
  {
    en: "Each lens is a weighting you can read, not a secret score. Among the provinces that have a figure, each one gets a percentile. A tie takes the middle of the tie: provinces strictly below, plus half the provinces with the same value, divided by the provinces that have a value, times 100. Where lower is better, the percentile is flipped, so cleaner air gets the higher mark.",
    th: "แต่ละเลนส์คือน้ำหนักที่อ่านได้ ไม่ใช่คะแนนลับ ในบรรดาจังหวัดที่มีตัวเลข แต่ละจังหวัดได้เปอร์เซ็นไทล์ ค่าที่เท่ากันอยู่ตรงกลางของกลุ่มที่เท่ากัน นับจังหวัดที่ต่ำกว่า บวกครึ่งหนึ่งของจังหวัดที่ค่าเท่ากัน หารด้วยจำนวนจังหวัดที่มีค่า แล้วคูณหนึ่งร้อย ที่ซึ่งค่าน้อยกว่าดีกว่า เปอร์เซ็นไทล์ถูกกลับด้าน อากาศที่สะอาดกว่าจึงได้คะแนนสูงกว่า",
    zh: "每个镜头都是可以读懂的权重，不是隐藏分数。在有这个数字的府里，每个府得到一个百分位。并列的取并列的中间：严格更低的府，加上数值相同的府的一半，再除以有数值的府数，乘以 100。越低越好的数字，百分位会被反过来，所以更干净的空气得到更高的分。",
  },
  {
    en: "A province with no value is not given zero. The other figures it does have are reweighted so those weights still sum to the same total. A figure that is missing for every province is not in that total at all, and the page says it is not in the file. A weight you set to zero is left out. A yes or no, such as a special zone, does not by itself produce an order. Border trade, and talent and border investment, are the exception: a province with no land or river checkpoint scores 0 on those lenses, and that 0 counts as an input. The customs file still leaves the cell blank. That border mark is not a percentile. It is log(1 + the million-baht total), stretched from no checkpoint at 0 to the largest province at 100, so a small checkpoint gets a small mark.",
    th: "จังหวัดที่ไม่มีค่าจะไม่ถูกใส่ศูนย์ ตัวเลขอื่นที่จังหวัดนั้นมีจะถูกถ่วงน้ำหนักใหม่ให้ผลรวมเท่าเดิม ตัวเลขที่ขาดทุกจังหวัดจะไม่อยู่ในผลรวมนั้นเลย และหน้านี้บอกว่ายังไม่อยู่ในไฟล์ น้ำหนักที่ตั้งเป็นศูนย์จะถูกตัดออก ใช่หรือไม่ เช่น เขตพิเศษ จะไม่สร้างลำดับด้วยตัวเอง การค้าชายแดน และคนมีฝีมือกับการลงทุนชายแดน เป็นข้อยกเว้น จังหวัดที่ไม่มีด่านบกหรือด่านน้ำได้ 0 ในเลนส์เหล่านั้น และ 0 นั้นนับเป็นตัวป้อน ไฟล์ศุลกากรยังเว้นช่องนั้นว่าง คะแนนชายแดนนั้นไม่ใช่เปอร์เซ็นไทล์ มันคือ log(1 + ยอดล้านบาท) ยืดจากจังหวัดที่ไม่มีด่านที่ 0 ไปถึงจังหวัดที่มากที่สุดที่ 100 ดังนั้นด่านเล็กได้คะแนนเล็ก",
    zh: "没有数值的府不会被记成零。它确实有的其他数字会重新分配权重，使这些权重的总和不变。每个府都缺的数字根本不进这个总和，页面会写明它还不在文件里。你设成零的权重会被留在外面。是否，比如一个特区，本身不会产生名次。边境贸易，以及人才与边境投资，是例外：没有陆路或河路关口的府在这两个镜头里记 0，这个 0 算作一项输入。海关文件里那个格子仍然留空。这个边境分数不是百分位。它是 log（1 + 百万铢总额），从没有关口的 0 拉到贸易额最大的府的 100，所以小关口只得小分。",
  },
  {
    en: "The mark beside a province is the weighted mean of those percentiles, from 0 to 100, using only the figures that province actually has. A figure published for only one province sits at 50, the middle of a distribution of one, and it cannot separate cities until a second province has the same figure. This is not an official index.",
    th: "ค่าข้างจังหวัดคือค่าเฉลี่ยถ่วงน้ำหนักของเปอร์เซ็นไทล์เหล่านั้น จาก 0 ถึง 100 โดยใช้เฉพาะตัวเลขที่จังหวัดนั้นมีจริง ตัวเลขที่มีจังหวัดเดียวจะอยู่ที่ 50 คือตรงกลางของการกระจายที่มีสมาชิกเดียว และจะแยกเมืองไม่ออกจนกว่าจะมีจังหวัดที่สองที่มีตัวเลขเดียวกัน ที่นี่ไม่ใช่ดัชนีทางการ",
    zh: "府旁边的分数是这些百分位的加权平均，从 0 到 100，只用该府真正有的数字。只公布了一个府的数字会落在 50，也就是只有一个成员的分布的中点，在第二个府有同一个数字之前，它分不出城市。这不是官方指数。",
  },
  {
    en: "Each row says how many of the inputs in the file that province has, for example 5 of 7 inputs. A blank is not a zero. A province missing an input is placed after every province that has the full set, so a missing border total or a missing PM2.5 station cannot lift it. A province with fewer than 80 percent of those inputs is not ranked.",
    th: "แต่ละแถวบอกว่าจังหวัดนั้นมีตัวป้อนกี่ตัวจากตัวที่อยู่ในไฟล์ เช่น 5 จาก 7 ตัวป้อน ช่องว่างไม่ใช่ศูนย์ จังหวัดที่ขาดตัวป้อนจะถูกวางไว้หลังจังหวัดที่มีครบทุกตัว ดังนั้นยอดการค้าชายแดนที่หายไป หรือสถานี PM2.5 ที่ไม่มี จะยกจังหวัดนั้นขึ้นไม่ได้ จังหวัดที่มีตัวป้อนไม่ถึง 80 เปอร์เซ็นต์ของชุดนั้นจะไม่ถูกจัดลำดับ",
    zh: "每一行写明该府拥有文件里多少项输入，例如 7 项输入里的 5 项。空白不是零。缺一项输入的府排在输入齐全的府后面，所以缺少的边境贸易额或缺少的 PM2.5 站点不能把它抬上去。这些输入不足 80% 的府不进入名次。",
  },
];

export function ratePhrase(lang: Lang, rate: number): string {
  const pct = num(rate * 100, 1);
  if (lang === "th") return `${pct} เปอร์เซ็นต์ต่อปี`;
  if (lang === "zh") return `每年 ${pct} 个百分点`;
  return `${pct} percent a year`;
}

export function outOf100(lang: Lang, score: number): string {
  const n = num(score, 0);
  if (lang === "th") return `${n} จาก 100`;
  if (lang === "zh") return `100 分里的 ${n} 分`;
  return `${n} out of 100`;
}

export function coveragePhrase(lang: Lang, have: number, of: number): string {
  if (lang === "th") return `${have} จาก ${of} ตัวป้อน`;
  if (lang === "zh") return `${of} 项输入里的 ${have} 项`;
  return `${have} of ${of} inputs`;
}

const FLAG_IDS = new Set(["economy.sez", "economy.eec", "governance.emergency_decree"]);
const BOI_IDS = new Set(["economy.investment", "economy.boi_projects", "economy.boi_jobs"]);
const AIR_IDS = new Set(["env.pm25", "env.aqi"]);

export function gregorianProse(text: string): string {
  return text.replace(/https?:\/\/\S+|B\.E\.\s*(2[4-6]\d{2})|\b(2[4-6]\d{2})\b/g, (match, beYear: string | undefined, year: string | undefined) => {
    if (match.startsWith("http")) return match;
    return String(Number(beYear || year) - 543);
  });
}

function snapshotClause(lang: Lang, asOf: string | undefined): string {
  const raw = String(asOf || "");
  const hourly = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(raw);
  const day = hourly ? dateParts(hourly[1], hourly[2], hourly[3], undefined, lang) : whenPhrase(lang, asOf);
  const clock = hourly ? `${hourly[4]}:${hourly[5]}` : "";
  if (lang === "th") return clock ? `ภาพ ณ ${clock} น. เวลาประเทศไทย, ${day}` : `ภาพ ณ ${day} เวลาประเทศไทย`;
  if (lang === "zh") return clock ? `快照截至 ${clock}（泰国时间），${day}` : `快照截至${day}（泰国时间）`;
  return clock ? `snapshot as of ${clock} ICT, ${day}` : `snapshot as of ${day} ICT`;
}

const SINGULAR_EN: Record<string, string> = {
  datasets: "dataset",
  areas: "area",
  projects: "project",
  jobs: "job",
  firms: "firm",
  vehicles: "vehicle",
  beds: "bed",
  schools: "school",
  cases: "case",
  permits: "permit",
  days: "day",
  students: "student",
  physicians: "physician",
  "person-trips": "person-trip",
};

export function countUnit(lang: Lang, unit: string, value: number): string {
  if (lang === "en" && value === 1 && SINGULAR_EN[unit]) return SINGULAR_EN[unit];
  return unit;
}

function yearSpan(lang: Lang, from: string, to: string): string {
  const joiner = lang === "th" ? " ถึง " : lang === "zh" ? "至" : " to ";
  return `${whenPhrase(lang, from)}${joiner}${whenPhrase(lang, to)}`;
}

export function isFlagIndicator(indicator: { id: string; unit: Tr }): boolean {
  if (FLAG_IDS.has(indicator.id)) return true;
  return /^1 or 0$/i.test(indicator.unit.en) || /^1 =/.test(indicator.unit.en);
}

export function figurePhrase(lang: Lang, indicator: Indicator, value: Observation | null, published: boolean, jobsUnreported = false): string {
  if (!value) {
    if (indicator.id === "economy.boi_jobs" && jobsUnreported) return t(lang, "boiJobsUnreported");
    if (BOI_IDS.has(indicator.id) && published) return t(lang, "boiAbsent");
    return published ? t(lang, "notHere") : t(lang, "notInFile");
  }
  if (AIR_IDS.has(indicator.id)) {
    const airUnit = tr(lang, indicator.unit);
    const airShown = Number.isInteger(value.value) ? num(value.value, 0) : num(value.value, 1);
    return `${airShown} ${airUnit}, ${snapshotClause(lang, value.asOf || value.period)}`;
  }
  const when = whenPhrase(lang, value.period);
  if (isFlagIndicator(indicator)) {
    const word = value.value > 0 ? t(lang, "yes") : t(lang, "no");
    return `${word}, ${when}`;
  }
  const unit = countUnit(lang, tr(lang, indicator.unit), value.value);
  const shown = Number.isInteger(value.value) ? num(value.value, 0) : num(value.value, 1);
  const base = `${shown} ${unit}, ${when}`.replace(/\s+/g, " ").trim();
  if (indicator.id === "economy.boi_jobs" && value.value === 0) return t(lang, "boiJobsUnreported");
  if (BOI_IDS.has(indicator.id) && value.value === 0) return `${base}. ${t(lang, "boiZero")}`;
  return base;
}

export function indicatorLabel(lang: Lang, indicator: { id: string; name: Tr }): string {
  const label = tr(lang, indicator.name).trim();
  if (label && label !== indicator.id) return label;
  return tr(lang, indicator.name);
}

export function partSentence(lang: Lang, part: Part, lens: Lens, indicators: Indicator[]): string {
  const component = lens.components.find((item) => item.id === part.id);
  const name = component ? tr(lang, component.name) : part.id;
  const evidence = part.evidence;
  if (!evidence || part.value == null) return name;
  const publisher = publisherName(lang, evidence.publisher || "");
  const when = whenPhrase(lang, evidence.asOf);
  if (evidence.absentAsZero) {
    return `${name}: ${t(lang, "noCheckpoint")} ${publisher}, ${whenPhrase(lang, evidence.period)}.`;
  }
  if (part.kind === "cagr") {
    const base = `${name}: ${ratePhrase(lang, part.value)}, ${yearSpan(lang, String(evidence.fromYear ?? ""), String(evidence.toYear ?? ""))}. ${publisher}, ${when}.`;
    return part.places === 1 ? `${base} ${t(lang, "oneProvince")}` : base;
  }
  if (part.kind === "flag") {
    const word = part.value && part.value > 0 ? t(lang, "yes") : t(lang, "no");
    const base = `${name}: ${word}, ${whenPhrase(lang, evidence.period)}. ${publisher}, ${when}.`;
    return evidence.stale ? `${base} ${t(lang, "lastGood")}` : base;
  }
  if (part.kind === "ratio") {
    const mul = component?.display?.mul || 1;
    const digits = component?.display?.digits ?? 2;
    const unit = component?.display ? tr(lang, component.display.unit) : "";
    const base = `${name}: ${num(part.value * mul, digits)} ${unit}. ${publisher}, ${when}.`.replace(/\s+/g, " ").trim();
    return part.places === 1 ? `${base} ${t(lang, "oneProvince")}` : base;
  }
  const indicatorId = component?.indicatorId || part.id;
  const indicator = indicators.find((item) => item.id === indicatorId);
  const unit = indicator ? countUnit(lang, tr(lang, indicator.unit), part.value) : "";
  const shown = Number.isInteger(part.value) ? num(part.value, 0) : num(part.value, 1);
  const base = `${name}: ${shown} ${unit}, ${whenPhrase(lang, evidence.period)}. ${publisher}, ${when}.`.replace(/\s+/g, " ").trim();
  const withMiddle = part.places === 1 ? `${base} ${t(lang, "oneProvince")}` : base;
  return evidence.stale ? `${withMiddle} ${t(lang, "lastGood")}` : withMiddle;
}

export function namesFor(lang: Lang, lens: Lens, ids: string[]): string {
  return ids
    .map((id) => {
      const component = lens.components.find((item) => item.id === id);
      return component ? tr(lang, component.name) : id;
    })
    .join(", ");
}

export function topParts(row: ScoreRow): Part[] {
  return row.parts
    .filter((part) => part.state === "used" || part.state === "flag-used")
    .slice()
    .sort((a, b) => (b.contribution || 0) - (a.contribution || 0))
    .slice(0, 3);
}

export function gapSentence(lang: Lang, kind: "price" | "reputation" | "appraisal", gap: number, percentile: number, places: number, source: string, asOf: string): string {
  const publisher = publisherName(lang, source);
  const above = gap >= 0;
  const mag = num(Math.abs(gap), 1);
  const pct = num(percentile, 0);
  if (lang === "th") {
    const side = above ? "สูงกว่า" : "ต่ำกว่า";
    const what = kind === "reputation" ? "เปอร์เซ็นไทล์ของชื่อเสียง" : kind === "appraisal" ? "เปอร์เซ็นไทล์ของราคาประเมินราชการ" : "เปอร์เซ็นไทล์ของราคา";
    const tail = kind === "appraisal" ? " ราคาประเมินไม่ใช่ราคาตลาด." : "";
    return `คะแนนเลนส์อยู่${side}${what} ${mag} คะแนน (${pct} จาก 100, ${places} จังหวัด). ${publisher}, ${whenPhrase(lang, asOf)}.${tail}`;
  }
  if (lang === "zh") {
    const side = above ? "高于" : "低于";
    const what = kind === "reputation" ? "名声百分位" : kind === "appraisal" ? "官方评估价的百分位" : "价格百分位";
    const tail = kind === "appraisal" ? "评估价不是市场价。" : "";
    return `镜头分数${side}${what} ${mag} 分（百分位 ${pct}，${places} 个府）。${publisher}，${whenPhrase(lang, asOf)}。${tail}`;
  }
  const side = above ? "above" : "below";
  const what = kind === "reputation" ? "the reputation percentile" : kind === "appraisal" ? "the official-appraisal percentile" : "the price percentile";
  const tail = kind === "appraisal" ? " The appraisal is not a market price." : "";
  return `The lens mark sits ${mag} points ${side} ${what} (${pct} out of 100, ${places} provinces). ${publisher}, ${whenPhrase(lang, asOf)}.${tail}`;
}

export function depaSentence(lang: Lang, status: string | undefined): string {
  if (!status) return "";
  if (/renewal not found/i.test(status)) return t(lang, "depaNotFound");
  if (/renewed\/new|newly labelled|new \(effective/i.test(status)) return t(lang, "depaRenewed");
  return "";
}

export const regions: Record<string, Tr> = {
  bangkok: { en: "Bangkok", th: "กรุงเทพมหานคร", zh: "曼谷" },
  central: { en: "Central", th: "ภาคกลาง", zh: "中部" },
  north: { en: "North", th: "ภาคเหนือ", zh: "北部" },
  northeast: { en: "Northeast", th: "ภาคตะวันออกเฉียงเหนือ", zh: "东北部" },
  east: { en: "East", th: "ภาคตะวันออก", zh: "东部" },
  west: { en: "West", th: "ภาคตะวันตก", zh: "西部" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
};
