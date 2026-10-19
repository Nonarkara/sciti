export function fillFor(score: number | null): string {
  if (score == null) return "none";
  const opacity = 0.15 + (score / 100) * 0.75;
  return `rgba(18, 53, 78, ${opacity.toFixed(3)})`;
}
