import {
    ModalOverlay,
    Button,
    ModalHeader,
    ModalBody,
    Text,
    ModalFooter,
    ModalContent,
    Modal,    
    useDisclosure,
    Flex,
    Image,
    Input,
    Spinner
} from "@chakra-ui/react"
import React, {useState} from "react"
import {GrEdit} from "react-icons/gr"
import axios from "axios"

const OverlayOne = () => (
  <ModalOverlay
    // bg='blackAlpha.100'
    backdropFilter='blur(10px)'
  />
)

function ViewModal({domain, tld, text, icon, loading, getDomain, updateData, domainOwner, account, toast}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)
    const [data, setData] = useState(null) // 
    const [bufferData, setBufferData] = useState(null) // data state while editing
    const [rejectData, setRejectData] = useState({}) // restore data back when operation is canceled
    const [isOwner, setIsOwner] = useState(false)
    const [tokenData, setTokenData] = useState(null)

    const [editing, setEditing] = useState(false)
    const [editingBtc, setEditingBtc] = useState(false)
    const [editingBnb, setEditingBnb] = useState(false)
    const [editingLtc, setEditingLtc] = useState(false)
    const [editingSol, setEditingSol] = useState(false)

    const structureData = (data) => {
      if (data) return {
        ethAddress: data.ethAddress,
        btcAddress: data.btcAddress,
        bnbAddress: data.bnbAddress,
        ltcAddress: data.ltcAddress,
        solanaAddress: data.solanaAddress
      }
    }

    const fetchMetadata = async (uri) => {
      try {
        const metadata = await axios.get(uri)
        return metadata;
      } catch(e) {console.log(e)}
    }

    const handleEditData = (key, e) => {
      setBufferData({ 
        ...data,
        [key]: e.target.value        
      })
    }
  
    return (
      <>
        <Button   
          onClick={async () => {
          const {data: ddata, tokenUri} = await getDomain(`${domain}.${tld}`)   
          const sdata = structureData(ddata);              
          const owner = await domainOwner(domain, tld)
          const _isOwner = owner.toLowerCase() === account.toLowerCase()
          const metadata = await fetchMetadata(tokenUri)
          setTokenData(metadata);        
          setData(sdata);
          setRejectData(sdata)
          setIsOwner(_isOwner);
          setOverlay(<OverlayOne />)          
          onOpen()
        }} isLoading={loading} loadingText="Fetching Domain" disabled={domain.length<2}  leftIcon={icon} mt={"40px"} w="250px" h="60px" fontSize={"20px"}>{text}</Button>        
        <Modal size={"xl"} isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!loading} >
          {overlay}
          <ModalContent>
            <ModalHeader textAlign={"center"} fontSize="40px">{`${domain}.${tld}`}</ModalHeader> 
                       
            {data !== null && !loading ? 
            <ModalBody>                
              <Flex my="25px" direction={"column"} align="center">
                <Image src={tokenData.data.image} height={"300px"} width="300px" borderRadius={"10px"}/>
                <Text mt="10px" fontSize={"15px"} fontWeight="700">{tokenData.data.description}</Text>
              </Flex>

              {/* ETH Address field */}
              <Flex m="15px 0" align={"center"}>
                <Text fontSize={"16px"} fontWeight="700" opacity={".6"}>ETH:</Text>
                {!editing && <Text letterSpacing={"1px"} fontWeight={"700"} fontFamily={"Source Code Pro, monospace"} mx="15px">{data.ethAddress? data.ethAddress : "Not set"}</Text>}
                {editing && <Input autoFocus onChange={e => handleEditData("ethAddress", e)} w={"450px"} ml="10px" fontFamily={"Source Code Pro, monospace"} height="35px"/>}
                {(!editing && isOwner) && <GrEdit onClick={() => setEditing(true)} fontSize={"16px"} cursor="pointer"/>}
                {editing && <Button mx={"4px"} height="35px" disabled={!bufferData?.ethAddress?.length} onClick={async () => {
                  setEditing(false);
                  setRejectData(bufferData)
                  setData(bufferData)
                  await updateData(Object.values(bufferData))
                  toast("Successfully updated Ethereum (ETH) address", "success")}}>Save</Button>}
                {editing && <Button height="35px" onClick={() => {setEditing(false); setData(rejectData); setBufferData(null)}}>Cancel</Button>}
              </Flex>   

              {/* BTC Address field */}
              <Flex m="15px 0" align={"center"}>
                <Text fontSize={"16px"} fontWeight="700" opacity={".6"}>BTC:</Text>
                {!editingBtc && <Text letterSpacing={"1px"} fontWeight={"700"} fontFamily={"Source Code Pro, monospace"} mx="15px">{data.btcAddress? data.btcAddress : "Not set"}</Text>}
                {editingBtc && <Input autoFocus onChange={e => handleEditData("btcAddress", e)} w={"450px"} ml="10px" fontFamily={"Source Code Pro, monospace"} height="35px"/>}
                {(!editingBtc && isOwner) && <GrEdit onClick={() => setEditingBtc(true)} fontSize={"16px"} cursor="pointer"/>}
                {editingBtc && <Button mx={"4px"} height="35px" disabled={!bufferData?.btcAddress?.length} onClick={async () => {
                  setEditingBtc(false);
                  setRejectData(bufferData)
                  setData(bufferData)
                  await updateData(Object.values(bufferData))
                  toast("Successfully updated Bitcoin (BTC) address", "success")}}>Save</Button>}
                {editingBtc && <Button height="35px" onClick={() => {setEditingBtc(false); setData(rejectData); setBufferData(null)}}>Cancel</Button>}
              </Flex>    

              {/* BNB Address field */}
              <Flex m="15px 0" align={"center"}>
                <Text fontSize={"16px"} fontWeight="700" opacity={".6"}>BNB:</Text>
                {!editingBnb && <Text letterSpacing={"1px"} fontWeight={"700"} fontFamily={"Source Code Pro, monospace"} mx="15px">{data.bnbAddress? data.bnbAddress : "Not set"}</Text>}
                {editingBnb && <Input autoFocus onChange={e => handleEditData("bnbAddress", e)} w={"450px"} ml="10px" fontFamily={"Source Code Pro, monospace"} height="35px"/>}
                {(!editingBnb && isOwner) && <GrEdit onClick={() => setEditingBnb(true)} fontSize={"16px"} cursor="pointer"/>}
                {editingBnb && <Button mx={"4px"} height="35px" disabled={!bufferData?.bnbAddress?.length} onClick={async () => {
                  setEditingBnb(false);
                  setRejectData(bufferData)
                  setData(bufferData)
                  await updateData(Object.values(bufferData))
                  toast("Successfully updated BNB address", "success")}}>Save</Button>}
                {editingBnb && <Button height="35px" onClick={() => {setEditingBnb(false); setData(rejectData); setBufferData(null)}}>Cancel</Button>}
              </Flex> 

              {/* LTC Address field */}
              <Flex m="15px 0" align={"center"}>
                <Text fontSize={"16px"} fontWeight="700" opacity={".6"}>LTC:</Text>
                {!editingLtc && <Text letterSpacing={"1px"} fontWeight={"700"} fontFamily={"Source Code Pro, monospace"} mx="15px">{data.ltcAddress? data.ltcAddress : "Not set"}</Text>}
                {editingLtc && <Input autoFocus onChange={e => handleEditData("ltcAddress", e)} w={"450px"} ml="10px" fontFamily={"Source Code Pro, monospace"} height="35px"/>}
                {(!editingLtc && isOwner) && <GrEdit onClick={() => setEditingLtc(true)} fontSize={"16px"} cursor="pointer"/>}
                {editingLtc && <Button mx={"4px"} height="35px" disabled={!bufferData?.ltcAddress?.length} onClick={async () => {
                  setEditingLtc(false);
                  setRejectData(bufferData)
                  setData(bufferData)
                  await updateData(Object.values(bufferData))
                  toast("Successfully updated Litecoin (LTC) address", "success")}}>Save</Button>}
                {editingLtc && <Button height="35px" onClick={() => {setEditingLtc(false); setData(rejectData); setBufferData(null)}}>Cancel</Button>}
              </Flex>  

              {/* SOL Address field */}
              <Flex m="15px 0" align={"center"}>
                <Text fontSize={"16px"} fontWeight="700" opacity={".6"}>SOL:</Text>
                {!editingSol && <Text letterSpacing={"1px"} fontWeight={"700"} fontFamily={"Source Code Pro, monospace"} mx="15px">{data.solanaAddress? data.solanaAddress : "Not set"}</Text>}
                {editingSol && <Input autoFocus onChange={e => handleEditData("solanaAddress", e)} w={"450px"} ml="10px" fontFamily={"Source Code Pro, monospace"} height="35px"/>}
                {(!editingSol && isOwner) && <GrEdit onClick={() => setEditingSol(true)} fontSize={"16px"} cursor="pointer"/>}
                {editingSol && <Button mx={"4px"} height="35px" disabled={!bufferData?.solanaAddress?.length} onClick={async () => {
                  setEditingSol(false);
                  setRejectData(bufferData)
                  setData(bufferData)
                  await updateData(Object.values(bufferData))
                  toast("Successfully updated Solana (SOL) address", "success")}}>Save</Button>}
                {editingSol && <Button height="35px" onClick={() => {setEditingSol(false); setData(rejectData); setBufferData(null)}}>Cancel</Button>}
              </Flex>         

            </ModalBody> : 
            <Flex h="400px" direction={"column"} align={"center"}>
              <Spinner size={"xl"} w="2px" h="80px" speed=".5s" color="orange" thickness="80px"/>
              <Text mt='50px' fontWeight={"600"}>Updating data...</Text>
              <Text mt='50px' fontWeight={"600"}>Please check your wallet</Text>
            </Flex>}
            <ModalFooter>
              <Button disabled={loading} onClick={() => {
                onClose(); 
                setEditing(false)
                setEditingBtc(false)
                setEditingBnb(false)
                setEditingLtc(false)
                setEditingSol(false)
                  }}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default ViewModal