// Lens definitions. Weights are the defaults. The page lets a reader move them.
// A figure that is missing for every province stays out of the sum. It is not scored as zero.

const bahtPerPerson = {
  mul: 1000000,
  digits: 0,
  unit: { en: "baht per person", th: "บาทต่อคน", zh: "铢/人" },
};

const kwhPerPerson = {
  mul: 1000000,
  digits: 0,
  unit: { en: "kWh per person", th: "กิโลวัตต์ชั่วโมงต่อคน", zh: "千瓦时/人" },
};

function raw(id, weight, direction, decisive, name, note) {
  return { id, kind: "raw", indicatorId: id, direction, weight, decisive, name, note };
}

function flag(id, weight, name, note) {
  return { id, kind: "flag", indicatorId: id, direction: "higher", weight, decisive: false, name, note };
}

const popCagr = {
  id: "people.population_cagr",
  kind: "cagr",
  indicatorId: "people.population",
  sinceYear: 2022,
  direction: "higher",
  weight: 20,
  decisive: true,
  name: { en: "Population growth", th: "การเติบโตของประชากร", zh: "人口增长" },
  note: {
    en: "Compound yearly change in registered population, using years from 2022 onward. It needs two values above zero. The rate is the later value divided by the earlier one, raised to one over the number of years, minus one. Earlier years stay in the file and are not used here.",
    th: "อัตราทบต้นรายปีของประชากรตามทะเบียน ใช้ปีตั้งแต่ 2022 ต้องมีสองค่าที่มากกว่าศูนย์ สูตรคือค่าหลังหารค่าก่อน ยกกำลังหนึ่งส่วนจำนวนปี แล้วลบหนึ่ง ปีที่เก่ากว่านั้นยังอยู่ในไฟล์ แต่ไม่ได้ใช้ตรงนี้",
    zh: "户籍人口的复合年变化，只用 2022 年及以后的年份。需要两个大于零的值。算法是后值除以前值，再取年数的倒数次方，然后减一。更早的年份仍在文件里，这里不用。",
  },
};

const gppGrowth = raw(
  "economy.gpp_real_growth",
  20,
  "higher",
  true,
  { en: "Real output growth", th: "การเติบโตของผลผลิตที่แท้จริง", zh: "实际产出增长" },
  {
    en: "One year of gross provincial product growth at chain volume, 2023, from the NSO yearbook (NESDC). It is not a multi-year rate, and 2024 is not in the file.",
    th: "การเติบโตของผลิตภัณฑ์มวลรวมจังหวัดหนึ่งปี ตามปริมาณลูกโซ่ ปี 2023 จากหนังสือสถิติประจำปีของ สสช. (สภาพัฒน์) ไม่ใช่อัตราหลายปี และปี 2024 ยังไม่อยู่ในไฟล์",
    zh: "府生产总值按链式物量计算的一年增长，2023 年，来自国家统计局年鉴（国家经济和社会发展委员会）。不是多年速率，2024 年还不在文件里。",
  },
);

const investmentPerPerson = {
  id: "economy.investment_per_person",
  kind: "ratio",
  numeratorId: "economy.investment",
  denominatorId: "people.population",
  direction: "higher",
  weight: 20,
  decisive: true,
  display: bahtPerPerson,
  name: { en: "BOI investment per person", th: "เงินลงทุนบีโอไอต่อคน", zh: "人均 BOI 投资" },
  note: {
    en: "BOI-approved investment for 2025, in million baht, divided by the latest registered population, shown as baht per person. Provinces the BOI table does not list are left blank. A blank is not a zero. The latest year in the file is used.",
    th: "มูลค่าส่งเสริมการลงทุนของบีโอไอปี 2025 หน่วยล้านบาท หารด้วยประชากรตามทะเบียนล่าสุด แสดงเป็นบาทต่อคน จังหวัดที่ตารางบีโอไอไม่ได้ลงไว้ จะว่าง ช่องว่างไม่ใช่ศูนย์ ใช้ปีล่าสุดในไฟล์",
    zh: "2025 年 BOI 批准投资额，单位百万铢，除以最新户籍人口，显示为每人铢。BOI 表上没有的府留空。空着不是零。用文件里的最近一年。",
  },
};

const newFirms = raw(
  "economy.new_firms_per_10k",
  20,
  "higher",
  true,
  { en: "New companies per 10,000 people", th: "บริษัทใหม่ต่อคนหมื่นคน", zh: "每万人新注册公司" },
  {
    en: "New juristic persons registered in 2025, per 10,000 registered people, from the Department of Business Development. A count of firms is not a count of jobs.",
    th: "นิติบุคคลตั้งใหม่ปี 2025 ต่อประชากรตามทะเบียนหมื่นคน จากกรมพัฒนาธุรกิจการค้า จำนวนบริษัทไม่ใช่จำนวนงาน",
    zh: "2025 年新注册法人，每万名户籍人口，来自商业发展厅。公司数不是就业人数。",
  },
);

const tourismPerPerson = {
  id: "economy.tourism_receipts_per_person",
  kind: "ratio",
  numeratorId: "economy.tourism_receipts",
  denominatorId: "people.population",
  direction: "higher",
  weight: 20,
  decisive: true,
  display: bahtPerPerson,
  name: { en: "Tourism receipts per person", th: "รายได้ท่องเที่ยวต่อคน", zh: "人均旅游收入" },
  note: {
    en: "Tourism receipts for 2025, in million baht, divided by the latest registered population. The Ministry of Tourism and Sports figure is person-trips and spending, not a census of who lives there.",
    th: "รายได้การท่องเที่ยวปี 2025 หน่วยล้านบาท หารด้วยประชากรตามทะเบียนล่าสุด ตัวเลขของกระทรวงการท่องเที่ยวและกีฬาเป็นจำนวนครั้งการเดินทางและค่าใช้จ่าย ไม่ใช่สำมะโนว่าใครอาศัยอยู่",
    zh: "2025 年旅游收入，单位百万铢，除以最新户籍人口。旅游与体育部的数字是人次和花费，不是当地居民普查。",
  },
};

