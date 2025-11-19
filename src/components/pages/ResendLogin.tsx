// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import logo from "../../assets/images/logo.svg";
// import illustrationSendEmail from "../../assets/images/Illustration_SendEmail.png";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { makeAPIPOSTRequest } from "../../utils/apiActions";

// export const ResendLogin: React.FC = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [recoverEmail, setRecoverEmail] = useState("");
//     const [emailError, setEmailError] = useState(false);
//     const [errorEmailTxt, setErrorEmailTxt] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     // eslint-disable-next-line
//     const [firebaseToken, setFirebaseToken] = useState("");
//     const [userIp, setUserIp] = useState("");

//     // Initialize Firebase and get user IP on component mount
//     useEffect(() => {
//         const initializeData = async () => {
//             // Get user IP
//             try {
//                 const response = await fetch("https://api.ipify.org?format=json");
//                 const { ip } = await response.json();
//                 setUserIp(ip);
//             } catch (error) {
//                 console.error("Failed to get IP address:", error);
//             }

//             // Initialize Firebase messaging (you'll need to set up Firebase in your React project)
//             // This is a placeholder - you'll need to implement Firebase initialization properly
//             try {
//                 // const messaging = getMessaging();
//                 // const token = await getToken(messaging, {
//                 //     vapidKey: "BI648VrFWeH6JYPTOjPOEtY1IuaSdjKtC9KzRJ1KVLiN6s_GgsrOqe4u-mUILrDQsFSqNb6wfykIoEIh_d-IXLs"
//                 // });
//                 // setFirebaseToken(token);
//             } catch (error) {
//                 console.error("Failed to get Firebase token:", error);
//             }
//         };

//         initializeData();
//     }, []);


//     const emailValidation = (email: string) => {
//         const regpan = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         return regpan.test(email);
//     };

//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setEmail(value);
//         setRecoverEmail(value);
//         setEmailError(false);
//         setErrorEmailTxt("");
//     };

//     const handleRecoverPassword = async () => {
//         if (!recoverEmail) {
//             setEmailError(true);
//             setErrorEmailTxt("Email is required");
//             return;
//         }

//         if (!emailValidation(recoverEmail)) {
//             setErrorEmailTxt("Please enter valid email id");
//             return;
//         }

//         setIsLoading(true);

//         // try {
//         //   // Using your makeAPIPOSTRequest utility
//         //   const response: any = await makeAPIPOSTRequest(
//         //     "https://uatgateway.supermoney.in/identityservices/auth/v1/forgot-password",
//         //     { email: recoverEmail }
//         //   );

//         //   // Check if response exists and has data
//         //   if (response && response.data && response.data.userId) {
//         //     // Success callback - navigate to recovery link sent page
//         //     navigate(`/recoveryLinkSent?userID=${response.data.userId}`);
//         //   } else {
//         //     setErrorEmailTxt("Invalid response from server");
//         //   }
//         // } catch (error: any) {
//         //   // Failure callback
//         //   if (error.response?.data?.[0]?.errorMsg) {
//         //     if (error.response.data[0].errorMsg === "User with this username not found") {
//         //       setErrorEmailTxt(error.response.data[0].errorMsg);
//         //     } else {
//         //       setErrorEmailTxt(error.response.data[0].errorMsg);
//         //     }
//         //   } else {
//         //     setErrorEmailTxt("An error occurred. Please try again.");
//         //   }
//         // } finally {
//         //   setIsLoading(false);
//         // }

//         const options = {
//             successCallBack: (res: any) => {
//                 if (res.userId != "") {
//                     navigate(`/recoveryLinkSent?userID=${res.data.userId}`);
//                 }
//                 setIsLoading(false);
//             },
//             failureCallBack: (error: any) => {
//                 if (error.response) {
//                     console.log(error.response.data);
//                     console.log(error.response.status);
//                     console.log(error.response.headers);
//                     // if (
//                     //   error.response.data[0].errorMsg ===
//                     //   "User with this username not found"
//                     // ) {
//                     //   self.emailError = true;
//                     //   self.errorEmailTxt = error.response.data[0].errorMsg;
//                     // } else {
//                     //   self.passwordError = true;
//                     //   self.error = error.response.data[0].errorMsg;
//                     // }
//                     setEmailError(true);
//                     setErrorEmailTxt(error.response.data[0].errorMsg);

//                 }
//                 setIsLoading(false);
//             }
//         };

//         makeAPIPOSTRequest("/identityservices/auth/v1/forgot-password", {}, { email: recoverEmail }, options)
//     };

//     // eslint-disable-next-line
//     const handleLogin = async () => {
//         if (!email || !emailValidation(email)) {
//             setErrorEmailTxt("Please enter valid email");
//             return;
//         }

//         setIsLoading(true);

//         try {
//             const timestamp = Math.round(+new Date() / 1000);

