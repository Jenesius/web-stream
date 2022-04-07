import React, {createRef, useEffect, useRef} from "react";
import {SimpleDownload} from "../../assets/js/test-provider";
import "./index.css";

 class UserScreen1 extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.videoRef = createRef();
		this.src = SimpleDownload()
	}
	componentDidMount() {
		//TestVideo(this.videoRef.current);
		//TestProvider();
	}
	
	
	render() {
		return (
			<video ref = {this.videoRef} key={this.props.src} width="320" height="240" autoPlay controls>
				<source src={this.src} />
			</video>
		)
	}
}

export default function UserScreen({user}) {
	
	 const video = useRef();
	
	 useEffect(() => {
		 if (user.stream)
		 {
			 video.current.srcObject = user.stream;
			 
		 }
	 })
	 

	 
	
	 return (
		 <div className= "user-screen">
			 <video ref = {video} width="320" height="240" autoPlay controls/>

		 </div>
		 
	 )
}
