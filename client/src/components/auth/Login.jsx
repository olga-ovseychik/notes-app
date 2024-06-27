import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { useLoginMutation } from "../../app/services/authApiSlice";
import { setCredentials } from "../../app/services/authSlice";

function Login() {
   
    const [error, setError] = useState('')
    const [inputFields, setInputFields] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login] = useLoginMutation();

    const finishSubmit = useCallback(async () => {
        try {
            const { accessToken, userInfo } = await login({ ...inputFields }).unwrap();
            dispatch(setCredentials({ accessToken, userInfo }));
            setInputFields({
                email: "",
                password: "",
            });
            navigate('/notes');
        } catch (error) {
            console.log(error.data?.message);
            setError('Invalid email or password');
        }
    }, [dispatch, inputFields, login, navigate]);

    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
            finishSubmit();
          }
    }, [errors, finishSubmit, submitting]);

    const handleClickShowPass = () => {
        setShowPass((prev) => !prev)
    }

    const handleChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
        setError('');
      };

    const validateValues = (inputValues) => {
        let errors = {};
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(inputValues.email)) {
          errors.email = "Invalid email address";
        }
        return errors;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(validateValues(inputFields));
        setSubmitting(true);
    }


    return(
        <div className="grid grid-cols-12">
            <form onSubmit={handleSubmit}
                className="lg:col-span-4 xs:col-span-12 h-dvh py-56 lg:px-12 md:px-52 sm:px-40 xs:px-12 rounded-md flex flex-col gap-4 bg-slate-50 border border-semiLight shadow-xl dark:bg-bgColor dark:border-none dark:shadow-darkMode">
                <h1 className="text-center font-bold dark:text-darkColor text-2xl text-textColor">Sign In</h1>
                <label>
                    <p className="text-textColor dark:text-semiLight">Email</p>
                    <input 
                        type="email" 
                        name="email"
                        value={inputFields.email}
                        placeholder="name@mail.com"
                        className={`w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-bgInput border dark:placeholder:text-semiLight placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-darkColor`}
                        onChange={handleChange}/>

                    {errors.email ? (<p>{errors.email}</p>) : null}
                </label>
                <label>
                    <p className="text-textColor dark:text-semiLight">Password</p>
                    <div className="relative">
                        <input 
                            type={showPass ? 'text' : 'password'}
                            name="password"
                            value={inputFields.password}
                            placeholder='••••••••'
                            className='w-full p-2 mt-2 rounded-md text-textColor placeholder:text-placeholderTextColor bg-bgInput dark:text-semiLight border dark:placeholder:text-semiLight placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-darkColor'
                            onChange={handleChange}/>

                        {showPass ? <EyeIcon onClick={handleClickShowPass} className='h-6 w-6 cursor-pointer absolute right-4 bottom-2 text-textColor'/>
                        : <EyeSlashIcon onClick={handleClickShowPass} className='h-6 w-6 z-50 cursor-pointer absolute right-4 bottom-2 text-textColor'/>}
                    </div>
                    {error ? (<div className="text-red-400 mt-2">{error}</div>) : null}   
                </label>
                <div>
                    <button 
                        type="submit"
                        disabled={!(inputFields.email && inputFields.password)}
                        className={`w-full h-10 bg-mainColor hover:bg-amber-200 text-textColor shadow-lg rounded-md disabled:opacity-75 ${!inputFields.email || !inputFields.password ? 'cursor-not-allowed' : null}`}>
                            Sign In
                    </button>
                </div>
                <p className="text-textColor dark:text-semiLight">Don’t have an account yet?  
                    <a href="/register" className="text-darkColor ml-2 font-semibold">Sign Up</a>
                </p>
                <a className="flex self-end text-xs text-zinc-500" href="https://www.freepik.com/free-photo/hand-writing-notebook-close-up_14411988.htm#fromView=search&page=1&position=8&uuid=543fdaf8-fe20-4f4a-8447-6e6912b93f11">illustrations by freepik</a>
            </form>

            <div className={`col-span-8 xs:hidden lg:flex bg-bgLogin bg-cover`}>
                <div className="backdrop-blur-md bg-white/2 w-full flex flex-col justify-center items-center p-16">
                    <div className="flex flex-col items-start backdrop-blur-md bg-black/10 rounded-xl p-10 gap-10">
                        <div className="self-center inline-block">
                            <h1 className="inline-block text-white xl:text-5xl lg:text-4xl">Welcome to the NotesApp</h1>
                        </div>            
                        <ul className="text-white text-lg leading-loose">
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-note-sticky"></i>   Make your notes</li>
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-square-check"></i>   Create your todo-lists</li>
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-face-smile"></i>   This app will make sure you don't have to keep everything in your mind</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;