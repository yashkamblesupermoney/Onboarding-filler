import { useSelector } from 'react-redux'
import RectangleGreen from '../../assets/images/imported/RectangleGreen.png'
import BackgroundImage from '../../assets/images/imported/backGroundImage.png'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RootState, store } from '../../store/store'
import { Programs } from '../../store/lenderProgramSlice'
import { useLocation } from 'react-router-dom'
import { makeAPIPOSTRequest } from '../../utils/apiActions'
import { useNavigate } from 'react-router-dom'

interface FormValues {
    setPin: string
    confirmPin: string
}
const SetPin: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const navigate = useNavigate();

    const {
        loginId,
        otpAuthorizationCode,
        mobHidden,
        programIDSet,
        lenderId
    } = Object.fromEntries(searchParams.entries());
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormValues>()
    const setPin = watch('setPin');
    const [programSelected, setProgramSelected] = useState({} as Programs)

    const programsList = useSelector((state: RootState) => state.lp.getProgramsList);
    const loggedInUserDetails = useSelector((state: RootState) => state.loggedInUser.user);
    const documentGroupId = useSelector((state: RootState) => state.lp.documentGroupId)
    const token = store.getState().auth.token || localStorage.getItem('authtoken')


    const verifyCustomerPin = (data: FormValues) => {
        console.log('Submitted:', data);
        if (data.setPin === data.confirmPin) {
            createCustomer(data.setPin);
        }
        // Call your verifyCustomerPin logic here
    }

    const createCustomer = (setPinValue: string) => {
        console.log("createCustomer called");
          
            const dataInfo = {
                customerType: "customerType",
                userId: "+91" + loginId,
                language: "en",
                otpAuthorizationCode: otpAuthorizationCode,
                pin: setPinValue,
                isRecurring: false
            };

            const options = {
                successCallBack: (res: any) => {
                    console.log("createCustomer res", res);
                    if(res?.successFlag){
                        createApplicationId(res?.profileId, res?.customerId);
                    } else if (res?.errorDetails[0].errorCode === "30001"){
                        let errors = res?.errorDetails[0].errorDesc;
                        if (
                            errors ===
                            "Oops! Seems user id is already taken. Either login with the same user id or choose a different credential for registration."
                        ) {
                            errors = "Oops! Seems user id is already taken.";
                        }
                        // alert.value = true;
                        // alertMessage.value = errors;
                    } else {
                        let errors = res.data.errorDetails[0].errorDesc;

                        // alert.value = true;
                        // alertMessage.value = errors;
                    }
                    
                },
                failureCallBack: (err: any) => {
                    console.log("createCustomer err", err);
                }
            }
            
        makeAPIPOSTRequest('/supermoney-service/customer/create', {}, dataInfo, options);
    }

    const createApplicationId = (profileId: string, customerId: string) => {
        const payLoadRequest = {
            customerId: customerId,
            profileId: profileId,
            programId: programSelected?.programId,
            createdBy: "Self",
            source: "IFWEB",
            lenderId: lenderId
        };

        const options = {
            successCallBack: (res: any) => {
                if (res.status) {
                    stageCreate(profileId, customerId, res?.applicationId);
                }
            }
            ,
            failureCallBack: (err: any) => {
                console.log("createApplicationId err", err);
            }
        }
        makeAPIPOSTRequest('/supermoney-service/customer/application/create', {}, payLoadRequest, options);
    }


    const stageCreate = (profileId: string, customerId: string, applicationId: string) => {
        // const instance = axios.create({
        //     baseURL: "https://uatgateway.supermoney.in/supermoney-service/stage/",
        //     headers: { "content-type": "application/json" },
        // });
        var dataInfo = {
            customerId: Number(customerId),
            profileId: Number(profileId),
            stageName: "Onboarding",
            stageStatus: "CREATED",
            applicationId: applicationId,
            relatedId: "",
            modifiedBy: loggedInUserDetails?.email
        };

        const options = { 
            successCallBack: (res: any) => {    
                console.log("stageCreate res", res);
                if(res?.successFlag){
                    const queryData = new URLSearchParams({
                        applicationId: applicationId,
                        loginId: '+91' + loginId,
                        lenderId: lenderId
                    }).toString();
                    if (!token) {
                        console.error('No auth token found');
                        return;
                    }
                    getOnBoardingId(applicationId);
                    // window.location.href = `https://smartdash.mintwalk.com/onboarding-uat/#/onboarding/${customerId}/generalinfo?token=${encodeURIComponent(token)}&${queryData}`

                    // window.location.href = `https://smartdash.mintwalk.com/onboarding-uat/#/?token=${encodeURIComponent(token)}`
                    // window.location.href = `https://youtube.com/?token=${encodeURIComponent(token)}&${queryData}`
                    // window.location.href = `https://smartdash.mintwalk.com/onboarding-uat/#/onboarding/${customerId}/generalinfo?${queryData}`

                    // navigate('/onboarding-id-step', { state: { queryData, id: customerId, step: "generalinfo" } });
                }
            },
            failureCallBack: (err: any) => {
                console.log("stageCreate err", err);
            }
        }
        makeAPIPOSTRequest('/supermoney-service/stage/update', {}, dataInfo, options);
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
                    // window.location.href = url;
                    window.open(url)
                }    
            },
            failureCallBack: (err: any) => {
                console.log("stageCreate err", err);
            }
        }
        makeAPIPOSTRequest('/supermoney-service/customer/application/update', {}, payLoad, options);
    }


    useEffect(() => {
        const matchedProgram = programsList?.find(
            (p: any) => p.programName === programIDSet
        )
        if (matchedProgram) {
            setProgramSelected(matchedProgram);
        }
    }, [programsList, programIDSet]);

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
                            onSubmit={handleSubmit(verifyCustomerPin)}
                            className="w-full space-y-6 max-w-md"
                            noValidate
                        >
                            <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white">
                                Register Customer
                            </h2>

                            {/* Set Pin */}
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                                    Set Pin
                                </label>
                                <input
                                    type="number"
                                    maxLength={4}
                                    {...register('setPin', {
                                        required: 'Set Pin is required',
                                        maxLength: {
                                            value: 4,
                                            message: 'Max length is 4 characters',
                                        },
                                    })}
                                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.setPin ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Pin"
                                />
                                {errors.setPin && (
                                    <p className="text-red-600 text-sm mt-1">{errors.setPin.message}</p>
                                )}
                            </div>

                            {/* Confirm Pin */}
                            <div>
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Pin
                                </label>
                                <input
                                    type="number"
                                    maxLength={4}
                                    {...register('confirmPin', {
                                        required: 'Confirm Pin is required',
                                        validate: (value) =>
                                            value === setPin || 'Pins do not match',
                                    })}
                                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.confirmPin ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter Pin"
                                />
                                {errors.confirmPin && (
                                    <p className="text-red-600 text-sm mt-1">{errors.confirmPin.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#4328ae] text-white py-2 px-6 rounded hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-[#4328ae]"
                                >
                                    Confirm Pin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default SetPin;