//             const requestData = {
//                 data: {
//                     loginID: email,
//                     password: "" // You'll need to handle password input
//                 },
//                 msgHeader: {
//                     authToken: "",
//                     authLoginID: "",
//                     timestamp: timestamp,
//                     ipAddress: userIp
//                 }
//             };

//             // Using mlForceLogin endpoint
//             const response: any = await makeAPIPOSTRequest(
//                 "https://uatgateway.supermoney.in/mlForceLogin",
//                 requestData
//             );

//             // Check if response exists and has data
//             if (response && response.data) {
//                 const JSONData = response.data;

//                 if (JSONData.data.error === 0) {
//                     // Success callback - dispatch actions and navigate
//                     dispatch({ type: "SET_LOGIN_ID", payload: JSONData.data.login });
//                     dispatch({ type: "SET_AUTH_TOKEN", payload: JSONData.msgHeader.authToken });
//                     dispatch({ type: "SET_LAST_LOGIN", payload: JSONData.data.lastLoginDate });
//                     dispatch({ type: "SET_ACCOUNT_TYPE", payload: JSONData.data.accountTypes[0] });
//                     dispatch({ type: "SET_CITY", payload: JSONData.data.city });
//                     dispatch({ type: "SET_IP_ADDRESS", payload: userIp });

//                     // Navigate based on account type
//                     if (JSONData.data.accountTypes[0] === "EXTNBFC" || JSONData.data.accountTypes[0] === "EXTCOMPANY") {
//                         navigate("/ugro");
//                     } else {
//                         navigate("/dashboard");
//                     }
//                 } else {
//                     // Failure callback
//                     setErrorEmailTxt(JSONData.data.message);
//                 }
//             } else {
//                 setErrorEmailTxt("Invalid response from server");
//             }
//         } catch (error: any) {
//             // Failure callback
//             setErrorEmailTxt(error.response?.data?.message || "Network Error");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const backToLogin = () => {
//         navigate("/login");
//     }

//     return (
//         <div id="page-login" className="grid grid-cols-1 md:grid-cols-12 min-h-screen ">
//             {/* Left Side (Image + Logo) */}
//             <div className="hidden md:flex md:col-span-8 flex-col bg-[#f8f8f8]">
//                 {/* Logo */}
//                 <div className="w-full p-6">
//                     <img src={logo} alt="logo" className="h-10" />
//                 </div>

//                 {/* Illustration */}
//                 <div className="flex flex-1 items-center justify-center">
//                     <img
//                         src={illustrationSendEmail}
//                         alt="illustration"
//                         className="max-w-2xl w-full h-auto object-contain"
//                     />
//                 </div>
//             </div>

//             {/* Right Side (Forgot Password Form) */}
//             <div className="col-span-12 md:col-span-4 flex items-center justify-center px-6 py-10 bg-white">
//                 <div className="w-full max-w-sm text-[#6e6b7b]">
//                     {/* Heading */}
//                     <h1 className="text-2xl font-bold ">Forgot Password</h1>
//                     <p className="text-sm  mt-2">
//                         Please enter your email address and we'll send you a 6-digit OTP to reset.
//                     </p>

//                     {/* Email Input */}
//                     <div className="mt-6">
//                         <label
//                             htmlFor="email"
//                             className="block text-sm font-medium "
//                         >
//                             Email
//                         </label>
//                         <div className="relative mt-1">
//                             <input
//                                 type="text"
//                                 id="email"
//                                 name="email"
//                                 value={email}
//                                 onChange={handleEmailChange}
//                                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 placeholder="Enter your email"
//                                 disabled={isLoading}
//                             />
//                             <i className="absolute right-3 top-2.5 text-gray-400 feather icon-user"></i>
//                         </div>
//                         {(emailError || errorEmailTxt) && (
//                             <span className="text-xs text-red-500 block text-center mt-1">
//                                 {errorEmailTxt || "Email is required"}
//                             </span>
//                         )}
//                     </div>

//                     {/* Send OTP Button */}
//                     <div className="mt-6">
//                         <button
//                             onClick={handleRecoverPassword}
//                             type="button"
//                             className="w-full py-2 rounded-md bg-[#4328ae] text-white font-semibold hover:bg-indigo-700 transition"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? "Processing..." : "Send OTP"}
//                         </button>
//                     </div>

//                     {/* Back to Login */}
//                     <div className="mt-4 flex justify-center">
//                         <button
//                             type="button"
//                             className="text-sm text-[#4328ae] hover:underline"
//                             onClick={backToLogin}
//                             disabled={isLoading}
//                         >
//                             Back To Login
//                         </button>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };


import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/images/logo.svg";
import illustrationSendEmail from "../../assets/images/Illustration_SendEmail.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeAPIPOSTRequest } from "../../utils/apiActions";

