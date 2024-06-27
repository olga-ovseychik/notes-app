import { useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classnames from 'classnames';
import { useGetFiltersQuery } from "../app/services/filtersApiSlice";
import { useGetNotesQuery } from "../app/services/notesApiSlice";
import { activeFilterChanged } from "../app/services/filtersSlice";
import { tagFilterChanged } from "../app/services/tagsSlice";

const Filters = () => {

    const userInfo = useSelector(state => state.auth.userInfo);
    const { data: filters } = useGetFiltersQuery(); 
    const { data: notes } = useGetNotesQuery(userInfo?.id);
    const activeFilter = useSelector(state => state.filters.activeFilter);
    const tagFilter = useSelector(state => state.tags.tagFilter);
    const dispatch = useDispatch();
    const dropdown = useRef();
    const dropdownTags = useRef();
    var tagList = [];

    notes?.forEach(item => {
        if (item.tags.length > 0) {
            item.tags.forEach(tag => {
                let checked = false;
                for (let i = 0; i < tagFilter.length; i++) {
                    if (tag == tagFilter[i]) {
                        checked = true;
                    } 
                }
                tagList.push({tagName: tag, checked});
            });     
        }
        tagList = [...new Map(tagList.map(tag => [tag['tagName'], tag])).values()];
    });

    useEffect(() => {
        dropdown.current.classList.add('flex');
        dropdown.current.classList.remove('hidden');
        dropdownTags.current.classList.add('hidden');
        dropdownTags.current.classList.remove('visible');
    }, [activeFilter, notes]);

    const handleRemoveTagFilter = useCallback((removedTag) => { 
        dispatch(tagFilterChanged(tagFilter.filter(tag => tag !== removedTag))); 
    }, []);

    const addTag = useCallback(
        (tag) => () => {
        let item = document.querySelector(`#tag_${tag}`) 
        if (!item.checked) {
            handleRemoveTagFilter(tag);
        } else {
            if (!tagFilter?.includes(tag)) {
                dispatch(activeFilterChanged('tag'))
                dispatch(tagFilterChanged([...tagFilter, tag]))
            }
        }},
        [tagFilter, dispatch, handleRemoveTagFilter]
    );

    const handleFilterChanged = (name) => {
        if (name == 'tag') hideTagDropdown();
        dispatch(activeFilterChanged(name));
    }

    function hideTagDropdown() {
        if (dropdownTags.current.classList.contains('hidden')) {
            dropdownTags.current.classList.add('visible');
            dropdownTags.current.classList.add('flex');
            dropdownTags.current.classList.remove('hidden');
        } else {
            dropdownTags.current.classList.add('hidden');
            dropdownTags.current.classList.remove('visible');
        } 
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
            ['tag',  <div key={`${_id}_`} className="flex gap-2 xs:flex-col lg:flex-row"><i className="fa-solid fa-tags"></i><i className="fa-solid fa-chevron-down text-sm"></i></div>],
        ]);
        const btnClass = classnames(className, { 'bg-mainColor dark:border dark:border-mainColor dark:bg-inherit text-zinc-700': name === activeFilter});
        
        return (
            <div key={`${_id}_`} className="lg:min-w-full">
                {/* lg */}
                <Link 
                    key={_id}
                    onClick={() => handleFilterChanged(name)}
                    className={`flex items-center lg:justify-start xs:hidden lg:flex min-w-full cursor-pointer rounded-md hover:bg-mainColor hover:text-hoverColor p-2 no-underline xl:text-lg text-base transition text-semiLight whitespace-break-spaces font-semibold dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit ${btnClass}`}>
                    {setIcon(mapIcons, name)} {` ${label}`}
                </Link>
                {/* xs */}
                <Link 
                    key={`xs_${_id}`}
                    onClick={() => handleFilterChanged(name)}
                    className={`lg:hidden xs:flex justify-center items-center max-w-10 min-w-10 max-h-10 min-h-10 cursor-pointer rounded-md hover:bg-mainColor hover:text-hoverColor p-2 no-underline xl:text-lg text-base transition text-semiLight dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit ${btnClass}`}>
                    {setIcon(mapIcons, name)}
                </Link>
            </div>
        );
    });

    
    return (
        <div className="flex flex-col justify-center items-center w-full">
             {/* lg */}
            <Link
                className={`transition w-full flex items-center md:hidden cursor-pointer rounded-md p-2 mb-1 no-underline xl:text-lg text-base xs:hidden sm:hidden xl:block lg:block text-semiLight bg-hoverColor font-semibold dark:text-mainColor dark:hover:bg-mainColor dark:hover:text-inherit`}>
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

            <ul className="hidden min-w-40 max-w-44 max-h-32 absolute top-96 xs:left-2 lg:left-6 ml-8 p-2 shadow-md rounded-md bg-hoverColor text-semiLight flex-col overflow-auto scroll-smooth z-50" 
                ref={dropdownTags}
                id="dropdownTags">
                {tagList.length > 0 
                    ? tagList.map(tag => {
                        return (
                            <div 
                                className={`flex items-center gap-2 min-h-10 max-h-16 lg:text-xs hover:bg-mainColor cursor-pointer hover:text-bgColor p-1 rounded-md break-all`} 
                                key={`${tag.tagName}`+2}>
                                <input 
                                    id={`tag_${tag.tagName}`}
                                    className="ml-2 accent-mainColor h-4 w-4"
                                    type="checkbox" 
                                    checked={tag.checked}
                                    onChange={addTag(tag.tagName)}/>
                                <div className="text-lg">{tag.tagName}</div>
                            </div> 
                        )
                    }) 
                : 'Tag list is empty'
                }
            </ul>
        </div>
    )
}


export default Filters;