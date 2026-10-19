// Lens definitions. Weights are the defaults. The page lets a reader move them.
// A decisive figure has to be in the file before a proposed lens publishes a rank.

const popCagr = {
  id: "people.population_cagr",
  kind: "cagr",
  indicatorId: "people.population",
  direction: "higher",
  weight: 50,
  decisive: true,
  name: { en: "Population growth", th: "การเติบโตของประชากร", zh: "人口增长" },
  note: {
    en: "Compound yearly change in registered population. It needs two values above zero, at least one year apart. The rate is the later value divided by the earlier one, raised to one over the number of years, minus one.",
    th: "อัตราทบต้นรายปีของประชากรตามทะเบียน ต้องมีสองค่าที่มากกว่าศูนย์ และห่างกันอย่างน้อยหนึ่งปี สูตรคือค่าหลังหารค่าก่อน ยกกำลังหนึ่งส่วนจำนวนปี แล้วลบหนึ่ง",
    zh: "户籍人口的复合年变化。需要两个大于零的值，且至少相隔一年。算法是后值除以前值，再取年数的倒数次方，然后减一。",
  },
};

const gppCagr = {
  id: "economy.gpp_cagr",
  kind: "cagr",
  indicatorId: "economy.gpp",
  direction: "higher",
  weight: 50,
  decisive: true,
  name: { en: "Output growth", th: "การเติบโตของผลผลิตจังหวัด", zh: "府产出增长" },
  note: {
    en: "The same compound rate, applied to gross provincial product in million baht. Provinces without two readable years do not get a rate.",
    th: "สูตรทบต้นเดียวกัน ใช้กับผลิตภัณฑ์มวลรวมจังหวัดหน่วยล้านบาท จังหวัดที่ไม่มีสองปีที่อ่านได้ จะไม่มีอัตรานี้",
    zh: "同一套复合速率，用在以百万铢计的府生产总值上。读不到两个年份的府，就没有这个速率。",
  },
};

const investment = {
  id: "economy.investment",
  kind: "raw",
  indicatorId: "economy.investment",
  direction: "higher",
  weight: 0,
  decisive: false,
  name: { en: "Investment", th: "การลงทุน", zh: "投资" },
  note: {
    en: "No investment file has been read. The default weight is zero so the slider is visible and the missing series cannot move the order.",
    th: "ยังไม่ได้อ่านไฟล์การลงทุน น้ำหนักเริ่มต้นเป็นศูนย์ เพื่อให้เห็นตัวเลื่อน และชุดข้อมูลที่ยังไม่มีจะไม่ไปขยับลำดับ",
    zh: "还没有读到投资文件。默认权重是零，滑杆看得见，缺席的序列不能改动名次。",
  },
};

const pm25 = (weight, decisive) => ({
  id: "env.pm25",
  kind: "raw",
  indicatorId: "env.pm25",
  direction: "lower",
  weight,
  decisive,
  name: { en: "PM2.5 this hour", th: "PM2.5 ชั่วโมงนี้", zh: "本小时 PM2.5" },
  note: {
    en: "Median PM2.5 from Air4Thai stations inside the province, for the latest hour. Lower is better. A single hour is not a year of exposure.",
    th: "มัธยฐาน PM2.5 จากสถานี Air4Thai ในจังหวัด ชั่วโมงล่าสุด ค่าน้อยกว่าดีกว่า หนึ่งชั่วโมงไม่ใช่การรับสัมผัสทั้งปี",
    zh: "府界内 Air4Thai 站点最新一小时的 PM2.5 中位数。越低越好。一个小时不是全年暴露。",
  },
});

