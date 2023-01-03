import abi from "./abi/abi.json" assert { type: "json" };


const SMART_CONTRACT = "0x69F6C92397dCf2dcB9A39872Ed419a65AEFFab56";

const blockchain = new Promise((res, rej)=> {
    // check if metamask is available
    if(typeof window.ethereum == "undefined") {
        rej("You should install Metamask to use it!");
    }

    //create web3 instance
    let web3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(abi, SMART_CONTRACT);


    web3.eth.requestAccounts().then((account)=> {

        //get my metamask address
        console.log("-> My account is: ", account);
        //get the current supply from contract
        contract.methods.totalSupply().call({from: account[0]}).then((supply)=> {
            console.log("-> Current supply of NFT token is: ", supply);
        });

        //get max supply
        contract.methods.MAX_SUPPLY().call({from: account[0]}).then((max_supply)=> {
            console.log("-> Max supply of NFT token is: ", max_supply);
        });

        //get your building made in metaverse
        contract.methods.getOwnerBuildings().call({from: account[0]}).then((buildings)=> {
            console.log("-> List of Building Owned by you: ", buildings);
        });
        
        //get all building made in metaverse
        contract.methods.totalSupply().call({from: account[0]}).then((supply)=> {
            contract.methods.getBuildings().call({from: account[0]}).then((data)=> {
                res({supply: supply, building: data})
            });
        });
    });

});

export default blockchain;