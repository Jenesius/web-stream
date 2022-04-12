import {createStore} from "redux";
const defaultState = {
	mediaConstrains: {
		'user-audio': false,
		'user-video': false,
		'screen-video': false
	}
}

function playlist( state: any = defaultState, action: any ){
	
	if (action.type === 'media:update-constrains') {
	
		const newConstrains = {
			...state.mediaConstrains,
			...action.payload
		}
		
		return {
			...state,
			mediaConstrains: newConstrains
		}
	
	}
	
	return state;
}

const store = createStore(playlist);

store.subscribe(() => {
	//console.log('+',store.getState());
})



/*

*/

// @ts-ignore
window.store = store;

export default store;
