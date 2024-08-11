import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { XCircleIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useGetNoteQuery } from "../../app/services/notesApiSlice";
import { useDeleteNoteMutation, useEditNoteMutation } from "../../app/services/notesApiSlice";
import { activeFilterChanged } from "../../app/services/filtersSlice";
import { tagFilterChanged } from "../../app/services/tagsSlice";
import Spinner from "../Spinner";

const EditItem = () => {
    const { noteId } = useParams();
    const {data: note, isLoading} = useGetNoteQuery(noteId);

    const [editNote, {isLoading: isUpdateNoteLoading}] = useEditNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();
    const activeFilter = useSelector(state => state.filters.activeFilter);
    const tagFilter = useSelector(state => state.tags.tagFilter);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [noteText, setNoteText] = useState(note?.text);
    const [noteTitle, setNoteTitle] = useState(note?.title);
    const [flag, setFlag] = useState(note?.flagged);
    const [tagsList, setTagsList] = useState(note?.tags);
    const [todosList, setTodoList] = useState(note?.todos);
    const [tag, setTag] = useState('');
    const [todo, setTodo] = useState('');    

    const input = document.getElementById(`$_${noteId}`); 

    const settingsList = useRef(null);
    const textarea = useRef(null);
    const todoInputRef = useRef(null);

    const addTag = useCallback(
        (tag) => () => {
            if (!tagFilter?.includes(tag)) {
                dispatch(activeFilterChanged('tag'))
                dispatch(tagFilterChanged([...tagFilter, tag]))
            }
    }, [tagFilter, dispatch]);

    useMemo(() => {
        setNoteText(note?.text)
        setNoteTitle(note?.title)
        setFlag(note?.flagged)
        setTagsList(note?.tags)
        setTodoList(note?.todos)
    }, [note]);

    const updateNote = () => {
        if (noteText != note?.text || noteTitle != note?.title) {
            editNote({ id: noteId, text: noteText, title: noteTitle });
        }   
    };

    const handleEditNote = (e) => {
        e.preventDefault();
        updateNote();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            input ? input.blur() : null;
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (![...note.tags]?.includes(tag)) {
                setTagsList([...note.tags, tag]);
                editNote({ id: noteId, tags: [ ...note.tags, tag] });
                e.target.value = '';
                e.target.blur();
            } 
        }
    };

    const handleRemoveNote = () => {
        deleteNote(noteId);
        hideShowSettings();
        navigate('/');
    };

    const handleFlaggedNote = (e) => {
        e.preventDefault();
        let getFlagged = !flag;
        setFlag(getFlagged);
        editNote({ id: noteId, flagged: getFlagged });
    };

    const handleOnChange = (e) => {
        setNoteText(e.target.value);
    };

    const onKeyDownTitle = (e) => {
        if (e.key === 'Enter') {
            if (textarea.current) textarea?.current.focus();
        }
    };

    const handleOnBlurTodo = (e) => {
        e.preventDefault();
        addTodo();
        if (todo != '' && !isWhitespaceString(todo)) { 
            todoInputRef?.current.focus();
        } else {
            setTodo('');
        }
    }

    const handleTodoKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTodo();
        }
    };

    function addTodo() {
        if (todo != '' && !isWhitespaceString(todo)) {
            setTodoList([...note.todos, {text: todo, completed: false}]);
            editNote({ id: noteId, task: true, todos: [...note.todos, {text: todo, completed: false}] });
            setTodo('');
        } else {
            setTodo('');
        }
    }

    const handleCheckedTodo = (todo, id) => {
        let todoInput = document.getElementById(`todo_input_${id}`);
        let todoCheck = document.getElementById(`todo-checkbox_${id}`);
        if (todoInput.classList.contains('text-semiLight')) {
            let updatedArr = note?.todos.map(item => (item._id === id ? {...item, completed: false} : item));
            setTodoList(updatedArr);
            editNote({ id: noteId, todos: updatedArr });
            todoCheck.checked = false;
            todoInput.classList.remove('text-semiLight');
        } else {
            let updatedArr = note?.todos.map(item => (item._id === id ? {...item, completed: true} : item))
            setTodoList(updatedArr);
            editNote({ id: noteId, todos: updatedArr });
            todoCheck.checked = true;
            todoInput.classList.add('text-semiLight');
        }
    };

    function hideShowSettings() {
        if (settingsList.current.classList.contains('hidden')) {
            settingsList.current.classList.remove('hidden');
            settingsList.current.classList.add('inline-block');
        } else {
            settingsList.current.classList.remove('inline-block');
            settingsList.current.classList.add('hidden');    
        }
    }

    const handleOnDeleteTag = (deletedTag) => {
        let modifiedTagArr = note.tags.filter(tag => tag != deletedTag);
        setTagsList(modifiedTagArr);
        editNote({ id: noteId, tags: [...modifiedTagArr] });
    };

    const handleOnDeleteTodo = (deletedTodo) => {
        let modifiedTodoArr = note?.todos.filter(item => item.text != deletedTodo);
        setTodoList(modifiedTodoArr);
        editNote({ id: noteId, todos: [...modifiedTodoArr] });
    };

    const handleOnDeleteCompletedTodos = () => {
        let modifiedTodoArr = note?.todos.filter(item => !item.completed);
        setTodoList(modifiedTodoArr);
        editNote({ id: noteId, todos: [...modifiedTodoArr] });
    };

    function checkCompletedTodos() {
        return note?.todos.some(todo => todo.completed);
    }

    function isWhitespaceString (str) {
        return !str.replace(/\s/g, '').length;
    } 

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Spinner size={16} color={'mainColor'}/>
            </div>
        )
    }

    return (
        <div className='flex flex-col justify-between shadow-lg border rounded-md hover:border-light cursor-default bg-white p-10 overflow-auto scroll-smooth dark:bg-darkModeSecColor dark:border-none dark:shadow-darkMode'>
            <div className="flex flex-col h-dvh">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex justify-between mt-2">
                        <div id={`${noteId}_s`} className="text-xs text-slate-500 dark:text-semiLight pl-2">{isUpdateNoteLoading ? 'Saving' : null}</div>
                    </div>
                    <div className="relative self-end">
                        <EllipsisVerticalIcon onClick={hideShowSettings} className="w-6 h-6 text-slate-600 dark:text-mainColor cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-hoverColor"/>
                        <ul ref={settingsList} className="hidden absolute right-0 text-sm min-w-36 border dark:border-none rounded-md p-2 mt-2 bg-white dark:bg-hoverColor shadow-lg">
                            {note?.flagged ? 
                            <li className="hover:bg-slate-100 dark:hover:bg-zinc-600 dark:text-semiLight cursor-pointer rounded-md p-1 text-slate-600" onClick={handleFlaggedNote}><i className="fa-solid fa-flag mr-2"></i>Remove flag</li>
                            : <li className="hover:bg-slate-100 dark:hover:bg-zinc-600 dark:text-semiLight cursor-pointer rounded-md p-1 text-slate-600" onClick={handleFlaggedNote}><i className="fa-regular fa-flag mr-2"></i>Add flag</li>}
                            <li className="hover:bg-slate-100 dark:hover:bg-zinc-600 cursor-pointer rounded-md p-1 text-red-500" onClick={() => handleRemoveNote(noteId)}><i className="fa-regular fa-trash-can mr-2"></i>Delete note</li>
                            {checkCompletedTodos() ?
                            <li className="hover:bg-slate-100 dark:hover:bg-zinc-600 cursor-pointer rounded-md p-1 text-amber-500" onClick={handleOnDeleteCompletedTodos}><i className="fa-regular fa-trash-can mr-2"></i>Delete completed tasks</li>
                            : null}    
                        </ul>
                    </div>
                </div>
                <input 
                    type="text" 
                    value={noteTitle} 
                    maxLength="85"
                    onKeyDown={onKeyDownTitle} 
                    onBlur={handleEditNote} 
                    onChange={(e) => setNoteTitle(e.target.value)} 
                    placeholder="Type your title here"
                    className="mt-4 text-xl pl-2 mb-4 focus:outline-none focus:bg-light rounded-md bg-inherit text-textColor dark:focus:bg-hoverColor dark:text-semiLight"
                    autoFocus/>
                <div className="overflow-auto scroll-smooth max-h-96">
                    {todosList?.map((item) => {
                            return (
                                <div className={`flex items-center gap-2 min-h-10 max-h-16 `} key={item._id}>
                                    <input 
                                        className="ml-2 accent-mainColor w-4 h-4"
                                        type="checkbox" 
                                        id={`todo-checkbox_${item._id}`}
                                        name="todo-input" 
                                        onChange={() => handleCheckedTodo(item, item._id)} 
                                        checked={item?.completed ? true : false}/>
                                    <div id={`todo_input_${item._id}`} className={`${item.completed ?'text-semiLight dark:text-textColor' : 'text-textColor dark:text-semiLight'}`}>
                                        {item.text} 
                                        <i className={`hidden fa-regular fa-circle-xmark cursor-pointer ml-4 text-secTxtColor`} 
                                            onClick={() => handleOnDeleteTodo(item.text)}>
                                        </i>
                                    </div>
                                </div> 
                            );
                        })
                    }
                </div>
                {(activeFilter == 'task' && note?.todos.length == 0) || (note?.task && (note?.todos.length > 0 || note?.todos.length == 0)) ? 
                    <>
                        <div className="flex items-center gap-2 min-h-10 max-h-16">
                            <input 
                                className="ml-2 accent-mainColor w-4 h-4"
                                type="checkbox"
                                disabled={true}
                                name="input"/>
                            <input 
                                ref={todoInputRef}
                                onChange={e => setTodo(e.target.value)}
                                className={`w-full focus:outline-none focus:bg-zinc-50 rounded-md p-2 text-textColor dark:text-semiLight dark:focus:bg-hoverColor text-base bg-inherit resize-none min-h-6 max-h-16`}
                                onKeyDown={handleTodoKeyDown}
                                onBlur={handleOnBlurTodo}
                                value={todo}
                                placeholder="+ item"/>
                        </div> 
                    </> 
                    : <textarea 
                        id={`$_${noteId}`}
                        ref={textarea}
                        type="text" 
                        value={noteText}
                        placeholder="Your awesome text is placed here"
                        onChange={handleOnChange}
                        onBlur={handleEditNote}
                        className="focus:outline-none focus:bg-light rounded-md p-2 bg-inherit text-textColor text-lg resize-none h-2/3 mt-1 dark:focus:bg-hoverColor dark:text-semiLight placeholder:italic"
                        onKeyDown={handleKeyDown}/>
                }
            </div>
            <div>
                <div className='flex justify-between pl-2 mt-2'>
                    <div className="flex">{flag ? <i className="fa-solid fa-flag mr-2 text-red-600"></i> : null}</div>
                </div> 
                <div className="mt-4">
                    <div className="relative inline-block w-20 mr-2">
                        <i className="fa-solid fa-tag absolute left-2 top-1.5 text-zinc-500 dark:text-secTxtColor"></i>
                        <input  
                            // ref={tagInput} 
                            onKeyDown={handleTagInputKeyDown} 
                            onChange={(e) => setTag(e.target.value)}
                            // onBlur={setTag('')}
                            type="text" 
                            placeholder={`+ tag`}
                            className={`focus:outline-none rounded-md p-2 text-xs bg-slate-100 dark:bg-hoverColor text-slate-600 placeholder:text-zinc-500 dark:placeholder:text-secTxtColor dark:text-semiLight pl-8 py-1 px-2 mr-2 w-full placeholder:text-xs`}/> 
                    </div>
                    {tagsList?.map((tag, i) => {
                            i++;
                            return (
                                <div className="inline-block relative" key={`tag_${noteId}_${i}`}>
                                    <span 
                                        className="bg-mainColor dark:bg-mainColor text-textColor text-xs font-medium me-2 px-2.5 py-0.5 rounded text-center cursor-pointer"
                                        onClick={addTag(tag)}>
                                        {tag}
                                    </span>
                                    <XCircleIcon 
                                        onClick={() => handleOnDeleteTag(tag)}
                                        className="w-4 block absolute bottom-0 top-0 right-0 cursor-pointer text-textColor dark:text-white"/>
                                </div>
                            );
                        })
                    }
                </div>
            </div>            
        </div>
    )
}

export default EditItem;