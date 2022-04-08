import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface MediaConstrains{
	audio: boolean
}

export const mediaSlice = createSlice({
	name: 'media',
	initialState: {
		constrains: {
			audio: true,
			video: true,
			screen: true,
		}
	},
	reducers: {
		updateConstrains: (state, action: PayloadAction<MediaConstrains>) => {
			
			state.constrains.audio = action.payload.audio
			
		}
	}
})

export const {updateConstrains} = mediaSlice.actions;

export default mediaSlice.reducer;
