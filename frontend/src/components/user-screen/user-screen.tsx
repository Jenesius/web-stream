import React, { useEffect, useRef, useState} from "react";
import "./index.css";
import RTCConnection from "../../assets/js/connections/rtc-connection";


interface UserScreenParams {
	user: RTCConnection
}



export default function UserScreen({user}: UserScreenParams) {
	const video = useRef(null);
	
	//const [isVideo, setIsVideo] = useState(false);
	const userId = user.clientId;
	

	function test(user: RTCConnection) {
		let m = new MediaStream();
		
		const videoTrack = user.tracks.find(track => track.kind === 'video');
		const audioTrack = user.tracks.find(track => track.kind === 'audio');
		
		if (videoTrack) m.addTrack(videoTrack);
		if (audioTrack) m.addTrack(audioTrack);
		

		if (video.current)
		{
			
			video.current.srcObject = m;
			video.current.oncanplay = () => {
				video.current.play()
			}
		}
		

	}
	
	useEffect(() => {
		test(user);
	}, [])
	
	user.on(RTCConnection.EVENT_TRACKS_UPDATE, () => {
		setTimeout(() => {
			test(user);
		}, 0)
	})
	
	function init(){
		test(user);
	}
	
	 return (
		 
		 <div className= "user-screen">
			 <p>UserId {userId}</p>
			 <video ref = {video} width="320" height="240" autoPlay muted />
		 </div>
		 
	 )
}
