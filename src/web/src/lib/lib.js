import { ethers } from "ethers";
import Decimal from 'decimal.js';

const output = require("../../../DelegatedMiner.json");
const DELEGATED_MINER_ABI = output.abi;
const DELEGATED_MINER_BYTECODE = output.bytecode;
let provider = "";

const AIUS_MAINNET = '0x8AFE4055Ebc86Bd2AFB3940c0095C9aca511d852';
const AIUS_TESTNET = '0x68903B30e75e7a49134E91ABC19Bfb170643a659';

const ArbiusEngine_Testnet = '0xab5E383A89ec907Bca01618352376C3C451d7012';
const ArbiusEngine_Mainnet = '0x3BF6050327Fa280Ee1B5F3e8Fd5EA2EfE8A6472a';
const ARBITRUM_NOVA_CHAIN_ID = '42170';
const ARBITRUM_TEST_CHAIN_ID = '';

async function getConnectedNetworkId(toggle=false){
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Create an ethers provider from the injected window.ethereum
                provider = new ethers.BrowserProvider(window.ethereum);

                // Request account access
                await provider.send('eth_requestAccounts', []);

                // Get the chain ID
                const chainId = await provider.getNetwork().then(network => network.chainId);
                console.log(String(String(chainId)===ARBITRUM_NOVA_CHAIN_ID))
                if (String(chainId) === ARBITRUM_NOVA_CHAIN_ID || String(chainId) === ARBITRUM_TEST_CHAIN_ID) {
                        if (toggle){
                                console.log(chainId)
                                toggle=true
                                return chainId
                        }
                        else{
                                return chainId;
                                toggle=false
                        }
                } else {
                    // Get the first account
                    const accounts = await provider.listAccounts();
                    const account = accounts[0];
                    return false;
                }
            } catch (error) {
                alert(error);
            }
        } else {
            alert("Metamask not installed");
        }

        ///////////////////////////////////////////
}

async function getConnectedNetwork() {
        let chainId = await getConnectedNetworkId();
        if(!chainId){
                return
        }
}

async function checkConnected() {
        const signer = await provider.getSigner();
        if (signer){

                walletAddr.innerHTML = await compactAddress(await signer.getAddress());
                connectWallet.setAttribute('disabled','disabled');
                connectWallet.innerHTML = 'Connected';
                accountDisplay.style.visibility = "visible";

                chainId = await getConnectedNetworkId();
                chainId = ARBITRUM_NOVA_CHAIN_ID;
        }
}

function compactNumber(inputNum, maxDecimals = 18){
        return Intl.NumberFormat('en-US', {
                notation: "compact",
                maximumFractionDigits: maxDecimals
        }).format(inputNum.toString());
}

function compactAddress(addr){
        const firstFour = addr.substring(0, 6);
        const lastFour = addr.substring(addr.length - 4);
        var etherscanUrl = "https://nova.arbiscan.io/address/"
        return '<span class="chip"><a href="' + etherscanUrl + addr + '" target="_blank">' + firstFour + "..." + lastFour + " <span class='material-icons' style='vertical-align: bottom;'>" +
                        'link</span></a></span>';
}

