import dollar from '../assets/images/dollar.png'
import star from '../assets/images/star.png'
import bag from '../assets/images/bag.png'
import caution from '../assets/images/caution.png'
import lock  from '../assets/images/lock.png'
export const liquidStaking = [
    {
        id:"1",
        image:dollar,
        content:'Arbius (AIUS) holders deposit AIUS to delegated Arbius miners and earn a share of mining rewards.'
    },
    {
        id:"2",
        image:star,
        content:'Miners who need more AIUS to mine may deploy a delegated miner contract to source AIUS from stakers.'
    },
    {
        id:"3",
        image:bag,
        content:"Mining rewards are trustlessly distributed to stakers and miners can always update the percentage of rewards they're sharing with stakers."
    }
]
export const warnings = [
    {
        id:"1",
        image:caution,
        content:"There is significant slashing risk for stakers. No collateral is held by the delegated miner contract to pay stakers in the event that the miner is slashed. Be aware of this risk and avoid staking with unfamiliar or untrustworthy miners."
    },
    {
        id:"2",
        image:lock,
        content:"The delegated miner contract has not been formally audited. There may be significant risks involved with using the delegated miner contract."
    }
]






