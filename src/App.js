import React from 'react';
import {
  ChakraProvider,
  theme,
  Flex,
  Text,
  Button,
  Input,
  Select,
  Box
} from '@chakra-ui/react';
import {FiHelpCircle} from "react-icons/fi"
import {FaWallet} from "react-icons/fa"
import {CgProfile} from "react-icons/cg"
import {AiOutlineFire} from "react-icons/ai"
import {GrOverview} from "react-icons/gr"

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
  return (
    <ChakraProvider theme={theme}> 
      <Flex direction={"column"} align="center" w="100vw" minH="100vh" position={"relative"}>
        <Box position="absolute" zIndex={"-10"} w="100vw" h="100vh" bgColor={"springgreen"} borderTopRightRadius="0%" borderBottomRightRadius={"450%"}/>
        {/* Navigation */}
        <Flex justify="space-around" align="center" w="100vw" height="120px" p="40px 40px">  
          <Flex h="100px" w="100px">
            <Text fontFamily={"Diplomata SC, cursive"} fontSize="50px">UD</Text>
          </Flex>            
          <Flex justify={"space-around"} align="center" w="700px" h="80px">
            <Button leftIcon={<CgProfile/>}>My Domain</Button>
            <Button leftIcon={<FiHelpCircle/>}>Help</Button>
            <Button leftIcon={<FaWallet/>}>Wallet</Button>
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
