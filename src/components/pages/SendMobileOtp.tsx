import { useEffect } from "react"
import { makeAPIGETRequest, makeAPIPOSTRequest } from "../../utils/apiActions"
import { useDispatch } from "react-redux"
import { setToken } from "../../store/authSlice"
import { setProgramsList } from "../../store/lenderProgramSlice"
import SendOtpForm from "../organism/SendOtpForm";
import RectangleGreen from '../../assets/images/imported/RectangleGreen.png'
import BackgroundImage from '../../assets/images/imported/backGroundImage.png'
import { setLoggedInUser } from "../../store/loggedInUserSlice"


export default function SendMobileOtp() {

    const dispatch = useDispatch();
    // const handleLogin = () => {
    //     const payload = {
    //         userName: 'Nitin',
    //         password: 'e2cLKcfo31gqwEaDKdKUig==',
    //         deviceId: 'Nitin',
    //         captchaResponse: '',
    //         deviceType: '',
    //         os: '',
    //         osVersion: '',
    //         appVersion: '',
    //         notificationToken: '',
    //         deviceName: '',
    //     }

    //     const options = {
    //         successCallBack: (res: any) => {
    //             console.log('Login success:', res)
    //             if (res?.token) {
    //                 dispatch(setToken(res.token));
    //                 getUserDetails();
    //             } else {
    //                 console.warn('No token found in response')
    //             }
    //         },
    //         failureCallBack: (err: any) => {
    //             console.error('Login failed:', err)
    //         },
    //     }

    //     makeAPIPOSTRequest('/identityservices/auth/v1/login', {}, payload, options)
    // }

    const getUserDetails = () => {
        const options = {
            successCallBack: (res: any) => {
                console.log('User success:', res)
                dispatch(setLoggedInUser(res));
                getProgramList();
            },
            failureCallBack: (err: any) => {
                console.error('User failed:', err)
            },
        }
        makeAPIGETRequest('/identityservices/auth/v1/users',{}, options)
    }

    const getProgramList = () => {
        const payLoad = {
            "borrowerType": "",
            "company": "",
            "onboardingPartner": "",
            "approve": true
        }

        const options = {
            successCallBack: (res: any) => {
                dispatch(setProgramsList(res?.getProgramsList));
            },
            failureCallBack: (err: any) => {
                console.error('Program failed:', err)
            },
        }

        makeAPIPOSTRequest('/supermoney-service/programs/get', {}, payLoad, options)
    }

    useEffect(() => {
        getUserDetails();
    }, [])

    return (
        <>
            <div className="p-4 text-black dark:text-red-500 dark:border-2 border-red-500">📱 Send Mobile OTP Page</div>
            <div className="relative w-full">
                {/* Full-width green rectangle background */}
                <img src={RectangleGreen} alt="Green Rectangle" className="w-full" />

                {/* Overlay container */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2  w-full px-4 z-10">
                    <div className="flex flex-row w-full">
                        {/* Left image section */}
                        <div className="w-7/12 flex justify-center items-center">
                            <img
                                src={BackgroundImage}
                                alt="Login"
                                className="w-[110%] max-w-none"
                            />
                        </div>

                        {/* Right form card */}
                        <div className="w-5/12 bg-white flex flex-col justify-center items-center relative overflow-hidden rounded-[25px] mt-0 -left-[2%]">
                            <SendOtpForm />
                        </div>
                    </div>
                </div>
            </div>
            {/* <RegisterCustomer/> */}
        </>
    )
}