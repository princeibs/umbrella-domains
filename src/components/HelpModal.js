import {
    ModalOverlay,
    Button,
    ModalHeader,
    ModalBody,    
    ModalFooter,
    ModalContent,
    Modal,
    ModalCloseButton,
    useDisclosure,
    Link,    
} from "@chakra-ui/react"
import React from "react"
import {FiHelpCircle} from "react-icons/fi"

function HelpModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const btnRef = React.useRef(null)
    return (
      <>          
        <Button ref={btnRef} onClick={onOpen} leftIcon={<FiHelpCircle/>}>Help</Button>        
  
        <Modal
          onClose={onClose}
          finalFocusRef={btnRef}
          isOpen={isOpen}
          scrollBehavior={"inside"}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Help</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Please visit <Link href="https://github.com/princeibs/umbrella-domains">https://github.com/princeibs/umbrella-domains</Link> to learn more about this app
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  export default HelpModal