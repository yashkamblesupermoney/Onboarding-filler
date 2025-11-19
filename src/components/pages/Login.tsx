import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from '../../assets/images/logo.svg'
import smartdashboard from "../../assets/images/smartdash-img.png";
import axios from "axios";
import CryptoJS from 'crypto-js'
import { makeAPIGETRequest, makeAPIPOSTRequest } from "../../utils/apiActions";
import { setIsLoading } from "../../store/loaderSlice";
import { setToken } from "../../store/authSlice";
import { setLoggedInUser } from "../../store/loggedInUserSlice";
// import { setuserId, setauthtoken, setloginId, setlastLogin, routeChange } from "../store/loginSlice";

// Declare the grecaptcha global type for TypeScript
declare global {
    interface Window {
        grecaptcha: any;
        onCaptchaLoad: () => void;
    }
}

export const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [errorEmailTxt, setErrorEmailTxt] = useState("");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    const [captchaResponse, setCaptchaResponse] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    useEffect(() => {
        // Setup window function for callback
        window.onCaptchaLoad = () => {
            renderRecaptcha();
        };

        loadRecaptcha();

        // Cleanup
        return () => {
            // @ts-ignore
            window.onCaptchaLoad = undefined;
        };
    }, []);

    const onCaptchaVerified = (response: string) => {
        setCaptchaResponse(response);
        setCaptchaVerified(true);
    };

    // const onCaptchaSuccess = (token: string) => {
    //     console.log("CAPTCHA token:", token);
    //     setCaptchaResponse(token);
    //     setCaptchaVerified(true);
    // };

    // const onCaptchaExpired = () => {
    //     console.log("CAPTCHA expired.");
    //     setCaptchaVerified(false);
    //     setCaptchaResponse("");
    // };

    const validateTextField = () => {
        if (typeof window.grecaptcha !== 'undefined') {
            // if (!captchaVerified) {
            //     alert("Please complete the CAPTCHA.");
            //     return;
            // }

            if (email.length === 0) {
                setEmailError(true);
                setErrorEmailTxt("Please enter login id");
                return;
            }

            if (password.length === 0) {
                setPasswordError(true);
                setError("Please enter password");
                return;
            }

            setProgress(true);

            if (emailValidation()) {
                loginAuthTokenEmail();
            } else if (
                email.length === 10 &&
                removeDuplicateCharacters(email) > 1 &&
                checkInitialLetter(email)
            ) {
                loginAuthTokenMobile();
            } else {
                loginAuthTokenUserName();
            }
        } else {
            alert("CAPTCHA not loaded properly. Please refresh the page.");
        }
    };


    const forgotPassClick = () => {
        navigate("/resendLogin");
    };

    // Update input handlers
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(false);
        setErrorEmailTxt("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(false);
        setError("");
    };

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    };

    const loginAuthTokenUserName = () => {
        if (email.length > 0) {
            localStorage.clear();
            setEmailError(false);
            setErrorEmailTxt("");

            const encryptionKey = "RsW6hk68oIZ9LDA2kdr3Pm436EpRGipYabVM0ezyeBc=";
            const encryptedPassword = encrypt(password, encryptionKey);
            dispatch(setIsLoading(true));
            dispatch(setIsLoading(true));

            const data = {
                userName: email,
                password: encryptedPassword,
                deviceId: email,
                captchaResponse: captchaResponse,
                deviceType: "",
                os: "",
                osVersion: "",
                appVersion: "",
                notificationToken: "",
                deviceName: ""
            };

            const options = {
                successCallBack: (res: any) => {
                    if (res.token !== "") {
                        dispatch(setToken(res.token));
                        localStorage.setItem("authtoken", res.token);
                        // dispatch(setLoggedInUser(res.user));
                        getUserDetails();
                    }
                    dispatch(setIsLoading(false));
                    setProgress(false);
                },
                failureCallBack: (error: any) => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        if (
                            error.response.data[0].errorMsg ===
                            "User with this username not found"
                        ) {
                            setEmailError(true);
                            setErrorEmailTxt(error.response.data[0].errorMsg);
                        } else {
                            setPasswordError(true);
                            setError(error.response.data[0].errorMsg);
                            if (typeof window.grecaptcha !== 'undefined') {
                                window.grecaptcha.reset();
                            }
                        }
                        dispatch(setIsLoading(false));
                    }
                    setProgress(false);
                }
            };
            makeAPIPOSTRequest("/identityservices/auth/v1/login", {}, data, options);
        } else {
            setEmailError(true);
            setErrorEmailTxt("Please enter login id");
        }
    };

    const loginAuthTokenMobile = () => {
        if (email.length > 0) {
            localStorage.clear();
            setEmailError(false);
            setErrorEmailTxt("");

            const encryptionKey = "RsW6hk68oIZ9LDA2kdr3Pm436EpRGipYabVM0ezyeBc=";
            const encryptedPassword = encrypt(password, encryptionKey);
            dispatch(setIsLoading(true));

            const data = {
                mobile: email,
                password: encryptedPassword,
                deviceId: email,
                captchaResponse: captchaResponse,
                deviceType: "",
                os: "",
                osVersion: "",
                appVersion: "",
                notificationToken: "",
                deviceName: ""
            };

            const options = {
                successCallBack: (res: any) => {

                    if (res.token !== "") {
                        dispatch(setToken(res.token));
                        localStorage.setItem("authtoken", res.token);
                        // dispatch(setLoggedInUser(res.user));
                        getUserDetails();
                    }
                    dispatch(setIsLoading(false));
                    setProgress(false);
                },
                failureCallBack: (error: any) => {
                    // Error handling similar to other login methods
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        if (
                            error.response.data[0].errorMsg ===
                            "User with this mobile not found"
                        ) {
                            setEmailError(true);
                            setErrorEmailTxt(error.response.data[0].errorMsg);
                        } else {
                            setPasswordError(true);
                            setError(error.response.data[0].errorMsg);
                            if (typeof window.grecaptcha !== 'undefined') {
                                window.grecaptcha.reset();
                            }
                        }
                        dispatch(setIsLoading(false));
                    }
                    setProgress(false);
                }
            };
            makeAPIPOSTRequest("/identityservices/auth/v1/login", {}, data, options);
        } else {
            setEmailError(true);
            setErrorEmailTxt("Please enter login id");
        }
    };

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

    const removeDuplicateCharacters = (string: string) => {
        const temp = string
            .split("")
            .filter((item, pos, self) => self.indexOf(item) === pos)
            .join("");
        console.log("this is the mobile length", temp.length);
        return temp.length;
    };

    const checkInitialLetter = (string: string) => {
        return parseInt(string.split("")[0]) > 4;
    };

    const emailValidation = () => {
        const regpan = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regpan.test(email);
    };

    const loginAuthTokenEmail = () => {
        if (email.length > 0) {
            localStorage.clear();
            setEmailError(false);
            setErrorEmailTxt("");

            const encryptionKey = "RsW6hk68oIZ9LDA2kdr3Pm436EpRGipYabVM0ezyeBc=";

            const encryptedPassword = encrypt(password, encryptionKey);
            dispatch(setIsLoading(true));

            const instance = axios.create({
                baseURL: "https://livegateway.supermoney.in/identityservices/auth/v1/",
                headers: { "content-type": "application/json" }
            });

            const data = {
                email: email,
                password: encryptedPassword,
                deviceId: email,
                captchaResponse: captchaResponse,
                deviceType: "",
                os: "",
                osVersion: "",
                appVersion: "",
                notificationToken: "",
                deviceName: ""
            };

            const options = {
                successCallBack: (res: any) => {
                    console.log(res);
                    // const JSONData = response.data;
                    if (res.token !== "") {
                        // setUserId(JSONData.user.id);

                        // dispatch(setuserId({ userId: JSONData.user.id }));

                        dispatch(setToken(res.token));
                        localStorage.setItem("authtoken", res.token);
                        // dispatch(setLoggedInUser(res.user));

                        // dispatch(setloginId({ loginid: JSONData.user.userName }));

                        // dispatch(setlastLogin({ lastLogin: JSONData.user.id }));

                        // axios.defaults.headers.common['Content-Type'] = 'application/json';
                        // axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("authtoken")}`;
                        getUserDetails();
                    }
                    dispatch(setIsLoading(false));
                    setProgress(false);
                },
                failureCallBack: (error: any) => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        if (
                            error.response.data[0].errorMsg ===
                            "User with this email not found"
                        ) {
                            setEmailError(true);
                            setErrorEmailTxt(error.response.data[0].errorMsg);
                        } else {
                            setPasswordError(true);
                            setError(error.response.data[0].errorMsg);
                            if (typeof window.grecaptcha !== 'undefined') {
                                window.grecaptcha.reset();
                            }
                        }
                        dispatch(setIsLoading(false));
                    }
                    setProgress(false);
                }
            };
            makeAPIPOSTRequest("/identityservices/auth/v1/login", {}, data, options);
        } else {
            setEmailError(true);
            setErrorEmailTxt("Please enter login id");
        }
    };

    const getUserDetails = () => {
        dispatch(setIsLoading(true));
        const options = {
            successCallBack: (res: any) => {
                dispatch(setLoggedInUser(res));
                if (redirect && redirect.length > 0) {
                    const redirectionUrl = `${redirect}?token=${localStorage.getItem("authtoken")}`;
                    window.location.href = redirectionUrl;
                }
                else {

                    if (res.roles[0].id === 11) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 12) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 10) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 9) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 8) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 13) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 14) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 25) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 6) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 4) {
                        // navigate("/sendmobileotp");
                        const newURL = "https://www.supermoney.in/Escorts/";
                        window.location.href = newURL;
                    } else if (res.roles[0].id === 27) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 28) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 3) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 29) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 19) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 20) {
                        navigate("/sendmobileotp");
                    } else if (res.roles[0].id === 30) {
                        navigate("/sendmobileotp");
                    } else {
                        navigate("/sendmobileotp");
                    }
                }
            },
            failureCallBack: (err: any) => {
                console.error("Error fetching user API details:", err);
                setIsLoading(false)
            },
        }
        makeAPIGETRequest('/identityservices/auth/v1/users', {}, options)
    }

    const loadRecaptcha = () => {
        // Check if the script is already loaded
        if (!document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]')) {
            const script = document.createElement("script");
            script.src = "https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        } else {
            // If already loaded, just render the captcha
            renderRecaptcha();
        }
    };

    const renderRecaptcha = () => {
        if (
            document.getElementById("recaptcha-container") &&
            typeof window.grecaptcha !== 'undefined' &&
            window.grecaptcha.render
        ) {
            try {
                window.grecaptcha.render("recaptcha-container", {
                    sitekey: "6Ld8bpwqAAAAAD0IzCr8elcGnNzhEv2nKIO8Iewz",
                    // sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", //for local testing
                    callback: onCaptchaSuccess,
                    "expired-callback": onCaptchaExpired
                });
            } catch (e) {
                console.log("Recaptcha already rendered.", e);
            }
        }
    };

    const onCaptchaSuccess = (token: string) => {
        console.log("CAPTCHA token:", token);
        setCaptchaResponse(token);
        setCaptchaVerified(true);
    };

    const onCaptchaExpired = () => {
        console.log("CAPTCHA expired.");
        setCaptchaVerified(false);
        setCaptchaResponse("");
    };

    return (
        <div id="page-login" className="grid grid-cols-1 md:grid-cols-12 min-h-screen ">
            {/* Left Side (Image + Logo) */}
            <div className="hidden md:flex md:col-span-8 flex-col bg-[#f8f8f8] dark:bg-gray-900">
                {/* Logo */}
                <div className="w-full p-6">
                    <img src={logo} alt="logo" className="h-10" />
                </div>

                {/* Illustration */}
                <div className="flex flex-1 items-center justify-center">
                    <img
                        src={smartdashboard}
                        alt="illustration"
                        className="max-w-2xl w-full h-auto object-contain"
                    />
                </div>
            </div>

            {/* Right Side (Login Form) */}
            <div className="col-span-12 md:col-span-4 flex md:items-center bg-white justify-center px-6 py-10 overflow-hidden dark:bg-gray-900">
                <div className="w-full max-w-sm text-[#6e6b7b]">
                    {/* Heading */}
                    <h1 className="text-lg font-bold">Login</h1>
                    <p className="text-sm text-[700]">
                        Welcome back, please login to your account.
                    </p>

                    {/* Email Input */}
                    <div className="mt-6">
                        <label htmlFor="loginTextOne" className="block text-xs font-medium ">
                            Email / Mobile Number
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                id="loginTextOne"
                                name="email"
                                autoComplete="off"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter email id or mobile number"
                                className={`w-full border ${emailError ? "border-red-500" : "border-gray-300"
                                    } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-400 placeholder:text-xs placeholder:dark:text-black`}
                            />
                            <i className="absolute right-3 top-2.5 text-gray-400 feather icon-user"></i>
                        </div>
                        {emailError && (
                            <p className="mt-1 text-xs text-red-600">{errorEmailTxt}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center">
                            <label htmlFor="passwordText" className="block text-xs font-medium ">
                                Password
                            </label>
                            <button
                                onClick={forgotPassClick}
                                className="text-xs text-[#4328ae] hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="relative mt-1">
                            <input
                                type="password"
                                id="passwordText"
                                name="password"
                                autoComplete="off"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter password"
                                className={`w-full border ${passwordError ? "border-red-500" : "border-gray-300"
                                    } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-400 placeholder:text-xs placeholder:dark:text-black`}
                            />
                            <i className="absolute right-3 top-2.5 text-gray-400 feather icon-lock"></i>
                        </div>
                        {passwordError && (
                            <p className="mt-1 text-xs text-red-600">{error}</p>
                        )}
                    </div>

                    {/* Recaptcha */}
                    <div className="mt-6 flex justify-start">
                        <div id="recaptcha-container"></div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center mt-4">
                        <input
                            id="rememberMe"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            className="h-4 w-4 rounded border-gray-300 text-[#4328ae] focus:ring-indigo-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-xs ">
                            Remember Me
                        </label>
                    </div>

                    {/* Login Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={validateTextField}
                            disabled={progress}
                            className="w-full py-2 rounded-md bg-[#4328ae] text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {progress ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};