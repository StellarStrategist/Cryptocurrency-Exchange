import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey}) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function getPrivateKey(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address" value={address} onChange={onChange}></input>
      </label>
      <label>
        Private Key
        <input placeholder="Enter your Private Key" value={privateKey} onChange={getPrivateKey} required></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
