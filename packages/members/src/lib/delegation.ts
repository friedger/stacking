export const stackingContract = 'SP000000000000000000002Q6VF78.pox-4';
export const fastPoolContract = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3';
export const multiPoolContract = 'SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.pox4-multi-pool-v1';

export function stxToMicroStx(microStx: string): number {
  return parseInt(microStx) * 1_000_000;
}
