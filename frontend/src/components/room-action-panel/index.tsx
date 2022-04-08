import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/store-hooks";
import {updateConstrains} from "../../store/modules/media-store";

export default function RoomActionPanel() {
	
	const dispatch = useAppDispatch();
	const mediaConstrains = useAppSelector(state => state.media.constrains);
	
	
	
	return (
		<div>
			<div className={mediaConstrains.audio?'action_active': ''}
				 onClick={() => dispatch(updateConstrains({audio: !mediaConstrains.audio}))}
			>Audio</div>
			<div >Video</div>
			<div>Screen</div>
			<div>Leave</div>
		</div>
	)
}
