import { useNavigate } from "react-router-dom";


const Item = ({ noteId, text, title, updatedAt, todos, task }) => {

    const navigate = useNavigate();
    const completedTodos = todos.filter(todo => todo.completed);

    const handleOnClick = (event) => {
        event.preventDefault();
        navigate(`/notes/${noteId}`);
    };

    return (
        <div 
            className={`flex flex-col justify-between max-w-full min-h-28 my-2 border-l-8 border-l-transparent border-b border-zinc-200 box-border p-2 hover:bg-light hover:rounded-lg hover:border-b-transparent hover:border-l-8 hover:border-l-mainColor cursor-pointer dark:hover:bg-hoverColor`}
            onClick={handleOnClick} 
            id={noteId}>
            <div className={`xs:text-base break-words ${!title ? 'text-secTxtColor dark:text-semiLight' : 'text-hoverColor dark:text-zinc-200'}`}>
                {title ? `${title.length > 30 ? `${title.slice(0, 30)}...` : title}` : 'Untitled'} 
            </div>
            <div className={`ignore text-sm break-words ${!text ? 'text-secTxtColor dark:text-semiLight' : 'text-hoverColor dark:text-zinc-200'}`}>
                {!text && todos.length == 0 && !task ? `Just start writing something` : `${text.length > 40 ? `${text.slice(0, 40)}...` : text}`}
                {!text && task && todos.length == 0 ? `Type some todos` : null}
            </div>
            {todos.length > 0 ?
                 <div className="ignore">
                    <div className="inline-block relative py-2">
                        <span 
                            className="bg-mainColor dark:bg-mainColor text-textColor text-xs font-medium me-2 px-1.5 py-0.5 rounded text-center">
                            <i className="fa-regular fa-circle-check mr-1"></i> {completedTodos.length}/{todos.length}
                        </span>
                    </div>
                </div> 
            : null}
            <div className="text-xs text-slate-500 dark:text-light ignore">{`${updatedAt}`}</div>
        </div>
    )
}


export default Item;