import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const [ walletConnected, setWalletConnected ] = useState(false);
  const [ ens, setEns ] = useState("");
  const [ walletAddress, setWalletAddress ] = useState("");
  const web3modalRef = useRef();

  const setEnsOrAddress = async(address, web3Provider) => {
    const isENS = await web3Provider.lookupAddress(address);
    if(isENS) {
      setEns(isENS);
    } else {
      setWalletAddress(address);
    }
  }

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3modalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if(chainId !== 4) {
      window.alert("Change network to rinkeby.")
      throw new Error("Change network to rinkeby.")
    }
    // const signer = undefined;
    // if(needSigner) {
    const signer = await web3Provider.getSigner();
    //}
    const address = await signer.getAddress();
    await setEnsOrAddress(address, web3Provider);
    return signer;

  }

  const connectWallet = async() => {
    try {
      if(!walletConnected) {
        await getProviderOrSigner(true);
        setWalletConnected(true);
      }
    } catch(err) {
      console.error(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if(!walletConnected) {
      web3modalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : walletAddress}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  );

}