export const ResendLogin: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [recoverEmail, setRecoverEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [errorEmailTxt, setErrorEmailTxt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line
    const [firebaseToken, setFirebaseToken] = useState("");
    const [userIp, setUserIp] = useState("");

    // Initialize Firebase and get user IP on component mount
    useEffect(() => {
        const initializeData = async () => {
            // Get user IP
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const { ip } = await response.json();
                setUserIp(ip);
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
    }, []);


    const emailValidation = (email: string) => {
        const regpan = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regpan.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setRecoverEmail(value);
        setEmailError(false);
        setErrorEmailTxt("");
    };

    const handleRecoverPassword = async () => {
        if (!recoverEmail) {
            setEmailError(true);
            setErrorEmailTxt("Email is required");
            return;
        }

        if (!emailValidation(recoverEmail)) {
            setErrorEmailTxt("Please enter valid email id");
            return;
        }

        setIsLoading(true);

        // try {
        //   // Using your makeAPIPOSTRequest utility
        //   const response: any = await makeAPIPOSTRequest(
        //     "https://uatgateway.supermoney.in/identityservices/auth/v1/forgot-password",
        //     { email: recoverEmail }
        //   );

        //   // Check if response exists and has data
        //   if (response && response.data && response.data.userId) {
        //     // Success callback - navigate to recovery link sent page
        //     navigate(`/recoveryLinkSent?userID=${response.data.userId}`);
        //   } else {
        //     setErrorEmailTxt("Invalid response from server");
        //   }
        // } catch (error: any) {
        //   // Failure callback
        //   if (error.response?.data?.[0]?.errorMsg) {
        //     if (error.response.data[0].errorMsg === "User with this username not found") {
        //       setErrorEmailTxt(error.response.data[0].errorMsg);
        //     } else {
        //       setErrorEmailTxt(error.response.data[0].errorMsg);
        //     }
        //   } else {
        //     setErrorEmailTxt("An error occurred. Please try again.");
        //   }
        // } finally {
        //   setIsLoading(false);
        // }

        const options = {
            successCallBack: (res: any) => {
                if (res.userId != "") {
                    navigate(`/recoveryLinkSent?userID=${res.userId}`);
                }
                setIsLoading(false);
            },
            failureCallBack: (error: any) => {
                if (error) {
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    // if (
                    //   error.response.data[0].errorMsg ===
                    //   "User with this username not found"
                    // ) {
                    //   self.emailError = true;
                    //   self.errorEmailTxt = error.response.data[0].errorMsg;
                    // } else {
                    //   self.passwordError = true;
                    //   self.error = error.response.data[0].errorMsg;
                    // }
                    setEmailError(true);
                    setErrorEmailTxt(error[0].errorMsg);

                }
                setIsLoading(false);
            }
        };

        makeAPIPOSTRequest("/identityservices/auth/v1/forgot-password", {}, { email: recoverEmail }, options)
    };

    const backToLogin = () => {
        navigate("/login");
    }

    return (
        <div id="page-login" className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
            {/* Left Side (Image + Logo) */}
            <div className="hidden md:flex md:col-span-8 flex-col bg-[#f8f8f8] dark:bg-gray-900">
                {/* Logo */}
                <div className="w-full p-6">
                    <img src={logo} alt="logo" className="h-10" />
                </div>

                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center ">
                    <img
                        src={illustrationSendEmail}
                        alt="illustration"
                        className="max-w-2xl w-full h-auto object-contain dark:bg-gray-900"
                    />
                </div>
            </div>

            {/* Right Side (Forgot Password Form) */}
            <div className="col-span-12 md:col-span-4 flex items-center justify-center px-6 py-10 bg-white dark:bg-gray-900">
                <div className="w-full max-w-sm text-[#6e6b7b]">
                    {/* Heading */}
                    <h1 className="text-2xl font-bold ">Forgot Password</h1>
                    <p className="text-sm  mt-2">
                        Please enter your email address and we'll send you a 6-digit OTP to reset.
                    </p>

                    {/* Email Input */}
                    <div className="mt-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium "
                        >
                            Email
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-400 placeholder:dark:text-black"
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                            <i className="absolute right-3 top-2.5 text-gray-400 feather icon-user"></i>
                        </div>
                        {(emailError || errorEmailTxt) && (
                            <span className="text-xs text-red-500 block mt-1">
                                {errorEmailTxt || "Email is required"}
                            </span>
                        )}
                    </div>

                    {/* Send OTP Button */}
                    <div className="mt-6">
                        <button
                            onClick={handleRecoverPassword}
                            type="button"
                            className="w-full py-2 rounded-md bg-[#4328ae] text-white font-semibold hover:bg-indigo-700 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Send OTP"}
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="mt-4 flex justify-center">
                        <button
                            type="button"
                            className="text-sm text-[#4328ae] hover:underline"
                            onClick={backToLogin}
                            disabled={isLoading}
                        >
                            Back To Login
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};