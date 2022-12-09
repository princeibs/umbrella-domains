import { ethers } from "ethers";

export const set = async (contract, name, tld, account) => {
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
        let tx = await contract.setName(name, tld, account, {value: ethers.utils.parseEther(cost) })
        tx = await tx.wait()
        return tx;
    } catch(e) {
        console.log(e)
    }    
}


export const update = async (contract, domain, tld, data) => {
    try {
        let tx = await contract.setData(domain, tld, data)
        tx = tx.wait();
        return tx;
    } catch (e) {
        console.log(e)
    }

}
