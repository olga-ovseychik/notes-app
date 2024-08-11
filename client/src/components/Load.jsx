const Load = () => {
    return (
        <div className={`flex bg-bgLogin bg-cover w-full h-dvh`}>
            <div className="backdrop-blur-md bg-white/20 w-full h-dvh flex justify-center items-center">
                <div className="self-center">
                    <div
                        className={`z-10 inline-block h-32 w-32 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-mainColor`}
                        role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default Load;