const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "prince";
const VERY_SHORT_NAME = "z";
const VERY_LONG_NAME = "pneumonoultramicroscopicsilicovolcanoconiosis"
const TLD = "wagmi"
const _DATA = {
    ethAddress: "0xethAddress",
    btcAddress: "bTCadDress",
    ltcAddress: "0xLtcAddress",
    bnbAddress: "0xBNBADDRESS",
    solanaAddress: "0xSoLaNaADdReSs"
}
const DATA = ["0xethAddress", "bTCadDress", "0xLtcAddress", "0xBNBADDRESS", "0xSoLaNaADdReSs"]

describe("ENS", function() {
    async function deployFixture() {
        const [deployer, acc1, acc2] = await ethers.getSigners();
        const ENS = await ethers.getContractFactory("ENS");
        const ens = await ENS.deploy();

        return {ens, deployer, acc1, acc2}
    }

    async function updateFixture() {
        const {ens, deployer, acc1, acc2} = await loadFixture(deployFixture)
        await ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})

        return {ens, deployer, acc1, acc2}
    }

    describe("constructor", function () {
        it("Should set the correct owner", async function () {
            const {ens, deployer} = await loadFixture(deployFixture);

            expect(await ens.owner()).to.equal(deployer.address);
        })
    })

    describe("setName", function () {
        it("Should revert when supplied with very short name", async function() {
            const {ens, acc1} = await loadFixture(deployFixture);            

            const actual  = ens.connect(acc1).setName(VERY_SHORT_NAME, TLD, {value: ethers.utils.parseEther('0.1')})
            await expect(actual).be.revertedWithCustomError(ens, "InvalidName").withArgs(anyValue)
        })
        it("Should revert when supplied with very long name", async function() {
            const {ens, acc1} = await loadFixture(deployFixture);            

            const actual  = ens.connect(acc1).setName(VERY_LONG_NAME, TLD, {value: ethers.utils.parseEther('0.1')})
            await expect(actual).be.revertedWithCustomError(ens, "InvalidName").withArgs(anyValue)
        })
        it("Should revert if supplied with invalid funds", async function() {
            const {ens, acc1} = await loadFixture(deployFixture);            

            const actual  = ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.001')})
            await expect(actual).be.revertedWithCustomError(ens, "InvalidFunds").withArgs(ethers.utils.parseEther('0.01'), ethers.utils.parseEther('0.001'))
        })
        it("Should revert with name already exists when supplied with a name already existing", async function() {
            const {ens, acc1} = await loadFixture(deployFixture);

            let actual  = ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})
            await expect(actual).to.not.be.reverted;

            // Try to set a name already existing
            actual = ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})
            await expect(actual).to.be.revertedWithCustomError(ens, "NameAlreadyExists");
        })
        it("Should register a name and save to storage", async function() {
            const {ens, acc1} = await loadFixture(deployFixture)
            await ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})
            
            expect(await ens.register(TLD, NAME)).to.be.equal(acc1.address)
        }) 
        it("Should add name to names array", async function() {
            const {ens} = await loadFixture(deployFixture)
            await ens.setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})

            expect(await ens.names(0)).to.be.equal(`${NAME}.${TLD}`)
        })  
        it("Should increase TLD count", async function() {
            const {ens} = await loadFixture(deployFixture)
            await ens.setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})

            expect(await ens.tldCount(TLD)).to.be.equal("1")
        })        
        it("Should emit `RegisterName` event", async function() {
            const {ens, acc1} = await loadFixture(deployFixture)
            const actual = await ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.1')})

            await expect(actual).to.emit(ens, "RegisterName").withArgs(`${NAME}.${TLD}`, acc1.address)
        })  
    })

    describe("setData", function () {
        it("Should revert when called from an unauthorized user", async function () {
            const {ens, acc2} = await loadFixture(updateFixture)

            await expect(ens.connect(acc2).setData(NAME, TLD, DATA)).to.be.revertedWithCustomError(ens, "Unauthorized")
        })
        it("Should update data correctly", async function () {
            const {ens, acc1} = await loadFixture(updateFixture)
            await ens.connect(acc1).setData(NAME, TLD, DATA);
            const data = await ens.data(`${NAME}.${TLD}`);
            
            for (let i = 0; i < data.length; i++) {
                expect(data[i]).to.equal(DATA[i])
            }
        })
        it("Should emit `updateData` event", async function () {
            const {ens, acc1} = await loadFixture(updateFixture)

            await expect(ens.connect(acc1).setData(NAME, TLD, DATA)).to.emit(ens, "UpdateData").withArgs(`${NAME}.${TLD}`)
        })
    })

    describe("withdraw", function () {
        it("Should revert if called by unauthorized user", async function () {
            const {ens, acc1} = await loadFixture(updateFixture);

            await expect(ens.connect(acc1).withdraw()).to.be.revertedWithCustomError(ens, "Unauthorized");
        })

        it("Should should transfer contract balance to owner", async function () {
            const {ens, deployer} = await loadFixture(updateFixture);
            
            await expect(await ens.connect(deployer).withdraw()).to.changeEtherBalances([ens, deployer], [ethers.BigNumber.from(ethers.utils.parseUnits("-0.1")), ethers.BigNumber.from(ethers.utils.parseUnits("0.1"))])
        })
    })
})