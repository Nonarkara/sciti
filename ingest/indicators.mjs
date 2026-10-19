// Indicator definitions. Observations are filled by the source modules.
// Unavailable indicators stay in this list so the coverage map can show the gap.

export const INDICATORS = [
  {
    id: "env.pm25",
    area: "environment",
    status: "ok",
    unit: { en: "µg/m³", th: "มคก./ลบ.ม.", zh: "微克/立方米" },
    name: {
      en: "PM2.5, this hour",
      th: "PM2.5 ชั่วโมงนี้",
      zh: "本小时 PM2.5",
    },
    sourceName: {
      en: "Pollution Control Department, Air4Thai",
      th: "กรมควบคุมมลพิษ Air4Thai",
      zh: "污染控制局 Air4Thai",
    },
    sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
    method: {
      en: "For each province, take the Air4Thai stations whose coordinates fall inside the province boundary and use the median PM2.5 of stations that reported a value of zero or higher. A reading of −1 is treated as no reading. The time on the figure is the earliest station stamp in that province for this pull. Provinces with no reporting station are left empty. This is one hour, not a year.",
      th: "ในแต่ละจังหวัด ใช้สถานี Air4Thai ที่พิกัดตกในขอบเขตจังหวัด แล้วหาค่ามัธยฐานของ PM2.5 จากสถานีที่รายงานค่าตั้งแต่ศูนย์ขึ้นไป ค่า −1 ถือว่าไม่มีค่า เวลาที่กำกับคือเวลาที่เร็วที่สุดของสถานีในจังหวัดนั้นในการดึงครั้งนี้ จังหวัดที่ไม่มีสถานีรายงาน จะว่างไว้ นี่คือหนึ่งชั่วโมง ไม่ใช่ค่าทั้งปี",
      zh: "每个府取落在府界内、且 PM2.5 读数大于或等于零的 Air4Thai 站点，用它们的中位数。读数为 −1 视为没有读数。时间取该府在这一次抓取里最早的站点时间。没有站点的府留空。这是一个小时，不是全年。",
    },
  },
  {
    id: "env.aqi",
    area: "environment",
    status: "ok",
    unit: { en: "AQI", th: "AQI", zh: "AQI" },
    name: { en: "Air quality index, this hour", th: "ดัชนีคุณภาพอากาศชั่วโมงนี้", zh: "本小时空气质量指数" },
    sourceName: {
      en: "Pollution Control Department, Air4Thai",
      th: "กรมควบคุมมลพิษ Air4Thai",
      zh: "污染控制局 Air4Thai",
    },
    sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
    method: {
      en: "Same stations and same hour as PM2.5. The figure is the median of the station AQI values that are zero or higher. It is the department’s index for that hour, not a yearly grade.",
      th: "ใช้สถานีและชั่วโมงเดียวกับ PM2.5 ค่าคือมัธยฐานของ AQI ที่รายงานตั้งแต่ศูนย์ขึ้นไป เป็นดัชนีของกรมในชั่วโมงนั้น ไม่ใช่เกรดทั้งปี",
      zh: "与 PM2.5 同一批站点、同一个小时。数值是大于或等于零的站点 AQI 的中位数。这是该小时的指数，不是全年评分。",
    },
  },
  {
    id: "economy.gpp",
    area: "economy",
    status: "ok",
    unit: { en: "million baht", th: "ล้านบาท", zh: "百万铢" },
    name: { en: "Gross provincial product", th: "ผลิตภัณฑ์มวลรวมจังหวัด", zh: "府生产总值" },
    sourceName: {
      en: "Provincial open-data catalogs, gross provincial product files",
      th: "บัญชีข้อมูลเปิดของจังหวัด ไฟล์ผลิตภัณฑ์มวลรวมจังหวัด",
      zh: "各府开放数据目录中的府生产总值文件",
    },
    sourceUrl: "https://gdcatalog.go.th/",
    method: {
      en: "The job searches GD Catalog for gross provincial product and reads at most 40 CSV files. A row is kept only when it is a value in million baht, not a growth rate, a share, a per-person figure, or an agriculture-only series. Buddhist years are shown as the matching Common Era year. If the same province and year appear twice with different numbers, that year is dropped. Provinces that have not published a file we can read stay empty. Each figure links to the file it came from.",
      th: "งานนี้ค้นบัญชีข้อมูลเปิดภาครัฐเรื่องผลิตภัณฑ์มวลรวมจังหวัด และอ่านไฟล์ CSV ไม่เกิน 40 ไฟล์ จะเก็บแถวที่เป็นมูลค่าล้านบาทเท่านั้น ไม่เก็บอัตราการเติบโต สัดส่วน ค่าต่อคน หรือเฉพาะภาคเกษตร ปีพุทธศักราชถูกแสดงเป็นคริสต์ศักราช ถ้าจังหวัดและปีเดียวกันมีคนละตัวเลข จะทิ้งปีนั้น จังหวัดที่ยังไม่มีไฟล์ที่อ่านได้ จะว่างไว้ แต่ละตัวเลขลิงก์ไปยังไฟล์ต้นทาง",
      zh: "程序在政府数据目录里检索府生产总值，最多读取 40 个 CSV。只保留“百万铢产值”的行，不保留增长率、占比、人均或仅农业的序列。佛历年份改记为对应的公元年。同一府同一年若出现两个不同数字，这一年就舍弃。读不到文件的府留空。每个数字都链回它的文件。",
    },
  },
  {
    id: "mobility.vehicles",
    area: "mobility",
    status: "ok",
    unit: { en: "vehicles", th: "คัน", zh: "辆" },
    name: { en: "Registered vehicles", th: "รถจดทะเบียนสะสม", zh: "累计注册车辆" },
    sourceName: {
      en: "Department of Land Transport",
      th: "กรมการขนส่งทางบก",
      zh: "陆路运输局",
    },
    sourceUrl: "https://gdcatalog.dlt.go.th/",
    method: {
      en: "Sum of cumulative registered vehicles in the Department of Land Transport open file, under the automobile law only (the file’s first column is รถยนต์). Counts are added across vehicle classes and fuel types. Rows with a blank fuel, or with the word รวม, are not added, so a subtotal is not counted twice. The date is taken from the file name. This is a stock of registrations, not traffic and not a count of trips.",
      th: "ผลรวมรถจดทะเบียนสะสมจากไฟล์เปิดของกรมการขนส่งทางบก เฉพาะตามกฎหมายรถยนต์ (คอลัมน์แรกเป็น รถยนต์) รวมทุกประเภทรถและทุกชนิดเชื้อเพลิง แถวที่เชื้อเพลิงว่าง หรือมีคำว่า รวม จะไม่ถูกบวก เพื่อไม่ให้นับซ้ำกับยอดรวม วันที่มาจากชื่อไฟล์ นี่คือจำนวนรถที่จดทะเบียนสะสม ไม่ใช่ปริมาณจราจร",
      zh: "陆路运输局公开文件里的累计注册车辆，只加总“汽车法”部分（第一列为 รถยนต์）。车类和燃料类型相加。燃料为空或含有“รวม”的行不加，避免把小计再加一次。日期取自文件名。这是注册存量，不是交通量，也不是出行次数。",
    },
  },
  {
    id: "energy.electricity",
    area: "energy",
    status: "unavailable",
    unit: { en: "GWh", th: "กิกะวัตต์ชั่วโมง", zh: "吉瓦时" },
    name: { en: "Electricity use", th: "การใช้ไฟฟ้า", zh: "用电量" },
    sourceName: {
      en: "Energy Policy and Planning Office",
      th: "สำนักงานนโยบายและแผนพลังงาน",
      zh: "能源政策与规划办公室",
    },
    sourceUrl: "https://www.eppo.go.th/data-energy-statistic/energy-statistic/electric-energy-stat/%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2-2/",
    method: {
      en: "EPPO publishes electricity tables by sector and by utility area, including the Metropolitan Electricity Authority. Those tables are not a figure for each province. A utility area is not a province, so the numbers are not copied onto the map. Until a provincial table is published in a file this job can read, electricity stays missing.",
      th: "สนพ. เผยแพร่ตารางไฟฟ้าแยกตามสาขาและตามเขตการไฟฟ้า รวมเขตการไฟฟ้านครหลวง ตารางนั้นไม่ใช่ตัวเลขรายจังหวัด เขตการไฟฟ้าไม่เท่ากับจังหวัด จึงไม่นำมาวางบนแผนที่ จนกว่าจะมีตารางรายจังหวัดที่งานนี้อ่านได้ การใช้ไฟฟ้าจะว่างไว้",
      zh: "能源政策与规划办公室公布的是按部门和供电区划分的电量表，其中包括曼谷都市电力局。供电区不是府，所以这些数字没有被画到地图上。在出现本程序能读取的分府表之前，用电量保持空缺。",
    },
  },
  {
    id: "people.population",
    area: "people",
    status: "ok",
    unit: { en: "people", th: "คน", zh: "人" },
    name: { en: "Registered population", th: "ประชากรตามทะเบียน", zh: "户籍人口" },
    sourceName: {
      en: "Department of Provincial Administration",
      th: "กรมการปกครอง",
      zh: "内政部府政厅",
    },
    sourceUrl: "https://stat.bora.dopa.go.th/new_stat/webPage/statByYear.php",
    method: {
      en: "Year-end civil-registration counts. The statistics host does not hand this job a single national file, so the ingest reads the Wikidata statements whose reference URL points at stat.bora.dopa.go.th or stat.dopa.go.th, for 2014 onward. The number on the page is that cited count, and the link goes to the DOPA page named in the reference, not to Wikidata. If the same province and year are cited with two different counts, that year is dropped. The latest year is not the same for every province, so the year is always shown.",
      th: "จำนวนประชากรตามทะเบียนราษฎร์สิ้นปี เว็บสถิติของกรมการปกครองไม่ได้ให้ไฟล์เดียวทั้งประเทศกับงานนี้ งานจึงอ่านข้อความบนวิกิสนเทศที่ URL อ้างอิงชี้ไปที่ stat.bora.dopa.go.th หรือ stat.dopa.go.th ตั้งแต่ปี 2014 ตัวเลขบนหน้านี้คือจำนวนที่อ้างนั้น และลิงก์ไปที่หน้าของกรมการปกครองตามที่อ้าง ไม่ได้ลิงก์ไปที่วิกิสนเทศ ถ้าจังหวัดและปีเดียวกันถูกอ้างด้วยคนละจำนวน จะทิ้งปีนั้น ปีล่าสุดไม่เหมือนกันทุกจังหวัด จึงแสดงปีไว้เสมอ",
      zh: "年末户籍人口。民政统计网站没有给这个程序一份全国文件，所以程序读取维基数据里参考链接指向 stat.bora.dopa.go.th 或 stat.dopa.go.th、且年份在 2014 年及以后的陈述。页面上的数字是那条引用里的人数，链接打开的是府政厅页面，不是维基数据。同一府同一年若有两个不同人数，这一年就舍弃。各府最新年份并不相同，所以年份始终写在数字旁边。",
    },
  },
  {
    id: "living.beds",
    area: "living",
    status: "unavailable",
    unit: { en: "beds", th: "เตียง", zh: "张" },
    name: { en: "Hospital beds", th: "เตียงผู้ป่วย", zh: "医院床位" },
    sourceName: {
      en: "National Statistical Office",
      th: "สำนักงานสถิติแห่งชาติ",
      zh: "国家统计局",
    },
    sourceUrl: "https://catalogapi.nso.go.th/api/index?table=PHS_26_01&format=csv",
    method: {
      en: "NSO table PHS_26_01 counts beds in private hospitals by region and for the whole country. It has no province column. A regional total is not split across provinces. Bed counts stay missing until a provincial table is the one being read.",
      th: "ตาราง สสช. PHS_26_01 นับเตียงโรงพยาบาลเอกชนเป็นรายภาคและทั้งประเทศ ไม่มีคอลัมน์จังหวัด ยอดภาคจึงไม่ถูกแบ่งใส่จังหวัด จำนวนเตียงจะว่างไว้จนกว่าตารางที่อ่านจะเป็นรายจังหวัด",
      zh: "国家统计局表 PHS_26_01 按区域和全国统计私立医院床位，没有府这一列。区域总数不会被拆进各个府。在读到分府表之前，床位保持空缺。",
    },
  },
  {
    id: "governance.datasets",
    area: "governance",
    status: "ok",
    unit: { en: "datasets", th: "ชุดข้อมูล", zh: "个数据集" },
    name: { en: "Open datasets in the catalog", th: "ชุดข้อมูลในบัญชีข้อมูลเปิด", zh: "开放数据目录中的数据集" },
    sourceName: {
      en: "Government Data Catalog",
      th: "บัญชีข้อมูลภาครัฐ",
      zh: "政府数据目录",
    },
    sourceUrl: "https://gdcatalog.go.th/",
    method: {
      en: "The number of datasets listed on GD Catalog under the organization named จังหวัด plus the province, or กรุงเทพมหานคร for Bangkok. It is a count of what that office has put in this catalog. It is not a score for how well the city is governed, and data.go.th itself blocked this job, so that portal is not included.",
      th: "จำนวนชุดข้อมูลในบัญชีข้อมูลภาครัฐ ภายใต้องค์กรที่ชื่อขึ้นต้นด้วย จังหวัดตามด้วยชื่อจังหวัด หรือ กรุงเทพมหานคร สำหรับกรุงเทพฯ เป็นจำนวนที่สำนักงานนั้นใส่ไว้ในบัญชีนี้ ไม่ใช่คะแนนว่าเมืองปกครองดีแค่ไหน data.go.th ปฏิเสธงานนี้ จึงไม่ได้นับพอร์ทัลนั้น",
      zh: "政府数据目录里，组织名称为“จังหวัด”加府名、曼谷则为“กรุงเทพมหานคร”的数据集个数。它只说明这个机构在该目录里放了多少，不是治理评分。data.go.th 拒绝了这次抓取，所以那个门户没有算进来。",
    },
  },
];

