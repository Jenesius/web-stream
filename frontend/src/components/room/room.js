import React from "react";
import { io } from "socket.io-client";

export default class Room extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.handleConnect = this.handleConnect.bind(this);
	}
	
	handleConnect(){
		
		const socket = io('ws://localhost:3333', {
			transports: ['websocket'],
			//rejectUnauthorized: false,
		});
		
		
		
		// client-side
		socket.on("connect", () => {
			console.log(socket.id);
		});
		
		socket.on('connect_error', err => {
			console.log(err);
		})
	}
	
	render(){
		
		return (
			<div>
				
				<button onClick={this.handleConnect}>Connect</button>
				
			</div>
		)
		
	}
}
