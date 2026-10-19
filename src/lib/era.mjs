// Buddhist Era years in prose become Common Era.
// A year that is the yyyy of an announcement number (19/2565, [1/2564]) stays.

export function gregorianProse(text) {
  return String(text).replace(
    /https?:\/\/\S+|selectyear=\d+|\[[^\]]*\]|\b\d{1,4}\/2[4-6]\d{2}\b|B\.E\.\s*2[4-6]\d{2}|\b2[4-6]\d{2}\b/g,
    (match) => {
      if (match.startsWith("http") || match.startsWith("selectyear=") || match.startsWith("[") || match.includes("/")) return match;
      const year = match.match(/2[4-6]\d{2}/);
      return year ? String(Number(year[0]) - 543) : match;
    },
  );
}
