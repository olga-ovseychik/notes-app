import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { useGetFiltersQuery } from "../app/services/filtersApiSlice";
import { useGetNotesQuery } from "../app/services/notesApiSlice";
import { activeFilterChanged } from "../app/services/filtersSlice";

const Filters = () => {

    const userInfo = useSelector(state => state.auth.userInfo);
    const { data: filters } = useGetFiltersQuery(); 
    const { data: notes } = useGetNotesQuery(userInfo?.id);
    const activeFilter = useSelector(state => state.filters.activeFilter);
    const dispatch = useDispatch();
    const dropdown = useRef();

    useEffect(() => {}, [activeFilter, notes]);

    const handleFilterChanged = (name) => {
        dispatch(activeFilterChanged(name));
    }

    const handleOnCLick = () => {
        if (dropdown.current.classList.contains('hidden')) {
            dropdown.current.classList.add('flex');
            dropdown.current.classList.remove('hidden');
        } else {
            dropdown.current.classList.add('hidden');
            dropdown.current.classList.remove('flex');
        } 
    };

    function setIcon(map, name) {
        for (let [key, value] of map) {
            if (name == key) return value;
        }
    }

    const renderedFilters = filters?.map(({ _id, name, label, className }) => {
        let mapIcons = new Map([
            ['flagged', <i key={`${_id}_`} className="fa-regular fa-flag mr-2 xs:mr-0"></i>],
            ['recent', <i key={`${_id}_`} className="fa-regular fa-calendar mr-2 xs:mr-0"></i>],
            ['task', <i key={`${_id}_`} className="fa-regular fa-circle-check mr-2 xs:mr-0"></i>],
            ['untagged', <i key={`${_id}_`} className="fa-solid fa-inbox mr-2 xs:mr-0"></i>],
            ['tag',  <div key={`${_id}_`} className="flex gap-2 xs:flex-col lg:flex-row"><i className="fa-solid fa-tags"></i></div>],
        ]);
        const btnClass = classnames(className, { 'bg-mainColor dark:border dark:border-mainColor dark:bg-inherit text-zinc-700': name === activeFilter});
        
        return (
            <div key={`${_id}_`} className="lg:min-w-full">
                {/* lg */}
                <Link 
                    key={_id}
                    onClick={() => handleFilterChanged(name)}
                    className={`flex items-center lg:justify-start xs:hidden lg:flex min-w-full cursor-pointer rounded-md hover:bg-mainColor hover:text-hoverColor p-2 no-underline xl:text-base transition text-semiLight whitespace-break-spaces dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit ${btnClass}`}>
                    {setIcon(mapIcons, name)}{`  ${label}`}
                </Link>
                {/* xs */}
                <Link 
                    key={`xs_${_id}`}
                    onClick={() => handleFilterChanged(name)}
                    className={`lg:hidden xs:flex justify-center items-center max-w-10 min-w-10 max-h-10 min-h-10 cursor-pointer rounded-md hover:bg-mainColor hover:text-hoverColor p-2 no-underline xl:text-base text-base transition text-semiLight dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit ${btnClass}`}>
                    {setIcon(mapIcons, name)}
                </Link>
            </div>
        );
    });

    
    return (
        <div className="flex flex-col justify-center items-center w-full">
             {/* lg */}
            <Link
                className={`transition w-full flex items-center md:hidden cursor-pointer rounded-md p-2 mb-1 no-underline xl:text-base xs:hidden sm:hidden xl:block lg:block text-semiLight bg-hoverColor dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit`}>
                <i className="fa-solid fa-chevron-down text-sm mr-2" onClick={handleOnCLick}></i>
                <i className="fa-regular fa-note-sticky mr-2"></i>Notes
            </Link>
            {/* xs */}
            <Link 
                className={`transition mb-2 flex flex-col max-w-10 min-w-10 max-h-10 min-h-10 items-center lg:hidden cursor-pointer rounded-md p-2 no-underline text-sm text-semiLight bg-hoverColor dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit`}>
                <i className="fa-regular fa-note-sticky"></i>
                <i className="fa-solid fa-chevron-down text-sm" onClick={handleOnCLick}></i>
            </Link>
            <ul className="hidden w-full xs:pl-0 lg:pl-6 flex-col justify-start xs:justify-center xs:items-center items-start gap-1" ref={dropdown}>
                {renderedFilters}
            </ul>
        </div>
    )
}


export default Filters;