const vehiclesPerPerson = (weight, decisive) => ({
  id: "mobility.vehicles_per_person",
  kind: "ratio",
  numeratorId: "mobility.vehicles",
  denominatorId: "people.population",
  direction: "lower",
  weight,
  decisive,
  name: { en: "Registered vehicles per person", th: "รถจดทะเบียนต่อคน", zh: "人均注册车辆" },
  note: {
    en: "Cumulative registered vehicles divided by the latest registered population. This is a stock of registrations, not a traffic count. Lower is treated as calmer.",
    th: "รถจดทะเบียนสะสมหารด้วยประชากรตามทะเบียนปีล่าสุด เป็นจำนวนรถที่จดทะเบียน ไม่ใช่ปริมาณจราจร ค่าน้อยกว่าถูกอ่านว่าสงบกว่า",
    zh: "累计注册车辆除以最新户籍人口。这是注册存量，不是交通量。数值更低，被当作更安静。",
  },
});

const beds = (weight, decisive) => ({
  id: "living.beds",
  kind: "raw",
  indicatorId: "living.beds",
  direction: "higher",
  weight,
  decisive,
  name: { en: "Hospital beds", th: "เตียงผู้ป่วย", zh: "医院床位" },
  note: {
    en: "Not in the file. The national table that was checked has no province column, so nothing was split across the map.",
    th: "ยังไม่อยู่ในไฟล์ ตารางระดับประเทศที่ตรวจแล้วไม่มีคอลัมน์จังหวัด จึงไม่มีการแบ่งตัวเลขลงแผนที่",
    zh: "还不在文件里。查过的全国表没有府这一列，所以没有把数字拆到地图上。",
  },
});

const price = (weight, decisive) => ({
  id: "market.price",
  kind: "raw",
  indicatorId: "market.price",
  direction: "lower",
  weight,
  decisive,
  name: { en: "Price", th: "ราคา", zh: "价格" },
  note: {
    en: "Not in the file. When a price series arrives, a lower price scores higher. Until then no city is priced.",
    th: "ยังไม่อยู่ในไฟล์ เมื่อมีชุดราคา ค่าที่ต่ำกว่าจะได้คะแนนสูงกว่า ก่อนหน้านั้นจะไม่มีการตีราคาเมือง",
    zh: "还不在文件里。等价格序列到了，价格更低的得分更高。在那之前，不为任何城市标价。",
  },
});

const tertiary = {
  id: "people.tertiary",
  kind: "raw",
  indicatorId: "people.tertiary",
  direction: "higher",
  weight: 40,
  decisive: true,
  name: { en: "Tertiary students", th: "นักศึกษาระดับอุดมศึกษา", zh: "高等教育在校生" },
  note: {
    en: "Not in the file. The id to send is people.tertiary. A headcount of students or a skilled-worker count both fit, as long as the unit is written on the row.",
    th: "ยังไม่อยู่ในไฟล์ รหัสที่ส่งคือ people.tertiary จะเป็นจำนวนนักศึกษาหรือผู้มีทักษะก็ได้ ขอให้หน่วยอยู่บนแถวนั้น",
    zh: "还不在文件里。要送的编号是 people.tertiary。学生人数或技能劳动力人数都可以，只要行上写了单位。",
  },
};

const borderTrade = (weight) => ({
  id: "economy.border_trade",
  kind: "raw",
  indicatorId: "economy.border_trade",
  direction: "higher",
  weight,
  decisive: true,
  name: { en: "Cross-border trade", th: "การค้าชายแดน", zh: "跨境贸易" },
  note: {
    en: "Not in the file. The figure wanted is the value of cross-border trade, with the unit on the row.",
    th: "ยังไม่อยู่ในไฟล์ ตัวเลขที่ต้องการคือมูลค่าการค้าชายแดน พร้อมหน่วยบนแถว",
    zh: "还不在文件里。要的是跨境贸易额，单位写在行上。",
  },
});

