import EventEmitter from "./event-emitter";
import makeId from "./make-id";
import PeerError from "./peer-error";

export default class RTCConnection extends EventEmitter{
	
	static EVENT_TRACKS_UPDATE 			= 'tracks:update';
	static EVENT_ON_ICE_CANDIDATE 		= 'peer:candidate';
	static EVENT_NEGOTIATION_CONNECTION = 'peer:create-offer';
	static EVENT_REMOVE_TRACK 			= 'peer:remove-track'
	
	peerConnection: RTCPeerConnection;
	
	/**
	 * Идентификатор клиента с которым устанавливает соединение
	 * На работу RTC-Connection не влияет, используется только для идентификации
	 * соединения.
	 * */
	clientId: string;
	
	/**
	 * Объект сопоставления. На данный момент не используется
	 * */
	credentials: RTCConnectionParams["credentials"]
	
	/**
	 * Массив трэков, которые предоставляет удалённый пользователь.
	 * Почему используется именно массив, а не объект: Т.к. нельзя точно сказать
	 * какие именно tracks будут хранится у нас. Задача RTCConnection дать удобн
	 * ый способ взаимодействия с подключением.
	 * */
	tracks: MediaStreamTrack[] = []
	
	/**
	 * Локальные отправители. Хранятся для удаления трека из подключения.
	 * */
	localRtpSenders: {
		[name: string]: RTCRtpSender
	} = {};
	
	readonly _index = makeId(6);
	
	constructor({tracks, clientId, credentials = {}}: RTCConnectionParams) {
		super();
		this.msg(`new connect to %c${clientId}`, 'color: blue');
		
		this.clientId = clientId;
		this.credentials = credentials;
		
		const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
		
		this.peerConnection = new RTCPeerConnection({
			iceServers,
			
		});
		
		this.updateTracks(tracks); // Устанавливаем новый дорожки
		
		this.peerConnection.ontrack = (e: RTCTrackEvent) => {
			
			try {
				if (!e.streams.length) throw PeerError.OnTrackStreamsIsEmpty(this, e);
				
				// Подписываемся на удаление дорожки
				// ВОзможно нудно подписываться на все стримы, которые есть
				e.streams[0].onremovetrack = (ev) => {
					this.removeRemoteTrack(ev.track.id);
				}
				const streamId = e.streams[0].id;
				this.setMediaStreamCredentials(streamId, {trackId: e.track.id})
				
				this.addRemoteTrack(e.track);
			} catch (e) {
				this.msg(`error set mediaCredentials ${JSON.stringify(e)}`, e)
			}
			
		}
		
		this.peerConnection.oniceconnectionstatechange = () =>
			this.msg(`state is ${this.peerConnection.iceConnectionState}`)
		
		this.peerConnection.onicecandidate = e => {
			this.emit(RTCConnection.EVENT_ON_ICE_CANDIDATE, e.candidate)
		}
		this.peerConnection.onicecandidateerror = e => {
			console.warn(`Handle error PeerConnection with client ${clientId}`, e);
		}
		
		this.peerConnection.onnegotiationneeded = () => {
			this.msg(`negotiation`)
			this.emit(RTCConnection.EVENT_NEGOTIATION_CONNECTION);
		}
		
		// @ts-ignore
		if (!window.globalPeers) window.globalPeers = []; window.globalPeers.push(this);
		
	}
	
	/**
	 * Закрывает соединение и чистит за нас всё.
	 * */
	close() {
		
		this.msg('closed');
		
		this.peerConnection.close(); // Закрываем соединение
		super.cleanEvents();		 // Удаляем все эвенты
		
		// Удаляем всех сендеров
		Object.values(this.localRtpSenders).forEach(this.removeSender.bind(this));
	}
	
	/**
	 * Удобные состояние подключения
	 * */
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
	 * @description Метод устанавливает используемые треки, и отменяет те, котор
	 * ые уже не используются. Если дорожка не указана в передаваемых значениях,
	 * но она активна - произайдёт удаление sender. Оставшиеся дорожки будут доб
	 * авлены
	 * @param {RTCTrack[]} newTracks - все новые трэки
	 * */
	updateTracks(newTracks: MediaStreamTrack[]) {
		/**
		 * Удаление локальный RTCRtpSender, который не были указаны в переданных
		 * дорожках
		 * */
		Object.values(this.localRtpSenders).forEach(sender => {
			if (newTracks.find(track => track.id === sender.track?.id)) return;
			
			this.removeSender(sender);
		})
		
		newTracks.forEach(track => {
			// Sender уже есть
			if (this.localRtpSenders[track.id]) return;
			
			this.addLocalTrack(track);
		})
	}
	
