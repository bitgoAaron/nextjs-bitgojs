import { BitGoAPI } from '@bitgo/sdk-api';

const bitgoAPI = new BitGoAPI({
  env: 'test',
  // make sure to define this in .env.local
  accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN,
});

export default bitgoAPI;
