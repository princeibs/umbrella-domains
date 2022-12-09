import {
    ModalOverlay,
    Button,
    ModalHeader,
    ModalBody,
    Text,
    ModalFooter,
    ModalContent,
    Modal,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react"
import React from "react"
import {CgProfile} from "react-icons/cg"
function MyDomain() {
    const OverlayOne = () => (
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(10px) hue-rotate(90deg)'
      />
    )
  
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)
  
    return (
      <>
        <Button   
          onClick={() => {
          setOverlay(<OverlayOne />)
          onOpen()
        }} disabled={false}  leftIcon={<CgProfile/>} >My Domain</Button>        
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          {overlay}
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Custom backdrop filters!</Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default MyDomain