	/**
	 * @description Начисто удаляет sender.
	 * */
	private removeSender(sender: RTCRtpSender) {
		this.msg(`remove sender`);
		const trackId = sender.track?.id;
		
		/**
		 * Отправка credentials. Нужна была для удаления дорожки их потока.
			const cr =
				Object.entries(this.getMediaStreamCredentials())
				.find(data => data[1].trackId === trackId)
		 
			this.emit(RTCConnection.EVENT_REMOVE_TRACK, cr[0]);
		*/
		if (trackId)
		delete this.localRtpSenders[trackId];
		
		// Мы останавливаем саму дорожку - это ошибка. В RTCConnection дорожки
		// нельзя останавливать. Нельзя на них влиять.
		// sender.track.stop();
		try {
			this.peerConnection.removeTrack(sender);
		} catch (e) {
			this.msg('', e);
		}
		
	}
	
	private addLocalTrack(track: MediaStreamTrack) {
		this.msg(`add local track`);
		const sender = this.peerConnection.addTrack(track, new MediaStream([track]));

		// Сохранили связь
		//this.setMediaStreamCredentials(m.id, {trackId: track.id});
		
		/**
		 * Сохранение RTCRtpSender для дальнейшего использование(Удаление трэка)
		 * */
		this.localRtpSenders[track.id] = sender;
	}
	
	/**
	 * @description Асинронное создание offer. В пресетах используется условие,
	 * что ожидается, как аудио, так и видео.
	 * Для оптимизации, можно сперва получить для чего нам нужен оффер. и далее
	 * уже устанавливать credentials.
	 * */
	async createOffer() {
		
		let offer;
		
		try {
			offer = await this.peerConnection.createOffer({
				/*
				offerToReceiveAudio: true,
				offerToReceiveVideo: true
				
				
				 */
			})
			await this.peerConnection.setLocalDescription(offer)
			return offer;
		} catch (e) {
			
			
			this.msg('', e);
			this.msg('', this);
			
			this.msg('', offer?.type);
			this.msg('', offer?.sdp);
			
		}

	}
	
	/**
	 * @description Создание answer на основе полученного offer
	 * */
	async createAnswer(offer: RTCSessionDescription) {
		await this.peerConnection.setRemoteDescription(offer);
		const answer = await this.peerConnection.createAnswer();
		await this.peerConnection.setLocalDescription(answer)

		return answer;
	}
	
	private addRemoteTrack(newTrack: MediaStreamTrack) {
		this.msg('get remote track');
		
		this.tracks.push(newTrack);
		
		newTrack.onended = () => {
			this.msg(`remote track ended.`);
			
			const index = this.tracks.findIndex(track => track.id === newTrack.id);
			if (index !== -1) this.tracks.splice(index, 1);
			
			this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
		}
		this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
	}
	
	removeRemoteTrack(trackId: string) {
		this.msg(`remove remote track `)
		
		/*
		try {
			const streamId = trackId;
			trackId = this.getMediaStreamCredentials()[streamId].trackId
		} catch (e ){
			this.msg(`error remove remote track ${JSON.stringify(e)}`)
		}
		*/
		const trackIndex = this.tracks.findIndex(track => track.id === trackId)
		if (trackIndex === -1) return;
		
		const track = this.tracks[trackIndex];
		
		// Метод по очистке не нужно вызывать, т.к. он автоматическо добавлен в
		// addRemoteTrack
		track.stop();
		track.dispatchEvent(new Event('ended'));
	}
	

	private msg(text: string, ...any: any) {
		console.log(`[%cpeer:${this._index}%c] ${text}`, 'color: green', 'color: black', ...any);
	}
	
	/**
	 *
	 * !!! НА ДАННЫЙ МОМЕНТ РАБОТА С CREDENTIALS НЕ ОСУЩЕСТВЛЯЕТСЯ. !!!
	 *
	 * Используется для того, чтобы сохранить связь между удалённым пользоватьск
	 * им трэком.
	 * */
	streamMediaCredentials: {
		[streamId: string]: {
			trackId: string,
		}
	} = {}
	/**
	 * @description Установки связи между трэком и его назначением.
	 * */
	public setMediaStreamCredentials(streamId: string, data: {trackId: string}) {
		this.streamMediaCredentials[streamId] = {
			trackId: data.trackId
		}
	}
	
	public getMediaStreamCredentials() {
		return this.streamMediaCredentials;
	}
	
}

interface RTCConnectionParams {
	tracks: MediaStreamTrack[],
	clientId: string,
	credentials?: {
		[type: string]: string
	}
}

