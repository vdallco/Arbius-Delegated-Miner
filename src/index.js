const output = require("./DelegatedMiner.json");
const DELEGATED_MINER_ABI = output.abi;
const DELEGATED_MINER_BYTECODE = output.bytecode;

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const AIUS_MAINNET = '0x8AFE4055Ebc86Bd2AFB3940c0095C9aca511d852';
const AIUS_TESTNET = '0x68903B30e75e7a49134E91ABC19Bfb170643a659';

const ArbiusEngine_Testnet = '0xab5E383A89ec907Bca01618352376C3C451d7012';
const ArbiusEngine_Mainnet = '0x3BF6050327Fa280Ee1B5F3e8Fd5EA2EfE8A6472a';
const ARBITRUM_NOVA_CHAIN_ID = '42170';

const connectWallet = document.querySelector('#connectWallet');
const walletAddr = document.querySelector('#walletAddress');
const accountDisplay = document.querySelector('#accountDisplay');

async function getConnectedNetworkId(){
        await provider.send("eth_requestAccounts", []);
        const { chainId } = await provider.getNetwork()
        return chainId;
}

async function getConnectedNetwork() {
        chainId = await getConnectedNetworkId();
        //network.value = chainId;
        //M.FormSelect.init(network, undefined);
}

async function checkConnected() {
        const signer = provider.getSigner();
        if (signer){

                walletAddr.innerHTML = await compactAddress(await signer.getAddress());
                connectWallet.setAttribute('disabled','disabled');
                connectWallet.innerHTML = 'Connected';
                accountDisplay.style.visibility = "visible";

                chainId = await getConnectedNetworkId();
                //await updateTokenSelectAddresses(chainId);
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

isLookingUpMiner = false;
async function lookupMiner(miner){
        console.log("Lookup miner: "+ isLookingUpMiner.toString());
        var lookupBtn = document.getElementById("lookupMiner");
        var loadingBar = document.getElementById("lookupLoading");
        if(isLookingUpMiner == false){
                loadingBar.style = 'display:;';
                lookupBtn.style = 'display:none;'
                lookupBtn.innerHTML = 'Reset';
        }else{
                lookupBtn.innerHTML = "Lookup";
        }
        //loadingBar.style = 'display:;';

        isLookingUpMiner = !isLookingUpMiner;

        if(!isLookingUpMiner){
                minerAddr = document.getElementById('minerAddressLookup');
                minerAddr.value = '';
                lookupTbl = document.getElementById('lookupTable').getElementsByTagName('tbody')[0];
                lookupTbl.replaceChildren();
                return;
        }

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        abi = [{
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

        var miner = await MinerContract.miner();
        var arbius = await MinerContract.arbius();
        var baseToken = await MinerContract.baseToken();
        var depositOfCaller = await MinerContract.depositOf(await signer.getAddress());
        var totalDeposited = await MinerContract.totalDeposited();
        var rewardShareDivisor = await MinerContract.rewardShareDivisor();
        var userPendingWithdrawCount = await MinerContract.userPendingWithdrawCount(await signer.getAddress());
        var hasPendingWithdraw = false;

        if (userPendingWithdrawCount > 0){
                hasPendingWithdraw = await MinerContract.pendingWithdraws(await signer.getAddress(), userPendingWithdrawCount);
        }

        lookupTbl = document.getElementById('lookupTable').getElementsByTagName('tbody')[0];
        var row1 = lookupTbl.insertRow();
        var r1c1 = row1.insertCell(0);
        var r1c2 = row1.insertCell(1);
        r1c1.innerHTML = 'Miner wallet';
        r1c2.innerHTML = compactAddress(miner);

        var row2 = lookupTbl.insertRow();
        var r2c1 = row2.insertCell(0);
        var r2c2 = row2.insertCell(1);
        var engineVerifiedBadge = "";
        if (arbius.toLowerCase() == ArbiusEngine_Testnet.toLowerCase()){
          engineVerifiedBadge = "<span class='badge new blue right' style='border-radius:8px;' data-badge-caption='Testnet'><i class='material-icons tiny' style='margin-top:3px;'>check</i></span>";
        }else if (arbius.toLowerCase() == ArbiusEngine_Mainnet.toLowerCase()){
          engineVerifiedBadge = "<span class='badge new green right' style='border-radius:8px;' data-badge-caption='Mainnet'><i class='material-icons tiny' style='margin-top:3px;'>check</i></span>";
        }else{
          engineVerifiedBadge = "<span class='badge new red'>Unverified</span>";
        }

        r2c1.innerHTML = "Arbius engine" + engineVerifiedBadge;
        r2c2.innerHTML = compactAddress(arbius);

        var row3 = lookupTbl.insertRow();
        var r3c1 = row3.insertCell(0);
        var r3c2 = row3.insertCell(1);
        var aiusTokenVerifiedBadge = "";

        if (baseToken.toLowerCase() == AIUS_TESTNET.toLowerCase()){
          aiusTokenVerifiedBadge = "<span class='badge new blue right' style='border-radius:8px;' data-badge-caption='Testnet'><i class='material-icons tiny' style='margin-top:3px;'>check</i></span>";
        }else if (baseToken.toLowerCase() == AIUS_MAINNET.toLowerCase()){
          aiusTokenVerifiedBadge = "<span class='badge new green right' style='border-radius:8px;' data-badge-caption='Mainnet'><i class='material-icons tiny' style='margin-top:3px;'>check</i></span>";
        }else{
          aiusTokenVerifiedBadge = "<span class='badge new red right' style='border-radius:8px;' data-badge-caption='Unverified'></span>";
        }

        r3c1.innerHTML = "Arbius token" + aiusTokenVerifiedBadge;
        r3c2.innerHTML = compactAddress(baseToken);

        var row4 = lookupTbl.insertRow();
        var r4c1 = row4.insertCell(0);
        var r4c2 = row4.insertCell(1);
        r4c1.innerHTML = "Your stake <div class='progress' id='unstakeLoading' style='display:none;'><div class='indeterminate'></div></div>";

        if (hasPendingWithdraw){
          var minerAddr = document.getElementById('minerAddressLookup');
          var pendingWithdraw = await pendingValidatorWithdrawRequests(minerAddr.value, userPendingWithdrawCount);
          console.log("Pending withdraw info:", pendingWithdraw);
          r4c2.innerHTML = "[pending withdrawal of " + pendingWithdraw[1]/(10**18) + " AIUS]<br/>" + depositOfCaller / (10**18) + " AIUS";
        }else{
          r4c2.innerHTML = depositOfCaller / (10**18) + " AIUS";
        }
        if(depositOfCaller > 0){
                r4c1.innerHTML = r4c1.innerHTML + '<div class="btn small right" id="unstakeBtn" style="background-color:#78A7FF;border-radius: 15px;">Unstake</div>'
        }

        if(hasPendingWithdraw){
                r4c1.innerHTML = r4c1.innerHTML + '<div class="btn small green right" id="unstakeBtn" style="background-color:#78A7FF;border-radius: 15px;">Withdraw</div>'
        }

        var unstakeBtn = document.getElementById('unstakeBtn');

        if (hasPendingWithdraw){
          unstakeBtn.addEventListener('click',function(){
                (async () => {
                 minerAddr = document.getElementById('minerAddressLookup');
                 console.log("Withdrawing for " + minerAddr.value);
                 await withdraw(minerAddr.value);
                })();
          });
        }else{
          if(depositOfCaller>0){
           unstakeBtn.addEventListener('click',function(){
                (async () => {
                 minerAddr = document.getElementById('minerAddressLookup');
                 console.log("Unstaking for " + minerAddr.value);
                 await initiateWithdraw(minerAddr.value);
                })();
           });
         }
        }
        var row5 = lookupTbl.insertRow();
        var r5c1 = row5.insertCell(0);
        var r5c2 = row5.insertCell(1);
        r5c1.innerHTML = "Total staked";
        r5c2.innerHTML = totalDeposited / (10**18) + " AIUS";

        var row6 = lookupTbl.insertRow();
        var r6c1 = row6.insertCell(0);
        var r6c2 = row6.insertCell(1);
        r6c1.innerHTML = "Rewards shared with stakers";
        r6c2.innerHTML = (100 / rewardShareDivisor) + "%";
        lookupBtn.style = 'display:;background-color:#78A7FF;border-radius: 15px;';
        loadingBar.style = 'display:none;';
}

async function pendingValidatorWithdrawRequests(miner, count){
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
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

async function initiateWithdraw(miner){
        var unstakeBtn = document.getElementById('unstakeBtn');
        var loadingBar = document.getElementById("unstakeLoading");
        loadingBar.style = 'display:;';
        unstakeBtn.style = "display:none;";

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        abi = [{
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
            M.toast({html: 'Withdraw initiated successfully!', displayLength:10000, classes: 'rounded green', });
        }catch(err){
           console.log("initiateWithdraw Transaction failed:", err);
           M.toast({html: 'Unstaking failed', displayLength:10000, classes: 'rounded red', });
           loadingBar.style = 'display:none;';
           unstakeBtn.style = "display:;background-color:#78A7FF;border-radius: 15px;";
        }

        loadingBar.style = "display:none;";
}

async function withdraw(miner){
        var unstakeBtn = document.getElementById('unstakeBtn');
        var loadingBar = document.getElementById("unstakeLoading");
        loadingBar.style = 'display:;';
        unstakeBtn.style = "display:none;";

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        abi = [{
                "inputs": [],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
        }];

        const MinerContract = new ethers.Contract(miner, abi, signer);

        try{
            var unstakeTx = await MinerContract.withdraw();
            console.log(unstakeTx);
            var receipt = await unstakeTx.wait();
            console.log(receipt);
            console.log("withdraw Transaction successful:", receipt);
            M.toast({html: 'Withdraw succeeded!', displayLength:10000, classes: 'rounded green', });
        }catch(err){
           if(err['data']['message'].includes('wait longer')){
                console.log("User must wait longer for withdraw");
                M.toast({html: 'You must wait 24 hours between initiating and completing a withdrawal', displayLength:10000, classes: 'rounded red', });
           }else{
             console.log("withdraw Transaction failed:", err);
             M.toast({html: 'Withdraw failed', displayLength:10000, classes: 'rounded red', });
           }
           loadingBar.style = 'display:none;';
           unstakeBtn.style = "display:;border-radius: 15px;";
        }

        loadingBar.style = "display:none;";
}

const deploy = async function (modelIds, miner, rewardShareDivisor, lendingAPR) {
    try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        var ARBIUS_ENGINE = '';
        var ARBIUS_TOKEN = ''
        var testnetSwitch = document.getElementById('testnetSwitch');
        if(testnetSwitch.checked){
                ARBIUS_TOKEN = AIUS_TESTNET;
                ARBIUS_ENGINE = ArbiusEngine_Testnet;
        }else{
                ARBIUS_TOKEN = AIUS_MAINNET;
                ARBIUS_ENGINE = ArbiusEngine_Mainnet;
        }
        console.log("Arbius Engine: ", ARBIUS_ENGINE);
        console.log("Arbius Token: ", ARBIUS_TOKEN);
        const ContractInstance = new ethers.ContractFactory(DELEGATED_MINER_ABI, DELEGATED_MINER_BYTECODE, signer);
        const contractInstance = await ContractInstance.deploy(ARBIUS_ENGINE, ARBIUS_TOKEN, modelIds, miner, rewardShareDivisor, lendingAPR);
        await contractInstance.deployed();
        M.toast({html: 'Deployment successful', displayLength:10000, classes: 'rounded green', });
        console.log("Deployed Delegated Miner ", contractInstance.address);
    } catch (err) {
        M.toast({html: 'Deployment failed', displayLength:10000, classes: 'rounded red', });
        console.log("Error deploying delegated miner");
        console.log(err);
        var deployMinerBtn = document.getElementById('deployMiner');
        deployMinerBtn.style = "display:;border-radius: 15px;";
    }

    //var deployMinerBtn = document.getElementById('deployMiner');
    //deployMinerBtn.style = "display:;border-radius: 15px;";
    var deployLoading = document.getElementById('deployLoading');
    deployLoading.style = 'display:none;';
};

async function deployMiner(miner, rewardsShareDivisor, modelIds, lendingAPR){
        var deployMinerBtn = document.getElementById('deployMiner');
        deployMinerBtn.style = "display:none;";
        var deployLoading = document.getElementById('deployLoading');
        deployLoading.style = 'display:;';
        deploy(modelIds, miner, rewardsShareDivisor, lendingAPR);
}

async function stakeAIUS(miner, amount){
        var stakeBtn = document.getElementById("stakeAIUS");
        stakeBtn.style = 'display:none;'
        var loadingBar = document.getElementById("stakeLoading");
        loadingBar.style = 'display:;';

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        abi = [{
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
          M.toast({html: 'Staking succeeded!', displayLength:10000, classes: 'rounded green', });
          //approveBtn = document.getElementById("");
          stakeBtn.classList.add('disabled');
          stakeBtn.innerHTML = 'Staked';
          //stakeBtn = document.getElementById("stakeAIUS");
          //stakeBtn.style = 'display:;background-color:#00ED76;border-radius: 15px;'
          loadingBar.style = 'display:none;'
        }catch(err){
          stakeBtn.style = 'display:;';
          console.log("Transaction failed:", err);
          M.toast({html: 'Staking failed', displayLength:10000, classes: 'rounded red', });
          loadingBar.style = 'display:none;'
        }

}

async function approveAIUSSpend(spender, amount){
        var approveBtn = document.getElementById("approveAIUS");
        approveBtn.style = 'display:none;'
        var loadingBar = document.getElementById("stakeLoading");
        loadingBar.style = 'display:;';

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        abi = [{
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

        var AIUSAddr;
        networkSwitch = document.getElementById("testnetSwitch");
        if(networkSwitch.checked){
          AIUSAddr = AIUS_TESTNET;
          console.log("Approving for testnet AIUS");
        }else{
          AIUSAddr = AIUS_MAINNET;
          console.log("Approving for mainnet AIUS");
        }
        const AIUSContract = new ethers.Contract(AIUSAddr, abi, signer);
        var amountDecimal = new Decimal(amount);
        var multiplier = new Decimal(10**18);
        var result = amountDecimal.times(multiplier);
        var resultFixed = result.toFixed();
        console.log("Approval amount ");
        console.log(resultFixed);
        try {
          const allowance = await AIUSContract.allowance(await signer.getAddress(), spender);
          if(allowance >= resultFixed){
                M.toast({html: 'AIUS allowance already exists', displayLength:10000, classes: 'rounded green', });
          }else{

           const approval = await AIUSContract.approve(spender, resultFixed);
           console.log(approval);
           const approvalReceipt = await approval.wait();

           console.log("Transaction successful:", approvalReceipt);
           M.toast({html: 'AIUS Approval succeeded!', displayLength:10000, classes: 'rounded green', });
          }
          //approveBtn = document.getElementById("");
          approveBtn.style = 'display:none;'
          stakeBtn = document.getElementById("stakeAIUS");
          stakeBtn.style = 'display:;background-color:#00ED76;border-radius: 15px;'
          loadingBar.style = 'display:none;'
        } catch (error) {
          //approveBtn = document.getElementById(approveBtnId);
          approveBtn.style = 'display:;';
          console.log("Transaction failed:", error);
          M.toast({html: 'AIUS Approval failed', displayLength:10000, classes: 'rounded red', });
          loadingBar.style = 'display:none;'
        }
}

async function tokenAllowance(token, spender){
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        abi = [{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

        //console.log("Checking allowance for token: " + token + " spender: " + spender + " owner: " + signer.getAddress());

        const tokenContract = new ethers.Contract(token, abi, signer);
        allowance = await tokenContract.allowance(signer.getAddress(), spender);
        return allowance;
}

document.addEventListener('DOMContentLoaded', function() {
        (async () => {
                var el = document.getElementById('tabs');
                var instance = M.Tabs.init(el);

                await getConnectedNetwork();
                await checkConnected();

                minerAddress = document.getElementById("minerAddress");
                approveAIUSBtn = document.getElementById('approveAIUS');
                approveAIUSBtn.addEventListener('click',function(d){
                        (async () => {
                                console.log("Approving AIUS...");

                                approvalAmt = document.getElementById("stakeAmount");
                                if(approvalAmt.value == ''){
                                        M.toast({html: 'Enter amount of AIUS to stake', displayLength:10000, classes: 'rounded red', });
                                        return;
                                }
                                if(minerAddress.value == ''){
                                         M.toast({html: 'Enter delegated miner address', displayLength:10000, classes: 'rounded red'});
                                         return;
                                }

                                await approveAIUSSpend(minerAddress.value, approvalAmt.value);
                        })();
                });

                stakeAIUSBtn = document.getElementById("stakeAIUS");
                stakeAIUSBtn.addEventListener('click', function(){
                    (async () => {
                        console.log("Staking AIUS...");
                        stakeAmt = document.getElementById("stakeAmount");

                        await stakeAIUS(minerAddress.value, stakeAmt.value);
                    })();

                });

                lookupMinerBtn = document.getElementById('lookupMiner');
                lookupMinerBtn.addEventListener('click', function(){
                    (async() => {
                        console.log("Looking up miner/staker info");
                        lookupMinerAddr = document.getElementById('minerAddressLookup');
                        console.log(lookupMinerAddr.value);
                        await lookupMiner(lookupMinerAddr.value);
                    })();
                });

                deployMinerBtn = document.getElementById('deployMiner');
                deployMinerBtn.addEventListener('click', function(){
                    (async () => {
                        console.log("Deploying delegated miner...");
                        var minerAddressDeploy = document.getElementById('minerAddressDeploy');
                        var rewardsShareDivisor = document.getElementById('rewardShareDivisor');
                        var modelIds = document.getElementById('modelIdsDeploy');
                        var lendingAPR = document.getElementById('lendingAPR');
                        modelIdsList = []
                        for(model in modelIds.value.split(',')){
                                modelIdsList.push(ethers.utils.arrayify(modelIds.value.split(',')[model]));
                        }

                        await deployMiner(minerAddressDeploy.value,rewardsShareDivisor.value,modelIdsList,lendingAPR.value); // (miner, rewardsShareDivisor, modelIds, lendingAPR)
                    })();
                });
        })();
});

async function switchNetwork(chainId) {
      console.log("Switching to " + chainId)
      try{
        chainIdHex = chainId.toString(16);
        console.log("Switching to 0x" + chainIdHex)
        await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x'+chainIdHex }],
      });
          return true;
   }catch(error){
           return false;
   }
}

// Connect Wallet button
connectWallet.addEventListener('click', async(e) => {
  e.preventDefault();
        (async () => {
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();

                walletAddr.innerHTML = await compactAddress(await signer.getAddress());
                connectWallet.setAttribute('disabled','disabled');
                connectWallet.innerHTML = 'Connected';
                accountDisplay.style.visibility = "visible";

                await getConnectedNetwork();
        })();
})