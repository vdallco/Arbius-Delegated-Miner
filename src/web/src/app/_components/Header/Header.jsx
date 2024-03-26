"use client"
import React,{useState,useEffect} from 'react'
import logo from '../../assets/images/logo.png'
import theme from '../../assets/images/theme.png'
import Image from 'next/image'
import { connectWallet } from '../../../lib/lib'

export default function Header(){
    const [dark,setDark]=useState(true)
    const [connected,setConnected]=useState(false)
    useEffect(()=>{
        const theme=localStorage.getItem("theme")
        if(theme==="WHITE"){
            setDark(false)
            document.documentElement.classList.remove('dark')
        }
        else{
            setDark(true)
            document.documentElement.classList.add('dark')
        }
        const wallet=sessionStorage.getItem("wallet")
        if(wallet){
            setConnected(true)
        }
    },[])
    const themeSwitchHandler=()=>{
        if(dark){
            document.documentElement.classList.remove('dark')
            localStorage.setItem("theme","WHITE")
            setDark(false)
        }
        else{
            document.documentElement.classList.add('dark')
            setDark(true)
            localStorage.setItem("theme","DARK")
        }
}
    return (
        <header className="dark:bg-black bg-white  py-5">
            <div className='max-w-center-width w-[98%] lg:w-page-width mx-auto flex justify-between items-center'>
                <div>
                    <Image src={logo} className='dark:invert-0 invert' width={50} alt="logo"/>
                </div>
                <div className='flex items-center gap-6'>
                    <div onClick={themeSwitchHandler} className='cursor-pointer'>
                        <Image width={30} className='dark:invert invert-0' src={theme} alt="theme"/>
                    </div>
                    <div>
                        <button onClick={async() => {connectWallet();setConnected(true)}} className='border dark:border-white border-black  dark:text-t-white hover:dark:bg-white hover:dark:border-white-mode hover:dark:text-t-black text-t-black hover:border-[#000000] hover:text-t-white hover:bg-black rounded-md px-4 py-2' type='button'>{connected?"Connected":"Connect"}</button>
                    </div>
                </div>
            </div>
        </header>
    )
}