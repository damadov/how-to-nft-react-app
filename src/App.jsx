import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ContractFactory } from "ethers";
//import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import "./App.css";
import abi from "./utils/GameNFT.json";
import abiMarket from "./utils/NFTMarket.json";
import abiToken from "./utils/GAMEToken.json";
import abiTokenStake from "./utils/NFTStake.json";
import abiFactory from "./utils/DaemonFactory.json";
import daemonNft from "./utils/DaemonNFT.json";
import daemonMultiNft from "./utils/DaemonMultiNFT.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [mintStatus, setMintStatus] = useState("");
  const [stakeStatus, setStakeStatus] = useState("");
  const [presaleStatus, setPresaleStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [provider, setProvider] = useState("");
  const [errorLabel, setErrorLabel] = useState("");
  const [resultLabel, setResultLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const newTokenURI =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjoie1wiZGltZW5zaW9uXCI6XCI4OTF4MTI1MiBweFwiLFwidG9rZW5JZFwiOjAsXCJ0aXRsZVwiOlwib3J0aG1hbnhlclwiLFwiZGVzY3JpcHRpb25cIjpcIlNvbGRpZXIgWGVyaWFuXCIsXCJjYXRlZ29yeVwiOlwiZ29sZFwiLFwiZm9ybWF0XCI6XCJwbmdcIixcIm1lZGlhTGlua1wiOlwiaHR0cHM6Ly9zdG9yYWdlLmdvb2dsZWFwaXMuY29tL3hlcmlhbnMtd2ViLmFwcHNwb3QuY29tL2Fzc2V0cy8xNjQ2OTk4ODg0OTQzLnBuZ1wiLFwibWV0YUxpbmtcIjpcImh0dHBzOi8vc3RvcmFnZS5nb29nbGVhcGlzLmNvbS94ZXJpYW5zLXdlYi5hcHBzcG90LmNvbS9tZXRhLzE2NDY5OTg4ODQ5NDMuanNvblwiLFwiaXBmc1wiOlwiaXBmczovL1FtUVhpU0pueFZvdmpvNk15R280QmlIc2hEUkpWZEFKdlY1eTlTS0QyNEU2TVJcIixcImhhc2hcIjpcIlwiLFwidGltZXN0YW1wXCI6MTY0Njk5ODg4NzI5OCxcInBvd2VyXCI6e1wiaW50ZWxsaWdlbmNlXCI6MTEsXCJzdHJlbmd0aFwiOjksXCJwb3dlclwiOjEyLFwic3BlZWRcIjoxMCxcInN0cmF0ZWd5XCI6MTIsXCJjYXJkUG93ZXJcIjo1LFwiYm9vc3RlclBvd2VyXCI6MH0sXCJwaWVjZXNcIjp7XCJhcm1MXCI6XCJYRTV4MS5wbmdcIixcImFybVJcIjpcIlhFNXg1LnBuZ1wiLFwibGVnTFwiOlwiWEU4eDIucG5nXCIsXCJsZWdSXCI6XCJYRTh4NC5wbmdcIixcInRvcnNvXCI6XCJYRTV4My5wbmdcIixcImJhY2twYWNrXCI6XCJYRTh4Ny5wbmdcIixcImhlYWRcIjpcIlhFNXg2LnBuZ1wiLFwiY2FyZFwiOlwiRzEucG5nXCIsXCJib29zdGVyc1wiOltcIkE0LnBuZ1wiXX0sXCJzaXplXCI6NTc0NTI0LFwia2luXCI6XCJYeWFuaXJpYW5cIn0ifQ.FNwzRrvQw0Z9TUFIwfwzeGvXE3kAFQyjo7IsgYe6aZ0";

  const [allNFTs, setAllNFTs] = useState([]);
  const contractAddress = "0x172D6FE3EE55Cb6306abe1f1a47D7676B82E639d";
  const marketAddress = "0xAE8e9eB714bbc93F88C53B53C9a825eCfb8c3aB9";
  const tokenAddress = "0xB1214ca9dC7E0aF4BA8953db30B11C37462ECfD1";
  const daemonFactoryAddress = "0xbe2dE92b14222f3B134928f7e49a5fBC09791F19";
  const daemonFactoryABI = abiFactory.abi;
  const contractABI = abi.abi;
  const marketABI = abiMarket.abi;
  const tokenABI = abiToken.abi;
  const liveChainId = "0xa869";
  //const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        let chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the network
        if (chainId !== liveChainId) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: liveChainId }],
          });
          console.log("You are not connected to the correct network!");
        }
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let servStatus = await pisocoContract.enabledServices();
        console.log("Presales:" + servStatus[0]);
        setPresaleStatus(servStatus[0]);
        console.log("Minting:" + servStatus[1]);
        setMintStatus(servStatus[1]);
        console.log("Staking:" + servStatus[2]);
        setStakeStatus(servStatus[2]);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
      //setErrorLabel(error.data.message);
    }
  };

  const changeNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        window.ethereum._handleChainChanged({
          chainId: liveChainId,
          networkVersion: 1,
        });
      } catch (error) {
        console.error(error);
        setErrorLabel(error);
      }
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
      setErrorLabel(error.data.message);
    }
  };

  const signIn = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const meta = await axios.get(
          "https://nftprime-api.appspot.com/auth/sign"
        );
        var msg = "uPq5bsKiCEDWGslcpzSrg0uGsVI=";
        var msgHex = msg.toString(16);
        const signture = await window.ethereum.request({
          method: "personal_sign",
          params: [msgHex, ethereum.selectedAddress],
        });
        //var recoverAddress = await window.ethereum.request({
        //  method: 'personal_ecRecover',
        //  params: [msgHex,signture]
        //});

        //Check signture from auth api
        const params = {
          address: ethereum.selectedAddress,
          nonce: msg,
          signature: signture,
        };
        const user = await axios.post(
          "https://nftprime-api.appspot.com/auth/sign",
          params
        );
        console.log("user:" + user);

        console.log("address:" + ethereum.selectedAddress);
        console.log("signature:" + signture);
        console.log("recoverAddress:" + recoverAddress);
        //console.log("r:" + EthJS.Util.bufferToHex(signatureParams.r));
        //console.log("s:" + EthJS.Util.bufferToHex(signatureParams.s));
        //console.log("v:" + signatureParams.v);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const deploySingleNFT = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const daemonFactory = new ethers.Contract(
          daemonFactoryAddress,
          daemonFactoryABI,
          signer
        );

        const salt =
          "0x0000000000000000000000000000000000000000000000000000000000000000";
        let trxDeploy = await daemonFactory.deployContract(
          ethereum.selectedAddress,
          marketAddress,
          salt,
          "PSCT",
          "Test Pisoco"
        );
        await trxDeploy.wait();
        console.log("Deployed...", trxDeploy);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const deployContract = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const factory = new ethers.ContractFactory(
          daemonNft.abi,
          daemonNft.bytecode,
          signer
        );
        factory.connect(signer);
        factory.getDeployTransaction(
          currentAccount,
          marketAddress,
          "PSCT",
          "Test Pisoco"
        );
        const contract = await factory.deploy(
          currentAccount,
          marketAddress,
          "PSCT",
          "Test Pisoco"
        );

        await contract.deployTransaction.wait();
        console.log(contract.deployTransaction);
        console.log(contract.address);

        const params = {
          address: ethereum.selectedAddress,
          contract: contract.address,
          trxResponse: contract.deployTransaction,
        };
        const contractLog = await axios.post(
          "https://nftprime-api.appspot.com/contract/deploy",
          params
        );
        console.log("Contract:" + contractLog);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const deployMultiContract = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const factory = new ethers.ContractFactory(
          daemonMultiNft.abi,
          daemonMultiNft.bytecode,
          signer
        );
        factory.connect(signer);
        factory.getDeployTransaction(
          currentAccount,
          marketAddress,
          "PSCTM",
          "Test PisocoMulti",
          10
        );
        const contract = await factory.deploy(
          currentAccount,
          marketAddress,
          "PSCTM",
          "Test PisocoMulti",
          10
        );

        await contract.deployTransaction.wait();
        console.log(contract.deployTransaction);
        console.log(contract.address);

        const params = {
          address: ethereum.selectedAddress,
          contract: contract.address,
          trxResponse: contract.deployTransaction,
        };
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const listTransactions = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const nodeURL = "https://api.avax-test.network/ext/bc/C/rpc";
        const HTTPSProvider = new ethers.providers.JsonRpcProvider(nodeURL);
        //const provider = new ethers.providers.Web3Provider(ethereum);
        //const signer = provider.getSigner();
        HTTPSProvider;
        //let etherscanProvider = new ethers.providers.EtherscanProvider();
        HTTPSProvider.getHistory(ethereum.selectedAddress).then((history) => {
          history.forEach((tx) => {
            console.log(tx);
          });
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const getBalance = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

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
        console.log("Balance...", count);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };
  const getTokenBalance = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          tokenAddress,
          tokenABI,
          signer
        );

        const balance = await tokenContract.balanceOf(currentAccount);
        console.log("Balance...", balance);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const mint = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenURI =
          "data:application/json;base64,eyJyb3lhbHR5IjowLCJuYW1lIjoiV2lkZWFscGVuIFZpZXciLCJkZXNjcmlwdGlvbiI6IiIsImltYWdlIjoiaXBmczovL1FtYkZNa2UxS1hxbll5QkJXeEI3NE40YzVTQm5KTVZBaU1OUmNHdTZ4MUF3UUgiLCJleHRlcm5hbF91cmwiOiJodHRwczovL2dleml6YWRlLmNvbSIsImF0dHJpYnV0ZXMiOlt7InRyYWl0X3R5cGUiOiJjb3VudHJ5IiwidmFsdWUiOiJhdXN0cmlhIn1dfQ==";
        const mintABI = [
          {
            inputs: [
              { internalType: "string", name: "_tokenURI", type: "string" },
              {
                internalType: "uint256",
                name: "_royaltPercentage",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
        ];
        const pisocoContract = new ethers.Contract(
          "0x2D566AD3ab7D87306006E31b86B1a244dBEa94b0",
          mintABI,
          signer
        );

        const mint = await pisocoContract.mint(tokenURI, 10);
        const receipt = await mint.wait();
        console.log(receipt.events);
        for (const event of receipt.events) {
          console.log("Event...", event);
          if (event.event !== "Transfer") {
            console.log("ignoring unknown event type ", event.event);
            continue;
          }
          return event.args.tokenId.toString();
        }

        console.log("Minting...", mint.tokenId);
        console.log("Transcaciton...", mint);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const sendToken = (_to, _amount) => async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");
      let abi = [
        {
          name: "approve",
          type: "function",
          inputs: [
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ];

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

        //let res_ = await tokenContract.approve(_to, ethers.utils.parseEther(_amount.toString()));
        let res = await tokenContract.transfer(
          _to,
          ethers.utils.parseEther(_amount.toString())
        );
        console.log("Transfer ...", res);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const enableMinting = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let res = await pisocoContract._enableMinting(true);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const enablePresale = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let res = await pisocoContract._enablePresale(true);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const publicMint = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const tokenURI = await axios.get("https://<yourproject>.com/meta");
        let mint = await pisocoContract.publicMint(newTokenURI, {
          value: ethers.utils.parseEther("1"),
        });
        await mint.wait();
        console.log("Minting...", mint);
        console.log(
          "Mined, see transaction: https://testnet.snowtrace.io/block/"
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorLabel(error.data.message);
    }
  };

  const airDrop = async () => {
    try {
      const { ethereum } = window;
      setErrorLabel("");
      setResultLabel("");

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pisocoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let mint = await pisocoContract.giftXerian(
          contractAddress,
          newTokenURI
        );
        await mint.wait();
        console.log("Airdrop minting...", mint);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error.data.message);
      setErrorLabel(error.data.message);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header"> NFT Cheat Sheet!</div>
        <div className="bio">
          All actions are for training purposes, do not use in production
          environment!
        </div>
        <button className="waveButton" onClick={signIn}>
          Sign in
        </button>
        <button className="waveButton" onClick={deploySingleNFT}>
          Deploy Single NFT
        </button>
        <button className="waveButton" onClick={deployContract}>
          Deploy NFT Contract
        </button>
        <button className="waveButton" onClick={deployMultiContract}>
          Deploy Multi NFTContract
        </button>
        <button className="waveButton" onClick={listTransactions}>
          List Transactions
        </button>
        <button className="waveButton" onClick={mint}>
          Mint Now
        </button>
        --------------------------------------------------
        <div>
          <font color="red">{errorLabel}</font>
        </div>
        <div>
          <font color="green">{resultLabel}</font>
        </div>
        {!presaleStatus && (
          <button className="waveButton" onClick={enablePresale}>
            Enable Presale
          </button>
        )}
        {!mintStatus && (
          <button className="waveButton" onClick={enableMinting}>
            Enable Minting
          </button>
        )}
        <button className="waveButton" onClick={publicMint}>
          Public Mint
        </button>
        <button className="waveButton" onClick={airDrop}>
          AirDrop
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        --------------------------------------------------
        <button className="waveButton" onClick={getTokenBalance}>
          Token Balance
        </button>
        <button
          className="waveButton"
          onClick={sendToken("0xE6C31a2d1FEd90adC3E7C6E528bC547D1cE89839", 10)}
        >
          Send 1 TOKEN
        </button>
        --------------------------------------------------
      </div>
    </div>
  );
};

export default App;
