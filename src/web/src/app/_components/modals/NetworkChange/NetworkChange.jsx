import React from "react"
import Image from 'next/image'
import warning from '../../../assets/images/warning.png'
import cross from '../../../assets/images/cross.png'
export default function NetworkChange({changeNetworkError}){
    const closeModal=()=>{
        changeNetworkError()
    }
    return (
        <section className="h-full w-[100%] fixed z-10 bg-[#BF000000] top-0 left-0 backdrop-blur" id="networkIdPop">
            <div className="flex items-center mt-[220px] justify-center ">
            <div className=" py-6 px-10 dark:bg-box-background bg-white border dark:border-[#ffffff] border-black rounded-md relative">
                <div className="absolute right-4 cursor-pointer" onClick={closeModal}>
                    <Image className="dark:invert-0 invert"  src={cross} alt="cross" width={15}/>
                </div>
                <div>
                    <div className="flex justify-center mt-6">
                        <Image src={warning} alt="warning" width={50}/>
                    </div>
                    <div>
                        <p className="text-center font-medium text-xl dark:text-t-white text-t-black">Wrong network detected!</p>
                        <p className="text-center text-md dark:text-t-white text-t-black">Please switch to Arbitrum Nova</p>
                    </div>
                    <div className="text-center flex justify-center mt-6">
                        <button className="bg-gradient-linear hover:bg-hover-gradient flex items-center gap-2 text-t-white font-bold px-4 py-2 rounded-md" type="button" onClick={closeModal}>Continue</button>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}