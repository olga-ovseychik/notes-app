import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Modal = ({ dialogRef }) => {

    return (
        <>
            <dialog ref={dialogRef} className="w-96 h-64 p-8 rounded-lg">
                <form method="dialog" className="flex flex-col justify-center items-center gap-6">
                    <CheckCircleIcon className='h-16 w-16 text-lime-600'/>
                    <div className="whitespace-pre-line text-center">{`You have successfully registered.\nYou will now be redirected to Login page`}</div>
                    <div className='w-full'>
                        <div className='h-1.5 w-full bg-lime-100 overflow-hidden'>
                            <div className='animate-progress w-full h-full bg-lime-600 origin-left-right'></div>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    )
}


export default Modal;

