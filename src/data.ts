// Smart City Thailand Index — data layer (TypeScript port)

export interface Move {
  tag: string;
  title: string;
  body: string;
}

export interface CityLocale {
  name: string;
  province: string;
  tagline?: string;
}

export interface City {
  id: string;
  rank: number;
  score: number;
  region: string;
  en: CityLocale;
  th: CityLocale;
  pillars: Record<string, number>;
  highlights_en?: string[];
  highlights_th?: string[];
  moves_en?: Move[];
  moves_th?: Move[];
  verdict_en?: string;
  verdict_th?: string;
}

export interface Pillar {
  id: string;
  en: string;
  th: string;
  hint_en: string;
  hint_th: string;
}

export interface Region {
  id: string;
  en: string;
  th: string;
}

export interface NewsItem {
  date: string;
  city: string;
  body: string;
}

export interface Source {
  en: string;
  th: string;
  kind: string;
  url: string;
}

export interface MethodItem {
  h: string;
  p: string;
}

export const PILLARS: Pillar[] = [
  { id: "livability",  en: "Livability",   th: "ความน่าอยู่",    hint_en: "Daily life quality",        hint_th: "คุณภาพชีวิตประจำวัน" },
  { id: "economy",     en: "Economy",      th: "เศรษฐกิจ",       hint_en: "Productive output",         hint_th: "ผลิตภาพและรายได้" },
  { id: "safety",      en: "Safety",       th: "ความปลอดภัย",    hint_en: "Crime, road, disaster",     hint_th: "อาชญากรรม จราจร ภัย" },
  { id: "wellbeing",   en: "Wellbeing",    th: "คุณภาพชีวิต",    hint_en: "Health, time, dignity",     hint_th: "สุขภาพ เวลา ศักดิ์ศรี" },
  { id: "environment", en: "Environment",  th: "สิ่งแวดล้อม",    hint_en: "Air, water, green",         hint_th: "อากาศ น้ำ พื้นที่สีเขียว" },
  { id: "civic",       en: "Civic",        th: "อัธยาศัย",       hint_en: "Trust, voice, openness",    hint_th: "ความไว้ใจ การมีส่วนร่วม" },
  { id: "digital",     en: "Digital",      th: "ดิจิทัล",        hint_en: "Connectivity, services",    hint_th: "การเชื่อมต่อ บริการ" },
];

export const REGIONS: Region[] = [
  { id: "north",     en: "North",         th: "เหนือ" },
  { id: "northeast", en: "Northeast",     th: "อีสาน" },
  { id: "central",   en: "Central",       th: "กลาง" },
  { id: "bangkok",   en: "Bangkok Metro", th: "กรุงเทพฯ" },
  { id: "east",      en: "East",          th: "ตะวันออก" },
  { id: "south",     en: "South",         th: "ใต้" },
  { id: "west",      en: "West",          th: "ตะวันตก" },
];