const sez = (weight) => ({
  id: "economy.sez",
  kind: "flag",
  indicatorId: "economy.sez",
  direction: "higher",
  weight,
  decisive: true,
  name: { en: "Special economic zone", th: "เขตเศรษฐกิจพิเศษ", zh: "经济特区" },
  note: {
    en: "Not in the file. A yes or no has to be sent for every province, 1 or 0. A list of only the yeses cannot rank the provinces that were left out. A yes or no on its own does not publish an order.",
    th: "ยังไม่อยู่ในไฟล์ ต้องส่งใช่หรือไม่ให้ครบทุกจังหวัด เป็น 1 หรือ 0 รายชื่อเฉพาะจังหวัดที่ได้ จะจัดลำดับจังหวัดที่ไม่ได้ส่งไม่ได้ และใช่หรือไม่เพียงอย่างเดียวจะไม่มีการเผยแพร่ลำดับ",
    zh: "还不在文件里。每个府都要送是或否，1 或 0。只列“是”的名单，没法给没送的府排序。单独一个是否，也不会公布名次。",
  },
});

const schools = {
  id: "people.schools",
  kind: "raw",
  indicatorId: "people.schools",
  direction: "higher",
  weight: 25,
  decisive: true,
  name: { en: "Schools", th: "โรงเรียน", zh: "学校" },
  note: {
    en: "Not in the file. A count of schools is not a measure of school quality.",
    th: "ยังไม่อยู่ในไฟล์ จำนวนโรงเรียนไม่ใช่คุณภาพของโรงเรียน",
    zh: "还不在文件里。学校数量不是学校质量。",
  },
};

const broadband = {
  id: "mobility.broadband",
  kind: "raw",
  indicatorId: "mobility.broadband",
  direction: "higher",
  weight: 20,
  decisive: true,
  name: { en: "Broadband", th: "บรอดแบนด์", zh: "宽带" },
  note: {
    en: "Not in the file. A count of open datasets is not broadband, and it is not accepted under this id.",
    th: "ยังไม่อยู่ในไฟล์ จำนวนชุดข้อมูลเปิดไม่ใช่บรอดแบนด์ และจะไม่รับภายใต้รหัสนี้",
    zh: "还不在文件里。开放数据集的个数不是宽带，也不会记在这个编号下。",
  },
};

const gppLevel = {
  id: "economy.gpp",
  kind: "raw",
  indicatorId: "economy.gpp",
  direction: "higher",
  weight: 0,
  decisive: false,
  name: { en: "Gross provincial product", th: "ผลิตภัณฑ์มวลรวมจังหวัด", zh: "府生产总值" },
  note: {
    en: "The level of output, not freight and not a factory count. The default weight on the logistics lens is zero so it cannot pretend to be a logistics ranking.",
    th: "ระดับผลผลิต ไม่ใช่ปริมาณขนส่งสินค้า และไม่ใช่จำนวนโรงงาน น้ำหนักเริ่มต้นในเลนส์โลจิสติกส์เป็นศูนย์ เพื่อไม่ให้แสร้งเป็นลำดับโลจิสติกส์",
    zh: "产出的水平，不是货运量，也不是工厂数。物流镜头里的默认权重是零，免得它冒充物流排名。",
  },
};

const visitors = {
  id: "economy.visitors",
  kind: "raw",
  indicatorId: "economy.visitors",
  direction: "higher",
  weight: 50,
  decisive: true,
  name: { en: "Visitors", th: "ผู้มาเยือน", zh: "游客" },
  note: {
    en: "Not in the file. Reputation and a coastline are not a visitor count.",
    th: "ยังไม่อยู่ในไฟล์ ชื่อเสียงและแนวชายฝั่งไม่ใช่จำนวนผู้มาเยือน",
    zh: "还不在文件里。名声和海岸线不是游客人数。",
  },
};

const receipts = {
  id: "economy.tourism_receipts",
  kind: "raw",
  indicatorId: "economy.tourism_receipts",
  direction: "higher",
  weight: 50,
  decisive: true,
  name: { en: "Tourism receipts", th: "รายได้การท่องเที่ยว", zh: "旅游收入" },
  note: {
    en: "Not in the file. Nothing else is substituted for a receipt.",
    th: "ยังไม่อยู่ในไฟล์ ไม่มีตัวเลขอื่นมาแทนรายได้",
    zh: "还不在文件里。没有任何其他数字代替收入。",
  },
};

