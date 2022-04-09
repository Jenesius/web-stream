import React from "react";
import "./index.css";

export default function RoomActionPanelItem(props: ItemParams) {
	
	const activeClass = props.active ? 'action-item_active' : ''
	return (
		<div
			className ={`action-item ${activeClass}`}
			onClick={props.onPress}>
			<i className={`fi fi-rr-${props.icon}`}/>
		</div>
	)
	
}
interface ItemParams {
	icon: string,
	onPress: () => {},
	active: boolean
}
