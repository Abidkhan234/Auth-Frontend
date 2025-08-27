import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleLogout } from "../redux/authSlice/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const Navbar = ({userName}) => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const res = await dispatch(handleLogout()).unwrap();

      toast.success(res);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <nav className="flex justify-between items-center px-2.5 sm:px-5 py-2">
      <div className="">
        <h1 className="text-3xl font-semibold tracking-wide">
          MERN Auth
        </h1>
      </div>
      <div className="relative grow text-end">
        <div
          className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-teal-500 rounded-full dark:bg-gray-600 cursor-pointer"
          onClick={() => setShowModal(!showModal)}
        >
          <span className="font-medium text-white text-xl uppercase">
            {userName?.charAt(0)}
          </span>
        </div>
        <div
          className={`${
            showModal
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-0"
          } fixed top-15 right-6 w-full max-w-[160px] rounded-sm bg-teal-500 transition-all duration-300 flex flex-col overflow-hidden gap-1`}
        >
          <button
            className="font-medium text-base cursor-pointer py-2 hover:bg-teal-400 w-full transition-colors text-white"
            onClick={() => onLogout()}
          >
            Logout
          </button>
          <button
            className="font-medium text-base cursor-pointer py-2 hover:bg-teal-400 w-full transition-colors text-white"
            onClick={() => navigate("/reset-password")}
          >
            Reset Password
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
