import moment from 'moment';
import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Mark from "mark.js";
import { useGetNotesQuery } from "../../app/services/notesApiSlice";
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useAddNoteMutation } from '../../app/services/notesApiSlice';
import Item from './Item';
import Spinner from '../Spinner';
import ModalGuest from '../ModalGuest';
import { tagFilterChanged } from '../../app/services/tagsSlice';
import { activeFilterChanged } from '../../app/services/filtersSlice';
import { useGetUserQuery } from '../../app/services/usersApiSlice'; 


const ItemsList = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const { data: notes, isLoading } = useGetNotesQuery(userInfo?.id);
    const {data: user} = useGetUserQuery(userInfo?.id);
    const [ addNote ] = useAddNoteMutation();
    const activeFilter = useSelector(state => state.filters.activeFilter);
    var tagFilter = useSelector(state => state.tags.tagFilter);
    const tasksCount = notes?.filter(item => item.task).length;
    const [ searchQuery, setSearchQuery ] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const dropdown = useRef();
    const guestDialogRef = useRef(null);
    const searchInput = useRef(null)
    const removeSearchResultsIcon = useRef(null);
    const searchResultOutput = document.querySelector('#search-result');
    const tagListElement = useRef();
    var tagList = [];

    const markInstance = new Mark(document.querySelector("#context"));
    const options = {
        "exclude": [".ignore"],
        "caseSensitive": false,
    };

    useEffect(() => {
        if (activeFilter == 'tag') {
            tagListElement.current.classList.add('flex');
            tagListElement.current.classList.remove('hidden');
        } else {
            tagListElement.current.classList.add('hidden');
            tagListElement.current.classList.remove('flex');
        }
    }, [notes, tagFilter, filteredNotes, activeFilter]);

 
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
    

    useMemo(() => {
        if (activeFilter !== 'tag' && tagFilter.length > 0) {
            dispatch(tagFilterChanged([]));
        }
    }, [activeFilter])

    useMemo(() => {
        markInstance.unmark({
            done: () => {
              markInstance.mark(searchQuery, options);
            }
          });
    }, [searchQuery])

    var filteredNotes = useMemo(() => {
        let filteredNotes = searchQuery != '' ? filterBySearch(notes?.slice()) : notes?.slice();

        switch (activeFilter) {
            case 'recent':
                return filteredNotes?.filter(item => moment(moment(item.updatedAt).format('YYYY-MM-DD')).isSame(new Date(), 'day') );
            case 'flagged': 
                return filteredNotes?.filter(item => item.flagged);
            case 'task':
                    return filteredNotes?.filter(item => item.task);
            case 'tag':
                return filterByTags(filteredNotes, tagFilter);
            default:
                return filteredNotes
        }
    }, [notes, activeFilter, tagFilter, searchQuery, filterBySearch, dispatch]);

    const handleRemoveTagFilter = useCallback(
        (removedTag) => {
            dispatch(tagFilterChanged(tagFilter.filter(tag => tag !== removedTag)));
    }, [tagFilter, dispatch]) 

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

    const handleOnCreate = async (e) => {
        e.preventDefault();
        const task = activeFilter == 'task' ? true : false;
        const limitNotes = user?.roles.includes('Guest') && notes?.length == 5 ? true : false;

        if (!limitNotes) {
            const newNote = await addNote({ text: '', title: '', user: userInfo.id, task: task});
            navigate(`/notes/${newNote?.data?._id}`);
        } else {
            handleOpenGuestModal();
        }
    };

    const renderedElements = filteredNotes?.map((note) => {
        let dateUpdated = moment(note.updatedAt).fromNow();
        return (
            <Item
                key={note._id}
                noteId={note._id}
                title={note.title}
                text={note.text}
                task={note.task}
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

    const handleOpenGuestModal = useCallback( () => {
        guestDialogRef?.current.showModal();  
    }, []);

    const handleCloseGuestModal = useCallback( () => {
        guestDialogRef?.current.close();  
    }, []);


    return (
        <div className="border border-slate-200 bg-white p-4 cursor-pointer overflow-auto scroll-smooth dark:bg-bgColor dark:border-hoverColor">           
            <ModalGuest guestDialogRef={guestDialogRef} handleCloseGuestModal={handleCloseGuestModal}/>
            <div className='flex md:flex-row md:justify-between md:items-center xs:justify-between sm:flex-col sm:justify-start lg:p-2 xs:p-0'>
                <div className="relative pl-4 py-2 text-lg font-semibold text-hoverColor sm:m-0 sm:p-1 dark:text-semiLight" onClick={() => hideShowDropdown(dropdown)}>
                    {
                        activeFilter == 'task' ? <i className="fa-regular fa-circle-check font-light mr-2"></i> 
                        : activeFilter == 'flagged' ? <i className="fa-regular fa-flag mr-2"></i>
                        : activeFilter == 'recent' ? <i className="fa-regular fa-calendar mr-2"></i>
                        : activeFilter == 'tag' ? <i className="fa-solid fa-tags mr-2"></i>
                        : <i className="fa-regular fa-note-sticky font-light mr-2"></i> 
                    }
                    {`${activeFilter == 'task' ? `Tasks` : activeFilter == 'flagged' ? 'Flagged' : activeFilter == 'recent' ? 'Today' : activeFilter == 'tag' ? 'Tags' : 'Notes'}`}
                    {activeFilter == 'task' || activeFilter == 'untagged' ? <i className="fa-solid fa-chevron-down text-sm"></i> : null}
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
                    id='search-query'       
                    ref={searchInput}
                    type="text"
                    value={searchQuery}  
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full p-2 rounded-md bg-light font-light text-sm focus:outline-none dark:bg-inherit dark:text-light dark:placeholder-light `}/>  
                    <i 
                        onClick={handleClearSearchResult}
                        ref={removeSearchResultsIcon}
                        className={`fa-regular fa-circle-xmark pr-2 cursor-pointer dark:text-mainColor ${searchQuery.length > 0 ? 'visible' : 'invisible'}`}>
                    </i>
            </div>
            
            <ul className="hidden ml-2 mt-2 max-h-32 p-2 shadow-md rounded-md bg-light text-textColor dark:bg-hoverColor dark:text-semiLight flex-col overflow-auto scroll-smooth" 
                ref={tagListElement}
                id="tagListElement">
                {tagList.length > 0 
                    ? tagList.map(tag => {
                        return (
                            <div 
                                className={`flex items-center gap-2 hover:bg-mainColor cursor-pointer hover:text-bgColor p-1 rounded-md break-all`} 
                                key={`${tag.tagName}`+2}>
                                <input 
                                    id={`tag_${tag.tagName}`}
                                    className="ml-2 accent-mainColor h-4 w-4"
                                    type="checkbox" 
                                    checked={tag.checked}
                                    onChange={addTag(tag.tagName)}/>
                                <div className="text-sm">{tag.tagName}</div>
                            </div> 
                        )
                    }) 
                : <p className='text-center text-sm'>Tag list is empty</p>
                }
            </ul>

            <p id='search-result' className={`ml-2 my-4 text-slate-600 hidden dark:text-mainColor`}>{searchQuery.length > 0 && filteredNotes.length > 0  ? `Search result: ${filteredNotes?.length}` : searchQuery.length > 0 ? 'No such notes' : null}</p>
            {isLoading
                ? <div className="flex justify-center items-center"><Spinner size={16} color={'mainColor'} /></div> 
                : <div id='context' className="flex flex-col justify-start">{renderedElements}</div>
            }   
        </div>
    )
}   


export default ItemsList;