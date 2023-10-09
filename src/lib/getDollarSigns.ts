// create getDollarSigns function that inptus a priceLevel number. if the number is
// Price levels are interpreted as follows:
//  - `0`: Free
//  - `1`: Inexpensive
//  - `2`: Moderate
//  - `3`: Expensive
//  - `4`: Very Expensive
export function getDollarSigns(priceLevel: number) {
  console.log("price level: ", priceLevel);
  if (priceLevel === 0) {
    return "Free";
  }
  if (priceLevel === 1) {
    return "$";
  }
  if (priceLevel === 2) {
    return "$$";
  }
  if (priceLevel === 3) {
    return "$$$";
  }
  if (priceLevel === 4) {
    return "$$$$";
  }
}
