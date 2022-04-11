import RTCConnection from "./connections/rtc-connection";

export default class PeerError extends Error{
	
	details: any;
	constructor(msg: string, details: any) {
		super(msg);
		this.details =details;
	}
	
	
	static OnTrackStreamsIsEmpty(rc: RTCConnection, e:RTCTrackEvent) {
		const msg = `При получении дорожки, не было найдено дополнительных stream, нужных для того, чтобы была возможность удалить дорожку`;
		return new PeerError(msg, {rc, e});
	}
	
}
