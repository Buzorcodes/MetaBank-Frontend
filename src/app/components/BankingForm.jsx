"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import {ethers, utils} from "ethers"

import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants";
function BankingForm() {
  const [balances, setBalances] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState("");
  // const [tokenUserSupply, setTokenUserSupply] = useState(0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [transactionType, setTransactionType] = useState('mint');
  const [fromAccount, setFromAccount] = useState('checking');
  const [toAccount, setToAccount] = useState('savings');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [inputValue, setInputValue] = useState({ address: "", amount: ""});
  const handleMint = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        let tokenOwner = tokenContract.owner();
        const amount = utils.parseEther(inputValue.amount)
        console.log("Value for mint", amount)
        const txn =  tokenContract.mint(amount);
        console.log("Amount", amount)
        console.log("Minting tokens...");
         await txn.wait();
        console.log("Tokens minted...", txn.hash);

        const updatedTokenSupply = await tokenContract.totalSupply();
const formattedTokenSupply = utils.formatEther(updatedTokenSupply);
setTokenTotalSupply(formattedTokenSupply);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBurn =async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        let tokenOwner = tokenContract.owner();
        const amount = utils.parseEther(inputValue.amount)
        console.log("Value for burn", amount)
        const txn =  tokenContract.burn(amount);
        console.log("Amount", amount)
        console.log("burning tokens...");
         await txn.wait();
        console.log("Tokens burned...", txn.hash);

        const updatedTokenSupply = await tokenContract.totalSupply();
const formattedTokenSupply = utils.formatEther(updatedTokenSupply);
setTokenTotalSupply(formattedTokenSupply);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const amount = utils.parseEther(inputValue.amount)
        const receiver = inputValue.address
        console.log("This is the receiver", receiver)
        const txn =  tokenContract.transfer(receiver, amount);
        console.log("Transfering tokens...");
        await txn.wait();
        console.log("Tokens Transfered", txn.hash);

        const updatedTokenSupply = await tokenContract.totalSupply();
        const formattedTokenSupply = utils.formatEther(updatedTokenSupply);
        setTokenTotalSupply(formattedTokenSupply);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTokenInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let tokenName = await tokenContract.name();
        let tokenSymbol = await tokenContract.symbol();
        let tokenOwner = await tokenContract.owner();
    // let balance = await tokenContract.getCustomerBalance()
   
        let tokenSupply = await tokenContract.totalSupply();
        console.log("signer", signer)

        tokenSupply = utils.formatEther(tokenSupply)
        // balance = utils.formatEther(balance)

        setTokenName(`${tokenName} 🦊`);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenSupply);
        // setTokenBalance(balance);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true)
        }

        console.log("Token Name: ", tokenName);
        console.log("Token Symbol: ", tokenSymbol);
        console.log("Token Supply: ", tokenSupply);
        console.log("Token Owner: ", tokenOwner);
        // console.log("Token Balance: ", tokenBalance);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleInputChange = async (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log("Account Connected: ", account);
        console.log("tokenBalance", tokenTotalSupply)
      } else {
        setError("Install a MetaMask wallet to get our token.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
    handleTokenInfo()
  }, [])


  return (
    <div className="max-w-md mx-auto mt-8 p-4  rounded shadow-lg bg-slate-600">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Card Balances: {tokenTotalSupply}</h2>
        <div className="flex">
        </div>
      </div>
      <form>
        <div className="mb-4">
          <label className="block font-bold mb-2">
            Transaction Type
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded focus:outline-none bg-slate-600 focus:border-blue-500"
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="mint">mint</option>
            <option value="burn">burn</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        {transactionType === 'transfer' && (
          <div className="mb-4">
            <label className="block  font-bold mb-2">
              To Account
            </label>
           <input
           name="address"
            className="w-full bg-slate-600 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={inputValue.address}
            onChange={handleInputChange}
          />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Amount</label>
          <input
          name="amount"
            className="w-full p-2 bg-slate-600 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={inputValue.amount}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              if (transactionType === 'mint') handleMint(event);
              else if (transactionType === 'burn') handleBurn(event);
              else if (transactionType === 'transfer') handleTransfer(event);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {transactionType === 'mint' ? 'mint' : transactionType === 'burn' ? 'burn' : 'Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BankingForm;
