import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

import Dappazon from "./constants/Dappazon.json";
import config from "./constants/networkMapping.json";
function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [dappazon, setDappazon] = useState(null);
  const [electronice, setElectronics] = useState(null);
  const [toys, setToys] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);
  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };
  const loadBlockchainData = async () => {
    //connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    let network = await provider.getNetwork();
    network = network.chainId;
    const address = config[network.toString()]["dappazon"][0];
    //connect to smart contracts(JS version)
    const contract = new ethers.Contract(address, Dappazon, provider);
    console.log(contract);
    setDappazon(contract);

    // load products
    const items = [];
    for (let i = 0; i < 9; i++) {
      const item = await contract.items(i + 1);
      items.push(item);
    }
    const electronice = items.filter((item) => item.category == "electronics");
    const clothing = items.filter((item) => item.category == "clothing");
    const toys = items.filter((item) => item.category == "toys");
    setClothing(clothing);
    setElectronics(electronice);
    setToys(toys);
  };
  useEffect(() => {
    loadBlockchainData();
  }, []);
  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Dappazon Best Sellers</h2>
      {electronice && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronice}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}
      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          dappazon={dappazon}
          togglePop={togglePop}
        />
      )}
    </>
  );
}

export default App;
