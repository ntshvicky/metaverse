const hre = require("hardhat")

async function main() {
    console.log("Compiling contract")
    await hre.run('compile')

    console.log("Starting deployment")
    const Metaverse = await hre.ethers.getContractFactory("metaverse")

    const contract = await Metaverse.deploy()
    await contract.deployed()

    console.log("Deployed address: ", contract.address);
}

main().then(()=>process.exit(0)).catch((error)=> {
    console.error(error)
    process.exit(1)
})