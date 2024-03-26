"use client"
import React,{useState} from "react"
import { approveAIUSSpend,stakeAIUS } from "../../../lib/lib"
import verified from '../../assets/images/verified.png'
import Image from 'next/image'
export default function Stake({toggle,changeNetworkError}){
    const emptyObject={
        minerAddress:"",
        aiusStake:"",
        approved:false,
        staked:false
    }
    const [stakeData,setStakeData]=useState(emptyObject)
    const [loader,setLoader]=useState(false)
    const stakeHandler=(e)=>{
        const name=e.target.name
        const value=e.target.value
        setStakeData({...stakeData,[name]:value})
    }
    const stakeSubmitHandler=async()=>{
        console.log(stakeData)
        
        try{
            if(!stakeData.aiusStake||!stakeData.minerAddress){
                return;
            }
            setLoader(true)
       const approveResult= await approveAIUSSpend(stakeData.minerAddress, stakeData.aiusStake,toggle)
       console.log(approveResult)
       if(approveResult?.purpose==="error"&&approveResult?.message==="Not on Arbitrum"){
        changeNetworkError()
        setLoader(false)
        return;
    }
       if(approveResult){
         setLoader(false)
         setStakeData({...stakeData,approved:true})
       }
    }catch(err){
        alert("Something went wrong")
        setLoader(false)
    }
        //setStakeData({minorAddress:"",aiusStake:""})
    }
    const stakingHandler=async()=>{
        try{
            if(!stakeData.aiusStake){
                return;
            }
        setLoader(true)
        const stakingResult=await stakeAIUS(stakeData.minerAddress,stakeData.aiusStake)
        if(stakingResult?.purpose==="error"&&stakingResult?.message==="Not on Arbitrum"){
            changeNetworkError()
            setLoader(false)
            return;
        }
        if(stakingResult){
            setStakeData({...stakeData,staked:true})
            setLoader(false)
        }
    }
    catch(err){
        alert("Something went wrong")
        setLoader(false)
    }
    }
    const resetHandler=()=>{
        setStakeData(emptyObject)
    }
    return (
        <section className="dark:bg-black bg-white pt-8">
            <div className="max-w-center-width w-[98%] lg:w-page-width mx-auto border dark:border-border-boxes border-white-mode rounded-md p-4 dark:bg-box-background bg-white">
                <div>
                    <p className="dark:text-t-white text-t-black font-extrabold text-xl">Stake</p>
                </div>
                <div className="mt-2">
                    <div className="mt-4">
                        <input type="text" name="minerAddress" value={stakeData.minerAddress} onChange={stakeHandler} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input" placeholder="Miner Address"/>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                       <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input"> 
                            <input type="number"  name="aiusStake" value={stakeData.aiusStake} onChange={stakeHandler} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 w-[100%] " placeholder="AIUS to stake"/>
                        </div>
                        
                    </div>
                </div>
                <div className="mt-4">
                    {
                        !stakeData?.approved?
                    <button type="button" onClick={stakeSubmitHandler} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">
                        Approve
                        {loader?
                        <div className="loader"></div>:""
                         }
                        </button>:
                        ""
                    }
                    {
                        stakeData?.approved&&stakeData?.staked?
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={resetHandler} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">
                                Reset
                            </button>
                            <div className="flex items-center gap-2">
                                <Image width={20} src={verified} alt="verified"/>
                                <p className="dark:text-t-white text-t-black">Staking succeeded</p>
                             </div>
                        </div>
                        :
                        ""
                    }
        
                            {
                                !stakeData?.staked&&stakeData?.approved?
                            <div className="flex items-center gap-4">    
                            <button type="button" className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient" onClick={stakingHandler}>
                                Stake
                                {loader?
                                   <div className="loader"></div>:""
                                }
                            </button>
                            <div className="flex items-center gap-2">
                                <Image width={20} src={verified} alt="verified"/>
                                <p className="dark:text-t-white text-t-black">AIUS Approval succeeded</p>
                             </div>
                            </div>:""
                            }
                    
                </div>
            </div>
        </section>
    )
}



