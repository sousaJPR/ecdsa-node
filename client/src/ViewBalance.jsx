import React, { useState } from 'react'
import server from "./server";

function ViewBalance() {
    const [viewAddress, setViewAddress] = useState()
    const [viewBalance, setViewBalance] = useState(0)

    //Fetch address balance from the server
    async function onChange(evt) {
        const address = evt.target.value;
        setViewAddress(address);
        if (address) {
          const {
            data: { balance },
          } = await server.get(`balance/${address}`);
          setViewBalance(balance);
        } else {
          setViewBalance(0);
        }
      }

  return (
    <div className='container wallet'>
        <h1>View Balance</h1>
        <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={viewAddress} onChange={onChange}></input>
      </label>
      <div className="balance">Balance: {viewBalance}</div>

    </div>
  )
}

export default ViewBalance