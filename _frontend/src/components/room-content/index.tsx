import UserScreen from "../user-screen/user-screen";
import RoomActionPanel from "../room-action-panel";
import React, {useEffect, useState} from "react";
import ApplicationMediaManager from "../../assets/js/application-media-manager";
import Room from "../../assets/js/room/Room";

export function RoomContent({id}: {id: string}) {
	
	const [users, setUsers] = useState([]);
	
	const [room, setRoom] = useState(null);
	
	useEffect(() => {
		if (!room) return;
		const offRoomUpdate = room.on('update', () => {
			setUsers(Object.values(room.connections));
		})
		
		const offUpdateTrack = ApplicationMediaManager.onupdateTrack(() => {
			room.recall();
		})
		
		return () => {
			offRoomUpdate();
			offUpdateTrack();
		}
		
	}, [room]);
	
	useEffect(() => {
		
		document.title = `Room ${id}`;
		setRoom(new Room());
		
		return () => {
			console.log('Сброс');
			room.leave();
		}
	}, [id])
	
	return (
		<div>
			<p>Room with id {id}</p>
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