const badAir = (weight, decisive) =>
  raw(
    "env.pm25_bad_days",
    weight,
    "lower",
    decisive,
    { en: "Days of bad PM2.5", th: "วันที่ PM2.5 เกินเกณฑ์", zh: "PM2.5 超标天数" },
    {
      en: "Days in 2025 when PM2.5 was over the Thai 24-hour standard, at the median station in the province, from the Pollution Control Department. Lower is better. Sixteen provinces have no station in that file and are left blank. The worst station in the same province can be much higher. It is a year of days, not this hour.",
      th: "จำนวนวันในปี 2025 ที่ PM2.5 เกินมาตรฐาน 24 ชั่วโมงของไทย ที่สถานีมัธยฐานในจังหวัด จากกรมควบคุมมลพิษ ค่าน้อยกว่าดีกว่า จังหวัดที่ไม่มีสถานีในไฟล์นั้นสิบหกจังหวัด จะว่างไว้ สถานีที่แย่ที่สุดในจังหวัดเดียวกันอาจสูงกว่ามาก นี่คือวันทั้งปี ไม่ใช่ชั่วโมงนี้",
      zh: "2025 年 PM2.5 超过泰国 24 小时标准的天数，取府内站点的中位数，来自污染控制局。越低越好。该文件里没有站点的十六个府留空。同一府最差站点可能高得多。这是全年的天数，不是这一小时。",
    },
  );

const doctors = (weight, decisive) =>
  raw(
    "living.doctors_per_10k",
    weight,
    "higher",
    decisive,
    { en: "Doctors per 10,000 people", th: "แพทย์ต่อคนหมื่นคน", zh: "每万人医生数" },
    {
      en: "Physicians in 2024 per 10,000 registered people, from the Office of the Permanent Secretary, Ministry of Public Health. The sheet does not say whether private-hospital doctors are included. This is not a count of hospital beds.",
      th: "แพทย์ปี 2024 ต่อประชากรตามทะเบียนหมื่นคน จากสำนักงานปลัดกระทรวงสาธารณสุข ตารางไม่ได้บอกว่านับแพทย์โรงพยาบาลเอกชนหรือไม่ นี่ไม่ใช่จำนวนเตียง",
      zh: "2024 年医生数，每万名户籍人口，来自公共卫生部常务秘书办公室。表上没有写是否包括私立医院的医生。这不是病床数。",
    },
  );

const deaths = (weight, decisive) =>
  raw(
    "mobility.road_deaths",
    weight,
    "lower",
    decisive,
    { en: "Road deaths per 100,000 people", th: "ผู้เสียชีวิตบนถนนต่อแสนคน", zh: "每十万人道路死亡" },
    {
      en: "Road traffic deaths in 2025 per 100,000 registered people, from the Department of Disease Control (RTDDI). Lower is better. It is not a crime series.",
      th: "ผู้เสียชีวิตจากอุบัติเหตุทางถนนปี 2025 ต่อประชากรตามทะเบียนแสนคน จากกรมควบคุมโรค (RTDDI) ค่าน้อยกว่าดีกว่า นี่ไม่ใช่ชุดข้อมูลอาชญากรรม",
      zh: "2025 年道路交通事故死亡，每十万名户籍人口，来自疾病控制局（RTDDI）。越低越好。这不是犯罪序列。",
    },
  );

const land = (weight, decisive) =>
  raw(
    "living.land_price",
    weight,
    "lower",
    decisive,
    { en: "Official land appraisal", th: "ราคาประเมินที่ดินราชการ", zh: "官方土地评估价" },
    {
      en: "The median official land appraisal in the province, baht per square wah, from the Treasury Department. Lower is treated as more affordable. This is not a market sale price and it is not a rent.",
      th: "มัธยฐานราคาประเมินที่ดินราชการในจังหวัด บาทต่อตารางวา จากกรมธนารักษ์ ค่าน้อยกว่าถูกอ่านว่าจ่ายได้ง่ายกว่า นี่ไม่ใช่ราคาซื้อขายในตลาด และไม่ใช่ค่าเช่า",
      zh: "府内官方土地评估价的中位数，铢/平方哇，来自财政部国库厅。数值更低，被当作更付得起。这不是市场成交价，也不是租金。",
    },
  );

const density = raw(
  "living.density",
  20,
  "lower",
  true,
  { en: "Population density", th: "ความหนาแน่นประชากร", zh: "人口密度" },
  {
    en: "Not in the file. Registered population is here, and province area is not, so density is not computed. Nothing is borrowed to stand in for it.",
    th: "ยังไม่อยู่ในไฟล์ มีประชากรตามทะเบียน แต่ไม่มีพื้นที่จังหวัด จึงไม่คำนวณความหนาแน่น ไม่ได้หยิบตัวเลขอื่นมาแทน",
    zh: "还不在文件里。户籍人口有，府面积没有，所以不算密度。也不借别的数字来代替。",
  },
);

