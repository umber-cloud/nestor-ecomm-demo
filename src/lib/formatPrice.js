export function formatPrice(price) {
  const numeric =
    typeof price === "number" ? price : parseFloat(String(price).replace(/[$,]/g, ""));
  return numeric.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
