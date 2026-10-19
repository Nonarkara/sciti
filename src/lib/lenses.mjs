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
    th: "อัตราทบต้นรายปีของประชากรตามทะเบียน ใช้ปีตั้งแต่ 2565 ต้องมีสองค่าที่มากกว่าศูนย์ สูตรคือค่าหลังหารค่าก่อน ยกกำลังหนึ่งส่วนจำนวนปี แล้วลบหนึ่ง ปีที่เก่ากว่านั้นยังอยู่ในไฟล์ แต่ไม่ได้ใช้ตรงนี้",
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
    th: "การเติบโตของผลิตภัณฑ์มวลรวมจังหวัดหนึ่งปี ตามปริมาณลูกโซ่ ปี 2566 จากหนังสือสถิติประจำปีของ สสช. (สภาพัฒน์) ไม่ใช่อัตราหลายปี และปี 2567 ยังไม่อยู่ในไฟล์",
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
    en: "BOI-approved investment for 2025, in million baht, divided by the latest registered population, shown as baht per person. A zero the BOI table publishes is a real zero. Provinces the table does not list are left blank. A blank is not a zero. The latest year in the file is used.",
    th: "มูลค่าส่งเสริมการลงทุนของบีโอไอปี 2568 หน่วยล้านบาท หารด้วยประชากรตามทะเบียนล่าสุด แสดงเป็นบาทต่อคน ศูนย์ที่ตารางบีโอไอเผยแพร่คือศูนย์จริง จังหวัดที่ตารางไม่ได้ลงไว้ จะว่าง ช่องว่างไม่ใช่ศูนย์ ใช้ปีล่าสุดในไฟล์",
    zh: "2025 年 BOI 批准投资额，单位百万铢，除以最新户籍人口，显示为每人铢。表上公布的零是真正的零。表上没有的府留空。空着不是零。用文件里的最近一年。",
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
    th: "นิติบุคคลตั้งใหม่ปี 2568 ต่อประชากรตามทะเบียนหมื่นคน จากกรมพัฒนาธุรกิจการค้า จำนวนบริษัทไม่ใช่จำนวนงาน",
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
    th: "รายได้การท่องเที่ยวปี 2568 หน่วยล้านบาท หารด้วยประชากรตามทะเบียนล่าสุด ตัวเลขของกระทรวงการท่องเที่ยวและกีฬาเป็นจำนวนครั้งการเดินทางและค่าใช้จ่าย ไม่ใช่สำมะโนว่าใครอาศัยอยู่",
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
      th: "จำนวนวันในปี 2568 ที่ PM2.5 เกินมาตรฐาน 24 ชั่วโมงของไทย ที่สถานีมัธยฐานในจังหวัด จากกรมควบคุมมลพิษ ค่าน้อยกว่าดีกว่า จังหวัดที่ไม่มีสถานีในไฟล์นั้นสิบหกจังหวัด จะว่างไว้ สถานีที่แย่ที่สุดในจังหวัดเดียวกันอาจสูงกว่ามาก นี่คือวันทั้งปี ไม่ใช่ชั่วโมงนี้",
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
      th: "แพทย์ปี 2567 ต่อประชากรตามทะเบียนหมื่นคน จากสำนักงานปลัดกระทรวงสาธารณสุข ตารางไม่ได้บอกว่านับแพทย์โรงพยาบาลเอกชนหรือไม่ นี่ไม่ใช่จำนวนเตียง",
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
      th: "ผู้เสียชีวิตจากอุบัติเหตุทางถนนปี 2568 ต่อประชากรตามทะเบียนแสนคน จากกรมควบคุมโรค (RTDDI) ค่าน้อยกว่าดีกว่า นี่ไม่ใช่ชุดข้อมูลอาชญากรรม",
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

