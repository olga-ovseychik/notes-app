import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './app/store.js';
import { persistor } from './app/store.js';
import App from './App.jsx';
import NoMatch from './components/NoMatch.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Profile from './components/profile/Profile.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import EditItem from './components/notes/EditItem.jsx';
import './index.css';


const router = createBrowserRouter([
	{
		path: "/",
		element: <App/>,
		errorElement: <NoMatch />,
		children: [
			{
				path: "notes",
				element: <ProtectedRoute/>,
				children: [
					{
						path: ":noteId",
						element: <EditItem />
					},
				]
			},
			{
				path: "/",
				element: <ProtectedRoute/>,
				children: [
					{
						path: "profile",
						element: <Profile />
					},
				]
			},
		]
	},
	{
		path: "login",
		element: <Login />
	},
	{
		path: "register",
		element: <Register />
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	// <React.StrictMode>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<RouterProvider router={router}/>
			</PersistGate>
		</Provider>
	// </React.StrictMode>
)
