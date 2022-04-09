import React from "react";
import {useAppDispatch, useAppSelector} from "../../store/store-hooks";
import {updateConstrains} from "../../store/modules/media-store";
import RoomActionPanelItem from "../room-action-panel-item";
import ApplicationMediaManager from "./../../assets/js/application-media-manager";
import "./index.css";
import {useDispatch, useSelector} from "react-redux";

export default function RoomActionPanel() {
	
	//const dispatch = useAppDispatch();
	//const mediaConstrains = useAppSelector(state => state.media.constrains);
	
	const {microphone, camera, screen} = useSelector((state:any) => state.mediaConstrains)
	
	const array:any = [
		{
			icon: 'microphone',
			callback: () => ApplicationMediaManager.microphone(),
			active: microphone
		},
		{
			icon: 'video-camera',
			callback: () => ApplicationMediaManager.camera(),
			active: camera
		},
		{
			icon: 'screen',
			callback: () => ApplicationMediaManager.screen(),
			active: screen
		}
	]
	
	return (
		<div className="room-action-panel">
			{
				array.map((item:any) => (
					<RoomActionPanelItem icon={item.icon} onPress={item.callback} active={item.active} key = {item.icon}/>
				))
			}

		</div>
	)
}