let isLookingUpMiner = false;
export const lookupMiner = async(miner) => {
        console.log("Lookup miner: "+ isLookingUpMiner.toString());
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const chainId=await getConnectedNetworkId()
        console.log(chainId)
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
        const abi = [{
                "inputs": [],
                "name": "miner",
                "outputs": [
                        {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [],
                "name": "arbius",
                "outputs": [
                        {
                                "internalType": "contract IArbius",
                                "name": "",
                                "type": "address"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [],
                "name": "baseToken",
                "outputs": [
                        {
                                "internalType": "contract IBaseToken",
                                "name": "",
                                "type": "address"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [
                        {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                        }
                ],
                "name": "depositOf",
                "outputs": [
                        {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [],
                "name": "totalDeposited",
                "outputs": [
                        {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [],
                "name": "rewardShareDivisor",
                "outputs": [
                        {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [{"internalType": "address","name": "","type": "address"}],
                "name": "userPendingWithdrawCount",
                "outputs": [
                        {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        },{
                "inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "uint256","name": "","type": "uint256"}],
                "name": "pendingWithdraws",
                "outputs": [
                        {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                        }
                ],
                "stateMutability": "view",
                "type": "function"
        }];
        const MinerContract = new ethers.Contract(miner, abi, signer);
        try{
        var miner = await MinerContract.miner();
        var arbius = await MinerContract.arbius();
        var baseToken = await MinerContract.baseToken();
        var depositOfCaller = await MinerContract.depositOf(await signer.getAddress());
        var totalDeposited = await MinerContract.totalDeposited();
        var rewardShareDivisor = await MinerContract.rewardShareDivisor();
        var userPendingWithdrawCount = await MinerContract.userPendingWithdrawCount(await signer.getAddress());
        var hasPendingWithdraw = false;
        let outPutObject={}
        if (userPendingWithdrawCount > 0){
                hasPendingWithdraw = await MinerContract.pendingWithdraws(await signer.getAddress(), userPendingWithdrawCount);
        }
        outPutObject["minerWallet"]=miner
        var engineVerifiedBadge = "";
        if (arbius.toLowerCase() == ArbiusEngine_Testnet.toLowerCase()){
          outPutObject["arbiusEngine"]="Testnet"
        }else if (arbius.toLowerCase() == ArbiusEngine_Mainnet.toLowerCase()){
          outPutObject["arbiusEngine"]="Mainnet"
        }else{
          engineVerifiedBadge = "<span class='badge new red'>Unverified</span>";
          outPutObject["arbiusEngine"]="Unverified"
        }
        outPutObject["arbiusAddress"]=arbius
        var aiusTokenVerifiedBadge = "";

        if (baseToken.toLowerCase() == AIUS_TESTNET.toLowerCase()){
           outPutObject["arbiusToken"]="Testnet"
        }else if (baseToken.toLowerCase() == AIUS_MAINNET.toLowerCase()){
           outPutObject["arbiusToken"]="Mainnet"
        }else{
           outPutObject["arbiusToken"]="Unverified"
        }
        outPutObject["arbiusTokenAddress"]=baseToken
        outPutObject["hasPendingWithdraw"]=hasPendingWithdraw
        outPutObject["depositCaller"]=false
        if (hasPendingWithdraw){
          var pendingWithdraw = await pendingValidatorWithdrawRequests(minerAddr.value, userPendingWithdrawCount);
          console.log("Pending withdraw info:", pendingWithdraw);
                outPutObject["pendingText"]=" [pending withdrawal of " +Number(pendingWithdraw[1])/(10**18) + " AIUS] " + Number(depositOfCaller) / (10**18) + " AIUS"
                outPutObject["withDrawlFunds"]= Number(depositOfCaller) / (10**18) + " AIUS"
        }else{
        const operation = Number(depositOfCaller) / (10**18);
        outPutObject["pendingText"] = `${operation} AIUS`;
        }
        if(depositOfCaller > 0){
                outPutObject["depositCaller"]=true
        }

        if(hasPendingWithdraw){
                outPutObject["hasPendingWithdraw"]=true
        }
        if (hasPendingWithdraw){
        }else{
          if(depositOfCaller>0){
         }
        }
        outPutObject["totalStaked"]=`${Number(totalDeposited) / (10**18)} AIUS`
        outPutObject["reward"]=`${(100 / Number(rewardShareDivisor))}%`
        return outPutObject
}
catch(err){
        throw err
}
}

async function pendingValidatorWithdrawRequests(miner, count){
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        abi = [{
                "inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "uint256","name": "","type": "uint256"}],
                "name": "pendingValidatorWithdrawRequests",
                "outputs": [{"internalType": "uint256","name": "","type": "uint256"},{"internalType": "uint256","name": "","type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
        }];

        var testnetSwitch = document.getElementById('testnetSwitch');
        var ArbiusEngineContract = undefined;
        if(testnetSwitch.checked){
                ArbiusEngineContract = new ethers.Contract(ArbiusEngine_Testnet, abi, signer);
        }else{
                ArbiusEngineContract = new ethers.Contract(ArbiusEngine_Mainnet, abi, signer);
        }
        try{
                results = await ArbiusEngineContract.pendingValidatorWithdrawRequests(miner, count);
                return results;
        }catch(err){
                console.log("Error in pendingValidatorWithdrawRequests()", err);
        }
}

export const initiateWithdraw=async(miner)=>{
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const chainId=await getConnectedNetworkId()
        let outPutObject={}
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
       const abi = [{
                "inputs": [],
                "name": "initiateWithdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
        }];

        const MinerContract = new ethers.Contract(miner, abi, signer);
        try{
            var unstakeTx = await MinerContract.initiateWithdraw();
            console.log(unstakeTx);
            var receipt = await unstakeTx.wait();
            console.log(receipt);
            console.log("initiateWithdraw Transaction successful:", receipt);
            outPutObject["withdrawResult"]="Withdraw initiated successfully"
            outPutObject["receipt"]=receipt
            return outPutObject
        }catch(err){
           console.log("initiateWithdraw Transaction failed:", err);
           throw err
        }
}

export const withdraw=async(miner)=>{
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const chainId=await getConnectedNetworkId()
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
       const abi = [{
                "inputs": [],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
        }];

        const MinerContract = new ethers.Contract(miner, abi, signer);
        let outPutObject={};
        try{
            var unstakeTx = await MinerContract.withdraw();
            console.log(unstakeTx);
            var receipt = await unstakeTx.wait();
            console.log(receipt);
            console.log("withdraw Transaction successful:", receipt);
             outPutObject["withdrawResult"]="Withdraw succeeded"
             outPutObject["receipt"]=receipt
            
        }catch(err){
                console.log(err)
           if(err['data']['message'].includes('wait longer')){
                console.log("User must wait longer for withdraw");
                 outPutObject["withdrawResult"]="You must wait 24 hours between initiating and completing a withdrawal"
                 outPutObject["receipt"]=""
                return outPutObject
           }else{
                console.log(err)
                console.log("withdraw Transaction failed:", err);
                throw err
              }
    
        }
}

export const deploy = async(modelIds, miner, rewardShareDivisor, lendingAPR,toggle) => {
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const chainId=await getConnectedNetworkId()
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
        var ARBIUS_ENGINE = '';
        var ARBIUS_TOKEN = ''
        if(toggle){
                ARBIUS_TOKEN = AIUS_TESTNET;
                ARBIUS_ENGINE = ArbiusEngine_Testnet;
        }else{
                ARBIUS_TOKEN = AIUS_MAINNET;
                ARBIUS_ENGINE = ArbiusEngine_Mainnet;
        }
        console.log("Arbius Engine: ", ARBIUS_ENGINE);
        console.log("Arbius Token: ", ARBIUS_TOKEN);
        console.log(modelIds)
        const updatedModelIds=modelIds.split(",")
        const ContractInstance = new ethers.ContractFactory(DELEGATED_MINER_ABI, DELEGATED_MINER_BYTECODE, signer);
        const contractInstance = await ContractInstance.deploy(ARBIUS_ENGINE, ARBIUS_TOKEN,updatedModelIds, miner, rewardShareDivisor, lendingAPR);
        await contractInstance.deployed();
        return true
    } catch (err) {
        console.log("Error deploying delegated miner");
        console.log(err);
        throw err
    }

};

async function deployMiner(miner, rewardsShareDivisor, modelIds, lendingAPR){
        var deployMinerBtn = document.getElementById('deployMiner');
        deployMinerBtn.style = "display:none;";
        var deployLoading = document.getElementById('deployLoading');
        deployLoading.style = 'display:;';
        deploy(modelIds, miner, rewardsShareDivisor, lendingAPR);
}

export const stakeAIUS = async(miner, amount) => {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const chainId=await getConnectedNetworkId()
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
        const signer = await provider.getSigner();
        const abi = [{
                "inputs": [
                        {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                        }
                ],
                "name": "deposit",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
        }];

        const MinerContract = new ethers.Contract(miner, abi, signer);
        var amountDecimal = new Decimal(amount);
        var multiplier = new Decimal(10**18);
        var result = amountDecimal.times(multiplier);
        var resultFixed = result.toFixed();
        console.log("Stake amount ");
        console.log(resultFixed);
        try {
          const stake = await MinerContract.deposit(resultFixed);
          console.log(stake);
          const stakeReceipt = await stake.wait();
          console.log("Transaction successful:", stakeReceipt);
          return true
        }catch(err){
          console.log("Transaction failed:", err);
        throw err
        }

}

export const  approveAIUSSpend=async(spender, amount,toggle)=>{
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const chainId=await getConnectedNetworkId()
        if(!chainId){
                return {purpose:"error",message:"Not on Arbitrum"};
        }
        const signer = await provider.getSigner();
       const abi = [{
                "inputs": [
                        {
                                "internalType": "address",
                                "name": "spender",
                                "type": "address"
                        },
                        {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                        }
                ],
                "name": "approve",
                "outputs": [
                        {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                        }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
        },{
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }];
        console.log(toggle)
        var AIUSAddr;
        if(toggle){
          AIUSAddr = AIUS_TESTNET;
          console.log("Approving for testnet AIUS");
        }else{
          AIUSAddr = AIUS_MAINNET;
          console.log("Approving for mainnet AIUS");
        }
        const AIUSContract = new ethers.Contract(AIUSAddr, abi, signer);
        console.log(typeof amount)
        var amountDecimal = new Decimal(amount);
        var multiplier = new Decimal(10**18);
        var result = amountDecimal.times(multiplier);
        var resultFixed = result.toFixed();
        console.log("Approval amount ");
        console.log(resultFixed);
        try {
          const allowance = await AIUSContract.allowance(await signer.getAddress(), spender);
          if(allowance >= resultFixed){
                alert("AIUS allowance already exists")
          }else{

           const approval = await AIUSContract.approve(spender, resultFixed);
           console.log(approval);
           const approvalReceipt = await approval.wait();

           console.log("Transaction successful:", approvalReceipt);
           return true;
          }
        } catch (error) {
          console.log("Transaction failed:", error);
          alert("Transaction failed")
          throw err
        }
}

async function tokenAllowance(token, spender){
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        abi = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
        const tokenContract = new ethers.Contract(token, abi, signer);
        allowance = await tokenContract.allowance(signer.getAddress(), spender);
        return allowance;
}


async function switchNetwork(chainId) {
      console.log("Switching to " + chainId)
      try{
         const wasSwitchSuccessful = await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: "0xA4BA",
                                    chainName: 'Arbitrum Nova',
                                    nativeCurrency: {
                                        name: 'Ethereum',
                                        symbol: 'ETH',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://nova.arbitrum.io/rpc'],
                                    blockExplorerUrls: ['https://nova-explorer.arbitrum.io/']
                                }]
                                });
                               
   }catch(error){
           return false;
   }
}

export const connectWallet = async() => {
        (async () => {
                await getConnectedNetwork();
                console.log(provider)
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                console.log(signer.address)
                switchNetwork("42170")
                sessionStorage.setItem("wallet",signer.address)
        })();
}

export const changeNetwork = async(toggle) => {
        await getConnectedNetworkId(toggle);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
}

