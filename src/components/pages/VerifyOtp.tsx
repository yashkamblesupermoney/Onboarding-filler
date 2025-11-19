import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import RectangleGreen from '../../assets/images/imported/RectangleGreen.png'
import BackgroundImage from '../../assets/images/imported/backGroundImage.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setProgramsList, Programs } from '../../store/lenderProgramSlice'
import { makeAPIPOSTRequest } from '../../utils/apiActions'
import { useSelector } from 'react-redux'
import { RootState, store } from '../../store/store'

interface FormData {
    otp: string
}

export default function VerifyOtp() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const {
        loginId,
        transactionCode,
        mobHidden,
        programIDSet,
        loginType,
        lenderId,
    } = Object.fromEntries(searchParams.entries());
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [programSelected, setProgramSelected] = useState({} as Programs)
    const [errorText, setErrorText] = useState('')
    const [errorFlag, setErrorFlag] = useState(false)
    const loggedInUserDetails = useSelector((state: RootState) => state.loggedInUser.user)
    const documentGroupId = useSelector((state: RootState) => state.lp.documentGroupId)
    const token = store.getState().auth.token || localStorage.getItem('authtoken')
    

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        formState: { errors },
    } = useForm<FormData>()

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
                const matchedProgram = res?.getProgramsList?.find(
                    (p: any) => p.programName === programIDSet
                )
                if (matchedProgram) {
                    setProgramSelected(matchedProgram);
                }
            },
            failureCallBack: (err: any) => {
                console.error('Program failed:', err)
            },
        }

        makeAPIPOSTRequest('/supermoney-service/programs/get', {}, payLoad, options)
    }

    const SendOtp = () => {
        const msgHeader = {
            authToken: "", //dynamic
            loginId: "+91" + loginId, //dynamic
            channelType: "M",
            consumerId: "414",
            deviceId: "SwiggyLoans",
            source: "WEB",
        };


        const deviceFPmsgHeader = {
            clientIPAddress: "192.168.0.122",
            connectionMode: "WIFI",
            country: "United States",
            deviceManufacturer: "Xiaomi",
            deviceModelNo: "Mi A2",
            dualSim: false,
            imeiNo: "09d9212a07553637",
            latitude: "",
            longitude: "",
            nwProvider: "xxxxxxxx",
            osName: "Android",
            osVersion: 28,
            timezone: "Asia/Kolkata",
            versionCode: "58",
            versionName: "5.5.1",
        };

        const dataInfo = {
            mobileNo: "+91" + loginId,
            otpFor: loginType,
        };

        const employeeDetails = { dataInfo, deviceFPmsgHeader, msgHeader };
        console.log("this is hiter", employeeDetails);
        const options = {
            successCallBack: (res: any) => {
                console.log('OTP sent successfully:', res)
            },
            failureCallBack: (err: any) => {
                console.error('Failed to send OTP:', err)
            },
        }
        makeAPIPOSTRequest('/supermoney-service/send/mobile/otp', {}, dataInfo, options)

    }

    const otpType = (data: FormData) => {
        if (loginType === 'verifyMobile') {
            verifyOtpSet()
        }
        else {
            loginOtp()
        }
    }

    const verifyOtpSet = () => {
        const formData = getValues();
        const msgHeader = {
            authToken: "", //dynamic
            loginId: "+91" + loginId, //dynamic
            channelType: "M",
            consumerId: "414",
            deviceId: "SwiggyLoans",
            source: "WEB",
        };


        const deviceFPmsgHeader = {
            clientIPAddress: "192.168.0.122",
            connectionMode: "WIFI",
            country: "United States",
            deviceManufacturer: "Xiaomi",
            deviceModelNo: "Mi A2",
            dualSim: false,
            imeiNo: "09d9212a07553637",
            latitude: "",
            longitude: "",
            nwProvider: "xxxxxxxx",
            osName: "Android",
            osVersion: 28,
            timezone: "Asia/Kolkata",
            versionCode: "58",
            versionName: "5.5.1",
        };

        const dataInfo = {
            mobileNo: "+91" + loginId,
            otpFor: "verifyMobile",
            otp: formData.otp,
            transactionCode: transactionCode
        };
        let employeeDetails = { dataInfo, deviceFPmsgHeader, msgHeader };
        console.log("this is hit verifyOtp", employeeDetails);

        const options = {
            successCallBack: (res: any) => {
                if (res.successFlag === true) {
                    const queryDataOtp = new URLSearchParams({
                        loginId: loginId,
                        otpAuthorizationCode: res.otpAuthorizationCode,
                        mobHidden: mobHidden,
                        programIDSet: programIDSet,
                        lenderId: lenderId
                    }).toString();
                    navigate(`/setpin?${queryDataOtp}`);
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to verify OTP:', err);
            },
        }

        makeAPIPOSTRequest('/supermoney-service/send/verify/otp', {}, dataInfo, options);
    }

    const loginOtp = () => {
        const formData = getValues();
        const msgHeader = {
            authToken: "", //dynamic
            loginId: "+91" + loginId, //dynamic
            channelType: "M",
            consumerId: "414",
            deviceId: "SwiggyLoans",
            source: "WEB",
        };


        const deviceFPmsgHeader = {
            clientIPAddress: "192.168.0.122",
            connectionMode: "WIFI",
            country: "United States",
            deviceManufacturer: "Xiaomi",
            deviceModelNo: "Mi A2",
            dualSim: false,
            imeiNo: "09d9212a07553637",
            latitude: "",
            longitude: "",
            nwProvider: "xxxxxxxx",
            osName: "Android",
            osVersion: 28,
            timezone: "Asia/Kolkata",
            versionCode: "58",
            versionName: "5.5.1",
        };

        const dataInfo = {
            userId: "+91" + loginId,
            pin: formData.otp,
            language: "en"
        };

        let employeeDetails = { dataInfo, deviceFPmsgHeader, msgHeader };
        console.log("this is hit in loginOTP", employeeDetails)

        const options = {
            successCallBack: (res: any) => {
                if (res.successFlag === true) {
                    createApplicationId(res.customerId, res.profileId.primaryProfileId);
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to login OTP:', err);
            },
        }

        makeAPIPOSTRequest('/supermoney-service/customer/loginWithotp', {}, dataInfo, options);
    }

    const createApplicationId = (customerId: string, primaryProfileId: string) => {
        let payLoadInfo = {
            customerId: customerId,
            profileId: primaryProfileId,
            programId: programSelected?.programId,
            createdBy: "Self",
            source: "IFWEB",
            lenderId: lenderId
        };

        const options = {
            successCallBack: (res: any) => {
                if (res.status) {
                    stageCreate(customerId, primaryProfileId, res.applicationId);
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to create application ID:', err);
            },
        };

        makeAPIPOSTRequest('/supermoney-service/customer/application/create', {}, payLoadInfo, options);
    }

    const stageCreate = (customerId: string, primaryProfileId: string, applicationId: string) => {
        const payLoadInfo = {
            customerId: Number(customerId),
            profileId: Number(primaryProfileId),
            stageName: "Onboarding",
            stageStatus: "CREATED",
            applicationId: applicationId,
            relatedId: "",
            modifiedBy: loggedInUserDetails?.email
        };

        const options = {
            successCallBack: (res: any) => {
                if (res.successFlag) {
                    const queryDatastageCreate = new URLSearchParams({
                        customerId: customerId,
                        profileId: primaryProfileId,
                        applicationId: applicationId,
                        loginId: '+91' + loginId,
                        lenderId: lenderId
                    }).toString();
                    getOnBoardingId(applicationId);
                } else {
                   console.log(res.data.message);
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to create stage:', err);
            },
        };
        makeAPIPOSTRequest('/supermoney-service/stage/update', {}, payLoadInfo, options);
    }

    
        const getOnBoardingId = (applicationId: string) => {
            const payLoad = {
                external_id : applicationId,
                document_group_id: documentGroupId,
            }
    
            const options = {
                successCallBack: (res: any) => {
                    syncOnBoardingId(res.id, applicationId);
                },
                failureCallBack: (err: any) => {
                    let res = {
                        id: 'c91068e5-b26c-4bd9-8a8e-1839ae51ed36'
                    }
                    syncOnBoardingId(res.id, applicationId);
                    console.log("stageCreate err", err);
                }
            }
            makeAPIPOSTRequest('https://uat.supermoney.in/onboardingdashboard/api/v1/onboardings/issue_onboarding', {}, payLoad, options);
        }
    
        const syncOnBoardingId = (onboardingId: string, applicationId: string) => {
            const payLoad = {
                applicationId: applicationId,
                externalId: onboardingId
            }
    
            const options = {
                successCallBack: (res: any) => {
                    if (token) {
                        const url = `https://uat.supermoney.in/onboardingdashboard/onboarding/${onboardingId}?token=${encodeURIComponent(token)}`
                        window.location.href = url;
                        // window.open(url)
                    }    
                },
                failureCallBack: (err: any) => {
                    console.log("stageCreate err", err);
                }
            }
            makeAPIPOSTRequest('/supermoney-service/customer/application/update', {}, payLoad, options);
        }

    useEffect(() => {
        getProgramList();
    }, [])

    return (
        <div className="relative w-full">
            {/* Green rectangle image */}
            <img src={RectangleGreen} alt="Green Rectangle" className="w-full" />

            {/* Overlay card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-full px-4 z-10">
                <div className="flex flex-col md:flex-row w-full">
                    {/* Left image section (hidden on small/medium screens) */}
                    <div className="hidden md:flex md:w-7/12 justify-center items-center">
                        <img
                            src={BackgroundImage}
                            alt="Login"
                            className="w-[110%] max-w-none"
                        />
                    </div>

                    {/* Right form card */}
                    <div className="w-full md:w-5/12 bg-white dark:bg-gray-900 flex flex-col justify-center items-center relative overflow-hidden rounded-[25px] p-6 shadow-lg">
                        <form
                            onSubmit={handleSubmit(otpType)}
                            className="w-full space-y-6 max-w-md"
                            noValidate
                        >
                            <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white">
                                Register Customer
                            </h2>

                            {/* Program field (disabled) */}
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                                    Program
                                </label>
                                <input
                                    type="text"
                                    value={programSelected?.programName}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                />
                            </div>

                            {/* OTP field */}
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 !mt-0">
                                Enter OTP sent to {mobHidden}
                            </p>
                            <div>
                                <label
                                    className={`block mb-1 font-medium ${errors.otp ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    {...register('otp', { required: 'OTP is required' })}
                                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.otp ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.otp && (
                                    <p className="text-red-600 text-sm mt-1">{errors.otp.message}</p>
                                )}
                            </div>

                            {/* Error label */}
                            {errorFlag && (
                                <label className="block text-center text-red-600 text-xs font-montserrat">
                                    {errorText}
                                </label>
                            )}

                            {/* Resend + Verify buttons */}
                            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                <span>Didn’t get an OTP?</span>
                            </div>

                            <div className="mt-4 space-y-4 flex flex-col items-start">
                                <button
                                    type="button"
                                    onClick={SendOtp}
                                    className="w-[40%] border border-[#4328ae] text-[#4328ae] py-2 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
                                >
                                    Resend OTP
                                </button>

                                <button
                                    type="submit"
                                    className="w-[25%] bg-[#4328ae] text-white py-2 rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-[#4328ae] transition"
                                >
                                    Verify
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}
