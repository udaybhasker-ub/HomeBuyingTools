export interface Iinsights {
  priceToRentRatio: number;
  idealRentLimitForPrice,
  idealPriceLimitForRent,
  atMonthRentingEqualsToBuying: number;
  atMonthBuyingCostIsZero: number;
  atMonthBuyingIsBenificialThanInvesting: number;
  purchaseVsRentBreakEvenMonth: number;
}
