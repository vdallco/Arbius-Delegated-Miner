"use client"
import React,{useState} from "react"
import { deploy } from "../../../lib/lib"
import Image from 'next/image'
import verified from '../../assets/images/verified.png'
export default function Deploy({toggle,changeNetworkError}){
    const emptyData= {
        wallet:"",
        id:"",
        share:"",
        apr:""
    }
    const [minerData,setminerData]=useState(emptyData)
    const [loader,setLoader]=useState(false)
    const [results,setResults]=useState(false)
const inputHandler=(e)=>{
    const name=e.target.name
    const value=e.target.value
    setminerData({...minerData,[name]:value})
}
const minerSubmitHandler=async()=>{
    try{
        if(!minerData.id||!minerData.apr||!minerData.share||!minerData.wallet){
            return;
        }
    setLoader(true)
    const results=await deploy(minerData.id, minerData.wallet, minerData.share, minerData.apr,toggle)
    console.log(minerData)
    console.log(results)
    if(results?.purpose==="error"&&results?.message==="Not on Arbitrum"){
        changeNetworkError()
        setLoader(false)
        return;
    }
    setResults(true)
    setLoader(false)
}catch(err){
    alert("Something went wrong")
    setLoader(false)
}
    // setminerData(emptyData)
}
const resetHandler=()=>{
    setminerData(emptyData)
    setResults(false)
}
    return (
        <section className="dark:bg-black bg-white pt-8 pb-8">
            <div className="max-w-center-width w-[98%] lg:w-page-width mx-auto border dark:border-border-boxes border-white-mode rounded-md p-4 dark:bg-box-background bg-white ">
                <div>
                    <p className="dark:text-t-white text-t-black font-extrabold text-xl">Deploy delegated miner</p>
                </div>
                <div className="mt-2">
                    <div className="mt-4">
                        <input type="text" name="wallet" onChange={inputHandler} value={minerData.wallet} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input" placeholder="miner Wallet"/>
                    </div>
                    <div className="mt-4">
                        <input type="text" name="id" onChange={inputHandler} value={minerData.id} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 lg:w-input-width xm:w-mobile-input-width w-smaller-mobile-input" placeholder="Model IDs(comma separated)"/>
                    </div>
                    <div className="mt-4 flex lg:flex-row flex-col lg:gap-0 gap-4 lg:items-center w-[100%]  lg:w-input-width justify-between">
                        <div>
                            <input type="number" name="share" onChange={inputHandler} value={minerData.share} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 lg:w-[100%] xm:w-mobile-input-width w-smaller-mobile-input" placeholder="Reward Share divisor"/>
                        </div>
                        <div>
                            <input type="number" name="apr" onChange={inputHandler} value={minerData.apr} className="border dark:border-border-boxes border-white-mode dark:bg-input-background bg-white rounded-2xl dark:text-t-white text-t-black p-2 lg:w-[100%] xm:w-mobile-input-width w-smaller-mobile-input" placeholder="Lending APR"/>
                        </div>
                    </div>
                </div>
                {
                    minerData.share?
                    <p className="dark:text-t-white text-t-black mt-4">Reward share of {minerData.share} is {100/minerData.share}%</p>:""
                }
                <div className="mt-4">
                    {
                        !results?
                    <button type="button" onClick={minerSubmitHandler} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">
                        Deploy
                        {loader?
                        <div className="loader"></div>:""
                         }
                     </button>:
                     <div className="flex items-center gap-4">
                        <button type="button" onClick={resetHandler} className="bg-gradient-linear flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md hover:bg-hover-gradient">
                            Reset
                        </button>
                        <div className="flex items-center gap-2">
                                <Image width={20} src={verified} alt="verified"/>
                                <p className="dark:text-t-white text-t-black">Deployment Succcessful</p>
                             </div>
                     </div>
                     }
                </div>
            </div>
        </section>
    )
}
/* Rectangle 10 */


