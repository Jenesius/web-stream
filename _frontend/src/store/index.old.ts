import { configureStore } from '@reduxjs/toolkit'
import {mediaSlice} from "./modules/media-store";


const store = configureStore({
	reducer: {
		media: mediaSlice.reducer
	}
})
export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch





