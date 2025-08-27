import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decoded,
  handleLogin,
  handleRegister,
} from "../redux/authSlice/authSlice";
import { IoEyeOff, IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router";
import Loader from "./Loader";
import toast from "react-hot-toast";

const Form = ({ isLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { isLoading } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const onRegisterSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      userName: user.userName.replace(/\s+/g, ""),
      email: user.email.replace(/\s+/g, ""),
      password: user.password.replace(/\s+/g, ""),
    };

    const { userName, email, password } = userData;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!userName || !email || !password) {
      toast.error("All fields are mandatory");
      return;
    } else if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return;
    } else if (password.length <= 5) {
      toast.error("Password must be 6 characters long");
      return;
    } else {
      try {
        const response = await dispatch(handleRegister(userData)).unwrap();

        setUser({ userName: "", email: "", password: "" });
        setShowPassword(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        toast.success(response);
      } catch (error) {
        console.log("Login Form Error", error);
        toast.error(error);
      }
    }
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      identifier: user.email.replace(/\s+/g, ""),
      password: user.password.replace(/\s+/g, ""),
    };

    const { identifier, password } = userData;

    if (!identifier || !password) {
      toast.error("All fields are mandatory");
      return;
    } else {
      try {
        const response = await dispatch(handleLogin(userData)).unwrap();

        setUser({ userName: "", email: "", password: "" });
        setShowPassword(false);
        dispatch(decoded());
        toast.success(response.message);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } catch (error) {
        toast.error(error);
        console.error("Login failed:", error);
      }
    }
  };

  if (isLogin) {
    return (
      <form
        onSubmit={(e) => onLoginSubmit(e)}
        className="flex flex-col gap-5 w-full md:max-w-[600px] lg:max-w-[660px] xl:max-w-[760px]  2xl:max-w-[820px] border-2 border-green-700 rounded-md px-1.5 sm:px-3 xl:px-4 2xl:px-5
     py-2 sm:py-3 xl:py-4"
      >
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-6xl font-semibold text-green-600 underline">
            Login
          </h1>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-medium text-base xl:text-lg ms-2"
          >
            UserName/Email
          </label>
          <input
            type="text"
            id="email"
            value={user.email}
            autoComplete="off"
            name="email"
            className="font-medium text-base xl:text-lg py-2 rounded-md px-2 outline-none border border-green-500 placeholder:text-black"
            placeholder="Enter username OR email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-medium text-base xl:text-lg ms-2"
          >
            Password
          </label>
          <div className="w-full flex justify-between items-center border border-green-500 rounded-md px-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
              name="password"
              value={user.password}
              className="font-medium text-base xl:text-lg py-2 outline-none px-1 placeholder:text-black grow"
              placeholder="Enter Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button
              type="button"
              className="cursor-pointer text-2xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeSharp /> : <IoEyeOff />}
            </button>
          </div>
          <div className="self-end">
            <button
              type="button"
              className="text-green-500 underline cursor-pointer hover:text-green-400"
              onClick={() => navigate("/forget-password")}
            >
              Forget Password
            </button>
          </div>
        </div>
        <div className="font-medium text-base xl:text-lg flex gap-2 items-center">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="text-green-500 underline cursor-pointer hover:text-green-400"
            onClick={() => navigate("/")}
          >
            Register
          </button>
        </div>
        <div className="w-full">
          <button
            disabled={isLoading ? true : false}
            className="py-2 font-medium text-lg sm:text-xl bg-green-600 hover:bg-green-500 transition-colors duration-200 w-full rounded-md text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
            type="submit"
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => onRegisterSubmit(e)}
      className="flex flex-col gap-5 w-full md:max-w-[600px] lg:max-w-[660px] xl:max-w-[760px]  2xl:max-w-[820px] border-2 border-green-700 rounded-md px-1.5 sm:px-3 xl:px-4 2xl:px-5
     py-2 sm:py-3 xl:py-4"
    >
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-6xl font-semibold text-green-600 underline">
          Register
        </h1>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="font-medium text-base xl:text-lg ms-2"
        >
          User Name
        </label>
        <input
          type="text"
          id="username"
          name="userName"
          value={user.userName}
          autoComplete="off"
          className="font-medium text-base xl:text-lg py-2 rounded-md px-2 outline-none border border-green-500 placeholder:text-black"
          placeholder="Enter User name"
          onChange={(e) => setUser({ ...user, userName: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-medium text-base xl:text-lg ms-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email}
          autoComplete="off"
          name="email"
          className="font-medium text-base xl:text-lg py-2 rounded-md px-2 outline-none border border-green-500 placeholder:text-black"
          placeholder="Enter Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-medium text-base xl:text-lg ms-2"
        >
          Password
        </label>
        <div className="w-full flex justify-between items-center border border-green-500 rounded-md px-1">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="off"
            name="password"
            value={user.password}
            className="font-medium text-base xl:text-lg py-2 outline-none px-1 placeholder:text-black grow"
            placeholder="Enter Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
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
      <div className="font-medium text-base xl:text-lg flex gap-2 items-center">
        <span>Already have an account?</span>
        <button
          type="button"
          className="text-green-500 underline cursor-pointer hover:text-green-400"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
      <div className="w-full">
        <button
          disabled={isLoading ? true : false}
          className="py-2 font-medium text-lg sm:text-xl bg-green-600 hover:bg-green-500 transition-colors duration-200 w-full rounded-md text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
          type="submit"
        >
          {isLoading ? <Loader /> : "Register"}
        </button>
      </div>
    </form>
  );
};

export default Form;
