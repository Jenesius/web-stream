import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface MediaConstrains{
	audio?: boolean,
	video?: boolean,
	screen?: boolean
}

export const mediaSlice = createSlice({
	name: 'media',
	initialState: {
		constrains: {
			audio: false,
			video: false,
			screen: false,
		}
	},
	reducers: {
		updateConstrains: (state, action: PayloadAction<MediaConstrains>) => {
			
			Object.entries(action.payload).forEach(elem => {
				const key = elem[0] as keyof MediaConstrains;
				state.constrains[key] = action.payload[key]
			})
			
		}
	}
})

export const {updateConstrains} = mediaSlice.actions;

export default mediaSlice.reducer;
