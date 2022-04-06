import './App.css';
import {WidgetRoom} from "../room/room";
import Test from "../test";

import { BrowserRouter, Router, Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<p>Default page</p>
			
			<Routes>
				<Route path = "/rooms/:id" element = { <WidgetRoom/> }/>

			</Routes>
			
		</div>
	);
}

export default App;
