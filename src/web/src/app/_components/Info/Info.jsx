import React from "react"
import question from '../../assets/images/question.png'
import exclamation from '../../assets/images/exclamation.png'
import { liquidStaking,warnings } from "@/app/data/info"
import Image from 'next/image'
import Toggle from "react-toggle"
import { changeNetwork } from "../../../lib/lib"

export default function Info({toggle,toggleHandler}){
    return (
            <section className="dark:bg-black bg-white border-t  dark:border-border-button border-black pt-8">
            <div className="max-w-center-width w-[98%] lg:w-page-width mx-auto">
                <div className="flex xm:flex-row flex-col xm:gap-0 gap-4 justify-between items-center mb-6">
                    <div>
                        <p className="dark:text-t-white text-t-black font-extrabold text-xl">Liquid Staking AIUS</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="dark:text-t-white text-t-black font-medium">Testnet</p>
                        <div className="cursor-pointer">
                        <Toggle
                            checked={toggle}
                            onChange={(e) =>{toggleHandler(e); changeNetwork(e.target.checked)} }
                            icons={false}
                          />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between flex-col lg:flex-row w-full gap-4 lg:gap-0">
                    <div className="lg:w-info-box w-[100%] border dark:border-border-button border-white-mode  dark:text-t-white text-t-black rounded-md p-4 box-border">
                        <div className="flex items-center justify-between">
                            <p className="text-md font-bold dark:text-t-white text-t-black">What is AIUS liquid staking?</p>
                            <Image width={28} className="dark:invert-0 invert" src={question} alt="question"/>
                        </div>
                        <div className="mt-8">
                            {
                                liquidStaking.map((data)=>{
                                    return (
                                        <div key={data.id} className="flex items-center gap-4 mt-4">
                                            <div>
                                                <Image className="dark:invert-0 invert" width={40} src={data.image} alt="liquid staking"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">{data.content}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="lg:w-info-box w-[100%]  border dark:border-border-button border-white-mode  dark:text-t-white text-t-black rounded-md p-4 box-border">
                        <div className="flex items-center justify-between">
                            <p className="text-md font-bold dark:text-t-white text-t-black">Warnings and disclaimers</p>
                            <Image className="dark:invert-0 invert" width={28} src={exclamation} alt="exclamation"/>
                        </div>
                        <div className="mt-8">
                            {
                                warnings.map((data)=>{
                                    return (
                                        <div key={data.id} className="flex items-center gap-4 mt-4">
                                            <div>
                                                <Image className="dark:invert-0 invert" width={60} src={data.image} alt="liquid staking"/>
                                            </div>
                                            <div>
                                                <p className="font-medium">{data.content}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}