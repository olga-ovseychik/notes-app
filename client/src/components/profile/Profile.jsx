import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EyeIcon } from '@heroicons/react/24/outline';
import { EyeSlashIcon } from '@heroicons/react/24/outline';
import { useGetUserQuery, useUpdateUserProfileMutation, useDeleteUserMutation } from '../../app/services/usersApiSlice';
import { selectUserInfo } from '../../app/services/authSlice';


const Profile = () => {

    const { id } = useSelector(selectUserInfo);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { data: user, 
            isSuccess, 
            isError,
            error } = useGetUserQuery(id, {
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
    });
    const [updateUserProfile, {isLoading}] = useUpdateUserProfileMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)
    const [email, setEmail] = useState(user?.email) 
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate();
    var divSaveInfo = document.getElementById("divSaveInfo");

    useEffect(() => {
        if (Object.keys(errors).length === 0 && submitting) {
            finishSubmit();
        }
    }, [submitting, errors]);

    useMemo(() => {
        setFirstName(user?.firstName)
        setLastName(user?.lastName)
        setEmail(user?.email)
    }, [user]);

    let content;

    if (isLoading) content = <p>Loading</p> 
    if (isError) { content = <p className="errmsg">{error?.data?.message}</p> }

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrors(validateValues(firstName, lastName, email, password, confirmPassword));
        setSubmitting(true);
    };

    const validateValues = (firstName, lastName, email, password, confirmPassword) => {
        let errors = {};
        let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

        if (!firstName || firstName.length < 2) {
            errors.firstName = "Name must not be less than 2 characters";
        }
        if (!lastName || lastName.length < 2) {
            errors.lastName = "Surname must not be less than 2 characters";
        }
        if (!regexEmail.test(email)) {
          errors.email = "Invalid email address.";
        }
        if (!regexPass.test(password) && password) {
          errors.password = `The password must contain:
            • at least one lowercase letter;
            • at least one uppercase letter;
            • at least one number;
            • at least one special character;
            must be at least 8 characters long.`;
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords does not match.'
        }
        return errors;
      };

    const handleClickShowPass = () => {
        setShowPass((prev) => !prev)
    };

    const onAccountDelete = (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete your account?') == true) {
            deleteUser(id);
            navigate('/login');
        } else null;
    };

    function finishSubmit() {
        try {
            updateUserProfile({ id, firstName, lastName, email, password });
        } catch (error) {
            console.log(error?.data?.message || error.error);
        }
    }

    if (isSuccess) {
    content =   
    <form onSubmit={submitHandler} className='h-dvh w-full flex flex-col gap-4 shadow-md p-4 rounded-md bg-zinc-50 dark:bg-bgColor'>
        <div className='flex gap-2 xs:flex-col sm:flex-row'>
            <div className='w-full flex flex-col'>
                <input 
                    value={firstName} 
                    type="text" 
                    className='w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-light border dark:placeholder:text-textColor placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-mainColor'
                    onChange={(e) => setFirstName(e.target.value)}/>
                {errors.firstName ? 
                    (<p className='text-red-400 italic mt-2'>
                        {errors.firstName}
                    </p>) 
                : null}
            </div>
            <div className='w-full flex flex-col'>
                <input 
                    value={lastName} 
                    type="text" 
                    className='w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-light border dark:placeholder:text-light placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-mainColor'
                    onChange={(e) => setLastName(e.target.value)}/>
                {errors.lastName ? (<p className='text-red-400 italic mt-2'>{errors.lastName}</p>) : null}
            </div>
        </div>
        <div className='w-full flex flex-col'>
            <input 
                value={email} 
                type="text" 
                className='w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-light border dark:placeholder:text-light placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-mainColor'
                onChange={(e) => setEmail(e.target.value)}/>
            {errors.email ? (<div className='text-red-400 mt-2 italic whitespace-pre-line'>{errors.email}</div>) : null}
        </div>
        <div className='flex gap-2 xs:flex-col sm:flex-row'>
            <div className='w-full flex flex-col'>
                <div className="relative">
                    <input 
                        value={password} 
                        type={showPass ? 'text' : 'password'} 
                        placeholder='New password'
                        className='w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-light border dark:placeholder:text-semiLight placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-mainColor'
                        onChange={(e) => setPassword(e.target.value)}/>
                        {
                            showPass ? <EyeIcon onClick={handleClickShowPass} className='h-6 w-6 cursor-pointer absolute right-4 bottom-2 text-slate-400'/>
                            : <EyeSlashIcon onClick={handleClickShowPass} className='h-6 w-6 cursor-pointer absolute right-4 bottom-2 text-slate-400'/>
                        }
                </div>
                {errors.password ? 
                    (<div className='text-red-400 p-2 mt-2 italic whitespace-pre-line'>
                        {`${errors.password}`}
                    </div>) 
                : null}
            </div>
            <div className='w-full flex flex-col'>
                <input 
                    value={confirmPassword} 
                    type={showPass ? 'text' : 'password'}
                    placeholder='Confirm password'
                    className='w-full p-2 mt-2 rounded-md text-textColor placeholder:placeholderTextColor dark:text-semiLight bg-light border dark:placeholder:text-semiLight placeholder:text-sm focus:outline-none dark:bg-inherit dark:border-mainColor'
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
                {errors.confirmPassword ? (<p className="text-red-400 italic mt-2">{errors.confirmPassword}</p>) : null}
            </div>
        </div>
        <div className="flex justify-between mt-2" id='divSaveInfo' ref={divSaveInfo}>
            <div className="invisible text-xs text-slate-500 pl-2">All changes saved</div>
        </div>
        <div className='flex justify-end sm:gap-6 xs:flex-col xs:gap-3'>
            <button 
                type='submit'
                className='sm:w-1/4 xs:w-full h-10 rounded-md bg-mainColor hover:bg-amber-200 text-textColor shadow-lg self-end'>{isLoading ? 'Loading...' : 'Save'}</button>
            <button onClick={onAccountDelete} className='sm:w-1/4 xs:w-full h-10 rounded-md bg-red-100 hover:bg-red-500 text-red-500 hover:text-white shadow-lg self-end'>Delete account</button>
        </div>
    </form>
    }

    return  (
        <div className='flex justify-start'>
            {content}
        </div>
    )
}


export default Profile;