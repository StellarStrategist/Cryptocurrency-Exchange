const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const {keccak256} = require("ethereum-cryptography/keccak");
const {utf8ToBytes, toHex} = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "6730c7a8adb536ab723b6720a7bf15d672923c6e": 1000,
  "ed637bdea0de5b77cb75ba5bb56b703ecf996e71": 5000,
  "29f1d395aa99577c4b84541413b1248891edf897": 2000,
  "7581307c2257833e3542185156d73813d3cecb05": 4400,
  "aa552eff6b67ea8e3089edd48c03fb9cdaa7db3c": 3500
};

const keys = {
  "089cfcb3003f44980f739391292087f3e4cc7382b3fc86da7b74dd94e5c5f0cb":"04c34d62dabbf0d1bb6593d3397912df40e8bbe050733460cc43fab8fa73b82b778b08d0ef949eea31415f8e9578570fffae8a273f28f94230c99bd8ad2ac2c624",
  "3f475927f63c13db7de25f1f43f88a0ba28b32612c8f3e717477a8d77ac95e18":"04d33af4b21bbd5a93364e7e9e0de476ce952b89431a5d0025048376a74bdb1f91a421b8caa116853198ff71939cfc15d07747375675626c8f84a031bf8f881180",
  "a8ba28ef2560f85d7caa48b54a2483ae8ced3a11c183fe379b3bf0117516ed69":"04809e3bd83245960ce6400a00051ff7a966939fd1a80c013b17bbc90edd150b6d5ef77e12b5f23bf9754a8b179976353b508e6fa7a4986c6c9df6f29aad714f27",
  "862a706ce351871c7e4f6df2ebf751787ae2b5eb61a813ae15dbf1d61483ea18":"043fc955ae2a663fe209461fad58bd8b6d31b29db84cebc6fd88ea29e680a220ad06d56eb7df17343e3914f84cfbd7fbe2dafd067a24dac838a6709ccfb12a4a3a",
  "43d14d672989fdbe18136d83779696bedd4e789a081146e6a4adfcea3410ed06":"046bc348d9b793ef3f4b43d07c173b4dd5d53e0322e2945a71372b94d194b41f7d8a29fed62fd51ecadd9bd6873fee1b87f58246e4de802b811fa60dd40a314f7a"
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { privateKey, sender, recipient, amount } = req.body;
  const publicKey = secp.getPublicKey(privateKey);
  const address = toHex(keccak256(publicKey).slice(-20));
  if(address!==sender) {
    res.status(400).send({ message: "Kindly check the private key and the addresses."});
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
    refreshPage();
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
    refreshPage();
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