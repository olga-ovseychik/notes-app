const Load = ({size, color}) => {
    return (
        <div className="flex justify-center items-center absolute w-full h-full blur-2xl bg-white">
            <div
                className={`inline-block h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-${color}`}
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
            </div>
        </div>
    )
}

export default Load;