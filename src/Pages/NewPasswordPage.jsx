import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader";
import { useState } from "react";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { handleNewPassword } from "../redux/authSlice/authSlice";

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    userPassword.confirmPassword = userPassword.confirmPassword.replace(
      /\s+/g,
      ""
    );
    userPassword.password = userPassword.password.replace(/\s+/g, "");

    const { password, confirmPassword } = userPassword;

    if (!password || !confirmPassword) {
      toast.error("Both fields are mandatory");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    try {
      const res = await dispatch(
        handleNewPassword({ email, newPassword: userPassword.password })
      ).unwrap();

      setUserPassword({
        password: "",
        confirmPassword: "",
      });

      toast.success(res);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-2">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-7 w-full md:max-w-[600px] lg:max-w-[660px] xl:max-w-[760px]  2xl:max-w-[820px] border-2 border-green-700 rounded-md px-1.5 sm:px-3 xl:px-4 2xl:px-5
     py-2 sm:py-3 xl:py-4"
      >
        <div className="text-center">
          <h1 className="sm:text-5xl min-[419px]:text-4xl min-[375px]:text-3xl text-2xl font-semibold text-green-600 underline">
            New Password
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="font-semibold text-base sm:text-lg xl:text-xl ms-2"
            >
              New Password
            </label>
            <div className="w-full flex justify-between items-center border border-green-500 rounded-md px-1">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="off"
                name="password"
                value={userPassword.password}
                className="font-medium text-base xl:text-lg py-2 outline-none px-1 placeholder:text-black grow"
                placeholder="Enter New Password"
                onChange={(e) =>
                  setUserPassword({
                    ...userPassword,
                    password: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="cursor-pointer text-2xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeSharp /> : <IoEyeOff />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="font-semibold text-base sm:text-lg xl:text-xl ms-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={userPassword.confirmPassword}
              autoComplete="off"
              name="confirmPassword"
              className="font-medium text-base xl:text-lg py-2 rounded-md px-2 outline-none border border-green-500 placeholder:text-black"
              placeholder="Confirm Password"
              onChange={(e) =>
                setUserPassword({
                  ...userPassword,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          <div className="w-full">
            <button
              disabled={isLoading ? true : false}
              className="py-2 font-medium text-lg sm:text-xl bg-green-600 hover:bg-green-500 transition-colors duration-200 w-full rounded-md text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
              type="submit"
            >
              {isLoading ? <Loader /> : "Update password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPasswordPage;