const students = (weight, decisive) =>
  raw(
    "people.tertiary_per_1000",
    weight,
    "higher",
    decisive,
    { en: "Tertiary students per 1,000 people", th: "นักศึกษาต่อคนพันคน", zh: "每千人高等教育在校生" },
    {
      en: "Current tertiary students in academic year 2568, first semester, per 1,000 registered people, from MHESI. Three provinces have no campus in that file and are left blank. Enrolment is not a count of graduates.",
      th: "นักศึกษาปัจจุบัน ปีการศึกษา 2568 ภาคต้น ต่อประชากรตามทะเบียนพันคน จาก อว. สามจังหวัดไม่มีวิทยาเขตในไฟล์นั้น และถูกเว้นว่าง การลงทะเบียนเรียนไม่ใช่จำนวนผู้สำเร็จการศึกษา",
      zh: "佛历 2568 学年第一学期的高等教育在校生，每千名户籍人口，来自高等教育、科研与创新部。该文件里没有校区的三个府留空。在校生不是毕业生人数。",
    },
  );

const borderTrade = (weight) =>
  raw(
    "economy.border_trade",
    weight,
    "higher",
    true,
    { en: "Border customs trade", th: "การค้าผ่านด่านศุลกากรชายแดน", zh: "边境海关贸易" },
    {
      en: "Exports plus imports in 2024 through land and river customs checkpoints, in million baht, from the Customs Department. Only the 25 provinces with such a checkpoint have a figure. The others are blank, not zero. Seaports and airports are not included. In December 2568 the Department of Foreign Trade recorded no border trade with Cambodia, so Sa Kaeo and Trat need a current check before anyone treats them as a border bet. Sangkhla Buri imports, inside the Kanchanaburi figure, likely include pipeline gas.",
      th: "ส่งออกบวกนำเข้าปี 2024 ผ่านด่านศุลกากรทางบกและทางน้ำ หน่วยล้านบาท จากกรมศุลกากร มีตัวเลขเฉพาะ 25 จังหวัดที่มีด่านแบบนั้น จังหวัดอื่นว่าง ไม่ใช่ศูนย์ ไม่รวมท่าเรือและสนามบิน เดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ จึงต้องตรวจสถานะปัจจุบันก่อนถือว่าสระแก้วหรือตราดเป็นการเดิมพันชายแดน นำเข้าที่สังขละบุรี ซึ่งอยู่ในตัวเลขกาญจนบุรี น่าจะรวมก๊าซทางท่อ",
      zh: "2024 年经陆路和河路海关关口的出口加进口，单位百万铢，来自海关厅。只有设有这类关口的 25 个府有数字。其余留空，不是零。不含海港和机场。佛历 2568 年 12 月，外贸厅记录对柬埔寨边境贸易为零，所以把沙缴或达叻当成边境赌注之前，要先核对当下的口岸状态。桑卡拉武里的进口算在北碧府的数字里，很可能包括管道天然气。",
    },
  );

const sez = (weight) =>
  flag("economy.sez", weight, { en: "Border special economic zone", th: "เขตเศรษฐกิจพิเศษชายแดน", zh: "边境经济特区" }, {
    en: "1 if the province is one of the ten Border SEZs, otherwise 0, for every province. A yes or no does not, by itself, order the map. Phase 1 is Tak, Mukdahan, Sa Kaeo, Trat and Songkhla. Phase 2 is Nong Khai, Narathiwat, Chiang Rai, Nakhon Phanom and Kanchanaburi.",
    th: "เป็น 1 ถ้าจังหวัดเป็นหนึ่งในสิบเขตเศรษฐกิจพิเศษชายแดน ไม่เช่นนั้นเป็น 0 ครบทุกจังหวัด ใช่หรือไม่เพียงอย่างเดียวจะไม่จัดลำดับแผนที่ ระยะที่ 1 คือตาก มุกดาหาร สระแก้ว ตราด และสงขลา ระยะที่ 2 คือหนองคาย นราธิวาส เชียงราย นครพนม และกาญจนบุรี",
    zh: "属于十个边境经济特区则为 1，否则为 0，七十七个府都有。单独一个是否不会给地图排序。第一期是达府、穆达汉、沙缴、达叻和宋卡。第二期是廊开、那拉提瓦、清莱、那空拍侬和北碧。",
  });

const eec = (weight) =>
  flag("economy.eec", weight, { en: "Eastern Economic Corridor", th: "ระเบียงเศรษฐกิจพิเศษภาคตะวันออก", zh: "东部经济走廊" }, {
    en: "1 for Chachoengsao, Chon Buri and Rayong, and 0 for every other province. A yes or no does not, by itself, order the map.",
    th: "เป็น 1 สำหรับฉะเชิงเทรา ชลบุรี และระยอง และเป็น 0 สำหรับจังหวัดอื่นทุกจังหวัด ใช่หรือไม่เพียงอย่างเดียวจะไม่จัดลำดับแผนที่",
    zh: "北柳、春武里和罗勇为 1，其余每个府为 0。单独一个是否不会给地图排序。",
  });

const internet = (weight) =>
  raw(
    "people.internet_households",
    weight,
    "higher",
    true,
    { en: "Households with internet", th: "ครัวเรือนที่มีอินเทอร์เน็ต", zh: "有互联网的家庭" },
    {
      en: "Share of households with internet, NSO ICT survey, 2569 second quarter. This is access in the home. It is not a broadband speed.",
      th: "สัดส่วนครัวเรือนที่มีอินเทอร์เน็ต จากการสำรวจไอซีทีของ สสช. ไตรมาส 2 ปี 2569 นี่คือการเข้าถึงในบ้าน ไม่ใช่ความเร็วบรอดแบนด์",
      zh: "有互联网的家庭占比，国家统计局信息通信技术调查，佛历 2569 年第二季度。这是家里有没有接入，不是宽带速率。",
    },
  );

