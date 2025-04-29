const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xb763468c64002ccee2bce2dac9e60bfd4da82893": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});



app.post("/send", (req, res) => {
  const { msgHash, signature, recoveryBit, sender, recipient, amount } = req.body;
  const msgHashBytes = objectToUint8Array(msgHash);
  const signatureBytes = objectToUint8Array(signature)

  try {
    const publicKey = secp.recoverPublicKey(msgHashBytes, signatureBytes, recoveryBit)
    const restPublicKey = publicKey.slice(1)
    const hash = keccak256(restPublicKey)
    const recoveredAddress = '0x' + toHex(hash.slice(-20))

    if (recoveredAddress !== sender) {
      return res.status(400).send({ message: 'Invalid signature!' })
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    return res.status(400).send({ message: 'Could not verify signature'})
  }
    
 

  
});



app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// Converts Hashes to Bytes to be able to use them on getPublicKey
function objectToUint8Array(obj) {
  return new Uint8Array(Object.values(obj));
}