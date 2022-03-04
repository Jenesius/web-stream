import React from "react";
import RoomSocket from "../../assets/js/sockets/RoomSocket";
import "./room.css";
export default class Room extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.handleConnect = this.handleConnect.bind(this);
		this.handleConnectToRoom = this.handleConnectToRoom.bind(this);
		this.handleRoomInformation = this.handleRoomInformation.bind(this);
		
		console.log("=");

		this.state = {
			users: []
		}
		
	}
	
	handleConnect(){}

	
	handleRoomInformation(payload) {
		console.log(payload);
	}
	
	componentDidMount() {
		this.socket = new RoomSocket();
		this.socket.on('room:information', data => {
			console.log(data);
			
			this.setState({
				users: data.users
			})
			
		})

	}
	componentWillUnmount() {

	}

	
	
	handleConnectToRoom(){
		this.socket.emit('room:join');
	}
	
	render(){
		
		return (
			<div>
				
				<div className="room__user-list">
					{
						this.state.users.map(id => (
							<p className="room__user-list__title" key={id}>
								{id}
							</p>
						))
					}
				</div>
				
				<button onClick={this.handleConnect}>Connect</button>
				
				<button onClick = {this.handleConnectToRoom}>
					Connect to default room
				</button>
				
			</div>
		)
		
	}
}
