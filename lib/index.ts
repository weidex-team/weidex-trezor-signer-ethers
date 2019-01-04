import { ethers } from 'ethers';
import TrezorConnect from 'trezor-connect';

let _pending: Promise<any> = Promise.resolve(null);
let _currentAddress: string | undefined;

export class TrezorSigner extends ethers.Signer {
    readonly path!: string;
    readonly provider!: ethers.providers.Provider;

    constructor(provider: ethers.providers.Provider, options?: Options, address?: string) {
        super();

        if(address) { _currentAddress = address }
        if (!options) { options = { }; }
        if (!options.path) { options.path = ethers.utils.HDNode.defaultPath; };

        ethers.utils.defineReadOnly(this, 'provider', provider);
        ethers.utils.defineReadOnly(this, 'path', options.path);
    }

    getPublicKey(): Promise<PublicKey> {
        let addressPromise = _pending.then(() => {
            return TrezorConnect.getPublicKey({path: this.path, coin: 'eth'}).then((result:any) => {
                return {publicKey: result.payload.publicKey, chainCode: result.payload.chainCode};
            });
        });
        
        _pending = addressPromise;
        return addressPromise; 
    }

    getAddress(): Promise<string> {
        if(_currentAddress === undefined) {
            let addressPromise = _pending.then(() => {
                return TrezorConnect.ethereumGetAddress({path: this.path}).then((result:any) => {
                    _currentAddress = result.payload.address;
                    return result.payload.address;
                });
            });
            _pending = addressPromise;
            return addressPromise; 
        } else {
            return Promise.resolve(_currentAddress);
        }
    }

    sign(transaction: ethers.providers.TransactionRequest): Promise<string> {
        return ethers.utils.resolveProperties(transaction).then((tx) => {
            let signPromise = _pending.then(() => {
                return TrezorConnect.ethereumSignTransaction({path: this.path, transaction: tx}).then((result:any) => {
                    let sig = {
                        v: result.payload.v,
                        r: result.payload.r,
                        s: result.payload.s
                    };
                    return ethers.utils.serializeTransaction(tx, sig);
                });
            });
            _pending = signPromise;
            return signPromise;
        });
    }

    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse> {
        return this.sign(transaction).then((signedTx) => {
            return this.provider.sendTransaction(signedTx);
        });
    }

    signMessage(message: ethers.utils.Arrayish | string): Promise<string> {
        let signPromise = _pending.then(() => {
            return TrezorConnect.ethereumSignMessage({
                path: this.path,
                message: message,
                hex: true,
            }).then((result:any) => {
                return result.payload.signature;
            });
        });

        _pending = signPromise;
        return signPromise;
    }

    connect(provider: ethers.providers.Provider) {
        return new TrezorSigner(provider);
    }
}

export type Options = {
    path?: string
}

export type PublicKey = {
    publicKey: string,
    chainCode: string
}
