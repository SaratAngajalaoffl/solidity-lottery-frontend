import React, { useEffect, useState } from "react";
import Web3 from "web3";

window.ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3(window.ethereum);

function App() {
  const [contract, setContract] = useState();
  const [manager, setManager] = useState();
  const [loading, setLoading] = useState(true);

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

    (async () => {
      setManager(await newContract.methods.manager().call());
      setLoading(false);
    })();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return <div>Hello Sarat! Manager is {manager}</div>;
}

export default App;
