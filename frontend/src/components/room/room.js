import React, {useEffect, useState} from "react";
import "./room.css";

import Socket from "../../assets/js/sockets/socket";
import {useParams} from "react-router-dom";
import Room from "../../assets/js/room/Room";
import UserScreen from "../user-screen/user-screen";
import RoomActionPanel from "../room-action-panel";
import ApplicationMediaManager from "../../assets/js/application-media-manager";
import AudioSystem from "../../assets/js/audio-system/audio-system";

export function WidgetRoom() {
	
	const {id} = useParams();
	const [users, setUsers] = useState([]);
	
	let room;
	
	useEffect(() => {

		document.title = `Room ${id}`;

		AudioSystem.init();
		
		room = new Room();
		room.on('update', () => {
			
			let v = Object.values(room.users).map(elem => {
				
				elem.hash = Math.floor(Math.random() % 1000);
				return elem;
			});
			setUsers(v);
		})
		window.room = room;

		
		ApplicationMediaManager.onupdateTrack(() => {
			window.room.recall(ApplicationMediaManager.getTracks());
		})
		
		
		return () => {
			console.log('Сброс')
		}
	}, [id])
	
	
	function recall() {
		window.room.recall(ApplicationMediaManager.getTracks());
	}

	


	return (
		<div class = "room-wrap">
			<p>Room with id {id}</p>
			<button onClick={() => recall()}>re call</button>
			<div className = "room-body room-users-cards">
				{
					users.map(user => <UserScreen user = {user} key = {user._index} />)
				}
			</div>
			
			<div className = "room__action-panel">
				<RoomActionPanel/>
			</div>
			
		</div>
	)
}
