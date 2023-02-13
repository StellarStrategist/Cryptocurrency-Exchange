const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

function generateKeys() {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    console.log("PrivateKey="+toHex(privateKey));
    console.log("Public Key="+toHex(publicKey));
    console.log("EthereumWalletAddress="+toHex(keccak256(publicKey).slice(-20)));
}
generateKeys();
module.exports = generateKeys;