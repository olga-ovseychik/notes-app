import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../app/services/authApiSlice";
import { useGetUserQuery } from "../app/services/usersApiSlice";
import Filters from "./Filters";

const SideNav = () => { 

    const navigate = useNavigate();
    const [logout, { isLoading, isSuccess, isError, error }] = useLogoutMutation();
    const userInfo = useSelector(state => state.auth.userInfo);
    const {data: user, isLoading: isUserLoading} = useGetUserQuery(userInfo?.id);
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');  
    const [userEmail, setUserEmail] = useState('');
    const dropdown = useRef(null);

    useEffect(() => { 
        isSuccess ? navigate('/login') : null;
        if (user) {
            setUserName(user.firstName);
            setUserSurname(user.lastName);
            setUserEmail(user.email);
        } 
    }, [isSuccess, navigate, user]);

    const hideShowDropdown = () => {
        if (dropdown.current.classList.contains('hidden')) {
            dropdown.current.classList.remove('hidden');
            dropdown.current.classList.add('flex');
        } else {
            dropdown.current.classList.remove('flex');
            dropdown.current.classList.add('hidden');
        }
    }

    if (isLoading) return <p>Logging Out...</p>
    if (isError) return <p>Error: {error.data?.message}</p>

    return (
        <>
            <nav id="sideNav"
                 className="h-lvh lg:col-span-2 sm:col-span-1 xs:col-span-2 bg-bgColor overflow-hidden origin-left dark:bg-darkModeSecColor dark:border-none dark:shadow-darkMode">
                <div className="h-full flex flex-col justify-between">
                    <div className="flex flex-col w-full lg:items-start xl:items-start md:items-center md:justify-center mt-2 p-4 sm:p-2 gap-1.5">
                        {userInfo ? 
                            <>
                                <div className="flex flex-col justify-center items-center lg:gap-2 relative mb-2">
                                    <div onClick={hideShowDropdown} className="flex items-center lg:gap-2 rounded-md cursor-pointer">
                                        <div className="flex justify-center items-center rounded-full h-10 w-10 p-4 text-lg font-medium bg-amber-100 text-textColor">
                                            {
                                                isUserLoading ? '...'
                                                : `${userName?.charAt(0)}${userSurname?.charAt(0)}`
                                            }
                                        </div>
                                        <div 
                                             className={`text-light font-medium xl:text-lg text-base break-all xs:hidden lg:block dark:text-semiLight`}>{userEmail} <i className="fa-solid fa-chevron-down text-xs mr-2"></i>
                                        </div>
                                        {/* xs */}
                                        <div className={`text-light dark:text-mainColor lg:text-xs break-all lg:hidden xl:hidden`}></div>
                                    </div>

                                    <ul ref={dropdown}
                                        className="hidden absolute top-12 left-0 flex-col lg:justify-start lg:items-start xs:justify-center xs:gap-2 lg:gap-0 place-items-center text-base xs:w-full lg:max-w-28 border rounded-md p-2 z-100 bg-white shadow-xl focus:outline-none"
                                        onBlur={hideShowDropdown}
                                        tabIndex={-1}>
                                        {/* lg */}
                                        <p className="text-xs p-1 text-slate-400 mb-2 xs:hidden lg:block">Account</p>
                                        <Link
                                            to={`/profile`}
                                            className={`block hover:bg-light text-textColor cursor-pointer rounded-md font-semibold p-1 xs:hidden lg:block`}>Edit profile
                                        </Link>
                                        <Link
                                            onClick={logout}
                                            className={`block hover:bg-light text-textColor cursor-pointer rounded-md p-1 font-semibold xs:hidden lg:block`}>Sign out
                                        </Link>
                                        {/* xs */}
                                        <Link
                                            to={`/profile`}
                                            className={`block hover:bg-light text-textColor cursor-pointer rounded-md lg:hidden hover:text-hoverColor`}><i className="fa-solid fa-user-pen"></i>
                                        </Link>
                                        <Link
                                            onClick={logout}
                                            className={`block hover:bg-light text-textColor cursor-pointer rounded-md lg:hidden`}><i className="fa-solid fa-arrow-right-from-bracket"></i>
                                        </Link>
                                    </ul>
                                </div>                              
                            </> 
                        : null}
                        {userInfo ? <Filters/> : null}
                    </div>
                </div>
            </nav>
        </>
    )
}


export default SideNav;