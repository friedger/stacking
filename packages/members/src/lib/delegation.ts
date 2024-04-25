export const stackingContract = 'SP000000000000000000002Q6VF78.pox-4';
export const fastPoolContract = 'SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3';

export function stxToMicroStx(microStx: string): number {
  return parseInt(microStx) * 1_000_000;
}