function borderTrade(weight, missingAsZero = false) {
  const component = raw(
    "economy.border_trade",
    weight,
    "higher",
    true,
    { en: "Border customs trade", th: "การค้าผ่านด่านศุลกากรชายแดน", zh: "边境海关贸易" },
    missingAsZero
      ? {
          en: "Exports plus imports in 2024 through land and river customs checkpoints, in million baht, from the Customs Department. On this lens a province with no such checkpoint scores 0, and that 0 counts as present. The mark is log(1 + the million-baht total), stretched from that 0 to the largest province, so a small checkpoint stays small. It is not a percentile. The 0 is the absence of a checkpoint, not a published customs total of zero, and the file still leaves the cell blank. Seaports and airports are not included. In December 2568 the Department of Foreign Trade recorded no border trade with Cambodia, so Sa Kaeo and Trat keep their 2024 customs year and carry a status mark. Sangkhla Buri imports, inside the Kanchanaburi figure, likely include pipeline gas.",
          th: "ส่งออกบวกนำเข้าปี 2567 ผ่านด่านศุลกากรทางบกและทางน้ำ หน่วยล้านบาท จากกรมศุลกากร ในเลนส์นี้ จังหวัดที่ไม่มีด่านแบบนั้นได้ 0 และ 0 นั้นนับว่ามีตัวป้อน คะแนนคือ log(1 + ยอดล้านบาท) ยืดจาก 0 นั้นไปถึงจังหวัดที่มากที่สุด ดังนั้นด่านเล็กได้คะแนนเล็ก ไม่ใช่เปอร์เซ็นไทล์ 0 คือการไม่มีด่าน ไม่ใช่ยอดศุลกากรที่เป็นศูนย์ซึ่งถูกเผยแพร่ และไฟล์ยังเว้นช่องนั้นว่าง ไม่รวมท่าเรือและสนามบิน เดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ ดังนั้นสระแก้วและตราดคงยอดศุลกากรทั้งปี 2567 ไว้ และมีเครื่องหมายสถานะ นำเข้าที่สังขละบุรี ซึ่งอยู่ในตัวเลขกาญจนบุรี น่าจะรวมก๊าซทางท่อ",
          zh: "2024 年经陆路和河路海关关口的出口加进口，单位百万铢，来自海关厅。在这个镜头里，没有这类关口的府记 0，这个 0 算作已有输入。分数是 log(1 + 百万铢总额)，从 0 拉到贸易额最大的府，所以小关口只得小分。这不是百分位。这个 0 是没有关口，不是一份公布出来的海关零，文件里那个格子仍然留空。不含海港和机场。佛历 2568 年 12 月，外贸厅记录对柬埔寨边境贸易为零，所以沙缴和达叻保留 2024 年的海关全年数字，并带有状态标记。桑卡拉武里的进口算在北碧府的数字里，很可能包括管道天然气。",
        }
      : {
          en: "Exports plus imports in 2024 through land and river customs checkpoints, in million baht, from the Customs Department. Only the 25 provinces with such a checkpoint have a figure. The others are blank, not zero. Seaports and airports are not included. In December 2568 the Department of Foreign Trade recorded no border trade with Cambodia, so Sa Kaeo and Trat need a current check before anyone treats them as a border bet. Sangkhla Buri imports, inside the Kanchanaburi figure, likely include pipeline gas.",
          th: "ส่งออกบวกนำเข้าปี 2567 ผ่านด่านศุลกากรทางบกและทางน้ำ หน่วยล้านบาท จากกรมศุลกากร มีตัวเลขเฉพาะ 25 จังหวัดที่มีด่านแบบนั้น จังหวัดอื่นว่าง ไม่ใช่ศูนย์ ไม่รวมท่าเรือและสนามบิน เดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ จึงต้องตรวจสถานะปัจจุบันก่อนถือว่าสระแก้วหรือตราดเป็นการเดิมพันชายแดน นำเข้าที่สังขละบุรี ซึ่งอยู่ในตัวเลขกาญจนบุรี น่าจะรวมก๊าซทางท่อ",
          zh: "2024 年经陆路和河路海关关口的出口加进口，单位百万铢，来自海关厅。只有设有这类关口的 25 个府有数字。其余留空，不是零。不含海港和机场。佛历 2568 年 12 月，外贸厅记录对柬埔寨边境贸易为零，所以把沙缴或达叻当成边境赌注之前，要先核对当下的口岸状态。桑卡拉武里的进口算在北碧府的数字里，很可能包括管道天然气。",
        },
  );
  if (missingAsZero) component.missingAsZero = true;
  component.scale = "log1p-minmax";
  return component;
}

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
    th: "ค่าเฉลี่ยสี่ไตรมาสของปี 2568 จากการสำรวจภาวะการทำงานของ สสช. ค่าน้อยกว่าดีกว่า นี่ไม่ใช่ค่าจ้าง",
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
    th: "การใช้ไฟฟ้าปี 2566 หน่วยกิกะวัตต์ชั่วโมง หารด้วยประชากรตามทะเบียนล่าสุด แสดงเป็นกิโลวัตต์ชั่วโมงต่อคน เป็นการใช้ทั้งหมดในจังหวัด ไม่ใช่เฉพาะโรงงาน และไม่มีปีหลังกว่านั้นรายจังหวัดในไฟล์",
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
    th: "กำลังแรงงานปี 2568 ค่าเฉลี่ยสี่ไตรมาส หน่วยพันคน จากการสำรวจภาวะการทำงานของ สสช. เป็นขนาด ดังนั้นจังหวัดใหญ่จะอยู่สูงกว่าในบรรทัดนี้เพียงบรรทัดเดียว",
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
      th: "จำนวนครั้งที่ผู้มาเยือนชาวต่างชาติเดินทางมาปี 2568 จากกระทรวงการท่องเที่ยวและกีฬา หนึ่งครั้งไม่ใช่หนึ่งผู้อยู่อาศัย",
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
    th: "อัตราเข้าพักโรงแรมปี 2568 จากกระทรวงการท่องเที่ยวและกีฬา เป็นอัตราทั้งปี ไม่ใช่ฤดูกาลรายเดือน",
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
    th: "พื้นที่ป่าเป็นสัดส่วนของจังหวัดปี 2567 จากหนังสือสถิติประจำปีของ สสช. ไม่ใช่พื้นที่สีเขียวในเมือง และไม่ใช่ชายหาด",
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
      en: "1 if the Cabinet announcement still covers any district, otherwise 0, for every province. Lower is better. Extension 86 is in force 20 October 2569 through 19 January 2570 (Cabinet, 6 October 2569): Narathiwat except Yi-ngo, Waeng and Sukhirin; Pattani except Yaring, Panare, Mayo, Mai Kaen, Thung Yang Daeng, Kapho and Mae Lan; Yala except Betong, Yaha, Kabang, Krong Pinang and Raman. A 0 is not a crime rate and it is not a claim that the province is safe. Provincial crime is a different line and it is still missing. Yala, Pattani and Narathiwat are 1. Songkhla is 0, because this decree does not cover it.",
      th: "เป็น 1 ถ้าประกาศของคณะรัฐมนตรียังครอบคลุมอำเภอใด ไม่เช่นนั้นเป็น 0 ครบทุกจังหวัด ค่าน้อยกว่าดีกว่า การขยายครั้งที่ 86 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 (มติคณะรัฐมนตรี 6 ตุลาคม 2569) นราธิวาสยกเว้นยี่งอ แว้ง และสุคิริน ปัตตานียกเว้นยะหริ่ง ปะนาเระ มายอ ไม้แก่น ทุ่งยางแดง กะพ้อ และแม่ลาน ยะลายกเว้นเบตง ยะหา กาบัง กรงปินัง และรามัน ค่า 0 ไม่ใช่อัตราอาชญากรรม และไม่ใช่ข้ออ้างว่าจังหวัดปลอดภัย อาชญากรรมรายจังหวัดเป็นบรรทัดคนละบรรทัดและยังขาด ยะลา ปัตตานี และนราธิวาสเป็น 1 สงขลาเป็น 0 เพราะประกาศนี้ไม่ครอบคลุมสงขลา",
      zh: "如果内阁宣布仍覆盖任何一个县，记为 1，否则记为 0，每个府都有值。越低越好。第 86 次延长自佛历 2569 年 10 月 20 日起至 2570 年 1 月 19 日有效（内阁，2569 年 10 月 6 日）：那拉提瓦除外伊戈、瓦英、素奇林；北大年除外亚灵、巴纳雷、玛腰、迈干、通央登、卡坡、湄兰；也拉除外勿洞、亚哈、甲邦、格龙披南和拉曼。0 不是犯罪率，也不是在说这个府安全。分府犯罪是另一行，仍然缺失。也拉、北大年、那拉提瓦是 1。宋卡是 0，因为这项宣布不包括宋卡。",
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
      en: "Ecology is left out on purpose. The order uses 2023 real output growth, registered-population growth from 2022 on, 2025 BOI investment per person, 2025 new companies per 10,000 people, and 2025 tourism receipts per person. A province the BOI table omits is blank, not zero. Per-person figures use the house register. Where the latent-population survey is complete, a high unregistered share, as in Phuket, Chon Buri and Samut Sakhon, means those per-person figures come out high. Where any cell is n.a., including Bangkok and Si Sa Ket, that share is left blank and is not stored as zero. This is not a depa index.",
      th: "เลนส์นี้ตัดนิเวศออกโดยตั้งใจ ลำดับใช้การเติบโตของผลผลิตที่แท้จริงปี 2566 การเติบโตของประชากรตามทะเบียนตั้งแต่ปี 2565 เงินลงทุนบีโอไอต่อคนปี 2568 บริษัทใหม่ต่อหมื่นคนปี 2568 และรายได้ท่องเที่ยวต่อคนปี 2568 จังหวัดที่ตารางบีโอไอไม่ได้ลง จะว่าง ไม่ใช่ศูนย์ ตัวเลขต่อคนใช้ทะเบียนบ้าน ที่ซึ่งการสำรวจประชากรแฝงครบ ภูเก็ต ชลบุรี และสมุทรสาครมีสัดส่วนผู้ไม่ได้อยู่ในทะเบียนสูง ตัวเลขต่อคนจึงออกมาสูง ที่ซึ่งมีช่อง n.a. รวมกรุงเทพฯ และศรีสะเกษ สัดส่วนนั้นถูกเว้นว่าง และไม่ได้ถูกเก็บเป็นศูนย์ ที่นี่ไม่ใช่ดัชนีของดีป้า",
      zh: "这个镜头故意不计生态。名次用的是 2023 年实际产出增长、2022 年起的户籍人口增长、2025 年人均 BOI 投资、2025 年每万人新公司，以及 2025 年人均旅游收入。BOI 表上没有的府是空白，不是零。人均数字用的是户籍。隐性人口调查完整的地方，比如普吉、春武里和龙仔厝，未登记比例高，人均数字就会偏高。任何一个单元格是 n.a. 的府，包括曼谷和四色菊，这个比例留空，不会被存成零。这不是 depa 的指数。",
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
      en: "Security data missing. The order uses 2025 bad-air days, doctors per 10,000 people, road deaths per 100,000, the Treasury appraisal, and whether any district is under the emergency decree. Parts of Yala, Pattani and Narathiwat are designated under extension 86, in force 20 October 2569 through 19 January 2570 (Cabinet, 6 October 2569). Raman is among Yala's exceptions, so those three provinces are marked and moved down. That designation is not a count of violent incidents. Songkhla is not under the decree. Four of its districts, Chana, Thepha, Na Thawi and Saba Yoi, were internal-security areas through 30 September 2569, and a later extension is not in this file, so Songkhla is not scored as a security zone. Sixteen provinces have no PM2.5 station and stay blank. The doctor series may leave out private hospitals. Provincial crime, density and hospital beds are named and missing. The appraisal is not a market price. Surin and Si Sa Ket sit high on this list, and both sit on the Cambodia border: Chong Chom in Surin, Chong Sa-ngam in Si Sa Ket. In November 2568 the Department of Foreign Trade recorded no border trade with Cambodia (https://mgronline.com/business/detail/9680000124855). Thai PBS describes Chong Chom as quiet after the clashes that resumed on 7 December 2568, and names both provinces in that southern-Isan border economy (https://policywatch.thaipbs.or.th/article/investment-102). A high rank here is not a claim that the border is calm. Their 2024 customs totals stay in the file.",
      th: "ข้อมูลความปลอดภัยยังขาด ลำดับใช้วันที่อากาศแย่ปี 2568 แพทย์ต่อหมื่นคน ผู้เสียชีวิตบนถนนต่อแสนคน ราคาประเมินของกรมธนารักษ์ และว่ามีอำเภอใดอยู่ใต้ประกาศสถานการณ์ฉุกเฉินหรือไม่ ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศตามการขยายครั้งที่ 86 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 (มติคณะรัฐมนตรี 6 ตุลาคม 2569) และรามันอยู่ในอำเภอยกเว้นของยะลา ดังนั้นสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง การประกาศไม่ใช่จำนวนเหตุรุนแรง สงขลาไม่อยู่ใต้ประกาศนี้ สี่อำเภอ คือจะนะ เทพา นาทวี และสะบ้าย้อย เป็นพื้นที่ความมั่นคงถึงวันที่ 30 กันยายน 2569 และยังไม่มีการขยายหลังวันนั้นในไฟล์นี้ จึงไม่ได้ให้คะแนนสงขลาเป็นเขตความมั่นคง สิบหกจังหวัดไม่มีสถานี PM2.5 และว่างไว้ ชุดข้อมูลแพทย์อาจไม่รวมโรงพยาบาลเอกชน อาชญากรรมรายจังหวัด ความหนาแน่น และเตียงผู้ป่วยถูกตั้งชื่อไว้และยังขาด ราคาประเมินไม่ใช่ราคาตลาด สุรินทร์และศรีสะเกษอยู่สูงในรายการนี้ และทั้งคู่อยู่บนชายแดนกัมพูชา คือช่องจอมในสุรินทร์ และช่องสะงำในศรีสะเกษ เดือนพฤศจิกายน 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์บาท (https://mgronline.com/business/detail/9680000124855) ไทยพีบีเอสบรรยายว่าช่องจอมเงียบหลังการปะทะที่กลับมาตั้งแต่วันที่ 7 ธันวาคม 2568 และระบุทั้งสองจังหวัดในเศรษฐกิจชายแดนอีสานใต้ (https://policywatch.thaipbs.or.th/article/investment-102) อันดับที่สูงที่นี่ไม่ใช่ข้ออ้างว่าชายแดนสงบ ยอดศุลกากรปี 2567 ของทั้งสองจังหวัดยังอยู่ในไฟล์",
      zh: "安全数据缺失。名次用的是 2025 年超标天数、每万人医生数、每十万人道路死亡、国库厅评估价，以及是否有县处于紧急状态。也拉、北大年、那拉提瓦的部分地区被划入，按第 86 次延长，自佛历 2569 年 10 月 20 日起至 2570 年 1 月 19 日（内阁，2569 年 10 月 6 日）。拉曼列入也拉的除外县，所以这三个府被标出并下移。这项划定不是暴力事件的计数。宋卡不在这项宣布里。它的四个县——乍那、特帕、那他威、沙拜依——曾是内部安全区，到佛历 2569 年 9 月 30 日为止，这份文件里没有之后的延长，所以宋卡不按安全区计分。十六个府没有 PM2.5 站点，保持空白。医生序列可能不包括私立医院。分府犯罪、密度和医院床位有名字，但还缺。评估价不是市场价。素林和四色菊在这份名单上靠前，两府都在柬埔寨边境：素林的冲宗，四色菊的冲桑岩。佛历 2568 年 11 月，外贸厅记录对柬埔寨的边境贸易为零铢（https://mgronline.com/business/detail/9680000124855）。泰国公共广播写道，冲宗在佛历 2568 年 12 月 7 日冲突再起之后一片冷清，并把两府都写进南部伊善边境经济（https://policywatch.thaipbs.or.th/article/investment-102）。这里名次高，不是在说边境平静。两府 2024 年的海关合计仍留在文件里。",
    },
    components: [badAir(20, true), doctors(20, true), deaths(20, true), land(20, true), decree(40), density],
  },
  {
    id: "talent-border",
    proposed: false,
    rankGate: "decisive",
    name: { en: "Talent and border investment", th: "คนมีฝีมือและการลงทุนชายแดน", zh: "人才与边境投资" },
    question: {
      en: "Where do tertiary students, a border checkpoint, a Border SEZ, or the Eastern Economic Corridor show up together?",
      th: "นักศึกษา ด่านชายแดน เขตเศรษฐกิจพิเศษชายแดน หรือระเบียงเศรษฐกิจภาคตะวันออก อยู่พร้อมกันที่ไหน",
      zh: "高等教育在校生、边境关口、边境经济特区或东部经济走廊，在哪里同时出现？",
    },
    caveat: {
      en: "This is the talent-plus-border persona. The order uses tertiary students per 1,000 people, 2024 border customs trade, and the SEZ and EEC flags. A province with no land or river checkpoint scores 0 on the border line, and that 0 counts as present, so a missing checkpoint does not drop the province out of the order. The border mark is log(1 + the million-baht total), stretched from that 0 to the largest province, not a percentile, so a small checkpoint stays small. The 0 is not written into the file. In December 2568 border trade with Cambodia was zero in the Department of Foreign Trade file, so Sa Kaeo and Trat keep their 2024 customs year and carry a status mark. Sangkhla Buri imports, in the Kanchanaburi total, likely include pipeline gas. Graduates and average wages are not in the file. A flag does not rank the map by itself. The students-only order is the Talent lens.",
      th: "นี่คือเลนส์คนมีฝีมือบวกการลงทุนชายแดน ลำดับใช้นักศึกษาต่อพันคน การค้าผ่านด่านศุลกากรปี 2567 และธงเขตเศรษฐกิจพิเศษกับอีอีซี จังหวัดที่ไม่มีด่านบกหรือด่านน้ำได้ 0 ในบรรทัดชายแดน และ 0 นั้นนับว่ามีตัวป้อน ดังนั้นด่านที่ไม่มีไม่ได้ทำให้จังหวัดหลุดจากลำดับ คะแนนชายแดนคือ log(1 + ยอดล้านบาท) ยืดจาก 0 นั้นไปถึงจังหวัดที่มากที่สุด ไม่ใช่เปอร์เซ็นไทล์ ดังนั้นด่านเล็กได้คะแนนเล็ก ไฟล์ไม่ได้เก็บ 0 นั้น เดือนธันวาคม 2568 การค้าชายแดนกับกัมพูชาเป็นศูนย์ในไฟล์กรมการค้าต่างประเทศ ดังนั้นสระแก้วและตราดคงยอดศุลกากรปี 2567 และมีเครื่องหมายสถานะ นำเข้าที่สังขละบุรีในยอดกาญจนบุรี น่าจะรวมก๊าซทางท่อ ผู้สำเร็จการศึกษาและค่าจ้างเฉลี่ยยังไม่อยู่ในไฟล์ ธงเพียงอย่างเดียวไม่จัดลำดับแผนที่ ลำดับที่ใช้แต่นักศึกษาคือเลนส์คนมีฝีมือ",
      zh: "这是人才加边境投资这个人物。名次用每千人高等教育在校生、2024 年边境海关贸易，以及特区和东部经济走廊的标记。没有陆路或河路关口的府，在边境这一行记 0，这个 0 算作已有输入，所以缺少关口不会把该府挤出名次。边境分数是 log(1 + 百万铢总额)，从 0 拉到贸易额最大的府，不是百分位，所以小关口只得小分。这个 0 不写进文件。佛历 2568 年 12 月，外贸厅文件里对柬埔寨的边境贸易是零，所以沙缴和达叻保留 2024 年的海关全年数字，并带有状态标记。北碧合计里的桑卡拉武里进口，很可能包括管道气。毕业生和平均工资还不在文件里。单独一个标记不会给地图排序。只用在校生的名次是人才镜头。",
    },
    components: [students(40, true), borderTrade(30, true), sez(15), eec(15)],
  },
  {
    id: "talent",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Talent", th: "คนมีฝีมือ", zh: "人才" },
    question: {
      en: "Where are there tertiary students, with the border left out of the sum?",
      th: "ที่ไหนมีนักศึกษา เมื่อไม่เอาชายแดนเข้าไปในผลรวม",
      zh: "如果不把边境放进总和，哪里有高等教育在校生？",
    },
    caveat: {
      en: "Proposed. The order uses tertiary students per 1,000 people and nothing else, so every province with that figure is ranked. Three provinces have no campus in the file and stay blank. A blank is not a zero. Border trade, the SEZ and the EEC are not inputs here. They live on Border trade and on Talent and border investment, where a province with no checkpoint scores 0. Graduates are not in the file.",
      th: "ข้อเสนอ ลำดับใช้นักศึกษาต่อพันคนเพียงอย่างเดียว ดังนั้นทุกจังหวัดที่มีตัวเลขนั้นถูกจัดลำดับ สามจังหวัดไม่มีวิทยาเขตในไฟล์และว่างไว้ ช่องว่างไม่ใช่ศูนย์ การค้าชายแดน เขตเศรษฐกิจพิเศษ และอีอีซีไม่ใช่ตัวป้อนที่นี่ สิ่งเหล่านั้นอยู่ในเลนส์การค้าชายแดน และเลนส์คนมีฝีมือและการลงทุนชายแดน ซึ่งจังหวัดที่ไม่มีด่านได้ 0 ผู้สำเร็จการศึกษายังไม่อยู่ในไฟล์",
      zh: "这是提议。名次只用每千人高等教育在校生，所以每一个有这个数字的府都进入名次。三个府在文件里没有校区，保持空白。空白不是零。边境贸易、经济特区和东部经济走廊不是这里的输入。它们在边境贸易镜头，以及人才与边境投资镜头里，没有关口的府在那里记 0。毕业生还不在文件里。",
    },
    components: [students(100, true)],
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
      en: "Proposed. Security data missing. The figures that are in the file do order the map, including the emergency-decree line: parts of Yala, Pattani and Narathiwat are designated under extension 86, in force 20 October 2569 through 19 January 2570 (Cabinet, 6 October 2569). Raman is among Yala's exceptions, and those three are marked and moved down. That is not a crime count. Songkhla is not under the decree. Four districts, Chana, Thepha, Na Thawi and Saba Yoi, were internal-security areas through 30 September 2569, and no later extension is in this file. School quality, childcare, provincial crime and hospital beds are still missing, so this is not a complete answer for a family. The doctor series may leave out private hospitals. The appraisal is not a market price.",
      th: "ข้อเสนอ ข้อมูลความปลอดภัยยังขาด ตัวเลขที่อยู่ในไฟล์จัดลำดับแผนที่ได้ รวมบรรทัดประกาศสถานการณ์ฉุกเฉิน ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศตามการขยายครั้งที่ 86 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 (มติคณะรัฐมนตรี 6 ตุลาคม 2569) และรามันอยู่ในอำเภอยกเว้นของยะลา และสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง นั่นไม่ใช่จำนวนคดี สงขลาไม่อยู่ใต้ประกาศนี้ สี่อำเภอ จะนะ เทพา นาทวี และสะบ้าย้อย เป็นพื้นที่ความมั่นคงถึงวันที่ 30 กันยายน 2569 และไม่มีการขยายหลังวันนั้นในไฟล์นี้ คุณภาพโรงเรียน สถานเลี้ยงเด็ก อาชญากรรมรายจังหวัด และเตียงผู้ป่วยยังขาด ดังนั้นนี่ไม่ใช่คำตอบครบสำหรับครอบครัว ชุดข้อมูลแพทย์อาจไม่รวมโรงพยาบาลเอกชน ราคาประเมินไม่ใช่ราคาตลาด",
      zh: "这是提议。安全数据缺失。文件里已有的数字会给地图排序，其中包括紧急状态这一行：也拉、北大年、那拉提瓦的部分地区被划入，按第 86 次延长，自佛历 2569 年 10 月 20 日起至 2570 年 1 月 19 日（内阁，2569 年 10 月 6 日）。拉曼列入也拉的除外县，这三个府被标出并下移。这不是犯罪计数。宋卡不在这项宣布里。乍那、特帕、那他威、沙拜依四个县曾是内部安全区，到佛历 2569 年 9 月 30 日为止，文件里没有之后的延长。学校质量、托幼、分府犯罪和医院床位仍然缺失，所以这不是给一个家庭的完整答案。医生序列可能不包括私立医院。评估价不是市场价。",
    },
    components: [doctors(15, true), badAir(15, true), deaths(15, true), internet(15), students(10, true), land(15, true), unemployment, decree(40), schools, beds, crime],
  },
  {
    id: "industry",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Industry and ports", th: "อุตสาหกรรมและท่าเรือ", zh: "产业与港口" },
    question: {
      en: "Where do approved investment, electricity, a labour pool and a lower statutory wage show up, with the border left out?",
      th: "เงินลงทุนที่ได้รับส่งเสริม ไฟฟ้า กลุ่มแรงงาน และค่าจ้างตามกฎหมายที่ต่ำกว่า อยู่ที่ไหน เมื่อไม่เอาชายแดนเข้าไป",
      zh: "如果不计入边境，获批投资、用电、劳动力规模和更低的法定工资出现在哪里？",
    },
    caveat: {
      en: "Proposed. The order uses BOI investment per person, 2023 electricity per person, the labour force and the January 2568 minimum wage, plus the SEZ and EEC flags. Border customs trade is not an input, so a province with no checkpoint is not dropped behind a smaller border province. That comparison lives on Border trade, where no checkpoint scores 0. Port distance, rail distance, truck volumes and industrial-estate prices are not in the file. Electricity is all use, not factories alone. A province the BOI table omits is blank on the investment line, not zero. The wage is a statutory floor as of January 2568, not an average wage.",
      th: "ข้อเสนอ ลำดับใช้เงินลงทุนบีโอไอต่อคน ไฟฟ้าต่อคนปี 2566 กำลังแรงงาน และค่าจ้างขั้นต่ำเดือนมกราคม 2568 พร้อมธงเขตเศรษฐกิจพิเศษและอีอีซี การค้าผ่านด่านศุลกากรไม่ใช่ตัวป้อน ดังนั้นจังหวัดที่ไม่มีด่านจะไม่ถูกดันไปอยู่หลังจังหวัดชายแดนที่เล็กกว่า การเทียบนั้นอยู่ในเลนส์การค้าชายแดน ซึ่งจังหวัดที่ไม่มีด่านได้ 0 ระยะทางถึงท่าเรือ ระยะทางรถไฟ ปริมาณรถบรรทุก และราคาที่ดินนิคม ยังไม่อยู่ในไฟล์ ไฟฟ้าคือการใช้ทั้งหมด ไม่ใช่เฉพาะโรงงาน จังหวัดที่ตารางบีโอไอไม่ได้ลง จะว่างในบรรทัดการลงทุน ไม่ใช่ศูนย์ ค่าจ้างเป็นขั้นต่ำตามกฎหมาย ณ มกราคม 2568 ไม่ใช่ค่าจ้างเฉลี่ย",
      zh: "这是提议。名次用人均 BOI 投资、2023 年人均用电、劳动力，以及佛历 2568 年 1 月的最低工资，再加上特区和东部经济走廊的标记。边境海关贸易不是输入，所以没有关口的府不会被排到较小的边境府后面。那个比较在边境贸易镜头里，没有关口记 0。到港口的距离、铁路距离、货车运量和工业区地价还不在文件里。用电是全部用电，不是只有工厂。BOI 表上没有的府，投资这一行是空白，不是零。工资是截至 2568 年 1 月的法定下限，不是平均工资。",
    },
    components: [{ ...investmentPerPerson, weight: 30 }, { ...electricityPerPerson, weight: 20 }, { ...labour, weight: 20 }, wage(20), sez(5), eec(5)],
  },
  {
    id: "border",
    proposed: true,
    rankGate: "decisive",
    name: { en: "Border trade", th: "การค้าชายแดน", zh: "边境贸易" },
    question: {
      en: "Where does land and river customs trade show up, once a province with no checkpoint is allowed to score zero?",
      th: "การค้าผ่านด่านศุลกากรทางบกและทางน้ำอยู่ที่ไหน เมื่อจังหวัดที่ไม่มีด่านได้ศูนย์ได้",
      zh: "当没有关口的府可以记零时，陆路和河路海关贸易出现在哪里？",
    },
    caveat: {
      en: "Proposed. The order uses 2024 border customs trade. A province with no land or river checkpoint scores 0, and that 0 counts as present, so it is not a missing input and it cannot lift another province by being blank. The mark is log(1 + the million-baht total), stretched from that 0 to the largest province, not a percentile, so a small checkpoint stays small. The 0 is not written into the customs file. Sa Kaeo and Trat keep the 2024 customs totals and are marked because, in December 2568, the Department of Foreign Trade recorded no border trade with Cambodia. Sangkhla Buri imports, inside the Kanchanaburi total, likely include pipeline gas. The Border SEZ flag is a yes or no beside the trade figure. Seaports and airports are not included.",
      th: "ข้อเสนอ ลำดับใช้การค้าผ่านด่านศุลกากรปี 2567 จังหวัดที่ไม่มีด่านบกหรือด่านน้ำได้ 0 และ 0 นั้นนับว่ามีตัวป้อน ดังนั้นมันไม่ใช่ตัวป้อนที่หายไป และช่องว่างจะยกจังหวัดอื่นขึ้นไม่ได้ คะแนนคือ log(1 + ยอดล้านบาท) ยืดจาก 0 นั้นไปถึงจังหวัดที่มากที่สุด ไม่ใช่เปอร์เซ็นไทล์ ดังนั้นด่านเล็กได้คะแนนเล็ก ไฟล์ศุลกากรไม่ได้เก็บ 0 นั้น สระแก้วและตราดคงยอดศุลกากรปี 2567 และถูกทำเครื่องหมาย เพราะเดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ นำเข้าที่สังขละบุรีในยอดกาญจนบุรี น่าจะรวมก๊าซทางท่อ ธงเขตเศรษฐกิจพิเศษชายแดนเป็นใช่หรือไม่คู่กับตัวเลขการค้า ไม่รวมท่าเรือและสนามบิน",
      zh: "这是提议。名次用 2024 年的边境海关贸易。没有陆路或河路关口的府记 0，这个 0 算作已有输入，所以它不是缺失的输入，空白也不能把别的府抬上去。分数是 log(1 + 百万铢总额)，从 0 拉到贸易额最大的府，不是百分位，所以小关口只得小分。海关文件里不写这个 0。沙缴和达叻保留 2024 年的海关合计，并被标出，因为佛历 2568 年 12 月外贸厅记录对柬埔寨的边境贸易为零。北碧合计里的桑卡拉武里进口很可能包括管道气。边境经济特区的标记是贸易数字旁边的是否。不含海港和机场。",
    },
    components: [borderTrade(80, true), sez(20)],
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
      en: "Proposed. Those figures are in the file, and so is the emergency-decree line. Parts of Yala, Pattani and Narathiwat are designated under extension 86, in force 20 October 2569 through 19 January 2570 (Cabinet, 6 October 2569). Raman is among Yala's exceptions, so those three are marked and moved down. That designation is not a crime count. Songkhla is not under the decree. Household internet is not a measured broadband speed, and the Treasury appraisal is not a rent. Coworking counts, market rents and provincial crime are not in the file.",
      th: "ข้อเสนอ ตัวเลขเหล่านั้นอยู่ในไฟล์ และมีบรรทัดประกาศสถานการณ์ฉุกเฉินด้วย ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศตามการขยายครั้งที่ 86 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 (มติคณะรัฐมนตรี 6 ตุลาคม 2569) และรามันอยู่ในอำเภอยกเว้นของยะลา ดังนั้นสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง การประกาศไม่ใช่จำนวนคดี สงขลาไม่อยู่ใต้ประกาศนี้ อินเทอร์เน็ตในครัวเรือนไม่ใช่ความเร็วบรอดแบนด์ที่วัดได้ และราคาประเมินของกรมธนารักษ์ไม่ใช่ค่าเช่า จำนวนโคเวิร์กกิง ค่าเช่าตลาด และอาชญากรรมรายจังหวัดยังไม่อยู่ในไฟล์",
      zh: "这是提议。那些数字在文件里，紧急状态这一行也在。也拉、北大年、那拉提瓦的部分地区被划入，按第 86 次延长，自佛历 2569 年 10 月 20 日起至 2570 年 1 月 19 日（内阁，2569 年 10 月 6 日）。拉曼列入也拉的除外县，所以这三个府被标出并下移。这项划定不是犯罪计数。宋卡不在这项宣布里。家庭互联网不是测得的宽带速率，国库厅评估价也不是租金。联合办公的数量、市场租金和分府犯罪还不在文件里。",
    },
    components: [internet(25), badAir(20, true), land(20, true), { ...newFirms, weight: 15 }, visitorsForeign(10), doctors(10, true), decree(40)],
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
      en: "Proposed. Receipts per person, foreign visitors, occupancy, forest cover, bad-air days and the emergency-decree line are in the order. Parts of Yala, Pattani and Narathiwat are designated under extension 86, in force 20 October 2569 through 19 January 2570 (Cabinet, 6 October 2569). Raman is among Yala's exceptions, so those three are marked and moved down. That is not a crime count. Songkhla is not under the decree. Seasonality and airport seats are not in the file. Forest cover is not a coastline. Sixteen provinces have no PM2.5 station and stay blank on that line. A blank does not lift them above a province that has every input.",
      th: "ข้อเสนอ รายได้ต่อคน ผู้มาเยือนชาวต่างชาติ อัตราเข้าพัก พื้นที่ป่า วันที่อากาศแย่ และบรรทัดประกาศสถานการณ์ฉุกเฉินอยู่ในลำดับ ยะลา ปัตตานี และนราธิวาสบางส่วนถูกประกาศตามการขยายครั้งที่ 86 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 (มติคณะรัฐมนตรี 6 ตุลาคม 2569) และรามันอยู่ในอำเภอยกเว้นของยะลา ดังนั้นสามจังหวัดนี้ถูกทำเครื่องหมายและถูกดันลง นั่นไม่ใช่จำนวนคดี สงขลาไม่อยู่ใต้ประกาศนี้ ฤดูกาลและที่นั่งบนเครื่องบินยังไม่อยู่ในไฟล์ พื้นที่ป่าไม่ใช่ชายฝั่ง สิบหกจังหวัดไม่มีสถานี PM2.5 และว่างในบรรทัดนั้น ช่องว่างไม่ได้ยกจังหวัดนั้นให้อยู่เหนือจังหวัดที่มีครบทุกตัวป้อน",
      zh: "这是提议。人均收入、外国游客、入住率、森林覆盖、超标天数和紧急状态这一行都进入名次。也拉、北大年、那拉提瓦的部分地区被划入，按第 86 次延长，自佛历 2569 年 10 月 20 日起至 2570 年 1 月 19 日（内阁，2569 年 10 月 6 日）。拉曼列入也拉的除外县，所以这三个府被标出并下移。这不是犯罪计数。宋卡不在这项宣布里。淡旺季和机场座位还不在文件里。森林覆盖不是海岸线。十六个府没有 PM2.5 站点，那一行保持空白。空白不会把这个府抬到一项输入都齐的府上面。",
    },
    components: [{ ...tourismPerPerson, weight: 25 }, visitorsForeign(25), occupancy, forest, badAir(15, true), decree(40)],
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
