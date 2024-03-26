"use client"
import React,{useState} from "react"
import Header from "./_components/Header/Header";
import Info from "./_components/Info/Info";
import Stake from "./_components/Stake/Stake";
import Minor from "./_components/Miner/Miner";
import Deploy from "./_components/Deploy/Deploy";
import NetworkChange from "./_components/modals/NetworkChange/NetworkChange";
export default function Home() {
  const [toggle,setToggle]=useState(false)
  const [openNetworkError,setOpenNetworkError]=useState(false)
  const toggleHandler=(e)=>{
    if(e.target.checked){
      setToggle(true)
    }
    else{
      setToggle(false)
    }
}
const changeNetworkError=()=>{
  setOpenNetworkError(!openNetworkError)
}
  return (
    <main>
      {
        openNetworkError?
        <NetworkChange changeNetworkError={changeNetworkError}/>:""
      }
      <Header changeNetworkError={changeNetworkError}/>
      <Info changeNetworkError={changeNetworkError} toggle={toggle} toggleHandler={toggleHandler}/>
      <Stake changeNetworkError={changeNetworkError} toggle={toggle}/>
      <Minor changeNetworkError={changeNetworkError}/>
      <Deploy changeNetworkError={changeNetworkError} toggle={toggle}/>
    </main>
  );
}
