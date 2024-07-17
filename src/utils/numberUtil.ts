import BigNumber from 'bignumber.js';

const NUMBER_TEN_THOUSAND_FORMAT = 10000; // 万
const NUMBER_FIXED_LENGTH = 2; // 小数点保留

export function formatAmountUnit(
  number: BigNumber.Value = 0,
  format = NUMBER_TEN_THOUSAND_FORMAT,
  fixed = NUMBER_FIXED_LENGTH,
): string {
  const x = new BigNumber(number);
  const y = new BigNumber(format);
  const z = x.dividedBy(y);
  return z.toFixed(fixed).toString(); // 四舍五入 保留2位
}