export const CITIES: City[] = [
  {
    id: "phuket", rank: 1, score: 72.8, region: "south",
    en: { name: "Phuket Smart City",        province: "Phuket",        tagline: "Tourism economy that actually pays the bills." },
    th: { name: "ภูเก็ตสมาร์ทซิตี้",            province: "ภูเก็ต",          tagline: "เศรษฐกิจท่องเที่ยวที่จ่ายค่าใช้จ่ายได้จริง" },
    pillars: { livability: 71, economy: 84, safety: 68, wellbeing: 70, environment: 64, civic: 73, digital: 79 },
    highlights_en: ["GPP ฿492K / capita", "PM2.5 — 18.2 µg/m³", "88% hospitality employment", "72% digital adoption"],
    highlights_th: ["GPP 492K บาท/คน", "PM2.5 18.2 µg/m³", "การจ้างงานในภาคบริการ 88%", "การใช้งานดิจิทัล 72%"],
    moves_en: [
      { tag: "Operating", title: "Tourist e-permit",         body: "Single window for stays, vendors, mooring." },
      { tag: "Operating", title: "Phuket Smart Bus",          body: "GPS-tracked, ฿100 day pass, 12 routes."   },
      { tag: "Building",  title: "Light-rail Phase 1",        body: "Airport → Chalong, target 2028."          },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "ใบอนุญาตนักท่องเที่ยวอิเล็กทรอนิกส์", body: "ช่องทางเดียวสำหรับที่พัก ผู้ค้า และจุดจอดเรือ" },
      { tag: "ดำเนินการแล้ว", title: "ภูเก็ตสมาร์ทบัส",                       body: "ติดตามด้วย GPS, ตั๋วรายวัน 100 บาท, 12 เส้นทาง" },
      { tag: "กำลังก่อสร้าง",  title: "รถไฟฟ้ารางเบา ระยะ 1",                  body: "สนามบิน → ฉลอง คาดเสร็จ 2571" },
    ],
    verdict_en: "Real outcomes, not paper plans. Tourism revenue funds visible public goods.",
    verdict_th: "ผลลัพธ์จริง ไม่ใช่แค่แผนกระดาษ รายได้ท่องเที่ยวกลับมาเป็นบริการสาธารณะ",
  },
  {
    id: "saimburi", rank: 2, score: 72.4, region: "bangkok",
    en: { name: "Sai-mburi Smart District", province: "Bangkok",       tagline: "A 1.4 km² wedge of Bangkok that works." },
    th: { name: "สามย่านสมาร์ทซิตี้",          province: "กรุงเทพฯ",       tagline: "พื้นที่ 1.4 ตร.กม. ของกรุงเทพฯ ที่ใช้งานได้จริง" },
    pillars: { livability: 78, economy: 82, safety: 74, wellbeing: 71, environment: 70, civic: 64, digital: 80 },
    highlights_en: ["GPP ฿628K / capita", "200+ active startups", "8-min walkscore", "Underground utilities"],
    highlights_th: ["GPP 628K บาท/คน", "สตาร์ทอัพ 200+ ราย", "เดินถึงทุกอย่างใน 8 นาที", "สาธารณูปโภคใต้ดิน"],
    moves_en: [
      { tag: "Operating", title: "EV-only zone",          body: "Combustion vehicles excluded after 2024." },
      { tag: "Operating", title: "Mixed-income housing",  body: "20% units rent-controlled, 30-year lease." },
      { tag: "Building",  title: "Skywalk extension",     body: "Connects Sam Yan ↔ Siam ↔ Chulalongkorn." },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "เขตปลอดเครื่องยนต์สันดาป", body: "ห้ามยานยนต์น้ำมันตั้งแต่ปี 2567" },
      { tag: "ดำเนินการแล้ว", title: "ที่อยู่อาศัยผสมรายได้",     body: "20% ของห้องเป็นค่าเช่าควบคุม สัญญา 30 ปี" },
      { tag: "กำลังก่อสร้าง", title: "ทางเดินยกระดับ ส่วนต่อขยาย", body: "เชื่อม สามย่าน ↔ สยาม ↔ จุฬาฯ" },
    ],
    verdict_en: "A model of dense, walkable, well-funded urbanism — at one district's scale.",
    verdict_th: "ต้นแบบเมืองหนาแน่น เดินสะดวก ทุนหนา — ในระดับย่านเดียว",
  },
  {
    id: "khonkaen", rank: 3, score: 70.2, region: "northeast",
    en: { name: "Khon Kaen Smart City",     province: "Khon Kaen",     tagline: "Northeast's serious bid for transit-oriented growth." },
    th: { name: "ขอนแก่นสมาร์ทซิตี้",         province: "ขอนแก่น",        tagline: "ความตั้งใจของอีสานเรื่องเมืองที่เติบโตรอบขนส่งมวลชน" },
    pillars: { livability: 68, economy: 65, safety: 71, wellbeing: 69, environment: 73, civic: 78, digital: 67 },
    highlights_en: ["LRT under construction", "Smart bus running", "Provincially-funded 60%", "12-municipality compact"],
    highlights_th: ["LRT อยู่ระหว่างก่อสร้าง", "สมาร์ทบัสให้บริการแล้ว", "ทุนจังหวัดเอง 60%", "ความตกลง 12 เทศบาล"],
    moves_en: [
      { tag: "Building",   title: "Khon Kaen LRT North–South", body: "26 km, target opening 2027 Phase 1." },
      { tag: "Operating",  title: "Smart Bus Network",         body: "Real-time tracking, ฿15 flat fare." },
      { tag: "Operating",  title: "Open-data portal",          body: "311 datasets, monthly refresh." },
    ],
    moves_th: [
      { tag: "กำลังก่อสร้าง", title: "ขอนแก่น LRT เหนือ–ใต้", body: "26 กม. คาดเปิดเฟส 1 ปี 2570" },
      { tag: "ดำเนินการแล้ว", title: "เครือข่ายสมาร์ทบัส",       body: "ติดตามเรียลไทม์ ค่าโดยสาร 15 บาทตลอดสาย" },
      { tag: "ดำเนินการแล้ว", title: "พอร์ทัลข้อมูลเปิด",          body: "311 ชุดข้อมูล อัปเดตรายเดือน" },
    ],
    verdict_en: "Rare provincial city financing its own transit. Watch this one.",
    verdict_th: "หาได้ยาก: เมืองภูมิภาคที่ลงทุนระบบขนส่งของตัวเอง",
  },
  {
    id: "cmu", rank: 4, score: 70.2, region: "north",
    en: { name: "CMU Smart City",            province: "Chiang Mai",   tagline: "Campus-scale lab that punches above its weight." },
    th: { name: "มหาวิทยาลัยเชียงใหม่ สมาร์ทซิตี้", province: "เชียงใหม่",     tagline: "ห้องทดลองสเกลมหาวิทยาลัยที่ส่งผลเกินขนาด" },
    pillars: { livability: 75, economy: 60, safety: 78, wellbeing: 75, environment: 72, civic: 68, digital: 81 },
    highlights_en: ["30% campus energy reduction", "12 AI traffic intersections", "Solar 4.2 MW installed", "EV shuttle fleet"],
    highlights_th: ["ลดใช้พลังงาน 30%", "ทางแยก AI 12 จุด", "โซลาร์ 4.2 เมกะวัตต์", "รถรับ-ส่งไฟฟ้า"],
    moves_en: [
      { tag: "Operating", title: "Smart microgrid",      body: "Self-balanced, 38% renewable in 2025." },
      { tag: "Operating", title: "Sensor-fed HVAC",      body: "Adapts to occupancy across 120 buildings." },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "ไมโครกริดอัจฉริยะ", body: "สมดุลในตัว พลังงานหมุนเวียน 38% ปี 2568" },
      { tag: "ดำเนินการแล้ว", title: "ปรับอากาศใช้เซ็นเซอร์", body: "ปรับตามการใช้งานในอาคาร 120 หลัง" },
    ],
    verdict_en: "A teaching tool that quietly outperforms most cities on this list.",
    verdict_th: "เครื่องมือสอนที่ทำผลงานเงียบ ๆ ดีกว่าเมืองส่วนใหญ่ในรายการ",
  },
  {
    id: "bangsaen", rank: 5, score: 67.5, region: "east",
    en: { name: "Bang Saen Smart City",      province: "Chonburi",     tagline: "EEC bet on a beach town with university muscle." },
    th: { name: "แสนสุขสมาร์ทซิตี้",            province: "ชลบุรี",         tagline: "ความหวัง EEC ในเมืองชายหาดที่มีมหาวิทยาลัย" },
    pillars: { livability: 70, economy: 68, safety: 65, wellbeing: 64, environment: 68, civic: 67, digital: 70 },
    highlights_en: ["Beach water-quality monitoring", "Smart parking 1,200 bays", "EEC corridor adjacent"],
    highlights_th: ["ตรวจคุณภาพน้ำชายหาด", "จุดจอดรถอัจฉริยะ 1,200 จุด", "ติดเขต EEC"],
    moves_en: [
      { tag: "Operating", title: "Coastal sensor mesh",   body: "Live wave, current, water-quality data." },
      { tag: "Building",  title: "Bang Saen ↔ U-Tapao",   body: "Express bus to airport, late 2026." },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "เครือข่ายเซ็นเซอร์ชายฝั่ง", body: "ข้อมูลคลื่น กระแสน้ำ คุณภาพน้ำเรียลไทม์" },
      { tag: "กำลังก่อสร้าง", title: "แสนสุข ↔ อู่ตะเภา",       body: "รถด่วนสู่สนามบิน ปลายปี 2569" },
    ],
    verdict_en: "Beach town meets industrial corridor. Promising, uneven.",
    verdict_th: "เมืองชายหาดเจอกับเขตอุตสาหกรรม น่าจับตา แต่ยังไม่สม่ำเสมอ",
  },
  {
    id: "rayong", rank: 6, score: 64.4, region: "east",
    en: { name: "Rayong Smart City",         province: "Rayong",       tagline: "Industrial wealth, uneven public realm." },
    th: { name: "ระยองสมาร์ทซิตี้",            province: "ระยอง",          tagline: "ความมั่งคั่งจากอุตสาหกรรม กับพื้นที่สาธารณะที่เหลื่อมล้ำ" },
    pillars: { livability: 60, economy: 86, safety: 62, wellbeing: 58, environment: 52, civic: 60, digital: 70 },
    highlights_en: ["GPP ฿1.1M / capita (#1)", "PM2.5 — 28.6 µg/m³", "EEC anchor", "Air-monitor network"],
    highlights_th: ["GPP 1.1 ล้านบาท/คน (อันดับ 1)", "PM2.5 28.6 µg/m³", "ฐาน EEC", "เครือข่ายตรวจอากาศ"],
    moves_en: [
      { tag: "Operating", title: "Real-time air sensors",  body: "32 stations. Public dashboard updated every 15 min." },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "เซ็นเซอร์อากาศเรียลไทม์", body: "32 สถานี อัปเดตทุก 15 นาที" },
    ],
    verdict_en: "Has the money. Hasn't yet bought the livability.",
    verdict_th: "มีเงิน แต่ยังไม่ได้แลกเป็นคุณภาพการอยู่อาศัย",
  },
  {
    id: "korat", rank: 7, score: 64.9, region: "northeast",
    en: { name: "Korat Smart City",          province: "Nakhon Ratchasima", tagline: "Gateway to the Northeast, slowly digitizing." },
    th: { name: "โคราชสมาร์ทซิตี้",           province: "นครราชสีมา",     tagline: "ประตูสู่อีสาน ที่ค่อย ๆ ปรับเข้าสู่ดิจิทัล" },
    pillars: { livability: 62, economy: 64, safety: 67, wellbeing: 65, environment: 70, civic: 62, digital: 60 },
    highlights_en: ["Smart traffic 18 junctions", "Rail-link to BKK 2028", "Population 2.6 M province"],
    highlights_th: ["จราจรอัจฉริยะ 18 จุด", "รถไฟเชื่อม กทม. ปี 2571", "จังหวัด 2.6 ล้านคน"],
    moves_en: [
      { tag: "Building",  title: "BKK ↔ Korat HSR",       body: "Phase 1, 2028 target." },
    ],
    moves_th: [
      { tag: "กำลังก่อสร้าง", title: "รถไฟความเร็วสูง กทม. ↔ โคราช", body: "ระยะ 1 คาดเสร็จ 2571" },
    ],
    verdict_en: "Patient progress. Becomes a different city when HSR opens.",
    verdict_th: "ค่อยเป็นค่อยไป จะเปลี่ยนโฉมเมื่อรถไฟความเร็วสูงเปิด",
  },
  {
    id: "cmoldtown", rank: 8, score: 69.7, region: "north",
    en: { name: "Chiang Mai Smart Old Town", province: "Chiang Mai",   tagline: "Heritage zone managed as living infrastructure." },
    th: { name: "เชียงใหม่สมาร์ทโอลด์ทาวน์",   province: "เชียงใหม่",     tagline: "ย่านมรดกที่จัดการแบบโครงสร้างพื้นฐานที่ยังมีชีวิต" },
    pillars: { livability: 74, economy: 62, safety: 70, wellbeing: 73, environment: 64, civic: 76, digital: 64 },
    highlights_en: ["300+ temple sensors", "PM2.5 — 46.1 µg/m³ (concern)", "Vehicle quota in moat zone"],
    highlights_th: ["เซ็นเซอร์วัด 300+ จุด", "PM2.5 46.1 µg/m³ (น่ากังวล)", "โควตารถยนต์ในคูเมือง"],
    moves_en: [
      { tag: "Operating", title: "Heritage sensor net",   body: "Vibration, humidity, crowd density per temple." },
    ],
    moves_th: [
      { tag: "ดำเนินการแล้ว", title: "เครือข่ายเซ็นเซอร์มรดก", body: "การสั่นสะเทือน ความชื้น ความหนาแน่นต่อวัด" },
    ],
    verdict_en: "Charming, monitored, but the air quality crisis remains unsolved.",
    verdict_th: "มีเสน่ห์ มีข้อมูล แต่วิกฤตอากาศยังแก้ไม่ได้",
  },
  {
    id: "yala", rank: 9, score: 55.8, region: "south",
    en: { name: "Yala Smart City",          province: "Yala",          tagline: "Patient urban planning under unusual constraints." },
    th: { name: "ยะลาสมาร์ทซิตี้",           province: "ยะลา",          tagline: "การวางผังเมืองที่อดทนภายใต้เงื่อนไขพิเศษ" },
    pillars: { livability: 56, economy: 50, safety: 48, wellbeing: 54, environment: 70, civic: 54, digital: 56 },
    highlights_en: ["Original grid plan from 1933", "Civic centre revival", "Tree canopy 32%"],
    highlights_th: ["ผังเมืองดั้งเดิม 2476", "ฟื้นย่านศาลากลาง", "พื้นที่ร่มไม้ 32%"],
    verdict_en: "A planning legacy worth preserving. Gets too little national attention.",
    verdict_th: "มรดกการวางผังที่ควรรักษาไว้ ได้รับความสนใจระดับประเทศน้อยเกินควร",
  },
  {
    id: "nstham", rank: 10, score: 62.9, region: "south",
    en: { name: "Nakhon Si Thammarat Smart", province: "Nakhon Si Thammarat", tagline: "Ancient capital trying telemedicine and flood sensors." },
    th: { name: "นครศรีธรรมราชสมาร์ทซิตี้",   province: "นครศรีธรรมราช",  tagline: "เมืองเก่าที่ทดลองเทเลเมดและเซ็นเซอร์น้ำท่วม" },
    pillars: { livability: 64, economy: 58, safety: 64, wellbeing: 62, environment: 68, civic: 60, digital: 64 },
    highlights_en: ["Telehealth across 41 sub-districts", "Flood-warning network"],
    highlights_th: ["บริการเทเลเมด 41 ตำบล", "เครือข่ายเตือนน้ำท่วม"],
    verdict_en: "Quiet competence in two pillars; weak in everything else.",
    verdict_th: "ทำสองด้านได้ดีเงียบ ๆ ส่วนอื่นยังอ่อน",
  },
  {
    id: "chiangrai", rank: 11, score: 63.8, region: "north",
    en: { name: "Chiang Rai Smart City",     province: "Chiang Rai",   tagline: "Border province quietly building its own dashboards." },
    th: { name: "เชียงรายสมาร์ทซิตี้",        province: "เชียงราย",      tagline: "เมืองชายแดนที่สร้างแดชบอร์ดของตัวเองอย่างเงียบ ๆ" },
    pillars: { livability: 66, economy: 56, safety: 70, wellbeing: 66, environment: 68, civic: 62, digital: 60 },
    verdict_en: "Steady, modest, real.",
    verdict_th: "มั่นคง เรียบง่าย ของจริง",
  },
  {
    id: "ubon", rank: 12, score: 61.1, region: "northeast",
    en: { name: "Ubon Ratchathani Smart",    province: "Ubon Ratchathani", tagline: "River city, smart-water focus." },
    th: { name: "อุบลราชธานีสมาร์ทซิตี้",       province: "อุบลราชธานี",   tagline: "เมืองแม่น้ำ เน้นจัดการน้ำอัจฉริยะ" },
    pillars: { livability: 60, economy: 58, safety: 64, wellbeing: 62, environment: 66, civic: 60, digital: 56 },
    verdict_en: "Right priorities for its geography.",
    verdict_th: "เลือกเรื่องที่ถูกต้องตามสภาพภูมิศาสตร์",
  },
  {
    id: "nan", rank: 13, score: 65.7, region: "north",
    en: { name: "Nan Smart City",            province: "Nan",          tagline: "Small city, careful design." },
    th: { name: "น่านสมาร์ทซิตี้",            province: "น่าน",          tagline: "เมืองเล็ก ออกแบบอย่างระมัดระวัง" },
    pillars: { livability: 70, economy: 50, safety: 72, wellbeing: 70, environment: 78, civic: 64, digital: 56 },
    verdict_en: "Proves you don't need scale to do this well.",
    verdict_th: "พิสูจน์ว่าไม่ต้องใหญ่ก็ทำดีได้",
  },
  {
    id: "nonthaburi", rank: 14, score: 63.3, region: "central",
    en: { name: "Nonthaburi Smart City",     province: "Nonthaburi",   tagline: "BKK's biggest suburb, slowly stitching itself together." },
    th: { name: "นนทบุรีสมาร์ทซิตี้",          province: "นนทบุรี",        tagline: "ปริมณฑลที่ใหญ่ที่สุด ค่อย ๆ เย็บตัวเอง" },
    pillars: { livability: 66, economy: 64, safety: 64, wellbeing: 62, environment: 60, civic: 60, digital: 68 },
    verdict_en: "More commuters than residents. Still finding its identity.",
    verdict_th: "คนเดินทางมากกว่าคนอยู่ ยังหาตัวตน",
  },
  {
    id: "petchburi-iot", rank: 15, score: 65.9, region: "central",
    en: { name: "Phetchaburi IoT", province: "Phetchaburi", tagline: "Sensor-first small city." },
    th: { name: "เพชรบุรีโกสินทร์อัจฉริยะ", province: "เพชรบุรี", tagline: "เมืองเล็กที่เน้นเซ็นเซอร์ก่อน" },
    pillars: { livability: 64, economy: 56, safety: 66, wellbeing: 62, environment: 70, civic: 60, digital: 70 },
    verdict_en: "Quiet compounding.",
    verdict_th: "ทบต้นเงียบ ๆ",
  },
  {
    id: "laemchabang", rank: 16, score: 66.4, region: "east",
    en: { name: "Laem Chabang Smart", province: "Chonburi", tagline: "Port-led, logistics-first." },
    th: { name: "แหลมฉบังสมาร์ทซิตี้", province: "ชลบุรี", tagline: "ท่าเรือนำ โลจิสติกส์ก่อน" },
    pillars: { livability: 60, economy: 76, safety: 60, wellbeing: 58, environment: 56, civic: 58, digital: 68 },
    verdict_en: "Logistics works. People feel like guests.",
    verdict_th: "โลจิสติกส์ทำงานได้ คนรู้สึกเป็นแขก",
  },
  {
    id: "wangchan", rank: 17, score: 29.7, region: "east",
    en: { name: "Wangchan Valley Smart", province: "Rayong", tagline: "PTT's company-town experiment." },
    th: { name: "วังจันทร์วัลเล่ย์สมาร์ทซิตี้", province: "ระยอง", tagline: "เมืองสร้างโดยบริษัท ทดลองโดย ปตท." },
    pillars: { livability: 45, economy: 50, safety: 60, wellbeing: 30, environment: 52, civic: 22, digital: 70 },
    verdict_en: "Plenty of fibre. Almost no civic life.",
    verdict_th: "ไฟเบอร์เยอะ แต่ชีวิตพลเมืองแทบไม่มี",
  },
  {
    id: "khlongtoei", rank: 18, score: 58.0, region: "bangkok",
    en: { name: "Khlong Toei District", province: "Bangkok", tagline: "Port district experiment." },
    th: { name: "คลองเตยสมาร์ทดิสทริค", province: "กรุงเทพฯ", tagline: "เขตท่าเรือทดลอง" },
    pillars: { livability: 56, economy: 70, safety: 52, wellbeing: 50, environment: 48, civic: 60, digital: 66 },
  },
  {
    id: "saraburi", rank: 19, score: 57.6, region: "central",
    en: { name: "Saraburi Industrial Smart", province: "Saraburi", tagline: "Cement country goes low-carbon (slowly)." },
    th: { name: "สระบุรีอุตสาหกรรมอัจฉริยะ", province: "สระบุรี", tagline: "เมืองปูนซีเมนต์ขยับสู่คาร์บอนต่ำ (ช้า)" },
    pillars: { livability: 52, economy: 70, safety: 58, wellbeing: 50, environment: 44, civic: 58, digital: 60 },
  },
  {
    id: "udonthani", rank: 20, score: 60.4, region: "northeast",
    en: { name: "Udon Thani Smart", province: "Udon Thani", tagline: "Logistics gateway, quiet ambition." },
    th: { name: "อุดรธานีสมาร์ทซิตี้", province: "อุดรธานี", tagline: "ประตูโลจิสติกส์ ทะเยอทะยานเงียบ ๆ" },
    pillars: { livability: 60, economy: 60, safety: 64, wellbeing: 58, environment: 64, civic: 58, digital: 60 },
  },
  {
    id: "songkhla", rank: 21, score: 60.0, region: "south",
    en: { name: "Songkhla–Hat Yai", province: "Songkhla", tagline: "Twin-city governance challenge." },
    th: { name: "สงขลา–หาดใหญ่สมาร์ท", province: "สงขลา", tagline: "ความท้าทายเมืองคู่" },
    pillars: { livability: 60, economy: 64, safety: 56, wellbeing: 58, environment: 62, civic: 58, digital: 64 },
  },
  {
    id: "trang", rank: 22, score: 58.2, region: "south",
    en: { name: "Trang Smart", province: "Trang", tagline: "Food city, quiet pilots." },
    th: { name: "ตรังสมาร์ทซิตี้", province: "ตรัง", tagline: "เมืองอาหาร ทดลองเงียบ ๆ" },
    pillars: { livability: 60, economy: 56, safety: 62, wellbeing: 58, environment: 60, civic: 56, digital: 56 },
  },
  {
    id: "samutprakan", rank: 23, score: 59.8, region: "central",
    en: { name: "Samut Prakan Smart", province: "Samut Prakan", tagline: "Industrial belt of BKK metro." },
    th: { name: "สมุทรปราการสมาร์ท", province: "สมุทรปราการ", tagline: "เขตอุตสาหกรรมปริมณฑล" },
    pillars: { livability: 54, economy: 68, safety: 56, wellbeing: 54, environment: 46, civic: 54, digital: 64 },
  },
  {
    id: "ayutthaya", rank: 24, score: 60.8, region: "central",
    en: { name: "Ayutthaya Heritage Smart", province: "Ayutthaya", tagline: "World-heritage management city." },
    th: { name: "อยุธยาเฮอริเทจสมาร์ท", province: "พระนครศรีอยุธยา", tagline: "เมืองบริหารมรดกโลก" },
    pillars: { livability: 60, economy: 58, safety: 62, wellbeing: 60, environment: 58, civic: 64, digital: 60 },
  },
  {
    id: "krabi", rank: 25, score: 59.2, region: "south",
    en: { name: "Krabi Smart", province: "Krabi", tagline: "Tourism town, pilot heavy." },
    th: { name: "กระบี่สมาร์ทซิตี้", province: "กระบี่", tagline: "เมืองท่องเที่ยว ทดลองเยอะ" },
    pillars: { livability: 60, economy: 60, safety: 58, wellbeing: 58, environment: 66, civic: 56, digital: 56 },
  },
  {
    id: "kanchanaburi", rank: 26, score: 56.4, region: "west",
    en: { name: "Kanchanaburi Smart", province: "Kanchanaburi", tagline: "Border, river, frontier." },
    th: { name: "กาญจนบุรีสมาร์ท", province: "กาญจนบุรี", tagline: "ชายแดน แม่น้ำ ชายขอบ" },
    pillars: { livability: 56, economy: 50, safety: 60, wellbeing: 54, environment: 64, civic: 56, digital: 54 },
  },
  {
    id: "phitsanulok", rank: 27, score: 56.0, region: "north",
    en: { name: "Phitsanulok Smart", province: "Phitsanulok", tagline: "Lower-north hub." },
    th: { name: "พิษณุโลกสมาร์ท", province: "พิษณุโลก", tagline: "ฮับเหนือล่าง" },
    pillars: { livability: 58, economy: 54, safety: 58, wellbeing: 56, environment: 60, civic: 54, digital: 52 },
  },
  {
    id: "lampang", rank: 28, score: 55.4, region: "north",
    en: { name: "Lampang Smart", province: "Lampang", tagline: "Small north, slow start." },
    th: { name: "ลำปางสมาร์ท", province: "ลำปาง", tagline: "เมืองเหนือเล็ก เริ่มช้า" },
    pillars: { livability: 56, economy: 50, safety: 58, wellbeing: 54, environment: 60, civic: 54, digital: 50 },
  },
  {
    id: "buriram", rank: 29, score: 54.8, region: "northeast",
    en: { name: "Buriram Smart", province: "Buriram", tagline: "Stadium town, broader ambitions." },
    th: { name: "บุรีรัมย์สมาร์ท", province: "บุรีรัมย์", tagline: "เมืองสนามกีฬา ที่ทะเยอทะยานกว่านั้น" },
    pillars: { livability: 54, economy: 52, safety: 58, wellbeing: 54, environment: 58, civic: 54, digital: 50 },
  },
  {
    id: "loei", rank: 30, score: 53.0, region: "northeast",
    en: { name: "Loei Smart", province: "Loei", tagline: "Mountain border, environmental focus." },
    th: { name: "เลยสมาร์ท", province: "เลย", tagline: "ชายแดนภูเขา เน้นสิ่งแวดล้อม" },
    pillars: { livability: 54, economy: 46, safety: 58, wellbeing: 52, environment: 64, civic: 50, digital: 46 },
  },
  {
    id: "phrae", rank: 31, score: 52.4, region: "north",
    en: { name: "Phrae Smart", province: "Phrae", tagline: "Teak heritage town." },
    th: { name: "แพร่สมาร์ท", province: "แพร่", tagline: "เมืองมรดกไม้สัก" },
    pillars: { livability: 56, economy: 44, safety: 60, wellbeing: 54, environment: 62, civic: 50, digital: 44 },
  },
  {
    id: "tak", rank: 32, score: 51.0, region: "west",
    en: { name: "Mae Sot–Tak", province: "Tak", tagline: "Border-trade frontier." },
    th: { name: "แม่สอด–ตากสมาร์ท", province: "ตาก", tagline: "ชายแดนการค้า" },
    pillars: { livability: 50, economy: 60, safety: 46, wellbeing: 46, environment: 58, civic: 46, digital: 50 },
  },
  {
    id: "hua-hin", rank: 33, score: 60.2, region: "west",
    en: { name: "Hua Hin Smart", province: "Prachuap Khiri Khan", tagline: "Royal-resort town updates itself." },
    th: { name: "หัวหินสมาร์ท", province: "ประจวบคีรีขันธ์", tagline: "เมืองตากอากาศหลวงปรับตัว" },
    pillars: { livability: 64, economy: 58, safety: 60, wellbeing: 60, environment: 62, civic: 56, digital: 60 },
  },
  {
    id: "samutsongkhram", rank: 34, score: 53.5, region: "central",
    en: { name: "Samut Songkhram Smart", province: "Samut Songkhram", tagline: "Smallest province, careful policies." },
    th: { name: "สมุทรสงครามสมาร์ท", province: "สมุทรสงคราม", tagline: "จังหวัดเล็กสุด นโยบายระมัดระวัง" },
    pillars: { livability: 56, economy: 48, safety: 58, wellbeing: 54, environment: 60, civic: 52, digital: 46 },
  },
  {
    id: "satun", rank: 35, score: 51.8, region: "south",
    en: { name: "Satun Smart", province: "Satun", tagline: "Geopark province." },
    th: { name: "สตูลสมาร์ท", province: "สตูล", tagline: "จังหวัดอุทยานธรณี" },
    pillars: { livability: 54, economy: 46, safety: 58, wellbeing: 52, environment: 64, civic: 50, digital: 44 },
  },
  {
    id: "mukdahan", rank: 36, score: 50.6, region: "northeast",
    en: { name: "Mukdahan Smart", province: "Mukdahan", tagline: "Mekong border crossing." },
    th: { name: "มุกดาหารสมาร์ท", province: "มุกดาหาร", tagline: "ด่านชายแดนแม่น้ำโขง" },
    pillars: { livability: 54, economy: 50, safety: 56, wellbeing: 50, environment: 58, civic: 46, digital: 44 },
  },
  {
    id: "narathiwat", rank: 37, score: 49.0, region: "south",
    en: { name: "Narathiwat Smart", province: "Narathiwat", tagline: "Patient, constrained, real." },
    th: { name: "นราธิวาสสมาร์ท", province: "นราธิวาส", tagline: "อดทน มีข้อจำกัด ของจริง" },
    pillars: { livability: 50, economy: 44, safety: 42, wellbeing: 48, environment: 62, civic: 50, digital: 44 },
  },
];

