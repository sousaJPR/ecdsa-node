const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require('ethereum-cryptography/utils')
const { keccak256 } = require("ethereum-cryptography/keccak")

const privateKey = secp.utils.randomPrivateKey()

console.log('private key', toHex(privateKey))

const restPublicKey = secp.getPublicKey(privateKey).slice(1);
const hash = keccak256(restPublicKey)
const addressBites = hash.slice(-20)
const address = '0x' + toHex(addressBites)

console.log('address', address)


