import { Btc, Tbtc } from '@bitgo/sdk-coin-btc';
import type { Wallet } from '@bitgo/sdk-core';
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import bitgoAPI from '@/utils/bitgo-api';

const registerCoins = () => {
  try {
    bitgoAPI.register('tbtc', Tbtc.createInstance);
    bitgoAPI.register('btc', Btc.createInstance);
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
registerCoins();

const BitGoSDK = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  useEffect(() => {
    const fetchWallets = async () => {
      const resp = await bitgoAPI.coin('tbtc').wallets().list();
      setWallets(resp.wallets);
    };
    fetchWallets();
  }, []);
  return (
    <Main
      meta={<Meta title="BitGoJS Meets NextJS" description="Lorem ipsum" />}
    >
      <h2>BitGoAPI: {bitgoAPI.version()}</h2>
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
