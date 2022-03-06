
// Video that will be fetched and appended
const remoteVidUrl = `https://raw.githubusercontent.com/chromium/chromium/b4b3566f27d2814fbba1b115639eb7801dd691cf/media/test/data/bear-vp9-opus.webm`;
const remoteType = `video/webm; codecs="vp9,opus"`
const link = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.720p.webm'
const linkType = 'video/webm; codecs="vp8,vorbis"'

const state = {
	link: link,
	type: linkType
}

export default async function  TestVideo(ref){
	const mediaSource = new MediaSource();
	// This creates a URL that points to the media buffer,
	// and assigns it to the video element src
	ref.src = URL.createObjectURL(mediaSource);
	

	
	
	
	// Fetch remote URL, getting contents as binary blob
	const vidBlob = await (await fetch(state.link)).blob();
	// We need array buffers to work with media source
	const vidBuff = await vidBlob.arrayBuffer();
	
	/**
	 * Before we can actually add the video, we need to:
	 *  - Create a SourceBuffer, attached to the MediaSource object
	 *  - Wait for the SourceBuffer to "open"
	 */
	/** @type {SourceBuffer} */
	const sourceBuffer = await new Promise((resolve, reject) => {
		const getSourceBuffer = () => {
			try {
				const sourceBuffer = mediaSource.addSourceBuffer(state.type);
				resolve(sourceBuffer);
			} catch (e) {
				reject(e);
			}
		};
		if (mediaSource.readyState === 'open') {
			getSourceBuffer();
		} else {
			mediaSource.addEventListener('sourceopen', getSourceBuffer);
		}
	});
	
	// Now that we have an "open" source buffer, we can append to it
	sourceBuffer.appendBuffer(vidBuff);
	
	setInterval(() => {
		console.log('Uppend')
		sourceBuffer.appendBuffer(vidBuff);
	}, 2000);
	
	// Listen for when append has been accepted and
	// You could alternative use `.addEventListener` here instead
	sourceBuffer.onupdateend = () => {
		// Nothing else to load
		//if (mediaSource.readyState === 'open')
		//mediaSource.endOfStream();
		// Start playback!
		// Note: this will fail if video is not muted, due to rules about
		// autoplay and non-muted videos
		ref.play();
	};
	

}

async function appendBuffer(buffer, value){
	return new Promise(resolve => {
		
		buffer.appendBuffer(value);
		buffer.addEventListener('updateend', resolve);
		
	})
}
const chunks = [];

function onData(value) {
	chunks.push(value);
	
	readChunk();
}

function readChunk() {
	
	const reader = FileReader();
	reader.onload = () => {
	
	}
	
}

export  function TestVideo1() {
	
	const mediaSource = new MediaSource();
	
	const video2url = URL.createObjectURL(mediaSource);
	
	
	
	console.log('++');
	mediaSource.addEventListener('sourceopen', () => {
		console.log('++');
		const sourceBuffer = mediaSource.addSourceBuffer(state.type);

		
		
		fetch(state.link)
		.then(response => response.body)
		.then(body => {
			const reader = body.getReader();
			
			return new ReadableStream({
				start(controller) {
					
					(function push() {
						
						reader.read().then(async ({done, value}) => {
							
							if (done) {
								controller.close();
								console.log('Stream done.');
								return;
							}
							
							await appendBuffer(sourceBuffer, value);
							controller.enqueue(value);
							
							console.log(value);
							
							push();
						})
						
					})()
					
				}
			})
			
		})
		.then(stream => {
			
			console.log(stream);
			
		})
	})
	

	

	
	return video2url;
}
