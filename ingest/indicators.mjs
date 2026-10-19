// Indicator definitions. Observations are filled by the source modules.
// Unavailable indicators stay in this list so the coverage map can show the gap.

export const INDICATORS = [
  {
    id: "env.pm25",
    area: "environment",
    status: "ok",
    unit: { en: "µg/m³", th: "มคก./ลบ.ม.", zh: "微克/立方米" },
    name: {
      en: "PM2.5",
      th: "PM2.5",
      zh: "PM2.5",
    },
    sourceName: {
      en: "Pollution Control Department, Air4Thai",
      th: "กรมควบคุมมลพิษ Air4Thai",
      zh: "污染控制局 Air4Thai",
    },
    sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
    method: {
      en: "For each province, take the Air4Thai stations whose coordinates fall inside the province boundary. A station reading older than about three hours before the pull is dropped, and a reading of −1 is treated as no reading. The figure is the median PM2.5 of the stations that remain, and the time is the latest of those stamps, not the earliest. If none of the stations are current, the province has no current reading. This is one hour, not a year. An old stamp is not shown as the current hour.",
      th: "ในแต่ละจังหวัด ใช้สถานี Air4Thai ที่พิกัดตกในขอบเขตจังหวัด ค่าที่เก่ากว่าประมาณสามชั่วโมงก่อนเวลาดึงจะถูกทิ้ง และค่า −1 ถือว่าไม่มีค่า ตัวเลขคือมัธยฐาน PM2.5 ของสถานีที่เหลือ และเวลาคือเวลาล่าสุดของสถานีเหล่านั้น ไม่ใช่เวลาที่เร็วที่สุด ถ้าไม่มีสถานีที่ยังเป็นปัจจุบัน จังหวัดนั้นไม่มีค่าปัจจุบัน นี่คือหนึ่งชั่วโมง ไม่ใช่ค่าทั้งปี เวลาที่เก่าจะไม่ถูกแสดงเป็นชั่วโมงปัจจุบัน",
      zh: "每个府取落在府界内的 Air4Thai 站点。比这次抓取早大约三小时以上的读数会被丢掉，读数为 −1 视为没有读数。数字是剩下站点的 PM2.5 中位数，时间取这些站点里最晚的时间，不是最早的。如果没有站点仍是当前的，这个府就没有当前读数。这是一个小时，不是全年。旧的时间不会被显示成当前小时。",
    },
  },
  {
    id: "env.aqi",
    area: "environment",
    status: "ok",
    unit: { en: "AQI", th: "AQI", zh: "AQI" },
    name: { en: "Air quality index", th: "ดัชนีคุณภาพอากาศ", zh: "空气质量指数" },
    sourceName: {
      en: "Pollution Control Department, Air4Thai",
      th: "กรมควบคุมมลพิษ Air4Thai",
      zh: "污染控制局 Air4Thai",
    },
    sourceUrl: "https://air4thai.pcd.go.th/services/getNewAQI_JSON.php",
    method: {
      en: "Same stations and same hour as PM2.5. Station readings older than about three hours are dropped. The figure is the median of the AQI values that remain, and the time is the latest stamp. If none are current, there is no current reading. It is the department’s index for that hour, not a yearly grade. An old stamp is not shown as the current hour.",
      th: "ใช้สถานีและชั่วโมงเดียวกับ PM2.5 ค่าที่เก่ากว่าประมาณสามชั่วโมงถูกทิ้ง ตัวเลขคือมัธยฐานของ AQI ที่เหลือ และเวลาคือเวลาล่าสุด ถ้าไม่มีค่าปัจจุบัน จะไม่มีค่าปัจจุบัน เป็นดัชนีของกรมในชั่วโมงนั้น ไม่ใช่เกรดทั้งปี เวลาที่เก่าจะไม่ถูกแสดงเป็นชั่วโมงปัจจุบัน",
      zh: "与 PM2.5 同一批站点、同一个小时。早于大约三小时的读数会被丢掉。数字是剩下的 AQI 的中位数，时间是最晚的时间。如果没有当前读数，就不给出当前读数。这是该小时的指数，不是全年评分。旧的时间不会被显示成当前小时。",
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
    id: "governance.emergency_decree",
    area: "governance",
    status: "ok",
    direction: "lower",
    licence: "not stated",
    unit: { en: "1 = designated in part", th: "1 = ถูกประกาศบางส่วน", zh: "1 = 部分地区被宣布" },
    name: {
      en: "Emergency decree on part of the province",
      th: "ประกาศสถานการณ์ฉุกเฉินในบางส่วนของจังหวัด",
      zh: "府内部分地区的紧急状态",
    },
    sourceName: {
      en: "Cabinet of Thailand, extension 86",
      th: "คณะรัฐมนตรี การขยายครั้งที่ 86",
      zh: "泰国内阁，第 86 次延长",
    },
    sourceUrl: "https://www.thaigov.go.th/th/news/169828",
    method: {
      en: "1 if any district of the province is inside the serious-emergency area under extension 86, otherwise 0, for every province. The Cabinet resolution of 6 October 2569 runs from 20 October 2569 through 19 January 2570. Narathiwat except Yi-ngo, Waeng and Sukhirin. Pattani except Yaring, Panare, Mayo, Mai Kaen, Thung Yang Daeng, Kapho and Mae Lan. Yala except Betong, Yaha, Kabang, Krong Pinang and Raman. Raman was added to Yala's exceptions in this extension. The 1 does not change, because other districts in each of the three provinces stay designated. Songkhla is 0: the decree does not cover it. This is a legal map, not a count of incidents. Provincial crime is still missing. Deep South Watch does not publish a current series for all 77 provinces, and the Royal Thai Police tables that were found are national totals. Neither is stored as zero.",
      th: "เป็น 1 ถ้าอำเภอใดในจังหวัดอยู่ในพื้นที่สถานการณ์ฉุกเฉินที่มีความร้ายแรงตามการขยายครั้งที่ 86 ไม่เช่นนั้นเป็น 0 ครบทุกจังหวัด มติคณะรัฐมนตรีวันที่ 6 ตุลาคม 2569 มีผลตั้งแต่วันที่ 20 ตุลาคม 2569 ถึงวันที่ 19 มกราคม 2570 นราธิวาสยกเว้นยี่งอ แว้ง และสุคิริน ปัตตานียกเว้นยะหริ่ง ปะนาเระ มายอ ไม้แก่น ทุ่งยางแดง กะพ้อ และแม่ลาน ยะลายกเว้นเบตง ยะหา กาบัง กรงปินัง และรามัน รามันถูกเพิ่มในข้อยกเว้นของยะลาในการขยายครั้งนี้ ค่า 1 ไม่เปลี่ยน เพราะแต่ละจังหวัดในสามจังหวัดยังมีอำเภออื่นที่ถูกประกาศอยู่ สงขลาเป็น 0 เพราะประกาศนี้ไม่ครอบคลุมสงขลา นี่คือแผนที่กฎหมาย ไม่ใช่จำนวนเหตุการณ์ อาชญากรรมรายจังหวัดยังขาด ศูนย์เฝ้าระวังสถานการณ์ภาคใต้ไม่ได้เผยแพร่ชุดข้อมูลปัจจุบันครบ 77 จังหวัด และตารางของสำนักงานตำรวจแห่งชาติที่พบเป็นยอดทั้งประเทศ ทั้งสองอย่างไม่ได้ถูกเก็บเป็นศูนย์",
      zh: "如果该府有任何一个县处在严重紧急状态第 86 次延长的区域内，记为 1，否则记为 0，77 个府都有值。2569 年 10 月 6 日的内阁决议覆盖 2569 年 10 月 20 日至 2570 年 1 月 19 日。那拉提瓦除外县为伊戈、瓦英、素奇林。北大年除外县为亚灵、巴纳雷、玛腰、迈干、通央登、卡坡、湄兰。也拉除外县为勿洞、亚哈、甲邦、格龙披南和拉曼。拉曼是这次延长新增的除外县。1 不会改，因为三省各自仍有其他县被划入。宋卡是 0：这项宣布不包括宋卡。这是法律地图，不是事件计数。分府犯罪仍然缺失。深南观察没有公布覆盖全部 77 府的当前序列，找得到的皇家警察表是全国合计。两者都不会被存成零。",
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
const crimeIndicator = INDICATORS.find((indicator) => indicator.id === "governance.crime");
if (crimeIndicator) {
  crimeIndicator.method = {
    en: "Not in the file. Royal Thai Police tables that were found are national totals. Deep South Watch publishes incident summaries for the southern border, not a current figure for all 77 provinces. Road deaths are not used as a stand-in, and a blank is not stored as zero. The emergency-decree line is a separate indicator.",
    th: "ยังไม่อยู่ในไฟล์ ตารางของสำนักงานตำรวจแห่งชาติที่พบเป็นยอดทั้งประเทศ ศูนย์เฝ้าระวังสถานการณ์ภาคใต้เผยแพร่สรุปเหตุการณ์ชายแดนใต้ ไม่ใช่ตัวเลขปัจจุบันครบ 77 จังหวัด ไม่ได้ใช้ผู้เสียชีวิตบนถนนมาแทน และช่องว่างไม่ได้ถูกเก็บเป็นศูนย์ บรรทัดประกาศสถานการณ์ฉุกเฉินเป็นตัวชี้วัดคนละตัว",
    zh: "还不在文件里。找得到的皇家警察表是全国合计。深南观察公布的是南部边境的事件摘要，不是覆盖全部 77 府的当前数字。不用道路死亡来代替，空着也不会存成零。紧急状态是另一个指标。",
  };
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
