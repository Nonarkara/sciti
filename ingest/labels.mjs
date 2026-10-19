// Trilingual method text for figures the cited file now fills.
// The row still carries its own source URL. This text is what the indicator page says.

function m(en, th, zh) {
  return { en, th, zh };
}

function u(en, th, zh) {
  return { en, th, zh };
}

export const LABELS = {
  "people.population": {
    status: "ok",
    unit: u("people", "คน", "人"),
    method: m(
      "Year-end registered population. The 2024 and 2025 counts in the cited file are the DOPA stat_c tables. Earlier years, when the file still has them, are counts whose reference page is the same office. The latest year is shown on the number.",
      "ประชากรตามทะเบียนสิ้นปี จำนวนปี 2024 และ 2025 ในไฟล์ที่อ้างคือตาราง stat_c ของกรมการปกครอง ปีที่เก่ากว่า ถ้ายังอยู่ในไฟล์ เป็นจำนวนที่หน้าอ้างอิงเป็นของหน่วยงานเดียวกัน ปีล่าสุดถูกแสดงคู่กับตัวเลข",
      "年末户籍人口。引用文件里的 2024 和 2025 年人数是府政厅 stat_c 表。更早的年份如果还在文件里，其参考页也是同一个机构。最新年份写在数字旁边。",
    ),
  },
  "economy.gpp": {
    status: "ok",
    unit: u("million baht", "ล้านบาท", "百万铢"),
    method: m(
      "Gross provincial product at current prices, million baht, 2021–2023, from the NSO yearbook (NESDC). 2024 is not in the file. Each row keeps the link it was read from.",
      "ผลิตภัณฑ์มวลรวมจังหวัดราคาประจำปี หน่วยล้านบาท ปี 2021–2023 จากหนังสือสถิติประจำปีของสำนักงานสถิติแห่งชาติ (สภาพัฒน์) ปี 2024 ยังไม่อยู่ในไฟล์ แต่ละแถวเก็บลิงก์ของไฟล์ที่อ่าน",
      "现价府生产总值，百万铢，2021–2023 年，来自国家统计局年鉴（国家经济和社会发展委员会）。2024 年不在文件里。每一行保留它读自的链接。",
    ),
  },
  "economy.gpp_per_capita": {
    status: "ok",
    direction: "higher",
    unit: u("baht per person", "บาทต่อคน", "铢/人"),
    method: m(
      "Gross provincial product per registered person, 2023. Places with many people off the house register come out high.",
      "ผลิตภัณฑ์มวลรวมจังหวัดต่อประชากรตามทะเบียน ปี 2023 จังหวัดที่มีคนนอกทะเบียนจำนวนมากจะได้ค่าที่สูง",
      "2023 年人均府生产总值。户籍外人口很多的地方，这个数字会偏高。",
    ),
  },
  "economy.gpp_real_growth": {
    status: "ok",
    direction: "higher",
    unit: u("%", "%", "%"),
    method: m(
      "One year of real gross provincial product growth, chain volume, 2023. It is not a multi-year rate. 2024 is not in the file.",
      "การเติบโตของผลิตภัณฑ์มวลรวมจังหวัดที่แท้จริงหนึ่งปี ตามปริมาณลูกโซ่ ปี 2023 ไม่ใช่อัตราหลายปี ปี 2024 ยังไม่อยู่ในไฟล์",
      "实际府生产总值的一年增长，链式物量，2023 年。不是多年速率。2024 年不在文件里。",
    ),
  },
  "economy.investment": {
    status: "ok",
    direction: "higher",
    unit: u("million baht", "ล้านบาท", "百万铢"),
    method: m(
      "BOI-approved investment. The file has 2024 and 2025. A zero that the BOI table publishes is a real zero. A province the table does not list is blank, not zero.",
      "มูลค่าการลงทุนที่บีโอไอให้การส่งเสริม ไฟล์มีปี 2024 และ 2025 ศูนย์ที่ตารางบีโอไอเผยแพร่คือศูนย์จริง จังหวัดที่ตารางไม่ได้ลงไว้จะว่าง ไม่ใช่ศูนย์",
      "BOI 批准的投资。文件里有 2024 和 2025 年。表上公布的零是真正的零。表上没有的府是空白，不是零。",
    ),
  },
  "economy.boi_projects": {
    status: "ok",
    unit: u("projects", "โครงการ", "个项目"),
    method: m(
      "Count of BOI-approved projects in 2025. A published zero is a real zero. A province the table omits is blank, not zero.",
      "จำนวนโครงการที่บีโอไอให้การส่งเสริมปี 2025 ศูนย์ที่เผยแพร่คือศูนย์จริง จังหวัดที่ตารางไม่ได้ลงจะว่าง ไม่ใช่ศูนย์",
      "2025 年 BOI 批准的项目数。公布的零是真正的零。表上没有的府是空白，不是零。",
    ),
  },
  "economy.boi_jobs": {
    status: "ok",
    unit: u("jobs", "ตำแหน่ง", "个岗位"),
    method: m(
      "Planned employment on BOI-approved projects in 2025, Thai and foreign jobs added together where the table gives both. A published zero is a real zero. A province the table omits is blank, not zero.",
      "การจ้างงานตามแผนของโครงการที่บีโอไอให้การส่งเสริมปี 2025 รวมคนไทยและคนต่างชาติเมื่อตารางให้ทั้งสองจำนวน ศูนย์ที่เผยแพร่คือศูนย์จริง จังหวัดที่ตารางไม่ได้ลงจะว่าง ไม่ใช่ศูนย์",
      "2025 年 BOI 批准项目的计划就业，表上同时给出泰国人和外国人时，两者相加。公布的零是真正的零。表上没有的府是空白，不是零。",
    ),
  },
  "economy.new_firms": {
    status: "ok",
    unit: u("firms", "ราย", "家"),
    method: m(
      "New juristic persons registered in 2025, from the Department of Business Development.",
      "นิติบุคคลตั้งใหม่ที่จดทะเบียนปี 2025 จากกรมพัฒนาธุรกิจการค้า",
      "2025 年新注册法人，来自商业发展厅。",
    ),
  },
  "economy.new_firms_per_10k": {
    status: "ok",
    unit: u("per 10,000 people", "ต่อคนหมื่นคน", "每万人"),
    method: m(
      "New juristic persons in 2025 per 10,000 registered people.",
      "นิติบุคคลตั้งใหม่ปี 2025 ต่อประชากรตามทะเบียนหมื่นคน",
      "2025 年新注册法人，每万名户籍人口。",
    ),
  },
  "economy.border_trade": {
    status: "ok",
    unit: u("million baht", "ล้านบาท", "百万铢"),
    method: m(
      "Exports plus imports in 2024 through land and river customs checkpoints. Twenty-five provinces have a figure. The rest are blank, not zero. Sangkhla Buri imports, inside Kanchanaburi, likely include pipeline gas. December 2568 border trade with Cambodia was zero at the Department of Foreign Trade.",
      "ส่งออกบวกนำเข้าปี 2024 ผ่านด่านศุลกากรทางบกและทางน้ำ ยี่สิบห้าจังหวัดมีตัวเลข ที่เหลือว่าง ไม่ใช่ศูนย์ นำเข้าที่สังขละบุรีในกาญจนบุรี น่าจะรวมก๊าซทางท่อ การค้าชายแดนกับกัมพูชาในธันวาคม 2568 เป็นศูนย์ที่กรมการค้าต่างประเทศ",
      "2024 年经陆路和河路海关的出口加进口。二十五个府有数字。其余是空白，不是零。北碧境内桑卡拉武里的进口很可能包括管道气。佛历 2568 年 12 月对柬埔寨的边境贸易，在外贸厅是零。",
    ),
  },
  "economy.sez": {
    status: "ok",
    unit: u("1 or 0", "1 หรือ 0", "1 或 0"),
    method: m(
      "1 if the province is one of the ten Border SEZs, otherwise 0. A flag does not order the map by itself.",
      "เป็น 1 ถ้าจังหวัดเป็นหนึ่งในสิบเขตเศรษฐกิจพิเศษชายแดน ไม่เช่นนั้นเป็น 0 ธงเพียงอย่างเดียวไม่จัดลำดับแผนที่",
      "属于十个边境经济特区则为 1，否则为 0。单独一个标记不会给地图排序。",
    ),
  },
  "economy.eec": {
    status: "ok",
    unit: u("1 or 0", "1 หรือ 0", "1 或 0"),
    method: m(
      "1 for Chachoengsao, Chon Buri and Rayong. 0 for every other province.",
      "เป็น 1 สำหรับฉะเชิงเทรา ชลบุรี และระยอง เป็น 0 สำหรับจังหวัดอื่น",
      "北柳、春武里、罗勇为 1。其余每个府为 0。",
    ),
  },
  "economy.tourism_receipts": {
    status: "ok",
    unit: u("million baht", "ล้านบาท", "百万铢"),
    method: m(
      "Tourism receipts in 2025, from the Ministry of Tourism and Sports. This is spending, not a visitor count, and it is not the foreign-only series.",
      "รายได้การท่องเที่ยวปี 2025 จากกระทรวงการท่องเที่ยวและกีฬา เป็นค่าใช้จ่าย ไม่ใช่จำนวนผู้มาเยือน และไม่ใช่ชุดเฉพาะชาวต่างชาติ",
      "2025 年旅游收入，来自旅游与体育部。这是花费，不是游客人数，也不是仅限外国游客的序列。",
    ),
  },
  "economy.tourism_receipts_foreign": {
    status: "ok",
    unit: u("million baht", "ล้านบาท", "百万铢"),
    method: m(
      "Tourism receipts from foreign visitors only, in 2025. This is not the Thai plus foreign total.",
      "รายได้การท่องเที่ยวจากผู้มาเยือนชาวต่างชาติเท่านั้น ปี 2025 ไม่ใช่ยอดไทยรวมต่างชาติ",
      "2025 年仅外国游客带来的旅游收入。这不是泰国游客加外国游客的合计。",
    ),
  },
  "economy.visitors": {
    status: "ok",
    unit: u("person-trips", "ครั้ง", "人次"),
    method: m(
      "Thai and foreign visitor person-trips in 2025, overnight and same-day, added together. A trip is not a resident, and this is not the foreign-only series.",
      "จำนวนครั้งการเดินทางของผู้มาเยือนชาวไทยและชาวต่างชาติปี 2025 ทั้งค้างคืนและไปเช้าเย็นกลับ รวมกัน หนึ่งครั้งไม่ใช่หนึ่งผู้อยู่อาศัย และนี่ไม่ใช่ชุดเฉพาะชาวต่างชาติ",
      "2025 年泰国和外国游客的人次，过夜和当日往返加在一起。一次行程不是一名居民，这也不是仅限外国游客的序列。",
    ),
  },
  "economy.visitors_foreign": {
    status: "ok",
    unit: u("person-trips", "ครั้ง", "人次"),
    method: m(
      "Foreign visitor person-trips only, in 2025. This is not the Thai plus foreign total, and a trip is not a resident.",
      "จำนวนครั้งการเดินทางของผู้มาเยือนชาวต่างชาติเท่านั้น ปี 2025 ไม่ใช่ยอดไทยรวมต่างชาติ และหนึ่งครั้งไม่ใช่หนึ่งผู้อยู่อาศัย",
      "2025 年仅外国游客的人次。这不是泰国游客加外国游客的合计，一次行程也不是一名居民。",
    ),
  },
  "economy.unemployment": {
    status: "ok",
    direction: "lower",
    unit: u("%", "%", "%"),
    method: m(
      "Unemployment rate, mean of the four quarters of 2025. Lower is better. It is not a wage.",
      "อัตราว่างงาน ค่าเฉลี่ยสี่ไตรมาสของปี 2025 ค่าน้อยกว่าดีกว่า นี่ไม่ใช่ค่าจ้าง",
      "失业率，2025 年四个季度的平均。越低越好。这不是工资。",
    ),
  },
  "economy.minimum_wage": {
    status: "ok",
    direction: "lower",
    unit: u("baht per day", "บาทต่อวัน", "铢/天"),
    method: m(
      "Statutory daily minimum wage as of January 2568. Later changes that year are not in the file. It is not an average wage.",
      "ค่าจ้างขั้นต่ำรายวันตามกฎหมาย ณ มกราคม 2568 การปรับหลังจากนี้ในปีนั้นยังไม่อยู่ในไฟล์ นี่ไม่ใช่ค่าจ้างเฉลี่ย",
      "截至佛历 2568 年 1 月的法定日最低工资。那一年后来的调整不在文件里。这不是平均工资。",
    ),
  },
  "economy.gini": {
    status: "ok",
    direction: "lower",
    unit: u("index", "ดัชนี", "指数"),
    method: m(
      "Gini coefficient for 2566, from the NSO. Lower means a more equal income distribution. It is not used to rank a lens.",
      "สัมประสิทธิ์จีนีปี 2566 จากสำนักงานสถิติแห่งชาติ ค่าน้อยกว่าหมายถึงการกระจายรายได้ที่เท่ากันกว่า ไม่ได้ใช้จัดลำดับเลนส์",
      "佛历 2566 年的基尼系数，来自国家统计局。越低表示收入分配越均等。不用于给镜头排名。",
    ),
  },
  "economy.inflation": {
    status: "ok",
    direction: "lower",
    unit: u("%", "%", "%"),
    method: m(
      "Provincial inflation, 2024. Bangkok is published together with its vicinity, so Bangkok itself is blank.",
      "เงินเฟ้อรายจังหวัดปี 2024 กรุงเทพฯ ถูกเผยแพร่รวมกับปริมณฑล ดังนั้นกรุงเทพฯ เองจึงว่าง",
      "2024 年分府通胀。曼谷是和周边一起公布的，所以曼谷本身是空白。",
    ),
  },
  "energy.electricity": {
    status: "ok",
    direction: "higher",
    unit: u("GWh", "กิกะวัตต์ชั่วโมง", "吉瓦时"),
    method: m(
      "Electricity use by province in 2023, from the Ministry of Energy. It is all tariffs, not factories alone. No later provincial year is in the file.",
      "การใช้ไฟฟ้ารายจังหวัดปี 2023 จากกระทรวงพลังงาน เป็นทุกอัตราค่าไฟ ไม่ใช่เฉพาะโรงงาน ไม่มีปีหลังกว่านั้นรายจังหวัดในไฟล์",
      "2023 年分府用电量，来自能源部。是全部电价类别，不是只有工厂。文件里没有更晚的分府年份。",
    ),
  },
  "energy.ev_charging": {
    status: "ok",
    unit: u("kWh", "กิโลวัตต์ชั่วโมง", "千瓦时"),
    method: m(
      "Electricity sold for EV charging in 2023. It is not a count of chargers.",
      "ไฟฟ้าที่ขายเพื่อชาร์จรถไฟฟ้าปี 2023 ไม่ใช่จำนวนเครื่องชาร์จ",
      "2023 年售出的电动车充电用电。不是充电桩的数量。",
    ),
  },
  "env.pm25_bad_days": {
    status: "ok",
    direction: "lower",
    unit: u("days", "วัน", "天"),
    method: m(
      "Days in 2025 when PM2.5 was over the Thai 24-hour standard, at the median station. Sixteen provinces have no station and are blank. Lower is better.",
      "จำนวนวันในปี 2025 ที่ PM2.5 เกินมาตรฐาน 24 ชั่วโมงของไทย ที่สถานีมัธยฐาน สิบหกจังหวัดไม่มีสถานีและว่างไว้ ค่าน้อยกว่าดีกว่า",
      "2025 年 PM2.5 超过泰国 24 小时标准的天数，取站点中位数。十六个府没有站点，留空。越低越好。",
    ),
  },
  "env.pm25_bad_days_worst": {
    status: "ok",
    direction: "lower",
    unit: u("days", "วัน", "天"),
    method: m(
      "The same year, counted at the worst station in the province. It is shown beside the median and it is not the figure the quiet lens ranks on.",
      "ปีเดียวกัน นับที่สถานีที่แย่ที่สุดในจังหวัด แสดงคู่กับมัธยฐาน และไม่ใช่ตัวเลขที่เลนส์เกษียณใช้จัดลำดับ",
      "同一年，按府内最差站点计数。它跟中位数一起显示，安静退休镜头不用它排名。",
    ),
  },
  "env.pm25_annual": {
    status: "ok",
    direction: "lower",
    unit: u("µg/m³", "มคก./ลบ.ม.", "微克/立方米"),
    method: m(
      "Annual mean PM2.5 in 2025. Provinces with no station are blank.",
      "ค่าเฉลี่ย PM2.5 ทั้งปี 2025 จังหวัดที่ไม่มีสถานีจะว่าง",
      "2025 年 PM2.5 年均值。没有站点的府留空。",
    ),
  },
  "env.forest_cover": {
    status: "ok",
    unit: u("% of area", "% ของพื้นที่", "占面积的百分比"),
    method: m(
      "Forest area as a share of the province in 2024. It is not urban green space.",
      "พื้นที่ป่าเป็นสัดส่วนของจังหวัดปี 2024 ไม่ใช่พื้นที่สีเขียวในเมือง",
      "2024 年森林占府面积的比例。不是城市绿地。",
    ),
  },
  "env.waste_per_person": {
    status: "ok",
    direction: "lower",
    unit: u("kg per person per day", "กก.ต่อคนต่อวัน", "千克/人/天"),
    method: m(
      "Municipal waste per person per day, 2024. Lower is better. It is not in a lens.",
      "ขยะมูลฝอยต่อคนต่อวัน ปี 2024 ค่าน้อยกว่าดีกว่า ไม่ได้อยู่ในเลนส์",
      "2024 年人均每日生活垃圾。越低越好。不在任何一个镜头里。",
    ),
  },
  "living.doctors": {
    status: "ok",
    unit: u("physicians", "คน", "人"),
    method: m(
      "Physicians by province. The sheet does not say whether private-hospital doctors are included. This is not a bed count.",
      "แพทย์รายจังหวัด ตารางไม่ได้บอกว่านับแพทย์โรงพยาบาลเอกชนหรือไม่ นี่ไม่ใช่จำนวนเตียง",
      "分府医生数。表上没有写是否包括私立医院的医生。这不是床位数。",
    ),
  },
  "living.doctors_per_10k": {
    status: "ok",
    unit: u("per 10,000 people", "ต่อคนหมื่นคน", "每万人"),
    method: m(
      "Physicians in 2024 per 10,000 registered people. Private-hospital doctors may be excluded.",
      "แพทย์ปี 2024 ต่อประชากรตามทะเบียนหมื่นคน แพทย์โรงพยาบาลเอกชนอาจไม่ถูกนับ",
      "2024 年医生数，每万名户籍人口。私立医院的医生可能没有计入。",
    ),
  },
  "living.land_price": {
    status: "ok",
    direction: "lower",
    unit: u("baht per square wah", "บาทต่อตารางวา", "铢/平方哇"),
    method: m(
      "Median official land appraisal, Treasury Department. It is not a market sale and it is not a rent. Lower is treated as more affordable when a lens uses it.",
      "มัธยฐานราคาประเมินที่ดินราชการ กรมธนารักษ์ ไม่ใช่ราคาซื้อขายในตลาด และไม่ใช่ค่าเช่า เมื่อเลนส์ใช้ ค่าน้อยกว่าถูกอ่านว่าจ่ายได้ง่ายกว่า",
      "官方土地评估价的中位数，国库厅。不是市场成交价，也不是租金。镜头使用时，数值更低被当作更付得起。",
    ),
  },
  "living.hotel_occupancy": {
    status: "ok",
    unit: u("%", "%", "%"),
    method: m(
      "Hotel occupancy in 2025, a rate for the year. It is not a sum of Thai and foreign visitors, and it is not a month-by-month season.",
      "อัตราเข้าพักโรงแรมปี 2025 เป็นอัตราทั้งปี ไม่ใช่ผลรวมผู้มาเยือนชาวไทยกับชาวต่างชาติ และไม่ใช่ฤดูกาลรายเดือน",
      "2025 年酒店入住率，是全年的比率。不是泰国游客和外国游客的合计，也不是逐月的淡旺季。",
    ),
  },
  "mobility.road_deaths": {
    status: "ok",
    direction: "lower",
    unit: u("per 100,000 people", "ต่อแสนคน", "每十万人"),
    method: m(
      "Road traffic deaths per 100,000 registered people. The file has 2024 and 2025. Lower is better. It is not a crime series.",
      "ผู้เสียชีวิตจากอุบัติเหตุทางถนนต่อประชากรตามทะเบียนแสนคน ไฟล์มีปี 2024 และ 2025 ค่าน้อยกว่าดีกว่า ไม่ใช่ชุดอาชญากรรม",
      "道路交通事故死亡，每十万名户籍人口。文件里有 2024 和 2025 年。越低越好。不是犯罪序列。",
    ),
  },
  "people.tertiary": {
    status: "ok",
    unit: u("students", "คน", "人"),
    method: m(
      "Current tertiary students, academic year 2568, first semester. Three provinces have no campus in the file and are blank. Enrolment is not graduates.",
      "นักศึกษาปัจจุบัน ปีการศึกษา 2568 ภาคต้น สามจังหวัดไม่มีวิทยาเขตในไฟล์และว่าง การลงทะเบียนไม่ใช่ผู้สำเร็จการศึกษา",
      "佛历 2568 学年第一学期的高等教育在校生。三个府在文件里没有校区，留空。在校不是毕业。",
    ),
  },
  "people.tertiary_per_1000": {
    status: "ok",
    unit: u("per 1,000 people", "ต่อคนพันคน", "每千人"),
    method: m(
      "Those students per 1,000 registered people. The same three provinces are blank.",
      "นักศึกษานั้นต่อประชากรตามทะเบียนพันคน สามจังหวัดเดียวกันว่าง",
      "这些在校生，每千名户籍人口。同样的三个府留空。",
    ),
  },
  "people.internet_households": {
    status: "ok",
    unit: u("% of households", "% ของครัวเรือน", "占家庭的百分比"),
    method: m(
      "Share of households with internet, 2569 second quarter. It is not a broadband speed.",
      "สัดส่วนครัวเรือนที่มีอินเทอร์เน็ต ไตรมาส 2 ปี 2569 ไม่ใช่ความเร็วบรอดแบนด์",
      "有互联网的家庭占比，佛历 2569 年第二季度。不是宽带速率。",
    ),
  },
  "people.labour_force": {
    status: "ok",
    unit: u("thousand people", "พันคน", "千人"),
    method: m(
      "Labour force in 2025, mean of the four quarters.",
      "กำลังแรงงานปี 2025 ค่าเฉลี่ยสี่ไตรมาส",
      "2025 年劳动力，四个季度的平均。",
    ),
  },
  "people.unregistered_share": {
    status: "ok",
    unit: u("% of registered population", "% ของประชากรตามทะเบียน", "占户籍人口的百分比"),
    method: m(
      "Unregistered residents relative to the house register, 2025. It is context. It is not a lens score. Night-time latent population is summed only when every sex and municipal cell is a number. An n.a. cell makes the share missing, including for Bangkok and Si Sa Ket. It is not stored as zero. Where the share is high, per-person figures come out high.",
      "ผู้ไม่ได้อยู่ในทะเบียนเทียบกับทะเบียนบ้าน ปี 2025 เป็นบริบท ไม่ใช่คะแนนเลนส์ ประชากรแฝงกลางคืนจะถูกรวมก็ต่อเมื่อทุกช่องเพศและเขตเทศบาลเป็นตัวเลข ช่อง n.a. ทำให้สัดส่วนหายไป รวมกรุงเทพฯ และศรีสะเกษ ไม่ได้ถูกเก็บเป็นศูนย์ ที่ซึ่งสัดส่วนสูง ตัวเลขต่อคนจะออกมาสูง",
      "2025 年未登记居民相对户籍的比例。这是背景，不是镜头分数。夜间隐性人口只有在每个性别和市镇单元格都是数字时才加总。任何一个 n.a. 单元格都会让这个比例缺失，包括曼谷和四色菊。不会被存成零。这个比例高的地方，人均数字会偏高。",
    ),
  },
  "governance.digital_trainees_per_1000": {
    status: "ok",
    unit: u("per 1,000 people", "ต่อคนพันคน", "每千人"),
    method: m(
      "People recorded in a digital-skills course in 2025, per 1,000 registered people. A course count is not governance quality.",
      "ผู้ที่ถูกบันทึกในหลักสูตรทักษะดิจิทัลปี 2025 ต่อประชากรตามทะเบียนพันคน จำนวนหลักสูตรไม่ใช่คุณภาพการปกครอง",
      "2025 年有数字技能课程记录的人，每千名户籍人口。课程人数不是治理质量。",
    ),
  },
  "governance.smart_city_areas": {
    status: "ok",
    unit: u("areas", "แห่ง", "处"),
    method: m(
      "Count of depa smart-city areas named for the province. The 2568 announcement renews 16 labels and adds Phuket Tinicon Valley. Other earlier labels are renewal not found, which is not the same as expired. The count is not a quality score.",
      "จำนวนพื้นที่เมืองอัจฉริยะของดีป้าที่ระบุในจังหวัด ประกาศปี 2568 ต่ออายุ 16 ป้าย และเพิ่มภูเก็ตทินิคอนวัลเลย์ ป้ายเก่าอื่นที่ไม่อยู่ในประกาศนั้นคือยังไม่พบการต่ออายุ ซึ่งไม่เหมือนกับหมดอายุ จำนวนนี้ไม่ใช่คะแนนคุณภาพ",
      "该府被点名的 depa 智慧城市片区个数。佛历 2568 年的公告续了 16 块牌子，并新增普吉 Tinicon Valley。更早的其余牌子是没有找到续期，这不等于过期。这个个数不是质量分。",
    ),
  },
};

export function applyLabels(indicators) {
  for (const indicator of indicators) {
    const label = LABELS[indicator.id];
    if (!label) continue;
    if (label.method) indicator.method = label.method;
    if (label.unit) indicator.unit = label.unit;
    if (label.direction) indicator.direction = label.direction;
    if (label.status) indicator.status = label.status;
    if (label.name) indicator.name = label.name;
  }
  return indicators;
}
