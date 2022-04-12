import React, {createRef} from "react";

export default class Test extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.test = createRef();
		
		this.handleStartRecord = this.handleStartRecord.bind(this);
		
		this.mediaSource = new MediaSource();
		const video2url = URL.createObjectURL(this.mediaSource);
		this.sourceBuffer = null;
		
		let med
		
		
		console.log(this.mediaSource.readyState)
		
		this.mediaSource.addEventListener('sourceopen', ()  => {
			//var mediaSource = this;
			console.log("SourceBuffer was created.");
			this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm;codecs=vp9');
		});
		
		this.arrayOfBlobs = [];
		
	}
	
	async handleStopRecord() {
	
	}
	readChunk() {
		const reader = new FileReader();
		reader.onload = (e) => {
			// как только FileReader будет готов, и загрузит себе кусочек видеопотока
			// мы "прицепляем" перекодированный в Uint8Array (был Blob) кусочек в буфер, связанный
			// с проигрывателем, и проигрыватель начинает воспроизводить полученный кусочек видео/аудио
			this.sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
			
			reader.onload = null;
		}
		reader.readAsArrayBuffer(this.arrayOfBlobs.shift());
	}
	async handleStartRecord() {
		
		const constrains = {video: true};
		
		const stream = await navigator.mediaDevices.getUserMedia(constrains);
		
		this.test.current.srcObject = stream;
		
		const options = {mimeType: 'video/webm;codecs=vp9'};
		const mediaRecorder = new MediaRecorder(stream, options);
		mediaRecorder.ondataavailable = (event) => {
			console.log(event.data);
			
			this.arrayOfBlobs.push(event.data);
			this.readChunk();
		}
		mediaRecorder.start(1000);
		mediaRecorder.onstop = e => {
			console.log('Stop', e)
		};
		mediaRecorder.onstart = e => {
			console.log('Start', e);
		}
		
	}
	
	
	render() {
		return (
			<div>
				<p>Is test</p>
				
				<button onClick={this.handleStartRecord}>start</button>
				<button onClick={this.handleStartRecord}>stop</button>
				
				<video ref={this.test} controls/>
				
			</div>
		)
	}
	
}
