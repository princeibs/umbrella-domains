import React, {useState, useEffect} from 'react';
import {
  ChakraProvider,
  theme,
  Flex,
  Text,
  Button,
  Input,
  Select,
  Box,
  Link
} from '@chakra-ui/react';
import {FiHelpCircle} from "react-icons/fi"
import {FaWallet} from "react-icons/fa"
import {CgProfile} from "react-icons/cg"
import {AiOutlineFire} from "react-icons/ai"
import {GrOverview} from "react-icons/gr"

const MUMBAI_CHAIN_ID = "0x13881";

function StyledText({t}) {
  return (
    <Text
      display="inline"
      fontFamily={"Source Code Pro, monospace"}
      fontSize="20px"
      fontWeight={"700"}
      mx="10px"
      color={"white"}
      backgroundColor="gray"
      borderRadius={"8px"}
      p="3px 10px"
    >{t}</Text>
  )
}

function App() {

  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)

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

  useEffect(() => {
    checkWalletStatus();
  }, [])

  // useEffect(() => {

  // })


  return (
    <ChakraProvider theme={theme}> 
      <Flex direction={"column"} align="center" w="100vw" minH="100vh" position={"relative"}>
        <Box position="absolute" zIndex={"-10"} w="100%" h="100vh" bgColor={"springgreen"} borderTopRightRadius="0%" borderBottomRightRadius={"450%"}/>
        {MUMBAI_CHAIN_ID !== chainId && <Box w="100%" h="50px" bgColor={"orange"} textAlign="center" pt="10px">You are not connected to the right network. In order to continue, please switch to the <Link onClick={switchNetwork} display="inline" textDecor={"underline"}>right network</Link></Box>}
        {/* Navigation */}        
        
        <Flex justify="space-around" align="center" w="100%" height="120px" p="40px 40px">  
          <Flex h="100px" w="100px">
            <Text fontFamily={"Diplomata SC, cursive"} fontSize="50px">UD</Text>
          </Flex>            
          <Flex justify={"space-around"} align="center" w="700px" h="80px">
            <Button leftIcon={<CgProfile/>}>My Domain</Button>
            <Button leftIcon={<FiHelpCircle/>}>Help</Button>
            {!account && <Button leftIcon={<FaWallet/>} onClick={connectWallet}>Connect</Button>}
            {account && <Button color={"white"} backgroundColor="green" leftIcon={<FaWallet/>}>{account.slice(0, 5)}...{account.slice(-4)}</Button>}          
          </Flex>
        </Flex>

        {/* Body */}
        <Flex w="90%">      
          {/* Header */}
          <Flex direction={"column"} p="20px" w="55%" h="650px" bgColor={"white"} borderBottomRightRadius="0%" borderRadius={"20px"}>
            <Flex direction={"column"} mt="80px" w="100%" backgroundColor={"yellow"}>
              <Text fontSize={"250px"} letterSpacing="-15px" fontFamily="'La Belle Aurore', cursive" backgroundColor={"orange"} lineHeight="70px">Umbrella</Text>            
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
          <Flex w="50%" align={"center"} justify="center" direction={"column"}>
            <Flex direction={"column"}>
              <Text fontSize={"25px"} mb="10px">Search or create domain names here</Text>
              <Flex>
                <Input size="lg" w={"350px"} fontWeight="600" letterSpacing={"3px"} fontSize={"20px"} />                
                <Select size="lg" width={"150px"} fontWeight="700">
                  <option value='option1'>.eth</option>
                  <option value='option2'>.crypto</option>
                  <option value='option3'>.nft</option>
                  <option value='option1'>.gm</option>
                  <option value='option2'>.wagmi</option>
                  <option value='option3'>.umbrella</option>
                </Select>
              </Flex>   
              <Text color={"green"}>Available</Text>
              {/* <Text color={"red"}>Unavailable</Text>            */}
            </Flex>
            <Button leftIcon={<AiOutlineFire/>} mt={"40px"} w="250px" h="60px" fontSize={"20px"}>Mint</Button>           
            <Button leftIcon={<GrOverview/>} mt={"40px"} w="250px" h="60px" fontSize={"20px"}>View</Button> 
          </Flex>
        </Flex>

      </Flex>
    </ChakraProvider>
  );
}

export default App;
