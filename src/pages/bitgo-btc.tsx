import { BitGoAPI } from '@bitgo/sdk-api';
import { Btc, Tbtc } from '@bitgo/sdk-coin-btc';
import type { Wallet } from '@bitgo/sdk-core';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const sdk = new BitGoAPI({
  env: 'test',
  // make sure to define this in .env.local
  accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
});

const registerCoins = () => {
  try {
    sdk.register('tbtc', Tbtc.createInstance);
    sdk.register('btc', Btc.createInstance);
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
registerCoins();

const BitGoSDK = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  useEffect(() => {
    const fetchWallets = async () => {
      const resp = await sdk.coin('tbtc').wallets().list();
      setWallets(resp.wallets);
    };
    fetchWallets();
  }, []);
  return (
    <Main
      meta={<Meta title="BitGoJS Meets NextJS" description="Lorem ipsum" />}
    >
      <h2>BitGoAPI: {sdk.version()}</h2>
      <h3>TBTC Wallets</h3>
      <div>
        {wallets.map((wallet) => (
          <div key={wallet.id()}>
            {wallet.label()} : {wallet.spendableBalanceString()}
          </div>
        ))}
      </div>
    </Main>
  );
};

export default BitGoSDK;