export const NEWS_EN: NewsItem[] = [
  { date: "2 weeks ago",    city: "Khon Kaen Smart City",  body: "First LRT viaduct section poured. 60% provincially financed — uniquely Thai for a project this size." },
  { date: "3 weeks ago",    city: "—",                     body: '"smart city thailand retirement" — search interest up 38% over six months. Boomers are listening.' },
  { date: "1 month ago",    city: "DEPA",                  body: "44 new smart-zone designations issued nationally. We will not be adding most of them — paper plans don't qualify." },
];

export const NEWS_TH: NewsItem[] = [
  { date: "2 สัปดาห์ก่อน",   city: "ขอนแก่นสมาร์ทซิตี้",      body: "การก่อสร้างทางยกระดับ LRT ช่วงแรกหล่อคอนกรีตแล้ว — แบบลงทุนโดยจังหวัดเอง 60% ซึ่งหายากในไทย" },
  { date: "3 สัปดาห์ก่อน",   city: "—",                     body: "คำค้น 'smart city thailand retirement' เพิ่มขึ้น 38% ในหกเดือน คนเกษียณกำลังฟัง" },
  { date: "1 เดือนที่แล้ว",  city: "depa",                  body: "depa ประกาศรายชื่อเขตส่งเสริมเมืองอัจฉริยะรอบใหม่ 44 แห่ง เราจะไม่เพิ่มส่วนใหญ่เข้าดัชนี — แผนกระดาษไม่นับ" },
];

