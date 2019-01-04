import { ethers } from 'ethers';
export declare class TrezorSigner extends ethers.Signer {
    readonly path: string;
    readonly provider: ethers.providers.Provider;
    constructor(provider: ethers.providers.Provider, options?: Options, address?: string);
    getPublicKey(): Promise<PublicKey>;
    getAddress(): Promise<string>;
    sign(transaction: ethers.providers.TransactionRequest): Promise<string>;
    sendTransaction(transaction: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
    signMessage(message: ethers.utils.Arrayish | string): Promise<string>;
    connect(provider: ethers.providers.Provider): TrezorSigner;
}
export declare type Options = {
    path?: string;
};
export declare type PublicKey = {
    publicKey: string;
    chainCode: string;
};
