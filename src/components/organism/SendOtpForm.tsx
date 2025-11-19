import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpFormSchema } from '../../validations/validation'
import { set, success, z } from 'zod'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, store } from '../../store/store'
import { useDispatch } from 'react-redux'
import { makeAPIPOSTRequest } from '../../utils/apiActions'
import { setDocumentGroupId, setProgramsLenderMappingList } from '../../store/lenderProgramSlice'
import { useNavigate } from 'react-router-dom'

type FormData = z.infer<typeof otpFormSchema>

export default function SendOtpForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const programsList = useSelector((state: RootState) => state.lp.getProgramsList);
    const lendersMappingList = useSelector((state: RootState) => state.lp.getProgramsLenderMappingList);
    const documentGrpID = useSelector((state: RootState) => state.lp.documentGroupId)
    const token = store.getState().auth.token || localStorage.getItem('authtoken')
    

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        getValues,
        clearErrors,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(otpFormSchema),
        defaultValues: {
            termsAgreed: true,
            whatsappAgreed: true,
        },
    })
    const [loginType, setLoginType] = useState('verifyMobile');    

    const handleProgramSelect = (programId: string) => {
        dispatch(setProgramsLenderMappingList([])) // Clear previous data

        if (programId === '') return
        const options = {
            successCallBack: (res: any) => {
                dispatch(setProgramsLenderMappingList(res?.getProgramsLenderMappingList || []))
            },
            failureCallBack: (err: any) => {
                console.error('Failed to fetch lenders:', err)
            },
        }
        makeAPIPOSTRequest('supermoney-service/programs/lender/get', {}, { programId: Number(programId) }, options)
    }

    const verifyExistingCustomer = (data: FormData) => {
        console.log('Form submitted:', data)
        const msgHeader = {
            authToken: "", //dynamic
            loginId: "+91" + data.mobileNo,
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
            userId: "+91" + data.mobileNo,

        };

        const employeeDetails = { dataInfo, deviceFPmsgHeader, msgHeader };
        console.log("this is hit", employeeDetails);
        const options = {
            successCallBack: (res: any) => {
                if (res.successFlag === true) {
                    SendOtp()
                }
                else {
                    if (res.hostStatus === "E") {
                        setError('mobileNo', { type: 'manual', message: res.header.error.errorDesc });
                    }
                    else {
                        if (res.errorMessage.includes("Oops! Seems user id is already taken.")) {
                            setLoginType('loginPin')
                            verifyCustomerForLenderFunction('loginPin')
                        }
                        else {
                            setError('mobileNo', { type: 'manual', message: res.data.errorDetails[0].errorDesc });
                        }
                    }
                }
            },
            failureCallBack: (err: any) => {
            },
        }
        makeAPIPOSTRequest('/supermoney-service/customer/verify/existing', {}, dataInfo, options)
    }

    const verifyCustomerForLenderFunction = (loginType: string) => {
        const formData = getValues();
        let dataInfo = {
            loginId: "+91" + formData.mobileNo,
            programId: Number(formData.program),
            lenderId: Number(formData.lender),

        };

        const options = { 
            successCallBack: (res: any) => {  
                if (res.applicationId == null) {
                    SendOtp()
                }  else {
                    setError('mobileNo', { type: 'manual', message: 'The above login id with specified lender and program name is already mapped with application id - ' + res.applicationId });
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to verify customer for lender:', err)
            },
        }
        
        makeAPIPOSTRequest('/supermoney-service/customer/application/checkApplicationId', {}, dataInfo, options)
    }

    const SendOtp = (loginType: string = 'verifyMobile') => {
        const formData = getValues();
        const msgHeader = {
            authToken: "", //dynamic
            loginId: "+91" + formData.mobileNo,
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
            mobileNo: "+91" + formData.mobileNo,
            otpFor: loginType,
        };

        const employeeDetails = { dataInfo, deviceFPmsgHeader, msgHeader };
        console.log("this is hiter", employeeDetails);
        console.log(formData, "yash");
        const options = {
            successCallBack: (res: any) => {
                if (res.successFlag === true) {
                    const queryParams = new URLSearchParams({
                        loginId: formData.mobileNo,
                        transactionCode: res.transactionCode,
                        mobHidden: '******' + formData.mobileNo.substring(6, 10),
                        programIDSet: programsList.find(p => p.programId === +formData.program)?.programName as string,
                        loginType: loginType,
                        lenderId: String(formData.lender),
                    }).toString();
                    // router.push({ name: 'onboarding-verifyotp', query: queryData });
                    navigate(`/verifyOtp?${queryParams}`);

                }
                else {
                    setError('mobileNo', { type: 'manual', message: 'The above login id with specified lender and program name is already mapped with application id' + res.applicationId });
                }
            },
            failureCallBack: (err: any) => {
                console.error('Failed to send OTP:', err)
            },
        }
        makeAPIPOSTRequest('/supermoney-service/send/mobile/otp', {}, dataInfo, options)

    }


    return (
        <form
            onSubmit={handleSubmit(verifyExistingCustomer)}
            className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow space-y-6"
        >
            <h2 className="text-center text-lg font-bold text-gray-800 dark:text-white">
                Register Customer
            </h2>

            {/* Mobile No */}
            <div>
                <label
                    className={`block mb-1 font-medium ${errors.mobileNo ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Mobile No
                </label>
                <input
                    type="text"
                    {...register('mobileNo')}
                    maxLength={10}
                    placeholder="Enter mobile number"
                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.mobileNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.mobileNo && (
                    <p className="text-red-600 text-sm mt-1">{errors.mobileNo.message}</p>
                )}
            </div>

            {/* Program */}
            <div>
                <label
                    className={`block mb-1 font-medium ${errors.program ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Select Program
                </label>
                <select
                    {...register('program')}
                    onChange={(e) => handleProgramSelect(e.target.value)}
                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.program ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">Select Program</option>
                    {programsList.map((p) => (
                        <option key={p.programId} value={p.programId}>
                            {p.programName}
                        </option>
                    ))}
                </select>
                {errors.program && (
                    <p className="text-red-600 text-sm mt-1">{errors.program.message}</p>
                )}
            </div>

            {/* Lender */}
            <div>
                <label
                    className={`block mb-1 font-medium ${errors.lender ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                >
                    Lender Name
                </label>
                <select
                    {...register('lender')}
                    onChange={(e) => dispatch(setDocumentGroupId(e.target.value))}
                    className={`w-full px-3 py-2 border rounded text-gray-900 dark:text-white dark:bg-gray-800 dark:border-gray-600 ${errors.lender ? 'border-red-500' : 'border-gray-300'
                        }`}
                >
                    <option value="">
                        {lendersMappingList.length === 0
                            ? 'No data available'
                            : 'Select Lender Name'}
                    </option>
                    {lendersMappingList.map((l) => (
                        <option key={l.lenderId} value={l.lenderId}>
                            {l.lenderName}
                        </option>
                    ))}
                </select>
                {errors.lender && (
                    <p className="text-red-600 text-sm mt-1">{errors.lender.message}</p>
                )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('termsAgreed')}
                        className="mr-2"
                    />
                    <span
                        className={`${errors.termsAgreed
                                ? 'text-red-600'
                                : 'text-[#736CCC] dark:text-indigo-300'
                            }`}
                    >
                        I agree to the Terms & Conditions
                    </span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        {...register('whatsappAgreed')}
                        className="mr-2"
                    />
                    <span
                        className={`${errors.whatsappAgreed
                                ? 'text-red-600'
                                : 'text-[#736CCC] dark:text-indigo-300'
                            }`}
                    >
                        I agree to be contacted on WhatsApp & SMS
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-[50%] bg-[#7367f0] text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-[#4328ae] transition"
            >
                Get OTP
            </button>
        </form>
    );

}
