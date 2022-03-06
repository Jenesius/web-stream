export default new class CaptureMedia{

	stream = null;
	
	async start() {
		
		const constrains = {
			audio: true,
			video: true
		}
		
		this.stream = await navigator.mediaDevices.getDisplayMedia(constrains)
		.catch(err => {
			
			console.warn('Handle error of displaying media.', err);
			
		})
		return this.stream;
	}
	
}()
