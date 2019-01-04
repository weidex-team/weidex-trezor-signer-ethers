ethers-trezor
=============

This is just a quick sample that is enough to integrate Ethers with Trezor Hardware Wallet. 
More work needs to be done in order to detect and relay any meaningful errors to the application developer.

Importing
---------

**Node.js**

This will intialize the Signer and 

```javascript
const { TrezorSigner } = require('trezor-signer');
```

**TypeScript**

```javascript
import { TrezorSigner } from 'trezor-signer';
```

API
---

**Initialize**
```javascript
// Options are optional; this is the default
let options = {
    path: "m'/44'/0'/0'/0/0"
};

let provider = ethers.providers.getDefaultProvider();

// Initialize TrezorSigner object with provider and options
const signer = new TrezorSigner(provider, options);
```

**Get Address**
```javascript
// Get the address by the given 'path' in options
signer.getPublicKey().then((address) => {
    console.log(address);
    // "0xcCd7ce9EC004bFBd5711245f917D6109813A909C"
})
```

**Get Public Key**
```javascript
// Get the publicKey and chainCode from which number of addresses can be extracted.
signer.getAddress().then((pk) => {
    console.log(pk);
    // {
    //     "publicKey": "024f4021c101d401086165425f2531cac43339a9ae736a9b84a5f3a1e50181d07d",
    //     "chainCode": "5d122909742cd9fa0320bbfd1b1ae851c88274328cc68390c956635ad7305e06"
    // }
})
```

**Sign message**
```javascript
// Sign a hexadecimal message and returns the correspoding signature
let message = "0x31124cc354ee4d13adfd08d6156a401578483ac5bf6ac435f314d0c95523d534"
signer.signMessage(message).then((signature) => {
    console.log(sinature);
    //  f8d5f3c077addba852ec5b9d8471d45878edd0678fc7f4c9465c03c82ea
    //  d2e9e7ef6b1f77d529197c727658fbe4be5e7880eec69a0f82c4724cf5712450f1ca91c
});
```

**Sign transaction**
```javascript
const tx = {
    to: '0x2156b0acbB9AE3cEE0451f489cd42477c427072A',
    value: '0x100',
    gasLimit: '0x5208',
    gasPrice: '0xbebc200',
    nonce: '0x5',
}
signer.sign(tx).then((signedRawTx) => {
    console.log(signedRawTx);
    //  0xf86505840bebc200825208942156b0acbb9ae3cee0451f489cd42477c427072a8201008
    //  01ca0bada9c94fe9b1add9c7e3af54825b1c61aa1b2f2090fdb3982f23aab
    //  7d36a075a022d4996cfd56f9594ed85a06811fd6897fb59c149cac9ffd6d38d08510cf48e2
});
```

**Send Transaction**
```javascript
const tx = {
    to: '0x2156b0acbB9AE3cEE0451f489cd42477c427072A',
    value: '0x100',
    gasLimit: '0x5208',
    gasPrice: '0xbebc200',
    nonce: '0x5',
}

// This requires a provider was provided
signer.sendTransaction(tx).then((tx) => {
    console.log(tx);
    //{
    //   "nonce": 6,
    //   "gasPrice": {
    //     "_hex": "0x0bebc200"
    //   },
    //   "gasLimit": {
    //     "_hex": "0x5208"
    //   },
    //   "to": "0x2156b0acbB9AE3cEE0451f489cd42477c427072A",
    //   "value": {
    //     "_hex": "0x1000"
    //   },
    //   "data": "0x",
    //   "chainId": 0,
    //   "v": 28,
    //   "r": "0x4b26534eb711fbfa8c299e62f590e7ef046fd463d22b71fda99abf6198108b2a",
    //   "s": "0x316c0401a9b2bdb9050e712b5beaef0198cc986c7829c3ed337515fe4f0dc558",
    //   "from": "0x3281575CbECBb5e625C1aEB382155e4d81f3Faf1",
    //   "hash": "0x2e3328065b98359fb79656a5acfb3927e6fbbfb5005514e43d46668324f2d580"
    // }
});
```

**Connect to new provider**
```javascript
let ropstenProvider = ethers.providers.getDefaultProvider('ropsten');
let ropstenSigner = signer.connect(ropstenProvider);
```