export const SOURCES: Source[] = [
  { en: "DEPA — Smart City Thailand Office",        th: "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa)",        kind: "Government",  url: "https://www.depa.or.th/" },
  { en: "NSO — National Statistical Office",        th: "สำนักงานสถิติแห่งชาติ",                          kind: "Government",  url: "http://www.nso.go.th/" },
  { en: "PCD — Pollution Control Department",       th: "กรมควบคุมมลพิษ",                                  kind: "Government",  url: "https://www.pcd.go.th/" },
  { en: "NESDC — National Economic & Social Dev.",  th: "สภาพัฒน์ฯ",                                      kind: "Government",  url: "https://www.nesdc.go.th/" },
  { en: "World Bank Open Data",                     th: "ธนาคารโลก",                                       kind: "Multilateral", url: "https://data.worldbank.org/" },
  { en: "OECD Better Life Index methodology",       th: "ระเบียบวิธี OECD Better Life Index",              kind: "Multilateral", url: "https://www.oecd.org/" },
  { en: "Local Government Open-Data portals (12)",  th: "พอร์ทัลข้อมูลเปิดของท้องถิ่น (12 แห่ง)",          kind: "Local",       url: "#" },
  { en: "On-the-ground field interviews 2024–25",   th: "สัมภาษณ์ภาคสนาม 2567–68",                         kind: "Original",    url: "#" },
];