const unemployment = raw(
  "economy.unemployment",
  10,
  "lower",
  true,
  { en: "Unemployment rate", th: "อัตราว่างงาน", zh: "失业率" },
  {
    en: "Mean of the four quarters of 2025, from the NSO labour force survey. Lower is better. It is not a wage.",
    th: "ค่าเฉลี่ยสี่ไตรมาสของปี 2025 จากการสำรวจภาวะการทำงานของ สสช. ค่าน้อยกว่าดีกว่า นี่ไม่ใช่ค่าจ้าง",
    zh: "2025 年四个季度的平均，来自国家统计局劳动力调查。越低越好。这不是工资。",
  },
);

const electricityPerPerson = {
  id: "energy.electricity_per_person",
  kind: "ratio",
  numeratorId: "energy.electricity",
  denominatorId: "people.population",
  direction: "higher",
  weight: 15,
  decisive: true,
  display: kwhPerPerson,
  name: { en: "Electricity per person", th: "ไฟฟ้าต่อคน", zh: "人均用电" },
  note: {
    en: "Electricity use in 2023, in gigawatt-hours, divided by the latest registered population, shown as kilowatt-hours per person. It is all use in the province, not factories alone, and there is no later provincial year in the file.",
    th: "การใช้ไฟฟ้าปี 2023 หน่วยกิกะวัตต์ชั่วโมง หารด้วยประชากรตามทะเบียนล่าสุด แสดงเป็นกิโลวัตต์ชั่วโมงต่อคน เป็นการใช้ทั้งหมดในจังหวัด ไม่ใช่เฉพาะโรงงาน และไม่มีปีหลังกว่านั้นรายจังหวัดในไฟล์",
    zh: "2023 年用电量，单位吉瓦时，除以最新户籍人口，显示为每人千瓦时。这是府内全部用电，不是只有工厂，文件里也没有更晚的分府年份。",
  },
};

const labour = raw(
  "people.labour_force",
  15,
  "higher",
  true,
  { en: "Labour force", th: "กำลังแรงงาน", zh: "劳动力" },
  {
    en: "Labour force in 2025, mean of the four quarters, in thousand persons, from the NSO labour force survey. It is a size, so a large province ranks higher on this line alone.",
    th: "กำลังแรงงานปี 2025 ค่าเฉลี่ยสี่ไตรมาส หน่วยพันคน จากการสำรวจภาวะการทำงานของ สสช. เป็นขนาด ดังนั้นจังหวัดใหญ่จะอยู่สูงกว่าในบรรทัดนี้เพียงบรรทัดเดียว",
    zh: "2025 年劳动力，四个季度的平均，单位千人，来自国家统计局劳动力调查。这是规模，所以大府单凭这一行就会排得更靠前。",
  },
);

const wage = (weight) =>
  raw(
    "economy.minimum_wage",
    weight,
    "lower",
    true,
    { en: "Daily minimum wage", th: "ค่าจ้างขั้นต่ำรายวัน", zh: "每日最低工资" },
    {
      en: "The statutory daily minimum wage as of January 2568. Lower is better only from an employer's cost. It is not an average wage, and later changes in 2568 are not in the file.",
      th: "ค่าจ้างขั้นต่ำรายวันตามกฎหมาย ณ มกราคม 2568 ค่าน้อยกว่าดีกว่าเฉพาะในมุมต้นทุนของนายจ้าง นี่ไม่ใช่ค่าจ้างเฉลี่ย และการปรับหลังจากนี้ในปี 2568 ยังไม่อยู่ในไฟล์",
      zh: "截至佛历 2568 年 1 月的法定日最低工资。只有从雇主成本来看，越低越好。这不是平均工资，2568 年后来的调整还不在文件里。",
    },
  );

const visitorsForeign = (weight) =>
  raw(
    "economy.visitors_foreign",
    weight,
    "higher",
    true,
    { en: "Foreign visitors", th: "ผู้มาเยือนชาวต่างชาติ", zh: "外国游客" },
    {
      en: "Foreign visitor trips in 2025, from the Ministry of Tourism and Sports. A trip is not a resident.",
      th: "จำนวนครั้งที่ผู้มาเยือนชาวต่างชาติเดินทางมาปี 2025 จากกระทรวงการท่องเที่ยวและกีฬา หนึ่งครั้งไม่ใช่หนึ่งผู้อยู่อาศัย",
      zh: "2025 年外国游客人次，来自旅游与体育部。一次行程不是一名居民。",
    },
  );

const occupancy = raw(
  "living.hotel_occupancy",
  20,
  "higher",
  true,
  { en: "Hotel occupancy", th: "อัตราเข้าพักโรงแรม", zh: "酒店入住率" },
  {
    en: "Hotel occupancy in 2025, from the Ministry of Tourism and Sports. It is a rate for the year, not a month-by-month season.",
    th: "อัตราเข้าพักโรงแรมปี 2025 จากกระทรวงการท่องเที่ยวและกีฬา เป็นอัตราทั้งปี ไม่ใช่ฤดูกาลรายเดือน",
    zh: "2025 年酒店入住率，来自旅游与体育部。这是全年的比率，不是逐月的淡旺季。",
  },
);

const forest = raw(
  "env.forest_cover",
  15,
  "higher",
  false,
  { en: "Forest cover", th: "พื้นที่ป่า", zh: "森林覆盖" },
  {
    en: "Forest area as a share of the province in 2024, from the NSO yearbook. It is not urban green space and it is not a beach.",
    th: "พื้นที่ป่าเป็นสัดส่วนของจังหวัดปี 2024 จากหนังสือสถิติประจำปีของ สสช. ไม่ใช่พื้นที่สีเขียวในเมือง และไม่ใช่ชายหาด",
    zh: "2024 年森林面积占府面积的比例，来自国家统计局年鉴。不是城市绿地，也不是海滩。",
  },
);

