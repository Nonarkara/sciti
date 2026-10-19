// Place-specific cautions. These are notes, not scores.

export const PLACE_NOTES = {
  "th-23": {
    en: "Trat is a phase-1 Border SEZ. In December 2568 the Department of Foreign Trade recorded no border trade with Cambodia. Check the crossing before treating Trat as a border-investment pick. The 2024 customs total is a year, not this month.",
    th: "ตราดเป็นเขตเศรษฐกิจพิเศษชายแดนระยะที่ 1 เดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ ตรวจด่านก่อนถือว่าตราดเป็นตัวเลือกการลงทุนชายแดน ยอดศุลกากรปี 2024 คือทั้งปี ไม่ใช่เดือนนี้",
    zh: "达叻是第一期边境经济特区。佛历 2568 年 12 月，外贸厅记录对柬埔寨的边境贸易为零。把达叻当成边境投资选项之前，先核对口岸。2024 年的海关合计是全年，不是这个月。",
  },
  "th-27": {
    en: "Sa Kaeo is a phase-1 Border SEZ, with the Aranyaprathet crossing in the 2024 customs file. In December 2568 the Department of Foreign Trade recorded no border trade with Cambodia. Check the crossing before treating Sa Kaeo as a border-investment pick.",
    th: "สระแก้วเป็นเขตเศรษฐกิจพิเศษชายแดนระยะที่ 1 และด่านอรัญประเทศอยู่ในไฟล์ศุลกากรปี 2024 เดือนธันวาคม 2568 กรมการค้าต่างประเทศบันทึกการค้าชายแดนกับกัมพูชาเป็นศูนย์ ตรวจด่านก่อนถือว่าสระแก้วเป็นตัวเลือกการลงทุนชายแดน",
    zh: "沙缴是第一期边境经济特区，2024 年海关文件里有亚兰口岸。佛历 2568 年 12 月，外贸厅记录对柬埔寨的边境贸易为零。把沙缴当成边境投资选项之前，先核对口岸。",
  },
  "th-71": {
    en: "Kanchanaburi is a phase-2 Border SEZ. Imports at Sangkhla Buri in the 2024 customs file likely include pipeline gas, so the province total is not all goods crossing a checkpoint.",
    th: "กาญจนบุรีเป็นเขตเศรษฐกิจพิเศษชายแดนระยะที่ 2 นำเข้าที่สังขละบุรีในไฟล์ศุลกากรปี 2024 น่าจะรวมก๊าซทางท่อ ดังนั้นยอดจังหวัดไม่ใช่สินค้าที่ข้ามด่านทั้งหมด",
    zh: "北碧是第二期边境经济特区。2024 年海关文件里桑卡拉武里的进口很可能包括管道天然气，所以府合计并不全是过关的货物。",
  },
};

export function placeNote(placeId) {
  return PLACE_NOTES[placeId] || null;
}
