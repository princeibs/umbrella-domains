export const checkWalletStatus = async () => {
    let account, chainID;
    const {ethereum} = window;    
    if (!ethereum) {
      console.log("Metamask not installed")
      return;
    }
    
    const accounts = await ethereum.request({method: "eth_accounts"});
    if (accounts.length !== 0) account = accounts[0]

    const chainId = await ethereum.request({method: "eth_chainId"});
    chainID = chainId
    
    ethereum.on('chainChanged', handleChainChange);

    function handleChainChange(_chainId) {
        window.location.reload()
      }
    
    return {account, chainID}
  }