import * as BigNumber from 'bignumber.js';

export class LedgerAddress {
    address: string | undefined;
    balance: BigNumber.BigNumber| undefined;
    point: number | undefined;
}