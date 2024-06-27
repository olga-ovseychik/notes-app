import { useRouteError, Link } from "react-router-dom";
import notFound from '../assets/404.svg';

export default function NoMatch() {

  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col justify-center items-center h-dvh">
      <img className="w-1/3" src={notFound} alt="Page not found" />
      <Link className="text-textColor bg-light rounded-full p-3 hover:bg-amber-200 transition" to={`/notes`}>GO BACK HOME</Link>
      <a className="flex text-xs mt-6 text-zinc-500" href="https://storyset.com/web">Illustrations by Storyset</a>
    </div>
  );
}