import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKeyHex }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const privateKey = hexToBytes(privateKeyHex)
    const msg = JSON.stringify({ from: address, to: recipient, amount: sendAmount })
    const msgBytes = utf8ToBytes(msg)
    const msgHash = keccak256(msgBytes)


    try {
      const [signature, recoveryBit] = await secp.sign(msgHash, privateKey, { recovered: true })
      console.log('signature: ', toHex(signature))
      console.log('signature: ', signature)
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        recipient: recipient,
        amount: parseInt(sendAmount),
        msgHash: Array.from(msgHash),
        signature: Array.from(signature),
        recoveryBit: recoveryBit
      });
     
      setBalance(balance);
    } catch (ex) {
      console.error('Error:', ex); // good for debug
      if (ex.response && ex.response.data && ex.response.data.message) {
        alert(ex.response.data.message); // Show the error from the backend
      } else {
        alert("Unkown error");
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
