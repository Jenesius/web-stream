import EventEmitter from "../event-emitter/event-emitter";

export default class RTCConnection extends EventEmitter{
	
	//static EVENT_NEW_TRACK = 'new-track';
	static EVENT_TRACKS_UPDATE = 'tracks:update';
	static EVENT_ON_ICE_CANDIDATE = 'peer:candidate';
	static EVENT_NEGOTIATION_CONNECTION = 'peer:create-offer';
	static EVENT_REMOVE_TRACK = 'peer:remove-track'
	
	peerConnection: RTCPeerConnection
	clientId: string;
	tracks: MediaStreamTrack[] = []
	
	localRtpSenders: {
		[name: string]: RTCRtpSender
	} = {};
	
	readonly _index = Math.floor(Math.random() * 10000);
	
	constructor({tracks, clientId}: RTCConnectionParams) {
		super();
		console.log(`[rtc-connection] [%cpeer:${this._index}%c] new`, 'color: green', 'color: black');
		
		this.clientId = clientId;
		
		this.peerConnection = new RTCPeerConnection({iceServers: [     // Information about ICE servers - Use your own!
				/*{
					urls: "stun:stun.stunprotocol.org"
				}*/
			]});
		
		tracks.forEach(track => this.addTrack(track));
		
		this.peerConnection.ontrack = (e: RTCTrackEvent) => this.addRemoteTrack(e.track);
		
		
		this.peerConnection.oniceconnectionstatechange = (e:Event) => {
			console.log(`[rtc-connection] [%cpeer:${this._index}%c] state is ${this.peerConnection.iceConnectionState}`, 'color: green', 'color: black')
		}
		
		
		this.peerConnection.onicecandidate = e => {
			this.emit(RTCConnection.EVENT_ON_ICE_CANDIDATE, e.candidate)
		}
		this.peerConnection.onicecandidateerror = e => {
			console.warn(`Handle error PeerConnection with client ${clientId}`, e);
		}
		
		this.peerConnection.onnegotiationneeded = (e: Event) => {
			console.log(`[rtc-connection] [peer:${this._index}] negotiation`)
			this.emit(RTCConnection.EVENT_NEGOTIATION_CONNECTION);
		}
		
		// @ts-ignore
		if (!window.globalPeers) window.globalPeers = []; window.globalPeers.push(this);
		
	}
	
	close() {
		this.peerConnection.close();
		super.cleanEvents();
	}
	
	get state() {
		return this.peerConnection.connectionState;
	}
	get connected() {
		return this.peerConnection.connectionState === 'connected';
	}
	get closed() {
		return ['closed', 'disconnected', 'failed'].includes(this.state);
	}
	
	/**
	 * Метод для обновления треков между подключением
	 * @description Метод проверяет все треки, отменяет существующие и добавляет новые
	 * @param {MediaStreamTrack[]} newTracks - все новые трэки
	 * */
	updateTracks(newTracks: MediaStreamTrack[]) {
		
		// Удаляем локальные sender, которые не нужно использовать
		Object.values(this.localRtpSenders).forEach(sender => {
			if (newTracks.includes(sender.track)) return;
			
			this.removeSender(sender);
		})
		
		newTracks.forEach(track => {
			if (this.localRtpSenders[track.id]) return;
			
			this.addTrack(track);
		})
		
	}
	
	private removeSender(sender: RTCRtpSender) {
		const trackId = sender.track.id;
		
		this.emit(RTCConnection.EVENT_REMOVE_TRACK, trackId);
		
		console.log(`[rtc-connection] [%cpeer:${this._index}%c] remove track.`, 'color: green', 'color: black', trackId);
		delete this.localRtpSenders[trackId];
		sender.track.stop();
		this.peerConnection.removeTrack(sender);
	}
	
	private addTrack(track: MediaStreamTrack) {
		console.log(`[rtc-connection] [%cpeer:${this._index}%c] setting track.`, 'color: green', 'color: black', track.id);
		const sender = this.peerConnection.addTrack(track);
		this.localRtpSenders[track.id] = sender;
	}
	
	
	async createOffer() {
		const offer = await this.peerConnection.createOffer({
			offerToReceiveAudio: true,
			offerToReceiveVideo: true
		})
		await this.peerConnection.setLocalDescription(offer)
		return offer;

	}
	
	async createAnswer(offer: RTCSessionDescription) {
		await this.peerConnection.setRemoteDescription(offer);
		const answer = await this.peerConnection.createAnswer();
		await this.peerConnection.setLocalDescription(answer)

		return answer;
	}
	
	private addRemoteTrack(newTrack: MediaStreamTrack) {
		console.log(`[rtc-connection] [%cpeer:${this._index}%c] getting track ${newTrack.id}`, 'color: green', 'color: black');

		this.tracks.push(newTrack);
		
		newTrack.onended = () => {
			console.log(`[rtc-connection] remove track ${this._index}`);
			const index = this.tracks.findIndex(track => track.id === newTrack.id);
			if (index !== -1) this.tracks.splice(index, 1);
			
			this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
		}
		
		this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
	}
	removeRemoteTrack(trackId: string) {
		console.log(`[rtc-connection] [%cpeer:${this._index}%c] remove remote track ${trackId}`, 'color: green', 'color: black');
		const trackIndex = this.tracks.findIndex(track => track.id === trackId)
		
		if (trackIndex === -1) return;
		
		const _track = this.tracks[trackIndex];
		
		_track.stop();
		_track.dispatchEvent(new Event('ended'));
		this.tracks.splice(trackIndex, 1);
	}
	
	
}

interface RTCConnectionParams {
	tracks: MediaStreamTrack[],
	clientId: string,
}

