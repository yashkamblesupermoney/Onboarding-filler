import RectangleGreen from '../../assets/images/imported/RectangleGreen.png'
import BackgroundImage from '../../assets/images/imported/backGroundImage.png'
import SendOtpForm from './SendOtpForm'

export default function RegisterCustomer() {
    return (
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
    )
}
