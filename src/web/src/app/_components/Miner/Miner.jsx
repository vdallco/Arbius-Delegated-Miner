"use client"
import React,{useState} from "react"
import { lookupMiner,withdraw,initiateWithdraw } from "../../../lib/lib"
import share from '../../assets/images/share.png'
import verified from '../../assets/images/verified.png'
import unverified from '../../assets/images/unverified.png'
import Image from 'next/image'
export default function Minor({changeNetworkError}){
    const [minor,setMinor]=useState("")
    const [loader,setLoader]=useState(false)
    const [results,setResults]=useState({})
    const minorLookupHandler=async()=>{
    try{
        if(!minor){
            return;
        }
        console.log(minor)
        setLoader(true)
       const outputResult= await lookupMiner(minor)
       console.log(outputResult)
       if(outputResult.purpose==="error"&&outputResult.message==="Not on Arbitrum"){
        changeNetworkError()
        setLoader(false)
        return;
    }
    //   setResults({minorId:"0x99"})
      setResults(outputResult)
      setLoader(false)
}catch(err){
    alert("Something went wrong")
    setLoader(false)
}
    }
    const minorInputHandler=(e)=>{
        setMinor(e.target.value)
    }
    const resetLookup=()=>{
        setMinor("")
        setResults({})
    }
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("Text Copied")
                console.log('Text copied to clipboard: ' + text);
            })
            .catch(err => {
                console.error('Failed to copy text to clipboard: ', err);
            });
    }
    const withDrawHandler=async()=>{
    try{
        setLoader(true)
        const withDrawResponse=await withdraw(minor)
        if(withDrawResponse?.purpose==="error"&&withDrawResponse?.message==="Not on Arbitrum"){
            changeNetworkError()
            setLoader(false)
            return;
        }
        console.log(withDrawResponse)
        setResults({...results,...withDrawResponse})
        setLoader(false)
    }
    catch(err){
        console.log(err)
        alert("Something went wrong")
        setLoader(false)
    }
    }
    const unStakeHandler=async()=>{
        try{
        setLoader(true)
        const unStakeResponse=await initiateWithdraw(minor)
        if(unStakeResponse?.purpose==="error"&&unStakeResponse?.message==="Not on Arbitrum"){
            changeNetworkError()
            setLoader(false)
            return;
        }
        console.log(unStakeResponse)
        setResults({...results,...unStakeResponse})
        setLoader(false)
    }
    catch(err){
        console.log(err)
        alert("Something went wrong")
        setLoader(false)
    }
    }
    return (
        <section className="dark:bg-black bg-white pt-8">
            <div className="max-w-center-width w-[98%] lg:w-page-width mx-auto border dark:border-border-boxes border-white-mode  rounded-md p-4 dark:bg-box-background bg-white">
                <div>
                    <p className="dark:text-t-white text-t-black font-extrabold text-xl">Miner lookup</p>
                </div>
                <div className="mt-2 flex items-center w-[100%] gap-4">
                    <div className="mt-4 lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input">
                        <input type="text" onChange={minorInputHandler} value={minor} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 w-[100%]" placeholder="Miner Address"/>
                    </div>
                    {
                        results?.minorWallet?
                    <div className="mt-4">
                        <button type="button" onClick={resetLookup} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">Reset</button>
                    </div>:""
                    }
                </div>
                {
                    !results?.minorWallet?
                <div className="mt-4">
                    <button type="button" onClick={minorLookupHandler} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">
                        Lookup
                        {loader?
                        <div className="loader"></div>:""
                         }
                        </button>
                </div>:""
               }
               {
                results?.minorWallet?
                <div className="mt-8">
                    <div className=" lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between mt-4 lg:flex-row flex-col lg:gap-0 gap-2">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="dark:text-t-white text-t-black font-semibold">Miner wallet:</p>
                        </div>
                        <div className="lg:w-[70%] w-[100%]">
                            <div className="dark:bg-white bg-black p-2 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="dark:text-t-black text-t-white font-semibold text-sm">{results.minorWallet.slice(0, 18)+"..."+results.minorWallet.slice(-5)}</p>
                                </div>
                                <div className="bg-gradient-linear hover:bg-hover-gradient cursor-pointer w-[35px] h-[35px] rounded-[50%] flex items-center justify-center" onClick={()=>copyToClipboard(results.minorWallet)}>
                                    <Image width={20} src={share} alt="share"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between mt-4 lg:flex-row flex-col lg:gap-0 gap-2">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="dark:text-t-white text-t-black font-semibold">Arbius Engine:</p>
                        </div>
                        <div className="lg:w-[70%] w-[100%] relative">
                            <div className="w-[100%]">
                                <div className="dark:bg-white bg-black p-2 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="dark:text-t-black text-t-white font-semibold text-sm">{results.arbiusAddress.slice(0, 18)+"..."+results.arbiusAddress.slice(-5)}</p>
                                    </div>
                                    <div  className="bg-gradient-linear hover:bg-hover-gradient w-[35px] h-[35px] rounded-[50%] flex items-center justify-center cursor-pointer" onClick={()=>copyToClipboard(results.arbiusAddress)}>
                                        <Image width={20} src={share} alt="share"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {
                                    results.arbiusEngine!=="Unverified"?
                                    <div className="flex items-center gap-2 absolute lg:right-[-100px] lg:top-4 top-[60px] ">
                                        <Image width={20} src={verified} alt="verified"/>
                                         <p  className="dark:text-t-white text-t-black">{results.arbiusEngine}</p>
                                    </div>
                                    : <div className="flex items-center gap-2 absolute lg:right-[-100px] lg:top-4 top-[60px] ">
                                          <Image width={20} src={unverified} alt="verified"/>
                                         <p  className="dark:text-t-white text-t-black">{results.arbiusEngine}</p>
                                       </div>

                                }
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between lg:mt-4 mt-10 lg:flex-row flex-col lg:gap-0 gap-2 ">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="dark:text-t-white text-t-black font-semibold ">Arbius Token:</p>
                        </div>
                        <div className="lg:w-[70%] w-[100%] relative">
                           <div className="w-[100%]"> 
                                <div className="dark:bg-white bg-black p-2 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="dark:text-t-black text-t-white font-semibold text-sm">{results.arbiusTokenAddress.slice(0, 18)+"..."+results.arbiusTokenAddress.slice(-5)}</p>
                                    </div>
                                    <div className="bg-gradient-linear hover:bg-hover-gradient w-[35px] h-[35px] rounded-[50%] flex items-center justify-center cursor-pointer" onClick={()=>copyToClipboard(results.arbiusTokenAddress)}>
                                        <Image width={20} src={share} alt="share"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {
                                    results.arbiusToken!=="Unverified"?
                                    <div className="flex items-center gap-2 absolute lg:right-[-100px]  lg:top-4 top-[60px]">
                                      <Image width={20} src={verified} alt="verified"/>
                                      <p className="dark:text-t-white text-t-black">{results.arbiusToken}</p>
                                    </div>
                                    :""

                                }
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between lg:flex-row flex-col lg:gap-0 gap-2 lg:mt-4 mt-10">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="dark:text-t-white text-t-black font-semibold">Your Stake:</p>
                        </div>
                        <div className="lg:w-[70%]  w-[100%] ">
                           <div className="lg:gap-2 relative flex items-center lg:justify-normal justify-between w-[100%]"> 
                            <div>
                                <p className="font-semibold dark:text-t-white text-t-black text-sm">{results.withdrawResult?results.withDrawlFunds:results.pendingText}</p>
                            </div>
                            <div>
                                <div className="flex lg:items-center lg:flex-row flex-col ">
                                {
                                
                                 results?.hasPendingWithdraw && !results.withdrawResult?
                                <button className="mt-4 bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient" onClick={withDrawHandler} type="button">
                                    Withdraw
                                    {loader?
                                      <div className="loader"></div>:""
                                     }
                                    </button>:""
                                }
                                {
                                    results?.depositCaller&&!results.withdrawResult?
                                    <button className="mt-4 bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient" onClick={unStakeHandler} type="button">
                                        Unstake
                                        {loader?
                                         <div className="loader"></div>:""
                                         }
                                        </button>:""
                                }
                                {
                                    results.withdrawResult?
                                 <div className="flex items-center gap-2">
                                      <Image width={20} src={verified} alt="verified"/>
                                      <p className="dark:text-t-white text-t-black">{results.withdrawResult}</p>
                                    </div>:""
                                }
                                </div>
                                
                            </div>
                            
                            </div>
                            {
                                results.receipt?
                            <div className="w-[100%] mt-2">
                                <div className="dark:bg-white w-[100%] bg-black p-2 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <p className="dark:text-t-black text-t-white font-semibold text-sm">{results.receipt.slice(0, 18)+"..."+results.receipt.slice(-5)}</p>
                                    </div>
                                    <div className="bg-gradient-linear hover:bg-hover-gradient w-[35px] h-[35px] rounded-[50%] flex items-center justify-center cursor-pointer" onClick={()=>copyToClipboard(results.receipt)}>
                                        <Image width={20} src={share} alt="share"/>
                                    </div>
                                </div>
                            </div>:""
                               }
                        </div>
                        
                    </div>
                    <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between mt-4 lg:flex-row flex-col lg:gap-0 gap-2">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="dark:text-t-white text-t-black font-semibold">Total Staked:</p>
                        </div>
                        <div className="lg:w-[70%] w-[100%]">
                            <p className="font-semibold dark:text-t-white text-t-black text-sm">{results.totalStaked}</p>
                        </div>
                    </div>
                    <div className="lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input  flex lg:items-center items-start justify-between mt-4 lg:flex-row flex-col lg:gap-0 gap-2">
                        <div className="lg:w-[30%] w-[100%]">
                            <p className="text-t-white font-semibold ">Rewards Shared:</p>
                        </div>
                        <div className="lg:w-[70%] w-[100%]">
                            <p className="font-semibold text-t-white text-sm">{results.reward}</p>
                        </div>
                    </div>
                </div>:""
             }
            </div>
        </section>
    )
}
/* Rectangle 10 */


