import React, {useState} from "react";
import "./room.css";

import {useParams} from "react-router-dom";
import {RoomPreloadConfig} from "../room-preload-config";
import {RoomContent} from "../room-content";
import AudioSystem from "./../../assets/js/audio-system/audio-system"

export function WidgetRoom() {
	const {id} = useParams();
	
	const [ready, setReady] = useState(false);

	
	async function connectToRoom() {
		
		await AudioSystem.init();
		
		setReady(true);
		
	}
	
	return (
			<div className = "room-wrap">
				{
					ready?<RoomContent id={id}/>:<RoomPreloadConfig roomId={id} handleConnect={() => connectToRoom()}/>
				}
				
			</div>
		
	)
}
