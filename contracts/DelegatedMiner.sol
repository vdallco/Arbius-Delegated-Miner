// SPDX-License-Identifier: MIT
pragma solidity >=0.8.13;

import "https://raw.githubusercontent.com/semperai/arbius/master/contract/contracts/interfaces/IArbius.sol";
import "https://raw.githubusercontent.com/semperai/arbius/master/contract/contracts/interfaces/IBaseToken.sol";

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/token/ERC20/ERC20.sol";

contract DelegatedValidatorV1 {
    address public miner;
    IArbius public arbius; // mainnet 0x3BF6050327Fa280Ee1B5F3e8Fd5EA2EfE8A6472a
    IBaseToken public baseToken; // mainnet 0x8AFE4055Ebc86Bd2AFB3940c0095C9aca511d852

    // Testnet:
    //"v2_baseTokenAddress": "0x68903B30e75e7a49134E91ABC19Bfb170643a659",
    //"v2_engineAddress": "0xab5E383A89ec907Bca01618352376C3C451d7012",
    // Testnet model: 0x3ac907e782b35cf2096eadcbd5d347fb7705db98526adcd2232ea560abbbef90

    mapping(address => uint256) public depositOf;

    // rewardShareDivisor is for liquid staking rewards
    uint256 public rewardShareDivisor = 10; // ie: 1 = 100%, 2 = 50%, 5 = 20%, 10 = 10%, 100 = 1%, etc
    mapping(bytes32 => bool) public modelIdEnabled;
    bytes32[] public modelIds;
    address[] public stakers;
    uint256 public stakersLength;
    uint256 public modelIdsLength;
    uint256 public minStakeAmount = 10000000000000; // 0.000010000000000000 AIUS min stake default

    // miner can disable others from continuing to deposit
    bool public depositsEnabled;

    // total all depositors have put in, minus their removed / pending removed amounts
    uint256 public totalDeposited;

    struct Loan {
        uint256 loanBalance;
        address lender;
    }

    // address -> count -> pending
    mapping(address => mapping(uint256 => bool)) public pendingWithdraws;
    mapping(address => uint256) public userPendingWithdrawCount;
    mapping(uint256 => Loan) public loans;

    event Deposit(address indexed addr, uint256 amount);
    event WithdrawInitiated(address indexed addr, uint256 count);
    event WithdrawCancelled(address indexed addr, uint256 count);
    event Withdraw(address indexed addr, uint256 count);
    event Claim(address indexed addr, uint256 amount);

    //event CheckedModel(uint256 timestamp, bytes32 model, bool enabled);

    modifier onlyMiner() {
        require(msg.sender == miner, "onlyMiner");
        _;
    }

    constructor(
        IArbius _arbius,
        IBaseToken _baseToken,
        bytes32[] memory _modelIds,
        address _miner,
        uint256 _rewardShareDivisor
    ) {
        arbius = _arbius;
        baseToken = _baseToken;
        rewardShareDivisor = _rewardShareDivisor;
        depositsEnabled = true;

        modelIds = _modelIds;
        modelIdsLength = _modelIds.length;
        for (uint256 i = 0; i < _modelIds.length; ++i) {
            modelIdEnabled[_modelIds[i]] = true;
        }

        miner = _miner;

        baseToken.approve(address(arbius), type(uint256).max);
    }

    function setMiner(address _newMiner) external onlyMiner {
        miner = _newMiner;
    }

    function setDepositsEnabled(bool _yea) external onlyMiner {
        depositsEnabled = _yea;
    }

    function setMinStakeAmount(uint256 _newMinStakeAmount) external onlyMiner {
        minStakeAmount = _newMinStakeAmount;
    }

    function setRewardsShareDivisor(uint256 _newRewardsShareDivisor) external onlyMiner {
        rewardShareDivisor = _newRewardsShareDivisor;
    }

    function borrowAIUS(uint256 _borrowAIUSAmount) external onlyMiner {
        // TO-DO: Implement Borrow function on Lending/Borrowing contract where AIUS lenders deposit to
        // And then call the borrow function from this one
        //uint256 aiusBalance = ERC20(baseToken)
        //require()
        //baseToken.transfer(miner, );
    }

    // arbius specific actions
    function submitSolution(
        bytes32 _taskid,
        bytes memory _cid
    ) external onlyMiner {
        (bytes32 model,,,,,) = arbiusTasks(_taskid);
        require(modelIdEnabled[model], "model not enabled");
        arbius.submitSolution(_taskid, _cid);
    }

    function arbiusTasks(bytes32 _taskid) public view returns (bytes32,uint256,address,uint64,uint8,bytes memory) {
        (, bytes memory arbiusTask) = address(arbius).staticcall(abi.encodeWithSignature("tasks(bytes32)",_taskid));
        (bytes32 model,uint256 fee,address owner,uint64 blocktime,uint8 version,bytes memory cid) = abi.decode(arbiusTask, (bytes32,uint256,address,uint64,uint8,bytes));
        return (model, fee, owner, blocktime, version, cid);
    }

    function submitTask(
        uint8 _version,
        address _owner,
        bytes32 _model,
        uint256 _fee,
        bytes calldata _input
    ) external onlyMiner {
        require(
            modelIdEnabled[_model],
            "model not enabled"
        );
        arbius.submitTask(_version, _owner, _model, _fee, _input);
    }

    function signalCommitment(bytes32 commitment_) external onlyMiner {
        arbius.signalCommitment(commitment_);
    }

    function submitContestation(bytes32 _taskid) external onlyMiner {
        (bytes32 model,,,,,) = arbiusTasks(_taskid);
        require(modelIdEnabled[model], "model not enabled");
        arbius.submitContestation(_taskid);
    }

    function voteOnContestation(bytes32 _taskid, bool _yea) external onlyMiner {
        (bytes32 model,,,,,) = arbiusTasks(_taskid);
        require(modelIdEnabled[model], "model not enabled");
        arbius.voteOnContestation(_taskid, _yea);
    }

    function delegateVoting(address _delegatee) external onlyMiner {
        baseToken.delegate(_delegatee);
    }

    // user actions for interaction
    function deposit(uint256 _amount) external {
        // the miner can always deposit
        require(_amount >= minStakeAmount, "less than min stake amount");
        require(depositsEnabled || msg.sender == miner, "deposits disabled");

        baseToken.transferFrom(msg.sender, address(this), _amount);

        depositOf[msg.sender] += _amount;
        totalDeposited += _amount;

        arbius.validatorDeposit(address(this), _amount);

        bool stakerExists = false;
        for (uint256 stakerId=0; stakerId < stakers.length; stakerId++){
            if (stakers[stakerId] == msg.sender){
                stakerExists = true;
            }
        }
        if(!stakerExists){
            stakers.push(msg.sender);
            stakersLength = stakersLength + 1;
        }
        emit Deposit(msg.sender, _amount);
    }

    function initiateWithdraw() external {
        require(
            userPendingWithdrawCount[msg.sender] == 0,
            "already withdrawing"
        );

        // depositOf[msg.sender], totalDeposited, arbius staked
        // require(depositOf[msg.sender]
        // TODO get adjusted balance

        uint256 adjBal = depositOf[msg.sender];

        require(adjBal > 0, "nothing to withdraw");

        uint256 count = arbius.initiateValidatorWithdraw(adjBal);

        // we look this up in case arbius has special handling of amounts
        // as in, prior deposit may not equal amount that is pending
        uint256 amount = arbius
            .pendingValidatorWithdrawRequests(address(this), count)
            .amount;

        pendingWithdraws[msg.sender][count] = true;
        userPendingWithdrawCount[msg.sender] = count;

        totalDeposited -= amount;
        depositOf[msg.sender] -= amount;

        emit WithdrawInitiated(msg.sender, count);
    }

    function cancelWithdraw() external {
        uint256 count = userPendingWithdrawCount[msg.sender];
        require(count != 0, "count zero");
        require(pendingWithdraws[msg.sender][count], "not pending");

        uint256 amount = arbius
            .pendingValidatorWithdrawRequests(address(this), count)
            .amount;
        arbius.cancelValidatorWithdraw(count);

        totalDeposited += amount;
        depositOf[msg.sender] += amount;
        userPendingWithdrawCount[msg.sender] = 0;

        emit WithdrawCancelled(msg.sender, count);
    }

    function withdraw() external {
        uint256 count = userPendingWithdrawCount[msg.sender];
        require(count != 0, "count zero");
        require(pendingWithdraws[msg.sender][count], "not pending");

        arbius.validatorWithdraw(count, msg.sender);

        pendingWithdraws[msg.sender][count] = false;
        userPendingWithdrawCount[msg.sender] = 0;

        emit Withdraw(msg.sender, count);
    }

    function calculateRewardsEarned() public view returns (uint256) {
        return baseToken.balanceOf(address(this)) / rewardShareDivisor;
    }

    function calculateMinerRewards() public view returns (uint256) {
        
        return baseToken.balanceOf(address(this)) - calculateRewardsEarned();
    }

    function getRewardsPerUnitStaked() public view returns (uint256) {
        uint256 stakingRewardsTotal = calculateRewardsEarned();
        uint256 minerRewardsTotal = calculateMinerRewards();
        uint256 multiplier = 10**18;

        uint256 rewardsPerUnitStaked = (stakingRewardsTotal*multiplier)/totalDeposited;
        return rewardsPerUnitStaked;
    }

    function claim() external {
        uint256 stakingRewardsTotal = calculateRewardsEarned();
        uint256 minerRewardsTotal = calculateMinerRewards();
        uint256 multiplier = 10**18;

        uint256 rewardsPerUnitStaked = (stakingRewardsTotal*multiplier)/totalDeposited;
        require(rewardsPerUnitStaked > 0, "rewards too small to distribute");

        for (uint256 stakerId=0; stakerId<stakersLength; stakerId++){
            uint256 rewardAmount = (depositOf[stakers[stakerId]] * rewardsPerUnitStaked) / multiplier;

            baseToken.transfer(stakers[stakerId], rewardAmount);
            emit Claim(stakers[stakerId], rewardAmount);
        }

        baseToken.transfer(miner, minerRewardsTotal);
    }
}