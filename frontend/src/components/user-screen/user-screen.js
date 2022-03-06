import React, {createRef} from "react";
import TestVideo, {TestVideo1} from "../../assets/js/test-video";
import TestProvider, {SimpleDownload} from "../../assets/js/test-provider";

export default class UserScreen extends React.Component {
	
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
