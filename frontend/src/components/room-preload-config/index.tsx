import React from "react";

export function RoomPreloadConfig(props: {roomId: string, handleConnect: () => void}) {
	
	return (
		<div>
			<p>Ты пытаешься подключится в комнату {props.roomId}</p>
			<button onClick={props.handleConnect}>Connect</button>
		</div>
	)
}
