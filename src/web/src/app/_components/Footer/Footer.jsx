import React from "react"
import arbius from '../../assets/images/arbius.png'
import github from '../../assets/images/github.png'
import Image from 'next/image'
export default function Footer(){
    return(
        <footer>
            <div className="dark:bg-box-background bg-white border-t dark:border-border-boxes border-white-mode py-6">
                <div className="max-w-center-width w-[98%] lg:w-page-width lg:px-0 px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="dark:bg-white rounded-[50%] bg-black w-[50px] h-[50px] flex items-center justify-center">
                            <Image width={50} src={arbius} alt="arbius"/>
                        </div>
                        <div>
                            <p className="dark:text-t-white text-t-black text-[25px] font-bold">Liquid Staking</p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between md:flex-row flex-col md:gap-0 gap-4">
                        <div className="md:w-[45%] w-[90%]">
                            <div>
                                <p className="dark:text-t-white text-t-black mb-2 font-bold text-[18px]">Disclaimer</p>
                            </div>
                            <div>
                                <p className="dark:text-[#ffffffcc]">The information provided here is for informational purposes only and should not be considered financial advice. Please conduct your own due diligence before participating in liquid staking.</p>
                            </div>
                        </div>
                        <div className="md:w-[45%] w-[90%]">
                            <div>
                                <p className="dark:text-t-white text-t-black font-bold mb-2 text-[18px]">Affiliation</p>
                            </div>
                            <div>
                                <p className="dark:text-[#ffffffcc]">This site is independently operated and is not affiliated with the official Arbius Foundation.</p>
                            </div>
                        </div>
                    </div>
                    <div className="dark:bg-[#ffffff80] bg-[#000000] w-[100%] h-[1px] my-6"></div>
                    <div className="flex items-center justify-end">
                        <div>
                            <a href="https://github.com/vdallco/Arbius-Delegated-Miner" target="_blank" rel="noreferrer">
                                <Image width={30} className='dark:invert invert-0' src={github} alt="github"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}