import { useState, useMemo } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../app/services/authSlice';

const ProtectedRoute = () => {
	const token = useSelector(selectToken);
	const [auth, setAuth] = useState(token);

	useMemo(() => {
		setAuth(token);
	}, [token]);

	return ( 
		auth ? <Outlet /> : <Navigate to='/login'/> 
	)
}

export default ProtectedRoute;