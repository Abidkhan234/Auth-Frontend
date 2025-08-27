import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Loader from "../Components/Loader";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { handleOTPVerification } from "../redux/authSlice/authSlice";

const VerifyOtpPage = () => {
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const { email } = useParams();

  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
    e.target.value = value;

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    updateOtp();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/[^0-9]/g, "");
    pastedData.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = char;
      }
    });
    updateOtp();
    if (inputsRef.current[pastedData.length - 1]) {
      inputsRef.current[pastedData.length - 1].focus();
    }
  };

  const updateOtp = () => {
    const value = inputsRef.current.map((input) => input.value).join("");
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Enter OTP first");
      return;
    } else if (otp.length < 6) {
      toast.error("Incorrect OTP");
      return;
    }

    try {
      const res = await dispatch(
        handleOTPVerification({ email, otp })
      ).unwrap();

      toast.success(res);

      inputsRef.current.forEach((input) => {
        if (input) input.value = "";
      });

      setOtp("");
      inputsRef.current[0].focus();

      setTimeout(() => {
        navigate(`/new-password/${email}`);
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error);
      if (error.includes("OTP Expired")) {
        navigate("/reset-password");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full px-2">
      <form
        className="flex flex-col gap-10 w-full md:max-w-[560px] lg:max-w-[600px] 2xl:max-w-[700px] border-2 border-green-700 rounded-md px-1.5 sm:px-3 xl:px-4 2xl:px-5
     py-2 sm:py-3 xl:py-4 relative"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div
          className="absolute xl:top-5 sm:top-4 top-3 min-[419px]:left-2 left-1 rounded-sm sm:size-10 min-[419px]:size-8 size-7 border border-green-400 flex justify-center items-center cursor-pointer bg-green-500 hover:bg-green-400 transition-colors duration-200"
          onClick={() => navigate("/forget-password")}
        >
          <span className="sm:text-xl text-base  text-white">
            <FaArrowLeft />
          </span>
        </div>
        <div className="text-center">
          <h1 className="sm:text-5xl min-[419px]:text-4xl text-3xl font-semibold text-green-600 underline">
            Verify OTP
          </h1>
        </div>
        <div className="flex justify-between items-center">
          {Array(6)
            .fill()
            .map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="border border-green-500 min-[421px]:size-12 size-10 rounded-md focus:shadow-md shadow-green-400 outline-none font-semibold text-xl text-center"
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
        </div>
        <div className="w-full">
          <button
            disabled={isLoading ? true : false}
            className="py-2 font-medium text-lg sm:text-xl bg-green-600 hover:bg-green-500 transition-colors duration-200 w-full rounded-md text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
            type="submit"
          >
            {isLoading ? <Loader /> : "Enter OTP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpPage;