const schools = raw(
  "people.schools",
  15,
  "higher",
  true,
  { en: "Schools", th: "โรงเรียน", zh: "学校" },
  {
    en: "Not in the file. A count of schools would still not be school quality. O-NET by province is not here.",
    th: "ยังไม่อยู่ในไฟล์ แม้มีจำนวนโรงเรียนก็ยังไม่ใช่คุณภาพ และไม่มีผลโอเน็ตรายจังหวัดที่นี่",
    zh: "还不在文件里。就算有学校数量，也不是学校质量。这里没有分府的 O-NET。",
  },
);

const beds = raw(
  "living.beds",
  15,
  "higher",
  true,
  { en: "Hospital beds", th: "เตียงผู้ป่วย", zh: "医院床位" },
  {
    en: "Not in the file. The national tables that were checked have no province column. Doctors are not used as a stand-in for beds.",
    th: "ยังไม่อยู่ในไฟล์ ตารางระดับประเทศที่ตรวจแล้วไม่มีคอลัมน์จังหวัด ไม่ได้ใช้จำนวนแพทย์แทนเตียง",
    zh: "还不在文件里。查过的全国表没有府这一列。不用医生数代替床位。",
  },
);

function decree(weight) {
  return {
    id: "governance.emergency_decree",
    kind: "flag",
    indicatorId: "governance.emergency_decree",
    direction: "lower",
    weight,
    decisive: true,
    name: {
      en: "Emergency decree on part of the province",
      th: "ประกาศสถานการณ์ฉุกเฉินในบางส่วนของจังหวัด",
      zh: "府内部分地区的紧急状态",
    },
    note: {
      en: "1 if the Cabinet announcement still covers any district, otherwise 0, for every province. Lower is better. A 0 is not a crime rate and it is not a claim that the province is safe. Provincial crime is a different line and it is still missing. Yala, Pattani and Narathiwat are 1. Songkhla is 0, because this decree does not cover it.",
      th: "เป็น 1 ถ้าประกาศของคณะรัฐมนตรียังครอบคลุมอำเภอใด ไม่เช่นนั้นเป็น 0 ครบทุกจังหวัด ค่าน้อยกว่าดีกว่า ค่า 0 ไม่ใช่อัตราอาชญากรรม และไม่ใช่ข้ออ้างว่าจังหวัดปลอดภัย อาชญากรรมรายจังหวัดเป็นบรรทัดคนละบรรทัดและยังขาด ยะลา ปัตตานี และนราธิวาสเป็น 1 สงขลาเป็น 0 เพราะประกาศนี้ไม่ครอบคลุมสงขลา",
      zh: "如果内阁宣布仍覆盖任何一个县，记为 1，否则记为 0，每个府都有值。越低越好。0 不是犯罪率，也不是在说这个府安全。分府犯罪是另一行，仍然缺失。也拉、北大年、那拉提瓦是 1。宋卡是 0，因为这项宣布不包括宋卡。",
    },
  };
}

const crime = raw(
  "governance.crime",
  15,
  "lower",
  true,
  { en: "Provincial crime", th: "อาชญากรรมรายจังหวัด", zh: "分府犯罪" },
  {
    en: "Not in the file. The Royal Thai Police figures that were found are national totals. Road deaths are not used as a stand-in.",
    th: "ยังไม่อยู่ในไฟล์ ตัวเลขของสำนักงานตำรวจแห่งชาติที่พบเป็นยอดทั้งประเทศ ไม่ได้ใช้ผู้เสียชีวิตบนถนนมาแทน",
    zh: "还不在文件里。找得到的皇家警察数字是全国合计。不用道路死亡来代替。",
  },
);

