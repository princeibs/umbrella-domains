import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import {
  ChakraProvider,
  theme,
  Flex,
  Text,
  Button,
  Box,
  Link,
  Input,
  Select,
  useToast,
  Image
} from '@chakra-ui/react';
import {FaWallet} from "react-icons/fa"
import {AiOutlineFire} from "react-icons/ai"
import {GrOverview} from "react-icons/gr"

import { set, update } from './utils/actions';
import ADDRESS from "./contracts/ENS-address.json";
import ABI from "./contracts/ENS.json";
import HelpModal from './components/HelpModal';
import ViewModal from './components/ViewModal';
import logo from "./asset/logo_w_name.png"


const MUMBAI_CHAIN_ID = "0x13881";

function StyledText({t}) {
  return (
    <Text
      display="inline"
      fontFamily={"Source Code Pro, monospace"}
      fontSize="20px"
      fontWeight={"700"}
      mx="10px"
      color={"black"}
      backgroundColor="gray.200"
      borderRadius={"8px"}
      p="3px 10px"
    >{t}</Text>
  )
}

function App() {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [domain, setDomain] = useState("")
  const [tld, setTld] = useState("eth")
  const [names, setNames] = useState([])
  const [nameAvailable, setNameAvailable] = useState(false)  
  const [loading, setLoading] = useState(false)  

  const toast = useToast();

  function showToast(message, status, duration=5000) {
    toast({
      position: "top-right",
      duration: duration,
      render: () => (
        <Box bgColor={status==="success"?"green.700": status==="error"? "red.300": "orange"} color="white" p="10px" borderRadius={"5px"} fontWeight="600" borderColor={"orange"} borderWidth="2px" minHeight={"70px"} w="350px">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: message }}
        />
        </Box>
      )
    });
  }

  // Switch Metamask wallet to Mumbai testnet
  const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				await window.ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{chainId: "0x13881"}]
				})
			} catch(e) {
				if (e.code === 4902) {
					try {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x13881",
									chainName: "Polygon Mumbai Testnet",
									rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
									nativeCurrency: {
										name: "Mumbai Matic",
										symbol: "MATIC",
										decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com"]
								},
							],
						});
					} catch(e) {
						console.log(e)
					}
				}
				console.log(e)
			}
		} else {
			alert("Metamask not installed");
		}
	}

  // Connect Metamask to dapp
  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        alert("Please install Metamask wallet")
        return;        
      } else {
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        setAccount(accounts[0]);        
      }
    } catch(e) {
      console.log(e)
    }
  }

  // Check if Metamask is already connected and set as account
  const checkWalletStatus = async () => {
    const {ethereum} = window;
    if (!ethereum) {
      console.log("Metamask not installed")
      return;
    } else {
      const accounts = await ethereum.request({method: "eth_accounts"});
      if (accounts.length !== 0) setAccount(accounts[0])

      const chainId = await ethereum.request({method: "eth_chainId"});
      setChainId(chainId)
      
      ethereum.on('chainChanged', handleChainChange);

      function handleChainChange(_chainId) {
        window.location.reload()
      }
    }
  }

  // Mint domain name
  const mintName = async () => {
    const {ethereum} = window;
    if (ethereum) {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ADDRESS.ENS, ABI.abi, signer);            
      const tx = await set(contract, domain, tld, account);
      if (tx?.status === 1){ 
        showToast("Clear the search box and re-enter your domain name again to view it", "warning", 15000)
        showToast(`Successfully claimed '${domain}.${tld}' on the blockchain`, "success")
      } else if (tx?.data?.code === -32000) {
        showToast("An error has occured. Please make sure you have enough funds in your wallet before proceeding", "error")
        setLoading(false)
        return
      } else {
        showToast("An error has occured. Please ensure that <br/><br/>1. The name you are claiming is available. <br/>2. You have enough funds to mint the name. <br/>3. You are on the right network. <br/>4. You did not reject the transaction from Metamask <br/><br/>Otherwise try again letter. There might be a conjestion on the network at the moment.", "error", 15000);
        setLoading(false)
        return;
      }

      setTimeout(async () => {
        await loadNames();
        nameStatus()
      }, 3000);       
      // console.log("tx: ", tx)
      setLoading(false)      
    }    
  }

  // Update domain name data
  const updateData = async (data) => {
    const {ethereum} = window;
    if (ethereum) {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ADDRESS.ENS, ABI.abi, signer);            
      const tx = await update(contract, domain, tld, data);    
      // console.log("tx: ", tx) 
      setLoading(false)
    } 
  }

  // Fetch all minted names from blockchain
  const loadNames = async () => {
    const {ethereum} = window;
    if (ethereum) {      
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ADDRESS.ENS, ABI.abi, signer);      
      const tx = await contract.getNames();
      // console.log("names: ", tx)
      setNames(tx)
    } 
  }

  // Fetch domain name data
  // name + tld = domainName
  const getDomain = async (domainName) => {
    const {ethereum} = window;
    if (ethereum) {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ADDRESS.ENS, ABI.abi, signer);      
      const data = await contract.data(domainName);
      const tokenUri = await contract.getTokenUri(domainName);
      const domainId = await contract.nameToIds(domainName);

      setLoading(false)    
      // showToast("Fetch details successful", "success")  
      return {data, tokenUri, domainId};
    } 
  }

  // Check wallet address domain name belongs to
  const domainOwner = async (name, tld) => {
    const {ethereum} = window;
    if (ethereum) {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ADDRESS.ENS, ABI.abi, signer);      
      const tx = await contract.register(tld, name); 

      setLoading(false)
      return tx;
    }
  }

  // Confirm if domain name is still available
  const nameStatus = () => {
    const domainName = domain + "." + tld;    
    if (names.includes(domainName)) {
      setNameAvailable(false)
    } else {
      setNameAvailable(true)
    }
  }

  useEffect(() => {     
    checkWalletStatus(); 
  }, [])

  useEffect(() => {
    if (account && chainId === MUMBAI_CHAIN_ID) {
      loadNames()
    }
  }, [account, chainId])

  useEffect(() => {
    nameStatus();
  }, [domain, tld]);


  return (
    <ChakraProvider theme={theme}> 
      {/* Wrong network warning */}
      <Flex direction={"column"} align="center" w="100vw" minH="100vh" position={"relative"}>
        <Box position="absolute" zIndex={"-10"} w="100%" h="100vh" bgColor={"springgreen"} borderTopRightRadius="0%" borderBottomRightRadius={"450%"}/>
        {MUMBAI_CHAIN_ID !== chainId && <Box w="100%" h="50px" bgColor={"orange"} textAlign="center" pt="10px">You are not connected to the right network. In order to continue, please switch to the <Link onClick={switchNetwork} display="inline" textDecor={"underline"}>right network</Link></Box>}
        {/* Navigation */}          
        <Flex justify="space-around" align="center" w="100%" height="120px" p="40px 40px">  
          <Flex h="100px">
            <Image src={logo} borderRadius="15px"/>
          </Flex>            
          <Flex justify={"flex-end"} gap="50px" align="center" w="700px" h="80px">            
            {/* <MyDomain /> */}
            <HelpModal/>
            {!account && <Button leftIcon={<FaWallet/>} onClick={connectWallet}>Connect</Button>}
            {account && <Button color={"white"} backgroundColor="green" leftIcon={<FaWallet/>}>{account.slice(0, 5)}...{account.slice(-4)}</Button>}          
          </Flex>
        </Flex>

        {/* Body */}
        <Flex w="90%">      
          {/* Header */}
          <Flex direction={"column"} p="20px" w="55%" h="650px" bgColor={"white"} borderBottomRightRadius="0%" borderRadius={"20px"}>
            <Flex direction={"column"} mt="80px" w="100%" backgroundColor={"yellow"}>
              <Text fontSize={"180px"} letterSpacing="-15px" backgroundColor={"orange"} lineHeight="70px">Umbrella</Text>            
              <Text textAlign={"right"} fontSize="40px" backgroundColor={"gray"} color="white" lineHeight="40px">domains</Text>
            </Flex>
            <Text fontSize={"30px"} mt="60px" textAlign={"center"}>
              Mint a 
              <StyledText t=".eth"/> <StyledText t=".crypto"/><StyledText t=".nft"/><StyledText t=".wagmi"/><StyledText t=".gm"/> 
              and other awesome name services on the blockchain and own it forever
            </Text>   
            <Text textAlign={"center"} fontSize={"25px"} mt="30px">No renewal fees!</Text>         
            <Text textAlign={"center"} fontSize="25px">Forever yours!</Text>
          </Flex>
          {account ? <Flex w="50%" align={"center"} justify="center" direction={"column"}>
            {/* <InputArea/> */}
            <Flex direction={"column"}>
              <Text fontSize={"25px"} mb="10px">Search or create domain names here</Text>
              <Flex>
                  <Input onChange={e => setDomain(e.target.value)} size="lg" w={"350px"} fontWeight="600" letterSpacing={"3px"} fontSize={"20px"} />                
                  <Select onChange={e => setTld(e.target.value)} size="lg" width={"150px"} fontWeight="700">
                      <option value='eth'>.eth</option>
                      <option value='crypto'>.crypto</option>
                      <option value='nft'>.nft</option>
                      <option value='gm'>.gm</option>
                      <option value='wagmi'>.wagmi</option>
                      <option value='umbrella'>.umbrella</option>
                  </Select>
              </Flex>   
              {(nameAvailable && domain.length > 1) && <Text color={"green"} mt="5px">
                <Text color={'green'} bgColor="gray.300" borderRadius="5px" mr={"5px"} fontFamily={"Source Code Pro, monospace"} p="1px 5px" display="inline">{domain+"."+tld}</Text>
                is available</Text>}
              {(!nameAvailable && domain.length > 1) && <Text color={"red"} mt="5px">
              <Text color={'red'} bgColor="gray.300" borderRadius="5px" mr={"5px"} fontFamily={"Source Code Pro, monospace"} p="1px 5px" display="inline">{domain+"."+tld}</Text>
              is already taken</Text>}    
              {(nameAvailable && domain.length > 1) && <Text color="yellow.800">Cost: {" "}
                <Text display={"inline"} fontFamily={"Source Code Pro, monospace"}>{domain.length === 2? "0.1" : domain.length === 3? "0.05" : domain.length === 4? "0.03" : "0.01"} MATIC</Text>
              </Text>}                       
            </Flex>
            {nameAvailable && <Button isLoading={loading} loadingText="Minting domain ..." disabled={domain.length<2 || loading} leftIcon={<AiOutlineFire/>} mt={"40px"} w="250px" h="60px" fontSize={"20px"} onClick={mintName}>Mint</Button>}
            {!nameAvailable && <ViewModal domain={domain} tld={tld} text="view" icon={<GrOverview/>} getDomain={getDomain} updateData={updateData} loading={loading} domainOwner={domainOwner} account={account} toast={showToast}/>}            
          </Flex>: 
          <Flex w="50%" align={"center"} justify="center">Please connect wallet to continue</Flex>}          
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
