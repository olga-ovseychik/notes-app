const Load = () => {
    return (
        <div className={`col-span-8 xs:hidden lg:flex bg-bgLogin bg-cover`}>
        <div className="backdrop-blur-md bg-white/2 w-full flex flex-col justify-center items-center p-16">
            <div className="flex flex-col items-start backdrop-blur-md bg-black/10 rounded-xl p-10 gap-10">
                <div className="self-center inline-block">
                <div
                     className={`z-10 inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-mainColor`}
                     role="status">
                     <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                 </div>
                </div>            
            </div>
        </div>
    </div>
        // <div className="bg-bgLogin bg-cover">
        //     <div className="flex justify-center items-center absolute w-full h-full backdrop-blur-md bg-white/2 z-0">
        //         <div
        //             className={`z-10 inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-mainColor`}
        //             role="status">
        //             <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Load;