export const LENSES = [
  {
    id: "growth",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Growth seekers", th: "คนที่ตามการเติบโต", zh: "追逐增长" },
    question: {
      en: "Where are output, population, approved investment, new companies and tourism spending growing, if ecology is left out?",
      th: "ผลผลิต ประชากร เงินลงทุนที่ได้รับส่งเสริม บริษัทใหม่ และค่าใช้จ่ายท่องเที่ยว โตที่ไหน ถ้าไม่เอานิเวศเข้าไปในผลรวม",
      zh: "如果总和里不计生态，产出、人口、获批投资、新公司和旅游花费在哪里增长？",
    },
    caveat: {
      en: "Ecology is left out on purpose. The order uses 2023 real output growth, registered-population growth from 2022 on, 2025 BOI investment per person, 2025 new companies per 10,000 people, and 2025 tourism receipts per person. A province the BOI table omits is blank, not zero. Per-person figures use the house register, so Bangkok, Phuket, Chon Buri and Samut Sakhon, where many people are not on the register, come out high. This is not a depa index.",
      th: "เลนส์นี้ตัดนิเวศออกโดยตั้งใจ ลำดับใช้การเติบโตของผลผลิตที่แท้จริงปี 2023 การเติบโตของประชากรตามทะเบียนตั้งแต่ปี 2022 เงินลงทุนบีโอไอต่อคนปี 2025 บริษัทใหม่ต่อหมื่นคนปี 2025 และรายได้ท่องเที่ยวต่อคนปี 2025 จังหวัดที่ตารางบีโอไอไม่ได้ลง จะว่าง ไม่ใช่ศูนย์ ตัวเลขต่อคนใช้ทะเบียนบ้าน ดังนั้นกรุงเทพฯ ภูเก็ต ชลบุรี และสมุทรสาคร ซึ่งมีคนนอกทะเบียนจำนวนมาก จะได้ค่าที่สูง ที่นี่ไม่ใช่ดัชนีของดีป้า",
      zh: "这个镜头故意不计生态。名次用的是 2023 年实际产出增长、2022 年起的户籍人口增长、2025 年人均 BOI 投资、2025 年每万人新公司，以及 2025 年人均旅游收入。BOI 表上没有的府是空白，不是零。人均数字用的是户籍，所以曼谷、普吉、春武里和龙仔厝这几个未登记人口很多的地方，数字会偏高。这不是 depa 的指数。",
    },
    components: [gppGrowth, popCagr, investmentPerPerson, newFirms, tourismPerPerson],
  },
  {
    id: "quiet",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Quiet retirement", th: "เกษียณแบบสงบ", zh: "安静退休" },
    question: {
      en: "Where is the air cleaner, a doctor closer, the road toll lower, and official land cheaper, with less crowding once density is published?",
      th: "ที่ไหนอากาศสะอาดกว่า แพทย์ใกล้กว่า ผู้เสียชีวิตบนถนนน้อยกว่า และที่ดินราชการถูกกว่า และแออัดน้อยกว่าเมื่อมีความหนาแน่นให้ใช้",
      zh: "哪里空气更干净、医生更近、道路死亡更少、官方地价更低，并且在密度公布之后没那么挤？",
    },
    caveat: {
      en: "Security data missing. The order uses 2025 bad-air days, doctors per 10,000 people, road deaths per 100,000, the Treasury appraisal, and whether any district is under the emergency decree. Parts of Yala, Pattani and Narathiwat are designated through 19 October 2569, so those three provinces are marked and moved down. That designation is not a count of violent incidents. Songkhla is not under the decree. Four of its districts, Chana, Thepha, Na Thawi and Saba Yoi, were internal-security areas through 30 September 2569, and a later extension is not in this file, so Songkhla is not scored as a security zone. Sixteen provinces have no PM2.5 station and stay blank. The doctor series may leave out private hospitals. Provincial crime, density and hospital beds are named and missing. The appraisal is not a market price.",
      th: "ข้อมูลความปลอดภัยยังขาด ลำดับใช้วันที่อากาศแย่ปี 2025 แพทย์ต่อหมื่นคน ผู้เสียชีวิตบนถนนต่อแสนคน ราคาประเมินของกรมธนารักษ์ และว่ามีอำเภอใดอยู่ใต้ประกาศสถานการณ์ฉุกเฉินหรือไม่ ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศถึงวันที่ 19 ตุลาคม 2569 ดังนั้นสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง การประกาศไม่ใช่จำนวนเหตุรุนแรง สงขลาไม่อยู่ใต้ประกาศนี้ สี่อำเภอ คือจะนะ เทพา นาทวี และสะบ้าย้อย เป็นพื้นที่ความมั่นคงถึงวันที่ 30 กันยายน 2569 และยังไม่มีการขยายหลังวันนั้นในไฟล์นี้ จึงไม่ได้ให้คะแนนสงขลาเป็นเขตความมั่นคง สิบหกจังหวัดไม่มีสถานี PM2.5 และว่างไว้ ชุดข้อมูลแพทย์อาจไม่รวมโรงพยาบาลเอกชน อาชญากรรมรายจังหวัด ความหนาแน่น และเตียงผู้ป่วยถูกตั้งชื่อไว้และยังขาด ราคาประเมินไม่ใช่ราคาตลาด",
      zh: "安全数据缺失。名次用的是 2025 年超标天数、每万人医生数、每十万人道路死亡、国库厅评估价，以及是否有县处于紧急状态。也拉、北大年、那拉提瓦的部分地区被划入，直至佛历 2569 年 10 月 19 日，所以这三个府被标出并下移。这项划定不是暴力事件的计数。宋卡不在这项宣布里。它的四个县——乍那、特帕、那他威、沙拜依——曾是内部安全区，到佛历 2569 年 9 月 30 日为止，这份文件里没有之后的延长，所以宋卡不按安全区计分。十六个府没有 PM2.5 站点，保持空白。医生序列可能不包括私立医院。分府犯罪、密度和医院床位有名字，但还缺。评估价不是市场价。",
    },
    components: [badAir(20, true), doctors(20, true), deaths(20, true), land(20, true), decree(40), density],
  },
  {
    id: "talent",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Talent and the border", th: "คนมีฝีมือกับชายแดน", zh: "人才与边境" },
    question: {
      en: "Where are there tertiary students, and where does a border checkpoint, a Border SEZ, or the Eastern Economic Corridor show up in the file?",
      th: "ที่ไหนมีนักศึกษา และที่ไหนด่านชายแดน เขตเศรษฐกิจพิเศษชายแดน หรือระเบียงเศรษฐกิจภาคตะวันออกโผล่ในไฟล์",
      zh: "哪里有高等教育在校生，哪里的边境关口、边境经济特区或东部经济走廊出现在文件里？",
    },
    caveat: {
      en: "The order uses tertiary students per 1,000 people, 2024 border customs trade where a land or river checkpoint exists, and the SEZ and EEC flags. No checkpoint is not stored as zero. In December 2568 border trade with Cambodia was zero in the Department of Foreign Trade file, so Sa Kaeo and Trat carry a current-status note. Sangkhla Buri imports, in the Kanchanaburi total, likely include pipeline gas. Graduates and average wages are not in the file. A flag does not rank the map by itself.",
      th: "ลำดับใช้นักศึกษาต่อพันคน การค้าผ่านด่านศุลกากรปี 2024 เฉพาะจังหวัดที่มีด่านบกหรือด่านน้ำ และธงเขตเศรษฐกิจพิเศษกับอีอีซี จังหวัดที่ไม่มีด่านไม่ได้ถูกเก็บเป็นศูนย์ เดือนธันวาคม 2568 การค้าชายแดนกับกัมพูชาเป็นศูนย์ในไฟล์กรมการค้าต่างประเทศ ดังนั้นสระแก้วและตราดมีหมายเหตุสถานะปัจจุบัน นำเข้าที่สังขละบุรีในยอดกาญจนบุรี น่าจะรวมก๊าซทางท่อ ผู้สำเร็จการศึกษาและค่าจ้างเฉลี่ยยังไม่อยู่ในไฟล์ ธงเพียงอย่างเดียวไม่จัดลำดับแผนที่",
      zh: "名次用的是每千人高等教育在校生、2024 年有陆路或河路关口的府的边境海关贸易，以及特区和东部经济走廊的标记。没有关口不会被存成零。佛历 2568 年 12 月，外贸厅文件里对柬埔寨的边境贸易是零，所以沙缴和达叻带有一条当下状态的说明。北碧合计里的桑卡拉武里进口，很可能包括管道气。毕业生和平均工资还不在文件里。单独一个标记不会给地图排序。",
    },
    components: [students(40, true), borderTrade(30), sez(15), eec(15)],
  },
  {
    id: "families",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Families", th: "ครอบครัว", zh: "家庭" },
    question: {
      en: "Where do the published figures for doctors, air, roads, internet, students, official land and unemployment point a household?",
      th: "ตัวเลขที่เผยแพร่แล้วเรื่องแพทย์ อากาศ ถนน อินเทอร์เน็ต นักศึกษา ที่ดินราชการ และว่างงาน ชี้ครัวเรือนไปที่ไหน",
      zh: "已经公布的医生、空气、道路、互联网、在校生、官方地价和失业数字，会把一个家庭指向哪里？",
    },
    caveat: {
      en: "Proposed. Security data missing. The figures that are in the file do order the map, including the emergency-decree line: parts of Yala, Pattani and Narathiwat are designated through 19 October 2569, and those three are marked and moved down. That is not a crime count. Songkhla is not under the decree. Four districts, Chana, Thepha, Na Thawi and Saba Yoi, were internal-security areas through 30 September 2569, and no later extension is in this file. School quality, childcare, provincial crime and hospital beds are still missing, so this is not a complete answer for a family. The doctor series may leave out private hospitals. The appraisal is not a market price.",
      th: "ข้อเสนอ ข้อมูลความปลอดภัยยังขาด ตัวเลขที่อยู่ในไฟล์จัดลำดับแผนที่ได้ รวมบรรทัดประกาศสถานการณ์ฉุกเฉิน ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศถึงวันที่ 19 ตุลาคม 2569 และสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง นั่นไม่ใช่จำนวนคดี สงขลาไม่อยู่ใต้ประกาศนี้ สี่อำเภอ จะนะ เทพา นาทวี และสะบ้าย้อย เป็นพื้นที่ความมั่นคงถึงวันที่ 30 กันยายน 2569 และไม่มีการขยายหลังวันนั้นในไฟล์นี้ คุณภาพโรงเรียน สถานเลี้ยงเด็ก อาชญากรรมรายจังหวัด และเตียงผู้ป่วยยังขาด ดังนั้นนี่ไม่ใช่คำตอบครบสำหรับครอบครัว ชุดข้อมูลแพทย์อาจไม่รวมโรงพยาบาลเอกชน ราคาประเมินไม่ใช่ราคาตลาด",
      zh: "这是提议。安全数据缺失。文件里已有的数字会给地图排序，其中包括紧急状态这一行：也拉、北大年、那拉提瓦的部分地区被划入，直至佛历 2569 年 10 月 19 日，这三个府被标出并下移。这不是犯罪计数。宋卡不在这项宣布里。乍那、特帕、那他威、沙拜依四个县曾是内部安全区，到佛历 2569 年 9 月 30 日为止，文件里没有之后的延长。学校质量、托幼、分府犯罪和医院床位仍然缺失，所以这不是给一个家庭的完整答案。医生序列可能不包括私立医院。评估价不是市场价。",
    },
    components: [doctors(15, true), badAir(15, true), deaths(15, true), internet(15), students(10, true), land(15, true), unemployment, decree(40), schools, beds, crime],
  },
  {
    id: "logistics",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Logistics and industry", th: "โลจิสติกส์และอุตสาหกรรม", zh: "物流与产业" },
    question: {
      en: "Where do border trade, approved investment, electricity, a labour pool and a lower statutory wage show up together?",
      th: "การค้าชายแดน เงินลงทุนที่ได้รับส่งเสริม ไฟฟ้า กลุ่มแรงงาน และค่าจ้างตามกฎหมายที่ต่ำกว่า อยู่พร้อมกันที่ไหน",
      zh: "边境贸易、获批投资、用电、劳动力规模和更低的法定工资，在哪里同时出现？",
    },
    caveat: {
      en: "Proposed. The order uses border trade, BOI investment per person, 2023 electricity per person, the labour force and the January 2568 minimum wage, plus the SEZ and EEC flags. Port distance, rail distance, truck volumes and industrial-estate prices are not in the file. Electricity is all use, not factories alone. The Cambodia note on Sa Kaeo and Trat, and the pipeline note on Kanchanaburi, apply here too. The wage is a statutory floor as of January 2568, not an average wage.",
      th: "ข้อเสนอ ลำดับใช้การค้าชายแดน เงินลงทุนบีโอไอต่อคน ไฟฟ้าต่อคนปี 2023 กำลังแรงงาน และค่าจ้างขั้นต่ำเดือนมกราคม 2568 พร้อมธงเขตเศรษฐกิจพิเศษและอีอีซี ระยะทางถึงท่าเรือ ระยะทางรถไฟ ปริมาณรถบรรทุก และราคาที่ดินนิคม ยังไม่อยู่ในไฟล์ ไฟฟ้าคือการใช้ทั้งหมด ไม่ใช่เฉพาะโรงงาน หมายเหตุกัมพูชาของสระแก้วและตราด และหมายเหตุท่อก๊าซของกาญจนบุรี ใช้ที่นี่ด้วย ค่าจ้างเป็นขั้นต่ำตามกฎหมาย ณ มกราคม 2568 ไม่ใช่ค่าจ้างเฉลี่ย",
      zh: "这是提议。名次用边境贸易、人均 BOI 投资、2023 年人均用电、劳动力，以及佛历 2568 年 1 月的最低工资，再加上特区和东部经济走廊的标记。到港口的距离、铁路距离、货车运量和工业区地价还不在文件里。用电是全部用电，不是只有工厂。沙缴和达叻的柬埔寨说明，以及北碧的管道气说明，在这里同样适用。工资是截至 2568 年 1 月的法定下限，不是平均工资。",
    },
    components: [borderTrade(25), { ...investmentPerPerson, weight: 20 }, electricityPerPerson, labour, wage(15), sez(5), eec(5)],
  },
  {
    id: "remote",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Remote workers", th: "คนทำงานทางไกล", zh: "远程工作" },
    question: {
      en: "Where do household internet, cleaner air, a lower official appraisal, new companies, foreign visitors and doctors coincide?",
      th: "อินเทอร์เน็ตในครัวเรือน อากาศที่สะอาดกว่า ราคาประเมินที่ต่ำกว่า บริษัทใหม่ ผู้มาเยือนชาวต่างชาติ และแพทย์ มาอยู่พร้อมกันที่ไหน",
      zh: "家庭互联网、更干净的空气、更低的官方评估价、新公司、外国游客和医生，在哪里碰在一起？",
    },
    caveat: {
      en: "Proposed. Those figures are in the file. Household internet is not a measured broadband speed, and the Treasury appraisal is not a rent. Coworking counts and market rents are not in the file, so this does not answer a nomad's actual bill. This lens does not include the emergency decree or provincial crime. Yala can rank high here while quiet retirement moves it down.",
      th: "ข้อเสนอ ตัวเลขเหล่านั้นอยู่ในไฟล์ อินเทอร์เน็ตในครัวเรือนไม่ใช่ความเร็วบรอดแบนด์ที่วัดได้ และราคาประเมินของกรมธนารักษ์ไม่ใช่ค่าเช่า จำนวนโคเวิร์กกิงและค่าเช่าตลาดยังไม่อยู่ในไฟล์ ดังนั้นนี่ไม่ได้ตอบบิลจริงของคนทำงานนอกสถานที่ เลนส์นี้ไม่มีประกาศสถานการณ์ฉุกเฉินหรืออาชญากรรมรายจังหวัด ยะลาอาจอยู่อันดับสูงที่นี่ ในขณะที่เลนส์เกษียณแบบสงบดันลง",
      zh: "这是提议。那些数字在文件里。家庭互联网不是测得的宽带速率，国库厅评估价也不是租金。联合办公的数量和市场租金还不在文件里，所以这回答不了一个远程工作者的实际账单。这个镜头不包括紧急状态，也不包括分府犯罪。也拉在这里可以排得高，而安静退休会把它下移。",
    },
    components: [internet(25), badAir(20, true), land(20, true), { ...newFirms, weight: 15 }, visitorsForeign(10), doctors(10, true)],
  },
  {
    id: "tourism",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Tourism investors", th: "นักลงทุนท่องเที่ยว", zh: "旅游投资" },
    question: {
      en: "Where do receipts, foreign visitors, hotel occupancy, forest and cleaner air show up in a published file?",
      th: "รายได้ ผู้มาเยือนชาวต่างชาติ อัตราเข้าพัก ป่า และอากาศที่สะอาดกว่า โผล่ในไฟล์ที่เผยแพร่ที่ไหน",
      zh: "收入、外国游客、酒店入住率、森林和更干净的空气，出现在哪一份已公布的文件里？",
    },
    caveat: {
      en: "Proposed. Receipts per person, foreign visitors, occupancy, forest cover and bad-air days are published for the provinces that have them, and they do order the map. Seasonality and airport seats are not in the file. Forest cover is not a coastline. Sixteen provinces have no PM2.5 station and stay blank on that line. This lens does not include the emergency decree. Yala can rank high on visitors and forest while quiet retirement moves it down.",
      th: "ข้อเสนอ รายได้ต่อคน ผู้มาเยือนชาวต่างชาติ อัตราเข้าพัก พื้นที่ป่า และวันที่อากาศแย่ ถูกเผยแพร่สำหรับจังหวัดที่มี และจัดลำดับแผนที่ได้ ฤดูกาลและที่นั่งบนเครื่องบินยังไม่อยู่ในไฟล์ พื้นที่ป่าไม่ใช่ชายฝั่ง สิบหกจังหวัดไม่มีสถานี PM2.5 และว่างในบรรทัดนั้น เลนส์นี้ไม่มีประกาศสถานการณ์ฉุกเฉิน ยะลาอาจอยู่อันดับสูงจากผู้มาเยือนและป่า ในขณะที่เลนส์เกษียณแบบสงบดันลง",
      zh: "这是提议。人均收入、外国游客、入住率、森林覆盖和超标天数，对有这些数字的府已经公布，也能给地图排序。淡旺季和机场座位还不在文件里。森林覆盖不是海岸线。十六个府没有 PM2.5 站点，那一行保持空白。这个镜头不包括紧急状态。也拉可以因游客和森林排得高，而安静退休会把它下移。",
    },
    components: [{ ...tourismPerPerson, weight: 25 }, visitorsForeign(25), occupancy, forest, badAir(15, true)],
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
