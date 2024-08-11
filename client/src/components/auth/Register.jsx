import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRegisterNewUserMutation } from "../../app/services/usersApiSlice";
import { useUpdateUserProfileMutation } from "../../app/services/usersApiSlice";
import { useGetUserQuery } from "../../app/services/usersApiSlice";
import { selectToken } from "../../app/services/authSlice";
import { useLogoutMutation } from "../../app/services/authApiSlice";
import Modal from "../Modal";

const  Register = () => {
    const token = useSelector(selectToken);
    const [inputFields, setInputFields] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const dialogRef = useRef(null);
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const {data: user} = useGetUserQuery(userInfo?.id);
    const [registerNewUser] = useRegisterNewUserMutation();
    const [updateUserProfile] = useUpdateUserProfileMutation();
    const [logout] = useLogoutMutation();
    const [userExist, setUserExist] = useState(false);
    var errrorsList = {}

    const handleOpenModal = useCallback( () => {
        dialogRef.current.showModal();
        setTimeout(() => {
            if (token) {
                logout();
            }
            navigate('/login');
        }, 5000)   
    }, [navigate]);

    const finishSubmit = useCallback( async () => {
        try {
            const {firstName, lastName, email, password} = inputFields;
            if (user?.roles.includes('Guest')) {
                const {id} = userInfo;
                await updateUserProfile({id, firstName, lastName, email, password, roles: ['User'] });
            } else {
                await registerNewUser({ firstName, lastName, email, password }).unwrap();
            }
            handleOpenModal();
        } catch (error) {
            if (error?.data?.message == 'User already exists') {
                errrorsList.email = "User with this e-mail address is already registered";
                setUserExist(true)
            }  
            console.log(error?.data?.message || error.error);
        }
    }, [handleOpenModal, inputFields, registerNewUser]);

    useEffect(() => {
        if (token && !user?.roles.includes('Guest')) {
            navigate('/notes');
        }
        if (Object.keys(errors).length === 0 && submitting) {
            finishSubmit();
        }
    }, [userInfo, errors, finishSubmit, navigate, submitting, userExist]);

    const handleClickShowPass = () => {
        setShowPass((prev) => !prev);
    };

    const handleChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    };

    const validateValues = (inputValues) => {
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

        if (inputValues.firstName == null || inputValues.firstName.length < 2) {
            errrorsList.firstName = "This field must contain at least two characters";
        }
        if (inputValues.lastName == null || inputValues.lastName.length < 2) {
            errrorsList.lastName = "This field must contain at least two characters";
        }
        if (/\d/.test(inputValues.firstName)) {
            errrorsList.firstName = "This field cannot have any numbers";
        }
        if (/\d/.test(inputValues.lastName)) {
            errrorsList.lastName = "This field cannot have any numbers";
        }
        if (!regexEmail.test(inputValues.email)) {
            errrorsList.email = "Invalid email address";
        }
        if(userExist) {
            errrorsList.email = "User alerady exists";
        }
        if (!regexPass.test(inputValues.password)) {
            errrorsList.password = `The password must contain:
            • at least one lowercase letter;
            • at least one uppercase letter;
            • at least one number;
            • at least one special character;
            must be at least 8 characters long`;
        }
        if (inputValues.password !== inputValues.confirmPassword) {
            errrorsList.confirmPassword = 'Passwords does not match'
        }
        return errrorsList;
      };

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrors(validateValues(inputFields));
        setSubmitting(true);
    };


    return(
        <div className="grid grid-cols-12">
            <Modal dialogRef={dialogRef}/>
            <form 
                id="register-form"
                onSubmit={submitHandler}
                className="lg:col-span-4 xs:col-span-12 min-h-dvh max-h-full lg:px-12 md:px-52 sm:px-40 xs:px-12 py-6 rounded-md flex flex-col justify-center gap-4 bg-slate-50 border border-semiLight shadow-xl dark:bg-bgColor dark:border-none overflow-auto scroll-smooth">
                <h1 className="text-center font-bold text-2xl text-textColor dark:text-darkColor">Sign Up</h1>
                <label>
                    <p className="text-textColor dark:text-semiLight">First name</p>
                    <input 
                        type="text" 
                        name="firstName"
                        value={inputFields.firstName}
                        placeholder="Your name"
                        className="w-full p-2 mt-2 rounded-md bg-slate-100 border placeholder:text-sm focus:outline-none dark:bg-inherit dark:placeholder:text-semiLight dark:text-semiLight dark:border-darkColor"
                        onChange={handleChange}/>
                    {errors.firstName ? (<p className="text-sm text-red-400 mt-2 italic">{errors.firstName}</p>) : null}
                </label>
                <label>
                    <p className="text-textColor dark:text-semiLight">Last name</p>
                    <input 
                        type="text" 
                        name="lastName"
                        value={inputFields.lastName}
                        placeholder="Your surname"
                        className="w-full p-2 mt-2 rounded-md bg-slate-100 border placeholder:text-sm focus:outline-none dark:placeholder:text-semiLight dark:text-semiLight dark:bg-inherit dark:border-darkColor"
                        onChange={handleChange}/>
                        {errors.lastName ? (<p className="text-sm text-red-400 mt-2 italic">{errors.lastName}</p>) : null}
                </label>
                <label>
                    <p className="text-textColor dark:text-semiLight">Email</p>
                    <input 
                        type="text" 
                        name="email"
                        value={inputFields.email}
                        placeholder="name@mail.com"
                        className="w-full p-2 mt-2 rounded-md bg-slate-100 border placeholder:text-sm focus:outline-none dark:placeholder:text-semiLight dark:text-semiLight dark:bg-inherit dark:border-darkColor"
                        onChange={handleChange}/>
                        {errors.email ? (<div className='text-red-400 mt-2 italic whitespace-pre-line text-sm'>{errors.email}</div>) : null}
                </label>
                <label>
                    <p className="text-textColor dark:text-semiLight">Password</p>
                    <div className="relative">
                        <input 
                            type={showPass ? 'text' : 'password'}
                            name="password"
                            value={inputFields.password}
                            placeholder='••••••••'
                            className={`w-full p-2 mt-2 rounded-md bg-slate-100 border placeholder:text-sm focus:outline-none dark:bg-inherit dark:placeholder:text-semiLight dark:text-semiLight dark:border-darkColor ${errors.password || errors.confirmPassword ? 'border-red-400' : null}`}
                            onChange={handleChange}/>
                        {showPass ? <EyeIcon onClick={handleClickShowPass} className='h-6 w-6 cursor-pointer absolute right-4 bottom-2 text-slate-400'/>
                        : <EyeSlashIcon onClick={handleClickShowPass} className='h-6 w-6 cursor-pointer absolute right-4 bottom-2 text-slate-400'/>}
                    </div>
                    {errors.password ? (<div className='text-red-400 p-2 mt-2 italic whitespace-pre-line text-sm'>{`${errors.password}`}</div>) : null}
                </label>
                <label>
                    <p className="text-textColor dark:text-semiLight">Confirm Password</p>
                    <input 
                        type={showPass ? 'text' : 'password'}
                        name="confirmPassword"
                        value={inputFields.confirmPassword}
                        placeholder='••••••••'
                        className={`w-full p-2 mt-2 rounded-md bg-slate-100 border placeholder:text-sm focus:outline-none dark:bg-inherit dark:placeholder:text-semiLight dark:text-semiLight dark:border-darkColor ${errors.confirmPassword ? 'border-red-400' : null}`}
                        onChange={handleChange}/>
                        {errors.confirmPassword ? (<p className="text-red-400 italic mt-2 text-sm">{errors.confirmPassword}</p>) : null}
                </label>
                <div>
                    <button 
                        type="submit"
                        className={`w-full h-10 rounded-md text-textColor bg-mainColor hover:bg-amber-200 disabled:opacity-75 ${!(inputFields.firstName && inputFields.lastName && inputFields.email && inputFields.password && inputFields.confirmPassword) ? 'cursor-not-allowed' : null}`}
                        disabled={!(inputFields.firstName && inputFields.lastName && inputFields.email && inputFields.password && inputFields.confirmPassword)}>
                            Sign Up
                    </button>
                </div>
                <p className="text-textColor dark:text-semiLight text-sm">Do you already have an account?
                    <a href="/login" className="text-darkColor sm:ml-1 xs:ml-0 font-semibold">Sign In</a>
                </p>
            </form>

            <div className={`col-span-8 xs:hidden lg:flex bg-bgLogin bg-cover`}>
                <div className="backdrop-blur-md bg-white/2 w-full flex flex-col justify-center items-center p-16">
                    <div className="flex flex-col items-start backdrop-blur-md bg-black/10 rounded-xl p-10 gap-10">
                        <div className="self-center inline-block">
                            <h1 className="inline-block text-white xl:text-5xl lg:text-4xl">Welcome to the NotesApp</h1>
                        </div>
                                        
                        <ul className="text-white text-lg leading-loose">
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-note-sticky"></i>   Manage your notes</li>
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-square-check"></i>   Create your todo-lists</li>
                            <li className="whitespace-break-spaces"><i className="fa-regular fa-face-smile"></i>   This app will make sure you don't have to keep everything in your mind</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;