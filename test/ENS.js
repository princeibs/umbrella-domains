const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const NAME = "prince";
const VERY_SHORT_NAME = "z";
const VERY_LONG_NAME = "pneumonoultramicroscopicsilicovolcanoconiosis"
const TLD = "wagmi"

describe("ENS", function() {
    async function deployFixture() {
        const [deployer, acc1, acc2] = await ethers.getSigners();
        const ENS = await ethers.getContractFactory("ENS");
        const ens = await ENS.deploy();

        return {ens, deployer, acc1, acc2}
    }

    describe("Constructor", function () {
        it("Should set the correct owner", async function () {
            const {ens, deployer} = await loadFixture(deployFixture);

            expect(await ens.owner()).to.equal(deployer.address);
        })
    })

    describe("SetName", function () {
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

            const actual  = ens.connect(acc1).setName(NAME, TLD, {value: ethers.utils.parseEther('0.01')})
            await expect(actual).be.revertedWithCustomError(ens, "InvalidFunds").withArgs(ethers.utils.parseEther('0.1'), ethers.utils.parseEther('0.01'))
        })
        
    })
})