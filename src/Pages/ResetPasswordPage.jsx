import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { handleResetPassword } from "../redux/authSlice/authSlice";
import { useNavigate } from "react-router";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    } else {
      try {
        const saveEmail = email;

        const res = await dispatch(handleResetPassword(saveEmail)).unwrap();

        setEmail("");

        toast.success(res);

        setTimeout(() => {
          navigate(`/verify-otp/${saveEmail}`);
        }, 1000);
      } catch (error) {
        console.log("Forget password form error", error);
        toast.error(error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full px-2">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-10 w-full md:max-w-[660px] lg:max-w-[700px] 2xl:max-w-[800px] border-2 border-green-700 rounded-md px-1.5 sm:px-3 xl:px-4 2xl:px-5
     py-2 sm:py-3 xl:py-4 relative"
      >
        <div
          className="absolute xl:top-5 sm:top-4 top-3 min-[419px]:left-2 left-1 rounded-sm sm:size-10 min-[419px]:size-8 min-[375px]:size-7 size-6 border border-green-400 flex justify-center items-center cursor-pointer bg-green-500 hover:bg-green-400 transition-colors duration-200"
          onClick={() => navigate("/home")}
        >
          <span className="sm:text-xl min-[375px]:text-base text-sm text-white">
            <FaArrowLeft />
          </span>
        </div>
        <div className="text-center">
          <h1 className="sm:text-5xl min-[419px]:text-4xl min-[375px]:text-3xl text-2xl font-semibold text-green-600 underline">
            Reset Password
          </h1>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-medium text-base sm:text-lg xl:text-xl ms-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              autoComplete="off"
              name="email"
              className="font-medium text-base xl:text-lg py-2 rounded-md px-2 outline-none border border-green-500 placeholder:text-black"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <button
              disabled={isLoading ? true : false}
              className="py-2 font-medium text-lg sm:text-xl bg-green-600 hover:bg-green-500 transition-colors duration-200 w-full rounded-md text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
              type="submit"
            >
              {isLoading ? <Loader /> : "Request OTP"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
