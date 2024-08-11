import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SideNav from './components/SideNav';
import ItemsList from './components/notes/ItemsList';
import { selectToken } from './app/services/authSlice';
import { useEffect } from 'react';

function App() {
	const token = useSelector(selectToken);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			navigate('/login');
		}
	}, [token]);

	return (
		<div className="grid grid-cols-12">
			<SideNav/>
			<main className='grid lg:col-span-10 sm:col-span-11 xs:col-span-10'>
				<div className='grid xs:grid-cols-12 xs:grid-rows-2 sm:grid-rows-1'>
					<div className={`grid ${location.pathname=='/profile' ? 'xs:row-span-12 sm:col-span-0 xs:h-full' : 'xs:row-span-1 sm:col-span-4 xs:h-dvh'} xs:col-span-full `}>
						{token && location.pathname !== `/profile` ? <ItemsList /> : null}
					</div>
					<div className={`grid xs:row-span-1 xs:col-span-full ${location.pathname=='/profile' ? 'col-span-10' : 'sm:col-span-8'} xs:h-dvh`}>
						<Outlet />                 
					</div>
				</div>
			</main>
		</div>
	)
}

export default App;