export const METHODOLOGY_EN: MethodItem[] = [
  { h: "Outcomes over plans",        p: "If a project hasn't moved dirt or moved data, it doesn't count. We score what is operating or under construction — not what was announced at a press conference." },
  { h: "Verified denominator",        p: "Only cities with enough independently-verifiable data make it in. 118 self-declared smart-zones exist; 37 made the bar; 81 didn't." },
  { h: "Seven pillars, equal weight", p: "Livability, economy, safety, wellbeing, environment, civic, digital. Each is the geometric mean of 4–7 indicators. Equal-weighted by design — we don't believe one pillar is worth more than another." },
  { h: "Field verification",          p: "Every top-20 city was visited at least once in the past 18 months. We talk to operators, not just officials." },
  { h: "Public + private + people",   p: "Government data is reconciled against private-sector telemetry (telco, payments, sensors) and citizen reports. Triangulated, then footnoted." },
  { h: "Open methodology",            p: "Indicators, weights, raw scores — all published. Disagree with us? File an issue. We update the index annually." },
];

export const METHODOLOGY_TH: MethodItem[] = [
  { h: "ผลลัพธ์มาก่อนแผน",            p: "ถ้าโครงการยังไม่ขุดดินหรือยังไม่มีข้อมูลขยับ ก็ไม่นับ เราให้คะแนนเฉพาะสิ่งที่ดำเนินการหรือกำลังก่อสร้างอยู่ ไม่ใช่สิ่งที่ประกาศในงานแถลงข่าว" },
  { h: "ตัวหารที่ตรวจสอบได้",          p: "เฉพาะเมืองที่มีข้อมูลตรวจสอบได้อย่างเป็นอิสระเท่านั้น มีเขตประกาศตัวเอง 118 เขต ผ่านเกณฑ์ 37 ไม่ผ่าน 81" },
  { h: "เจ็ดเสาหลัก น้ำหนักเท่ากัน",   p: "ความน่าอยู่ เศรษฐกิจ ความปลอดภัย คุณภาพชีวิต สิ่งแวดล้อม อัธยาศัย ดิจิทัล แต่ละเสาเป็นค่าเฉลี่ยเรขาคณิตของตัวชี้วัด 4–7 ตัว ให้น้ำหนักเท่ากันโดยตั้งใจ" },
  { h: "ตรวจสอบภาคสนาม",              p: "เมือง 20 อันดับแรกถูกลงพื้นที่อย่างน้อยหนึ่งครั้งใน 18 เดือนที่ผ่านมา เราคุยกับผู้ปฏิบัติ ไม่ใช่แค่ผู้บริหาร" },
  { h: "รัฐ + เอกชน + ประชาชน",         p: "ข้อมูลรัฐถูกเทียบกับข้อมูลเอกชน (โทรคม การชำระเงิน เซ็นเซอร์) และรายงานประชาชน — สามด้าน แล้วทำเชิงอรรถ" },
  { h: "ระเบียบวิธีเปิด",               p: "ตัวชี้วัด น้ำหนัก คะแนนดิบ ทั้งหมดเผยแพร่ ไม่เห็นด้วย? เปิดประเด็นได้ เราอัปเดตดัชนีทุกปี" },
];

