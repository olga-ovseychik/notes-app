import { Link } from 'react-router-dom';

const ModalGuest = ({ guestDialogRef, handleCloseGuestModal }) => {
    return (
        <>
            <dialog ref={guestDialogRef} className="w-96 h-96 p-8 rounded-lg">
                <form method="dialog" className="flex flex-col justify-center items-center gap-6 relative">
                    <button 
                        className='absolute right-0 top-0 hover:bg-slate-100 rounded-full px-4 py-2'
                        onClick={handleCloseGuestModal}>
                            <i className="fa-solid fa-xmark text-textColor"></i>
                    </button>
                    <div className='mt-16 flex flex-col gap-8 items-center'>
                        <div className="whitespace-pre-line text-center text-textColor">{`To be able to create more notes`}
                        </div>
                        <Link 
                            to='/register'
                            className={`w-full h-10 flex items-center justify-center bg-mainColor hover:bg-amber-200 text-textColor shadow-lg rounded-md disabled:opacity-75 `}>
                                Sign Up
                        </Link>
                        <div className="whitespace-pre-line text-center text-textColor">{`OR\nIf you already have an account`}</div>
                        <Link to='/login' className='text-mainColor font-bold hover:bg-slate-100 px-6 py-2 rounded-full'>Log In</Link>
                    </div>
                </form>
            </dialog>
        </>
    )
}


export default ModalGuest;