const awaitingMethod = {
  en: "No provincial file has been read for this figure. A row in data/incoming with this indicator id will fill it. Nothing is estimated, and a blank is not stored as zero.",
  th: "ยังไม่ได้อ่านไฟล์รายจังหวัดสำหรับตัวเลขนี้ แถวใน data/incoming ที่ใช้รหัสนี้จะเติมให้ ไม่มีการประมาณ และช่องว่างจะไม่ถูกเก็บเป็นศูนย์",
  zh: "这个数字还没有读到分府文件。data/incoming 里用这个编号的一行会把它补上。不做估计，空着也不会存成零。",
};

function awaiting(id, area, name, unit) {
  return {
    id,
    area,
    status: "awaiting",
    direction: "higher",
    licence: "not stated",
    unit,
    name,
    sourceName: {
      en: "Not in the file yet",
      th: "ยังไม่อยู่ในไฟล์",
      zh: "尚未入库",
    },
    sourceUrl: "https://github.com/Nonarkara/sciti/blob/main/data/SCHEMA.md",
    method: awaitingMethod,
  };
}

const AWAITING = [
  awaiting("market.price", "living", { en: "Market property price", th: "ราคาทรัพย์สินในตลาด", zh: "市场房产价格" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
  awaiting("market.reputation", "economy", { en: "Reputation", th: "ชื่อเสียง", zh: "名声" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
  awaiting("people.schools", "people", { en: "Schools", th: "โรงเรียน", zh: "学校" }, { en: "schools", th: "แห่ง", zh: "所" }),
  awaiting("mobility.broadband", "mobility", { en: "Broadband speed", th: "ความเร็วบรอดแบนด์", zh: "宽带速率" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
  awaiting("living.density", "living", { en: "Population density", th: "ความหนาแน่นประชากร", zh: "人口密度" }, { en: "people per km²", th: "คนต่อตร.กม.", zh: "人/平方公里" }),
  awaiting("governance.crime", "governance", { en: "Provincial crime", th: "อาชญากรรมรายจังหวัด", zh: "分府犯罪" }, { en: "cases", th: "คดี", zh: "起" }),
  awaiting("economy.permits", "economy", { en: "Construction permits", th: "ใบอนุญาตก่อสร้าง", zh: "施工许可" }, { en: "permits", th: "ใบ", zh: "份" }),
  awaiting("economy.wages", "economy", { en: "Average wage", th: "ค่าจ้างเฉลี่ย", zh: "平均工资" }, { en: "baht", th: "บาท", zh: "铢" }),
  awaiting("people.graduates", "people", { en: "Graduates", th: "ผู้สำเร็จการศึกษา", zh: "毕业生" }, { en: "people", th: "คน", zh: "人" }),
  awaiting("economy.gpp_2024", "economy", { en: "Gross provincial product, 2024", th: "ผลิตภัณฑ์มวลรวมจังหวัด ปี 2024", zh: "2024 年府生产总值" }, { en: "million baht", th: "ล้านบาท", zh: "百万铢" }),
  awaiting("env.green_space", "environment", { en: "Urban green space", th: "พื้นที่สีเขียวในเมือง", zh: "城市绿地" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
  awaiting("mobility.transit", "mobility", { en: "Transit use", th: "การใช้ขนส่งสาธารณะ", zh: "公共交通使用" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
  awaiting("governance.quality", "governance", { en: "Governance quality", th: "คุณภาพการปกครอง", zh: "治理质量" }, { en: "as published", th: "ตามที่เผยแพร่", zh: "按公布单位" }),
];

for (const extra of AWAITING) INDICATORS.push(extra);
const priceIndicator = INDICATORS.find((item) => item.id === "market.price");
if (priceIndicator) {
  priceIndicator.direction = "lower";
  priceIndicator.method = {
    en: "Not in the file. The Treasury appraisal is a separate series, living.land_price. A market sale price is not estimated from it.",
    th: "ยังไม่อยู่ในไฟล์ ราคาประเมินของกรมธนารักษ์เป็นชุดอื่น ชื่อ living.land_price ไม่ได้ประมาณราคาซื้อขายจากราคาประเมิน",
    zh: "还不在文件里。国库厅评估价是另一条序列，编号 living.land_price。不会用它去估计市场成交价。",
  };
}
for (const id of ["governance.crime", "living.density", "economy.wages"]) {
  const item = INDICATORS.find((indicator) => indicator.id === id);
  if (item) item.direction = "lower";
}

export const AREAS = [
  { id: "environment", en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" },
  { id: "economy", en: "Economy", th: "เศรษฐกิจ", zh: "经济" },
  { id: "mobility", en: "Mobility", th: "การเดินทาง", zh: "交通" },
  { id: "energy", en: "Energy", th: "พลังงาน", zh: "能源" },
  { id: "people", en: "People", th: "คน", zh: "人" },
  { id: "living", en: "Living", th: "การอยู่อาศัย", zh: "生活" },
  { id: "governance", en: "Governance", th: "ธรรมาภิบาล", zh: "治理" },
];
