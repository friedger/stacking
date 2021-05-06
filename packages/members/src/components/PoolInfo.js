import { ClarityType, cvToString } from '@stacks/transactions';
import { getPoolContractId, usernameCVToName } from '../lib/pools';
import { poxCVToBtcAddress } from '../lib/pools-utils';

export default function PoolInfo({ pool }) {
  const contractId = getPoolContractId(pool);

  return (
    <>
      <h5>
        {pool.data.url.data ? (
          <a href={pool.data.url.data}>{usernameCVToName(pool.data.name)}</a>
        ) : (
          <>{usernameCVToName(pool.data.name)}</>
        )}
        {pool.data.verified && pool.data.verified.type === ClarityType.BoolTrue && (
          <>
            {' '}
            <a href={`${pool.data.url.data}/manifest.json`}>
              <img src="/verified.svg" alt="verified" width="16" />
            </a>
          </>
        )}
      </h5>
      <p>
        {cvToString(pool.data.delegatee)}
        <br />
        {pool.data['locking-period'].type === ClarityType.List
          ? `Locking for ${pool.data['locking-period'].list
              .map(lp => lp.value.toString(10))
              .join(', ')} cycles.`
          : 'Variable locking period'}
        <br />
        {pool.data['minimum-ustx'].type === ClarityType.OptionalSome
          ? `Minimum amount required to join: ${
              pool.data['minimum-ustx'].value.value.toNumber() / 1000000
            } STX`
          : 'No minimum STX required.'}
        <br />
        Payout in {pool.data['payout'].data}.
        <br />
        {pool.data['date-of-payout'].data ? (
          <>When payout? {pool.data['date-of-payout'].data}.</>
        ) : (
          <>No information about payout date available.</>
        )}
        <br />
        {pool.data['fees'].data
          ? `Fees: ${pool.data['fees'].data}`
          : 'No information about fees available.'}
        <br />
        Reward addresses:
        <br />
        {pool.data['pox-address'].list.map(address => {
          return (
            <>
              {poxCVToBtcAddress(address)}
              <br />
            </>
          );
        })}
        Using contract:
        <br />
        {contractId}
        <br />
      </p>
    </>
  );
}
