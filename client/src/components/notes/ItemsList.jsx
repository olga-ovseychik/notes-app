import moment from 'moment';
import { useRef, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetNotesQuery } from "../../app/services/notesApiSlice";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useAddNoteMutation } from '../../app/services/notesApiSlice';
import Item from './Item';
import Spinner from '../Spinner';
import { tagFilterChanged } from '../../app/services/tagsSlice';
import { activeFilterChanged } from '../../app/services/filtersSlice';


const ItemsList = () => {

    const userInfo = useSelector(state => state.auth.userInfo);
    const { data: notes, isLoading } = useGetNotesQuery(userInfo?.id);
    const [ addNote ] = useAddNoteMutation();
    const activeFilter = useSelector(state => state.filters.activeFilter);
    var tagFilter = useSelector(state => state.tags.tagFilter);
    const tasksCount = notes?.filter(item => item.task).length;
    const [ searchQuery, setSearchQuery ] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const dropdown = useRef();
    const searchInput = useRef(null)
    const removeSearchResultsIcon = useRef(null);
    const searchResultOutput = document.querySelector('#search-result')

    useEffect(() => {}, [notes, tagFilter, filteredNotes]);

    useMemo(() => {
        if (tagFilter.length < 1) {
            dispatch(activeFilterChanged('untagged'));
        }
    }, [tagFilter, dispatch]);

    const filtersMap = new Map([
        ['untagged', `filteredNotes`],
        ['recent', `filteredNotes?.filter(item => moment(moment(item.updatedAt).format('YYYY-MM-DD')).isSame(new Date(), 'day') )`],
        ['flagged', `filteredNotes?.filter(item => item.flagged)`],
        ['task', `filteredNotes?.filter(item => item.task)`],
        ['tag', `filterByTags(filteredNotes, tagFilter)`],
    ]);

    var filteredNotes = useMemo(() => {
        let filteredNotes = searchQuery != '' ? filterBySearch(notes?.slice()) : notes?.slice();
        
        for (let [key, value] of filtersMap) {
            if (activeFilter == key) {
                return Function('return ' + value)(); 
            } 
        }
    }, [notes, activeFilter, tagFilter, searchQuery, filterBySearch, filtersMap, dispatch]);

    const handleOnCreate = async (e) => {
        e.preventDefault();
        const newNote = await addNote({ text: '', title: '', user: userInfo.id });
        navigate(`/notes/${newNote?.data?._id}`);
    };

    const handleRemoveTagFilter = (removedTag) => {
        dispatch(tagFilterChanged(tagFilter.filter(tag => tag !== removedTag)));
    };

    const renderedElements = notes?.map((note) => {
        let dateUpdated = moment(note.updatedAt).fromNow();
        return (
            <Item
                key={note._id}
                noteId={note._id}
                title={note.title}
                text={note.text}
                todos={note.todos}
                updatedAt={dateUpdated}>
            </Item>
        );
    });

    function filterByTags(list, tags) {
        return list?.filter((item) => tags.some((tag) => item.tags.includes(tag)));
    }

    function filterBySearch(list) {
        if (searchInput.current.value == '') {
            searchResultOutput?.classList.remove('visible');
            searchResultOutput?.classList.add('hidden');
            dispatch(activeFilterChanged('untagged'));
        } else {
            searchResultOutput?.classList.remove('hidden');
            searchResultOutput?.classList.add('visivle');
            return list?.filter(item => (item.title).toLowerCase().includes((searchInput.current.value).toLowerCase()));
        }
    }

    const handleClearSearchResult = (event) => {
        event.preventDefault();
        searchResultOutput.classList.remove('visible');
        searchResultOutput.classList.add('hidden');
        setSearchQuery('');
        dispatch(activeFilterChanged('untagged'));
    };  

    const hideShowDropdown = (dropdown) => {
        if (dropdown.current.classList.contains('hidden')) {
            dropdown.current.classList.add('block');
            dropdown.current.classList.remove('hidden');
        } else {
            dropdown.current.classList.add('hidden');
            dropdown.current.classList.remove('block');
        } 
    };
    console.log('NOTES from database: ', notes)
    console.log('FILTERED ITEMS: ', filteredNotes)
    console.log('RENDERED ITEMS: ', renderedElements)
    console.log('ACTIVE FILTER: ', activeFilter)

    return (
        <div className="sm:max-h-dvh sm:min-h-dvh xs:h-full border border-slate-200 bg-white p-4 cursor-pointer overflow-auto scroll-smooth dark:bg-bgColor dark:border-hoverColor">           
            <div className='flex md:flex-row md:justify-between md:items-center xs:justify-between sm:flex-col sm:justify-start lg:p-2 xs:p-0'>
                <div className="relative pl-4 py-2 text-xl text-hoverColor font-bold sm:m-0 sm:p-1 dark:text-semiLight" onClick={() => hideShowDropdown(dropdown)}>
                    {
                        activeFilter== 'task' ? <i className="fa-regular fa-circle-check font-light mr-2"></i> 
                        : activeFilter== 'flagged' ? <i className="fa-regular fa-flag mr-2"></i>
                        : activeFilter== 'recent' ? <i className="fa-regular fa-calendar mr-2"></i>
                        : activeFilter== 'tag' ? <i className="fa-solid fa-tags mr-2"></i>
                        : <i className="fa-regular fa-note-sticky font-light mr-2"></i> 
                    }
                    {`${activeFilter == 'task' ? 'Tasks' : activeFilter == 'flagged' ? 'Flagged' : activeFilter == 'recent' ? 'Today' : activeFilter == 'tag' ? 'Tags' : 'Notes'}`} <i className="fa-solid fa-chevron-down text-sm"></i>
                    <ul 
                        ref={dropdown}
                        className="hidden absolute top-6 min-w-20 text-sm font-normal rounded-md p-2 mt-2 bg-white shadow-md dark:bg-hoverColor">
                        <li onClick={handleOnCreate} className={`hover:bg-light cursor-pointer rounded-md p-1 text-textColor dark:text-semiLight dark:hover:bg-textColor`}>+ New</li>
                    </ul>
                </div>               
                <div className='flex items-center gap-1.5 sm:self-end'>
                    <p className='text-secTxtColor font-light cursor-default text-base'>{`${activeFilter == 'task' ? `${tasksCount} todos` : `${notes?.length ? notes?.length : 0} notes` }`}</p>
                    <PencilSquareIcon className='w-8 h-8 p-1 rounded-lg text-textColor hover:bg-light dark:text-semiLight dark:hover:bg-hoverColor' onClick={handleOnCreate}/>
                </div>
            </div>         
            <div className="flex items-center gap-2 bg-light dark:bg-inherit dark:border dark:border-textColor rounded-md pl-2 ml-2 text-textColor">
                <i className="fa-solid fa-magnifying-glass text-secTxtColor dark:text-mainColor"></i>
                <input          
                    ref={searchInput}
                    type="text"
                    value={searchQuery}  
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full p-2 rounded-md bg-light font-light lg:text-lg md:text-base focus:outline-none dark:bg-inherit dark:text-light dark:placeholder-light `}/>  
                    <i 
                        onClick={handleClearSearchResult}
                        ref={removeSearchResultsIcon}
                        className={`fa-regular fa-circle-xmark pr-2 cursor-pointer dark:text-mainColor ${searchQuery.length > 0 ? 'visible' : 'invisible'}`}>
                    </i>
            </div>
            <p id='search-result' className={`ml-2 my-4 text-slate-600 hidden dark:text-mainColor`}>{searchQuery.length > 0 && filteredNotes.length > 0  ? `Search result: ${filteredNotes?.length}` : searchQuery.length > 0 ? 'No such notes' : null}</p>
            <div className='ml-2 mt-2'>
            {tagFilter?.map(tag => {
                return (
                    <div className="inline-block relative" key={tag}>
                        <span className="bg-mainColor text-textColor text-sm font-medium me-2 px-2.5 py-0.5 rounded text-center cursor-pointer">
                            {tag}
                        </span>
                        <XCircleIcon 
                            onClick={() => handleRemoveTagFilter(tag)}
                            className="w-4 block absolute bottom-0 top-0 right-0 cursor-pointer text-textColor"/>
                    </div>
                    )
                })
            } 
            </div>
            {isLoading
                ? <div className="flex justify-center items-center"><Spinner /></div> 
                : <div className="flex flex-col justify-start">{renderedElements}</div>
            }   
        </div>
    )
}   


export default ItemsList;