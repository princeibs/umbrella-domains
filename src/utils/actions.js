import { ethers } from "ethers";

export const set = async (contract, name, tld) => {
    if (!name || !tld || !contract) {
        alert("Either one of name, tld, or contract is invalid")
        return;
    }
    if (name.length < 2) {
        alert("name length must be greater than length of 2")
        return;
    }
    const cost = name.length === 2? '.1': name.length === 3? '0.05' : name.length === 4? '0.03': '0.01'
    try {
        let tx = await contract.setName(name, tld, {value: ethers.utils.parseEther(cost) })
        tx = await tx.wait()
        return tx;
    } catch(e) {
        console.log(e)
    }    
}

