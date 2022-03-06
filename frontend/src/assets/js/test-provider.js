const LINK = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.720p.webm';
const MIME_TYPE = 'video/webm; codecs="vp8,vorbis"';

const LINK_2 = 'https://video.dailymail.co.uk/video/1418450360/2015/02/1418450360_4056782948001_nerdist--1424015378606.mp4';
const MIME_TYPE_2 = 'video/mp4; codecs="avc1.42c015,mp4a.40.2"'

async function downloadVideoFile () {
	
	const blob = await fetch(LINK).then(res => res.blob());
	
	console.log(blob);
	
	const reader = new FileReader();
	
	reader.readAsArrayBuffer(blob)
	
	
	reader.onprogress = e => {
		console.log(e);
	}
	
	reader.onload = e => {
		console.log(e);
		
	}
	
}

export  function SimpleDownload(){

	const mediaSource = new MediaSource();
	const url = URL.createObjectURL(mediaSource);
	
	mediaSource.onsourceopen = () => {
		const videoSource = mediaSource.addSourceBuffer(MIME_TYPE);
		
		fetch(LINK)
		.then( res => res.arrayBuffer())
		.then( data => videoSource.appendBuffer(data));
		
	}
	

	return url;
}

export default function TestProvider () {

	downloadVideoFile()

}
