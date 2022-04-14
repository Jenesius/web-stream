import './App.css';
import {WidgetRoom} from "../room/room";


import { BrowserRouter, Router, Route, Routes, Link } from "react-router-dom";




function App() {
	
	
	return (
		<div className="App">
			<p>Default page</p>
			
			<Link to = "/rooms/5" >Go</Link>
			
			
			<Routes>
				<Route path = "/rooms/:id" element = { <WidgetRoom/> }/>
				<Route path = "/rooms/:id" element = { <WidgetRoom/> }/>

			</Routes>
			
		</div>
	);
}

export default App;