export const BINGO_EN: string[] = [
  '"We\'re the next Singapore."', '"AI-powered" (no AI in operation)', '"Sustainability vision" (no funding)',
  '"Smart pole" pilot', '"Living lab" of one building', "Digital twin demo",
  "Mascot launched", "MOU signed (no project)", "Press conference, no dirt",
  '"Citizen-centric" (no citizens consulted)', "Logo refresh", "Drone footage",
  "FREE\nSpace", "Foreign expert visit", "Smart bin, one location",
  "Korean delegation", "Japanese delegation", "Singaporean delegation",
  "App with <100 downloads", "QR code on a tree", '"5G-ready" (no 5G)',
  "Data lake (no data)", "Solar bench", '"Cashless society" (cash only)',
  '"World-class" claim',
];

export const BINGO_TH: string[] = [
  '"เราคือสิงคโปร์ตัวต่อไป"', '"ขับเคลื่อนด้วย AI" (ไม่มี AI จริง)', '"วิสัยทัศน์ความยั่งยืน" (ไม่มีงบ)',
  'นำร่อง "เสาอัจฉริยะ"', '"ห้องทดลองเป็นๆ" อาคารเดียว', "เดโมดิจิทัลทวิน",
  "เปิดตัวมาสคอต", "ลงนาม MOU (ไม่มีโครงการ)", "แถลงข่าว ไม่ขุดดิน",
  '"ยึดประชาชนเป็นศูนย์" (ไม่ถามประชาชน)', "รีเฟรชโลโก้", "ฟุตเทจโดรน",
  "ฟรี\nช่อง", "ผู้เชี่ยวชาญต่างชาติเยี่ยม", "ถังขยะอัจฉริยะ จุดเดียว",
  "คณะเกาหลีเยี่ยม", "คณะญี่ปุ่นเยี่ยม", "คณะสิงคโปร์เยี่ยม",
  "แอปยอดดาวน์โหลด <100", "QR บนต้นไม้", '"พร้อม 5G" (ไม่มี 5G)',
  "Data lake (ไม่มีข้อมูล)", "ม้านั่งโซลาร์", '"สังคมไร้เงินสด" (รับเฉพาะเงินสด)',
  'อ้าง "ระดับโลก"',
];
