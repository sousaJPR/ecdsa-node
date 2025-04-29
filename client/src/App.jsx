import Wallet from "./Wallet";
import Transfer from "./Transfer";
import ViewBalance from "./ViewBalance"
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKeyHex, setPrivateKeyHex] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        setPrivateKeyHex={setPrivateKeyHex}
      />
      <Transfer setBalance={setBalance} address={address} privateKeyHex={privateKeyHex} />
      <ViewBalance/>
    </div>
  );
}

export default App;