export const LENSES = [
  {
    id: "growth",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Growth seekers", th: "คนที่ตามการเติบโต", zh: "追逐增长" },
    question: {
      en: "Where are people and provincial output growing, if ecology is left out of the sum?",
      th: "คนและผลผลิตจังหวัดโตที่ไหน ถ้าไม่เอานิเวศเข้าไปในผลรวม",
      zh: "如果总和里不计生态，人口和府产出在哪里增长？",
    },
    caveat: {
      en: "Ecology is left out on purpose. Investment sits on the slider at weight zero until a file arrives. Output growth is only as wide as the gross provincial product files we could read. Where that rate is missing, the order is population growth alone, and the row says so. A fast-growing register of residents is not a verdict on the city.",
      th: "เลนส์นี้ตัดนิเวศออกโดยตั้งใจ การลงทุนอยู่บนตัวเลื่อนที่น้ำหนักศูนย์จนกว่าไฟล์จะมา การเติบโตของผลผลิตมีเท่าที่อ่านไฟล์ผลิตภัณฑ์มวลรวมจังหวัดได้ จังหวัดที่ไม่มีอัตรานี้ ลำดับคือการเติบโตของประชากรเท่านั้น และแถวนั้นบอกไว้ จำนวนคนในทะเบียนที่โตเร็วไม่ใช่คำตัดสินว่าเมืองดี",
      zh: "这个镜头故意不计生态。投资停在权重为零的滑杆上，直到文件到来。产出增长的覆盖面，只到读得动的府生产总值文件为止。缺这个速率的地方，名次只是人口增长，那一行会写明。户籍人数涨得快，不是对一座城市的判决。",
    },
    components: [popCagr, gppCagr, investment],
  },
  {
    id: "quiet",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Quiet retirement", th: "เกษียณแบบสงบ", zh: "安静退休" },
    question: {
      en: "Where is the air cleaner and the registered fleet lighter, for someone who wants a calmer city?",
      th: "อากาศสะอาดกว่าและจำนวนรถที่จดทะเบียนเบากว่าที่ไหน สำหรับคนที่อยากได้เมืองที่สงบกว่า",
      zh: "想要更安静的城市，哪里空气更干净、注册车辆更少？",
    },
    caveat: {
      en: "Calm, safety, and affordability are not fully measured. There is no crime series and no price series. Hospital beds are not in the file, so healthcare access is not in the sum. Vehicles per person stand in for congestion, and a tourist fleet can make a small town look crowded. PM2.5 is one hour, not a year.",
      th: "ความสงบ ความปลอดภัย และราคาที่จ่ายไหว ยังไม่ได้ถูกวัดครบ ไม่มีชุดข้อมูลอาชญากรรมและไม่มีชุดราคา เตียงผู้ป่วยไม่อยู่ในไฟล์ การเข้าถึงการรักษาจึงไม่อยู่ในผลรวม รถต่อคนใช้แทนความแออัด และรถของนักท่องเที่ยวทำให้เมืองเล็กดูแน่นได้ PM2.5 คือหนึ่งชั่วโมง ไม่ใช่ทั้งปี",
      zh: "安静、安全和付得起，都还没有测全。没有犯罪序列，也没有价格序列。医院床位不在文件里，所以就医可及性不在总和里。人均车辆用来代替拥堵，旅游城市的车队会让小镇看起来很挤。PM2.5 是一个小时，不是一年。",
    },
    components: [pm25(30, true), vehiclesPerPerson(30, true), beds(20, false), price(20, false)],
  },
  {
    id: "talent",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Talent and the border", th: "คนมีฝีมือกับชายแดน", zh: "人才与边境" },
    question: {
      en: "Where is there a published skilled population, and where does border trade or a special zone show up in the file?",
      th: "ที่ไหนมีจำนวนผู้มีทักษะที่เผยแพร่แล้ว และที่ไหนการค้าชายแดนหรือเขตพิเศษโผล่ในไฟล์",
      zh: "哪里有已经公布的技能人口，哪里的边境贸易或特区出现在文件里？",
    },
    caveat: {
      en: "Tertiary students, cross-border trade, and special economic zones are named so a file can fill them. None of those series is in the file yet, so this lens does not publish a ranking. A zone that is only a yes or no will not, by itself, order the provinces. Another figure is not borrowed and called talent.",
      th: "นักศึกษา การค้าข้ามแดน และเขตเศรษฐกิจพิเศษ ถูกตั้งชื่อไว้เพื่อให้ไฟล์มาเติม ยังไม่มีชุดข้อมูลเหล่านี้ในไฟล์ เลนส์นี้จึงไม่เผยแพร่ลำดับ เขตที่เป็นเพียงใช่หรือไม่ จะไม่จัดลำดับจังหวัดด้วยตัวเอง และจะไม่หยิบตัวเลขอื่นมาเรียกว่าคนมีฝีมือ",
      zh: "高等教育在校生、跨境贸易和经济特区先把名字占上，等文件来填。这些序列都还不在文件里，所以这个镜头不公布排名。只是是否的园区，本身不会给府排序。也不会借一个别的数字，把它叫做人才。",
    },
    components: [tertiary, borderTrade(30), sez(30)],
  },
  {
    id: "families",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Families", th: "ครอบครัว", zh: "家庭" },
    question: {
      en: "Where would a household look, once schools and hospital beds are actually published?",
      th: "ครัวเรือนจะมองที่ไหน เมื่อจำนวนโรงเรียนและเตียงผู้ป่วยถูกเผยแพร่จริง",
      zh: "等学校和医院床位真的公布了，一个家庭会先看哪里？",
    },
    caveat: {
      en: "Proposed. This is not a ranking yet. Schools and hospital beds are the figures that would be allowed to order the map. Neither is in the file. Air and vehicles per person can be weighted, and they still do not produce a family ranking on their own. Childcare, safety, and school quality are not measured.",
      th: "ข้อเสนอ ยังไม่ใช่ลำดับ โรงเรียนและเตียงผู้ป่วยคือตัวเลขที่จะได้รับอนุญาตให้จัดลำดับบนแผนที่ ทั้งคู่ไม่อยู่ในไฟล์ อากาศและรถต่อคนปรับน้ำหนักได้ และยังไม่ทำให้เกิดลำดับครอบครัวด้วยตัวเอง การดูแลเด็ก ความปลอดภัย และคุณภาพโรงเรียนไม่ได้ถูกวัด",
      zh: "这是提议，还不是排名。学校和医院床位才是允许给地图排序的数字。两个都不在文件里。空气和人均车辆可以调权重，它们自己仍然不会产生家庭排名。托幼、安全和学校质量都没有测。",
    },
    components: [schools, beds(25, true), pm25(25, false), vehiclesPerPerson(25, false)],
  },
  {
    id: "logistics",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Logistics and industry", th: "โลจิสติกส์และอุตสาหกรรม", zh: "物流与产业" },
    question: {
      en: "Where do freight, border trade, or a special zone show up, once those figures are published?",
      th: "ขนส่งสินค้า การค้าชายแดน หรือเขตพิเศษ อยู่ที่ไหน เมื่อตัวเลขเหล่านั้นถูกเผยแพร่",
      zh: "等货运、边境贸易或特区的数字公布了，它们在哪里？",
    },
    caveat: {
      en: "Proposed. This is not a ranking yet. Vehicle registrations are not freight, and gross provincial product is not a warehouse count, so neither is allowed to order this lens. Cross-border trade and special economic zones are the figures that would. They are not in the file.",
      th: "ข้อเสนอ ยังไม่ใช่ลำดับ รถจดทะเบียนไม่ใช่ปริมาณขนส่งสินค้า และผลิตภัณฑ์มวลรวมจังหวัดไม่ใช่จำนวนคลังสินค้า จึงไม่ให้ทั้งคู่จัดลำดับเลนส์นี้ การค้าข้ามแดนและเขตเศรษฐกิจพิเศษคือตัวเลขที่จะทำได้ และยังไม่อยู่ในไฟล์",
      zh: "这是提议，还不是排名。注册车辆不是货运，府生产总值不是仓库数量，所以两者都不允许给这个镜头排序。跨境贸易和经济特区才可以。它们还不在文件里。",
    },
    components: [borderTrade(50), sez(50), gppLevel],
  },
  {
    id: "remote",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Remote workers", th: "คนทำงานทางไกล", zh: "远程工作" },
    question: {
      en: "Where is a published price, and a published connection, for someone who can work away from an office?",
      th: "ที่ไหนมีราคาที่เผยแพร่แล้ว และการเชื่อมต่อที่เผยแพร่แล้ว สำหรับคนที่ทำงานนอกสำนักงานได้",
      zh: "对可以离开办公室工作的人，哪里有公布的价格和公布的连接？",
    },
    caveat: {
      en: "Proposed. This is not a ranking yet. Price and broadband are the figures that would be allowed to order the map. A count of open datasets is not broadband and is not used. Cleaner air can be weighted after a decisive figure exists. Until then the lens shows what is missing and does not name a city.",
      th: "ข้อเสนอ ยังไม่ใช่ลำดับ ราคาและบรอดแบนด์คือตัวเลขที่จะได้รับอนุญาตให้จัดลำดับ จำนวนชุดข้อมูลเปิดไม่ใช่บรอดแบนด์และไม่ถูกใช้ อากาศที่สะอาดกว่าปรับน้ำหนักได้หลังจากมีตัวเลขชี้ขาด ก่อนหน้านั้นเลนส์แสดงสิ่งที่ขาด และไม่ชี้ชื่อเมือง",
      zh: "这是提议，还不是排名。价格和宽带才是允许给地图排序的数字。开放数据集的个数不是宽带，这里不用。等有了决定性的数字，才可以给更干净的空气加权重。在那之前，镜头只列出缺什么，不点名一座城市。",
    },
    components: [price(40, true), broadband, pm25(40, false)],
  },
  {
    id: "tourism",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Tourism investors", th: "นักลงทุนท่องเที่ยว", zh: "旅游投资" },
    question: {
      en: "Where do visitors and tourism receipts actually show up in a published file?",
      th: "ผู้มาเยือนและรายได้การท่องเที่ยวโผล่ในไฟล์ที่เผยแพร่ที่ไหน",
      zh: "游客和旅游收入到底出现在哪一份已公布的文件里？",
    },
    caveat: {
      en: "Proposed. This is not a ranking yet. Visitors and tourism receipts are the only figures that count. They are not in the file. Air quality is not swapped in for a receipt, and neither is a reputation.",
      th: "ข้อเสนอ ยังไม่ใช่ลำดับ ผู้มาเยือนและรายได้การท่องเที่ยวคือตัวเลขเดียวที่นับ และยังไม่อยู่ในไฟล์ คุณภาพอากาศไม่ได้ถูกสลับเข้ามาแทนรายได้ และชื่อเสียงก็ไม่ได้ถูกสลับเข้ามา",
      zh: "这是提议，还不是排名。游客和旅游收入是唯一算数的数字。它们还不在文件里。空气质量不会被拿来代替收入，名声也不会。",
    },
    components: [visitors, receipts],
  },
];

export function lensById(id) {
  return LENSES.find((lens) => lens.id === id) || LENSES[0];
}

export function withWeights(lens, weights) {
  if (!weights) return lens;
  return {
    ...lens,
    components: lens.components.map((component) => ({
      ...component,
      weight: Object.prototype.hasOwnProperty.call(weights, component.id)
        ? Math.max(0, Math.min(100, Number(weights[component.id]) || 0))
        : component.weight,
    })),
  };
}
