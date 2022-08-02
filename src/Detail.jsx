import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
//import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import "./App.css";
import abi from "./utils/PisocoOne.json";

const Detail = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [provider, setProvider] = useState("");

  const [xerian, setXerian] = useState("");
  const contractAddress = "0x75267b2225D5B3931423f7DC97A54Be095E96706";
  const contractABI = abi.abi;
  //const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await pisocoContract.getBalance();
        setBalance(count);
        console.log("Retrieved total wave count...", count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stakeMyXerian = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let res = await pisocoContract.stakeXerian(0, 1, 1, 7);
        console.log("Staked ...", res);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getXerian = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let balanceOf = await pisocoContract.getXerian(0);
        console.log("Xerians count...", balanceOf);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        window.ethereum._handleChainChanged({
          chainId: 43113,
          networkVersion: 1,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Xerian Detail!</div>

        <div className="bio">
          I am izmael. Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={getAllXerians}>
          All Game NFTs
        </button>
        <button className="waveButton" onClick={enableMinting}>
          Enable Minting
        </button>
        <button className="waveButton" onClick={publicMint}>
          Public Mint
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Detail;
