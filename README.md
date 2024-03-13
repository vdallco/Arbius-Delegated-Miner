# Arbius-Delegated-Miner
Solidity contract for a delegated Arbius miner that enables Liquid Staking AIUS, self-repaying AIUS loans (lending &amp; borrowing), etc


## Configuration

In the MiningConfig.json file for Arbius Miner, add keys for use_delegated_validator and delegated_validator_address

```
 "blockchain": {
    "use_delegated_validator": true,
    "delegated_validator_address": '...'
  }
```

## Run the miner

```
yarn start:dev MiningConfig.json
```

## Claim rewards

To claim rewards for stakers and the miner, simply call the claim() function on the Delegated Miner contract.