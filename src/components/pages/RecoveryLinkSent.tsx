import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png'
import IllustrationsLinkSent from '../../assets/images/Illustrations_LinkSent.png'
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { setIsLoading } from "../../store/loaderSlice";
import { useDispatch } from "react-redux";

// // Firebase configuration (you'll need to add your actual config)
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-auth-domain",
//   projectId: "your-project-id",
//   storageBucket: "your-storage-bucket",
//   messagingSenderId: "your-messaging-sender-id",
//   appId: "your-app-id"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

interface LoginState {
  showButton: boolean;
  loginFlag: boolean;
  email: string;
  password: string;
  error: string;
  errorcode: string;
  firebaseToken: string;
  broadCastList: any[];
  accountStatus: string;
  checkbox_remember_me: boolean;
  userip: string;
  connectionStatus: string;
  recoverEmail: string;
  confirmPassword: string;
  finalOtpValue: string;
  userID: string;
  errorEmailTxt: string;
}

export const RecoveryLinkSent: React.FC = () => {

  const [state, setState] = useState<LoginState>({
    showButton: true,
    loginFlag: true,
    email: '',
    password: '',
    error: '',
    errorcode: '',
    firebaseToken: '',
    broadCastList: [],
    accountStatus: '',
    checkbox_remember_me: true,
    userip: '',
    connectionStatus: '',
    recoverEmail: '',
    confirmPassword: '',
    finalOtpValue: '',
    userID: '',
    errorEmailTxt: ''
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Initialize Firebase and get user IP on component mount
    useEffect(() => {
      const userID = searchParams.get('userID');
      if (userID) {
        setState(prev => ({ ...prev, userID }));
      }
      const initializeData = async () => {
        // Get user IP
        try {
          const response = await fetch("https://api.ipify.org?format=json");
          const { ip } = await response.json();
          // setUserIp(ip);
        } catch (error) {
          console.error("Failed to get IP address:", error);
        }

        // Initialize Firebase messaging (you'll need to set up Firebase in your React project)
        // This is a placeholder - you'll need to implement Firebase initialization properly
        try {
          // const messaging = getMessaging();
          // const token = await getToken(messaging, {
          //     vapidKey: "BI648VrFWeH6JYPTOjPOEtY1IuaSdjKtC9KzRJ1KVLiN6s_GgsrOqe4u-mUILrDQsFSqNb6wfykIoEIh_d-IXLs"
          // });
          // setFirebaseToken(token);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      };

      initializeData();
    }, [searchParams]);

    const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const finalValue = newOtp.join('');
    setState(prev => ({ ...prev, finalOtpValue: finalValue }));

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code.length === 6) {
      console.log('Verifying OTP:', code);

      dispatch(setIsLoading(true));

        // const instance = axios.create({
        //   baseURL: "https://uatgateway.supermoney.in/identityservices/auth/v1/",
        //   headers: { "content-type": "application/json" },
        // });

        // ✅ payload
        var data = {
         otp: code,
         userId: Number(state.userID),
       };

       const option = {
          successCallBack: (res: any) => {
            console.log(res);
            navigate(`/resetPassword?userID=${state.userID}&otp=${code}`);
            dispatch(setIsLoading(false));
          },
          failureCallBack: (err: any) => {
            // console.log(err.res.data);
            // console.log(err.res.status);
            // console.log(err.res.headers);
            
            setState(prev => ({ 
              ...prev, 
              errorEmailTxt: err[0]?.errorMsg || 'Verification failed' 
            }));

            dispatch(setIsLoading(false));
          }
       };
        makeAPIPOSTRequest('/identityservices/auth/v1/verify-otp', {}, data, option);

    } else {
      setState(prev => ({ ...prev, errorEmailTxt: "Please enter valid OTP" }));
    }
  };

  const RecoverPassword = () => {
    navigate("/resendLogin");
  };

  return (
    <div id="page-login" className="grid grid-cols-1 md:grid-cols-12 min-h-screen bg-white">
      {/* Left Side (Image + Logo) */}
      <div className="hidden md:flex md:col-span-8 flex-col bg-[#f8f8f8] dark:bg-gray-900">
        {/* Logo */}
        <div className="w-full p-6">
          <img 
            src={logo}
            alt="logo" 
            className="h-10 ml-10" 
          />
        </div>

        {/* Illustration */}
        <div className="flex flex-1 items-center justify-center">
          <img
            src={IllustrationsLinkSent}
            alt="illustration"
            className="max-w-2xl w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right Side (OTP Verification) */}
      <div className="col-span-12 md:col-span-4 items-center justify-center px-3.5  bg-white dark:bg-gray-900">
        <div className="w-full text-[#6e6b7b] p-7 mt-24">
          {/* <div className="p-7 mt-20"> */}
            <h2 className="text-[#5e5873] text-xl font-semibold mb-2  ">OTP Verification</h2>
            <p className="text-sm mb-3.5">We've sent a verification code to your email and</p>
            <p className="text-sm mb-[2rem]">phone no. Enter the code in the field below</p>
            
            <div>
              <p className="text-sm mb-3.5">Type your 6 digit security code</p>
              <div className="flex justify-between mb-1">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                          inputRefs.current[index] = el; // Just assign, don't return anything
                        }}                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    // onPaste={handlePaste}
                    className="w-12 h-12 border border-[#d8d6de] rounded text-center text-lg focus:border-[#7367f0] focus:ring-1 focus:ring-[#7367f0] outline-none dark:bg-gray-900"
                  />
                ))}
              </div>
                {state?.errorEmailTxt && (
                        <p className="text-xs text-red-500 p-0 mb-1">{state?.errorEmailTxt}</p>
               )}
              
              <button
                onClick={verifyOtp}
                className="w-full mt-9 bg-[#4328ae] text-white pt-[6px] pr-5 pb-[6px] pl-5 rounded-md hover:bg-[#6559b3] transition-colors font-medium"
              >
                Verify my account
              </button>
              
              <div className="flex justify-center mt-4 text-sm">
                <span className="text-[#6e6b7b]">
                  Didn't get the code?{' '}
                  <button 
                    onClick={RecoverPassword}
                    className="text-[#4328ae] hover:underline cursor-pointer"
                  >
                    Resend
                  </button>
                </span>
              </div>
            </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}
