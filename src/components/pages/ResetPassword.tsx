import React, { useState, useRef, useEffect } from 'react'
import axios from "axios";
import CryptoJS from 'crypto-js'
import logo from '../../assets/images/logo.svg'
import IllustrationsReset from '../../assets/images/Illustrations_Reset.png'
import checkGrey from "../../assets/images/CheckedGrey.png";
import checkGreen from "../../assets/images/CheckGeenr.png";
import { makeAPIPOSTRequest } from '../../utils/apiActions';
import { setIsLoading } from "../../store/loaderSlice";
import { useDispatch } from "react-redux";
// import { encrypt } from "../../utils/apiActions";


export const ResetPassword = () => {

    const [showRules, setShowRules] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passChangeSuccess, setPassChangeSuccess] = useState(false);
    const [countDown, setCountDown] = useState(3);
    // eslint-disable-next-line
    const [firebaseToken, setFirebaseToken] = useState("");
    const [userIp, setUserIp] = useState("");
    const dispatch = useDispatch();

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

    // Validation flags
    const passLengthFlag = password.length >= 8 && password.length <= 20;
    const passNumFlag = /\d/.test(password);
    const passUpperCaseFlag = /[A-Z]/.test(password);
    const passLowerCaseFlag = /[a-z]/.test(password);
    const passSpecialCaseFlag = /[!@#$%^&*(),.?":{}|<>]/.test(password);


    const toggleShow = () => setShowPassword(!showPassword);
    const toggleNewShowOne = () => setShowConfirmPassword(!showConfirmPassword);

    const recoverPasswordSet = () => {

        setPasswordError(false);
        setError("");


        const encrypt = (data: string, base64Key: string) => {
            // const cipher = crypto.createCipheriv(
            //     "aes-256-cbc",
            //     key,
            //     Buffer.alloc(16, 0)
            // );
            // let encrypted = cipher.update(data, "utf8", "base64");
            // encrypted += cipher.final("base64");
            // return encrypted;
            const key = CryptoJS.enc.Base64.parse(base64Key);
            const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
            const encrypted = CryptoJS.AES.encrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            return encrypted.toString();
        };

        if (password.length > 7) {
            if (password === confirmPassword) {
                const regex = /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;
                const isValid = regex.test(password);

                if (!isValid) {
                    setPasswordError(true);
                    setError(
                        "Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                    );
                    return;
                }
                console.log("this is valid password", isValid);

                // ✅ Encrypt password (like your login function)
                const encryptionKey = "RsW6hk68oIZ9LDA2kdr3Pm436EpRGipYabVM0ezyeBc=";
                const encryptedPassword = encrypt(password, encryptionKey);
                dispatch(setIsLoading(true));

                // // ✅ API instance
                // const instance = axios.create({
                //     baseURL:
                //         "https://uatgateway.supermoney.in/identityservices/auth/v1/",
                //     headers: { "content-type": "application/json" },
                // });

                // ✅ payload
                const data = {
                    otp: new URLSearchParams(window.location.search).get("otp"),
                    newPassword: encryptedPassword,
                    userId: new URLSearchParams(window.location.search).get("userID"),
                };

                const options = {
                    successCallBack: (res: any) => {
                        console.log("reset response", res);
                        console.log(res);

                        startCountdown();
                        setPassChangeSuccess(true);
                        alert("✅ Password reset successfully!");
                        // self.$store.commit("routeChange", "start");
                        dispatch(setIsLoading(false));
                    },
                    failureCallBack: (err: any) => {
                        if (err) {
                            // console.log(err.data);
                            // console.log(err.status);

                            if (
                                err[0]?.errorMsg ===
                                "User with this username not found"
                            ) {
                                setError(err[0].errorMsg);
                            } else {
                                setPasswordError(true);
                                setError(err[0]?.errorMsg);
                            }
                        }
                        dispatch(setIsLoading(false));
                    }
                };

                makeAPIPOSTRequest("/identityservices/auth/v1/set-password", {}, data, options);


                //     // ✅ Call API
                //     instance
                //         .post("set-password", data)
                //         .then((response) => {
                //             console.log("reset response", response.data);
                //             setPassChangeSuccess(true);
                //             startCountdown();
                //         })
                //         .catch((error) => {
                //             if (error.response) {
                //                 console.log(error.response.data);
                //                 console.log(error.response.status);

                //                 if (
                //                     error.response.data[0]?.errorMsg ===
                //                     "User with this username not found"
                //                 ) {
                //                     setError(error.response.data[0].errorMsg);
                //                 } else {
                //                     setPasswordError(true);
                //                     setError(error.response.data[0]?.errorMsg);
                //                 }
                //             } else {
                //                 setPasswordError(true);
                //                 setError("Something went wrong. Please try again.");
                //             }
                //         });
                // } else {
                //     setPasswordError(true);
                //     setError("Please make sure your passwords match");
                // }
            } else {
                setPasswordError(true);
                setError("Please make sure your passwords match");
            }
        } else {
            setPasswordError(true);
            setError("Please enter valid password");
        }
    };

    const startCountdown = () => {
        if (countDown > 0) {
            setTimeout(() => {
                setCountDown((prev) => prev - 1);
                startCountdown();
            }, 1000);
        } else {
            setPassChangeSuccess(false);
            window.location.href = "/"; // redirect after countdown
        }
    };


    return (
        <div id="page-login" className="grid grid-cols-1 md:grid-cols-12 min-h-screen bg-white dark:bg-gray-900">
            {/* Left Side (Image + Logo) */}
            <div className="hidden md:flex md:col-span-8 flex-col bg-[#f8f8f8] dark:bg-gray-900">
                {/* Logo */}
                <div className="w-full p-6">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-10"
                    />
                </div>

                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center">
                    <img
                        src={IllustrationsReset}
                        alt="illustration"
                        className="max-w-2xl w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Right Side () */}
            <div className="col-span-12 md:col-span-4 flex pl-1 pr-1 justify-center text-[#6e6b7b] overflow-hidden">
                <div className="w-full max-w-md p-7 mt-[6.5rem] text-[#6e6b7b]">
                    <h1 className="text-xl font-bold">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Your new password must be different from previously used passwords
                    </p>

                    {/* New Password */}
                    {/* Password Rules - Always visible on desktop, conditional on mobile */}
                    <div className={`hidden md:${showRules ? 'block' : 'hidden'} bg-gray-50 rounded-lg p-4 text-sm mt-6`}>
                        <p className="font-medium text-gray-700 mb-2">Password must have:</p>

                        <div className="flex items-center mb-1">
                            <img src={passLengthFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                            <span className={passLengthFlag ? "text-green-500" : "text-gray-500"}>
                                8-20 characters
                            </span>
                        </div>

                        <div className="flex items-center mb-1">
                            <img src={passNumFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                            <span className={passNumFlag ? "text-green-500" : "text-gray-500"}>
                                1 number
                            </span>
                        </div>

                        <div className="flex items-center mb-1">
                            <img src={passUpperCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                            <span className={passUpperCaseFlag ? "text-green-500" : "text-gray-500"}>
                                1 uppercase letter
                            </span>
                        </div>

                        <div className="flex items-center mb-1">
                            <img src={passLowerCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                            <span className={passLowerCaseFlag ? "text-green-500" : "text-gray-500"}>
                                1 lowercase letter
                            </span>
                        </div>

                        <div className="flex items-center mb-1">
                            <img src={passSpecialCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                            <span className={passSpecialCaseFlag ? "text-green-500" : "text-gray-500"}>
                                1 special character
                            </span>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="relative mt-6">
                        <label
                            htmlFor="password"
                            className="block text-xs font-medium text-gray-600"
                        >
                            New Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "password" : "text"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setShowRules(true)}
                            onBlur={() => setShowRules(false)}
                            className="w-full border border-gray-300 bg-transparent rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={toggleShow}
                            className="absolute right-3 top-8 text-gray-500"
                        >
                            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                        </button>
                    </div>

                    {/* Password Rules for Mobile */}
                    {showRules && (
                        <div className="md:hidden bg-gray-50 rounded-lg p-4 text-sm mt-4">
                            <p className="font-medium text-gray-700 mb-2">Password must have:</p>

                            <div className="flex items-center mb-1">
                                <img src={passLengthFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                                <span className={passLengthFlag ? "text-green-500" : "text-gray-500"}>
                                    8-20 characters
                                </span>
                            </div>

                            <div className="flex items-center mb-1">
                                <img src={passNumFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                                <span className={passNumFlag ? "text-green-500" : "text-gray-500"}>
                                    1 number
                                </span>
                            </div>

                            <div className="flex items-center mb-1">
                                <img src={passUpperCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                                <span className={passUpperCaseFlag ? "text-green-500" : "text-gray-500"}>
                                    1 uppercase letter
                                </span>
                            </div>

                            <div className="flex items-center mb-1">
                                <img src={passLowerCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                                <span className={passLowerCaseFlag ? "text-green-500" : "text-gray-500"}>
                                    1 lowercase letter
                                </span>
                            </div>

                            <div className="flex items-center mb-1">
                                <img src={passSpecialCaseFlag ? checkGreen : checkGrey} className="h-4 mr-2" alt="check" />
                                <span className={passSpecialCaseFlag ? "text-green-500" : "text-gray-500"}>
                                    1 special character
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <div className="relative mt-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-xs font-medium text-gray-600"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "password" : "text"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-600 bg-transparent rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={toggleNewShowOne}
                            className="absolute right-3 top-8 text-gray-400"
                        >
                            <i
                                className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                                    }`}
                            />
                        </button>

                        {passwordError && (
                            <p className="mt-1 text-xs text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Error Label */}

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            id="button-with-loading"
                            onClick={recoverPasswordSet}
                            className="w-full py-2 rounded-md bg-[#4328ae] text-white font-semibold hover:bg-indigo-700 transition"
                        >
                            Set New Password
                        </button>
                    </div>

                    {/* Success Popup */}
                    {passChangeSuccess && (
                        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center">
                            <img src={checkGreen} alt="success" className="h-6 mr-2" />
                            <span>Your password has been changed successfully!</span>
                            <span className="ml-4">Redirecting in {countDown}...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}

