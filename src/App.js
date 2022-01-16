import React, { useEffect, useState } from "react";
import Web3 from "web3";

window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

function App() {
  const [contract, setContract] = useState();
  const [manager, setManager] = useState();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: "manager",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "pickWinner",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getPlayers",
        outputs: [{ name: "", type: "address[]" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "enter",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "players",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
      },
    ];

    const address = "0xddf2f640852E5efaFc23D78A3bA53330e59BE45d";

    const newContract = new web3.eth.Contract(abi, address);

    setContract(newContract);
  }, []);

  useEffect(() => {
    if (!contract) return;
    (async () => {
      setManager(await contract.methods.manager().call());
      setBalance(await web3.eth.getBalance(contract.options.address));
      setPlayers(await contract.methods.getPlayers().call());
      setLoading(false);
    })();
  }, [contract]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await contract.methods.enter().send({
        from: (await web3.eth.getAccounts())[0],
        value: web3.utils.toWei(amount.toString(), "ether"),
      });
      setManager(await contract.methods.manager().call());
      setBalance(await web3.eth.getBalance(contract.options.address));
      setPlayers(await contract.methods.getPlayers().call());
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handlePickWinner = async () => {
    try {
      setLoading(true);
      await contract.methods
        .pickWinner()
        .send({ from: (await web3.eth.getAccounts())[0] });
      setManager(await contract.methods.manager().call());
      setBalance(await web3.eth.getBalance(contract.options.address));
      setPlayers(await contract.methods.getPlayers().call());
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div style={{ padding: 50 }}>
      <h1>Welcome to ethereum lottery</h1>
      <h3>This lottery is managed by {manager}</h3>
      <h3>
        {players.length} players have chipped in for {balance} wei
      </h3>

      <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleSubmit}>Enter</button>

      <h1>Want to Pick a Winner</h1>
      <button onClick={handlePickWinner}>Pick Winner</button>
    </div>
  );
}

export default App;
