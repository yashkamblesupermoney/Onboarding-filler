// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import LPReducer from './lenderProgramSlice'
import loggedInUserReducer from './loggedInUserSlice'
import loaderSlice from './loaderSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        lp: LPReducer,
        loggedInUser: loggedInUserReducer,
        loader: loaderSlice
    },
})

// ✅ Typed RootState and Dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch