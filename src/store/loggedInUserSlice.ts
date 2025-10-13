import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Role {
    id: number
    roleName: string
    roleCode: string
    archived: boolean
}

export interface LoggedInUser {
    id: number
    username: string
    password: string | null
    email: string
    phoneNum: string
    numCountryCode: string
    name: string
    clientId: string
    clientSecret: string | null
    userType: string | null
    department: string
    whatsappNum: string
    whatsappNumCountryCode: string
    dob: string
    privateKey: string | null
    programId: number
    emailVerified: boolean
    phoneNumVerified: boolean
    createdDate: string
    createdBy: number
    updatedDate: string
    updatedBy: number
    archived: boolean
    roles: Role[]
    customerId: number
    supplierId: number | null
    addressLine1: string
    addressLine2: string
    city: string
    district: string
    state: string
    pincode: number
    profilePic: string | null
    profilePicThumbnail: string | null
}

interface LoggedInUserState {
    user: LoggedInUser | null
}

const initialState: LoggedInUserState = {
    user: null,
}

const loggedInUserSlice = createSlice({
    name: 'loggedInUser',
    initialState,
    reducers: {
        setLoggedInUser(state, action: PayloadAction<LoggedInUser>) {
            state.user = action.payload
        },
        clearLoggedInUser(state) {
            state.user = null
        },
    },
})

export const { setLoggedInUser, clearLoggedInUser } = loggedInUserSlice.actions
export default loggedInUserSlice.reducer