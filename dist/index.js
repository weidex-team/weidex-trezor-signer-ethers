"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var trezor_connect_1 = require("trezor-connect");
var _pending = Promise.resolve(null);
var _currentAddress;
var TrezorSigner = /** @class */ (function (_super) {
    __extends(TrezorSigner, _super);
    function TrezorSigner(provider, options, address) {
        var _this = _super.call(this) || this;
        if (address) {
            _currentAddress = address;
        }
        if (!options) {
            options = {};
        }
        if (!options.path) {
            options.path = ethers_1.ethers.utils.HDNode.defaultPath;
        }
        ;
        ethers_1.ethers.utils.defineReadOnly(_this, 'provider', provider);
        ethers_1.ethers.utils.defineReadOnly(_this, 'path', options.path);
        return _this;
    }
    TrezorSigner.prototype.getPublicKey = function () {
        var _this = this;
        var addressPromise = _pending.then(function () {
            return trezor_connect_1.default.getPublicKey({ path: _this.path, coin: 'eth' }).then(function (result) {
                return { publicKey: result.payload.publicKey, chainCode: result.payload.chainCode };
            });
        });
        _pending = addressPromise;
        return addressPromise;
    };
    TrezorSigner.prototype.getAddress = function () {
        var _this = this;
        if (_currentAddress === undefined) {
            var addressPromise = _pending.then(function () {
                return trezor_connect_1.default.ethereumGetAddress({ path: _this.path }).then(function (result) {
                    _currentAddress = result.payload.address;
                    return result.payload.address;
                });
            });
            _pending = addressPromise;
            return addressPromise;
        }
        else {
            return Promise.resolve(_currentAddress);
        }
    };
    TrezorSigner.prototype.sign = function (transaction) {
        var _this = this;
        return ethers_1.ethers.utils.resolveProperties(transaction).then(function (tx) {
            var signPromise = _pending.then(function () {
                return trezor_connect_1.default.ethereumSignTransaction({ path: _this.path, transaction: tx }).then(function (result) {
                    var sig = {
                        v: result.payload.v,
                        r: result.payload.r,
                        s: result.payload.s
                    };
                    return ethers_1.ethers.utils.serializeTransaction(tx, sig);
                });
            });
            _pending = signPromise;
            return signPromise;
        });
    };
    TrezorSigner.prototype.sendTransaction = function (transaction) {
        var _this = this;
        return this.sign(transaction).then(function (signedTx) {
            return _this.provider.sendTransaction(signedTx);
        });
    };
    TrezorSigner.prototype.signMessage = function (message) {
        var _this = this;
        var signPromise = _pending.then(function () {
            return trezor_connect_1.default.ethereumSignMessage({
                path: _this.path,
                message: message,
                hex: true,
            }).then(function (result) {
                return result.payload.signature;
            });
        });
        _pending = signPromise;
        return signPromise;
    };
    TrezorSigner.prototype.connect = function (provider) {
        return new TrezorSigner(provider);
    };
    return TrezorSigner;
}(ethers_1.ethers.Signer));
exports.TrezorSigner = TrezorSigner;
