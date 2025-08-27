import Navbar from "../Components/Navbar";
import { NavLink, useNavigate } from "react-router";
import { FaGithubSquare, FaLink, FaLinkedin } from "react-icons/fa";
import store from "../store.js";
import { useDispatch, useSelector } from "react-redux";
import {
  handleProfileData,
  handleLogout,
  handleTokenRefresh,
} from "../redux/authSlice/authSlice";
import { useEffect } from "react";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = store.getState().auth; // avoid store.getState outside component if possible

  const handleUserData = async () => {
    try {
      await dispatch(handleProfileData()).unwrap();
    } catch (error) {
      if (error.includes("Token expired")) {
        try {
          await dispatch(handleTokenRefresh()).unwrap();
        } catch (error) {
          if (error.includes("Sign In again")) {
            dispatch(handleLogout());
            navigate("/login");
          }
        }
      }
    }
  };

  useEffect(() => {
    handleUserData();

    const interval = setInterval(() => {
      handleUserData();
    }, 20000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="h-full w-full flex flex-col gap-5">
      <>
        <Navbar userName={user?.userName} />
      </>
      <main className="h-full w-full flex justify-center items-center px-3">
        <div className="py-2 w-full md:max-w-[660px] lg:max-w-[700px] xl:max-w-[760px]  2xl:max-w-[820px] flex flex-col items-center gap-7">
          <h1 className="font-semibold sm:text-7xl text-6xl text-green-600 text-center leading-18">
            Hey {user?.userName}
          </h1>
          <div className="flex min-[451px]:justify-between justify-center items-center w-full flex-wrap gap-3">
            <NavLink
              to={"https://www.linkedin.com/in/abid-shah-khan"}
              target="_blank"
              className={`font-medium flex items-center gap-1.5 border px-1 py-2 rounded-md justify-center`}
            >
              <span className="text-3xl text-blue-500">
                <FaLinkedin />
              </span>
              <span className="sm:text-xl text-lg">Visit my Linkedin</span>
            </NavLink>
            <NavLink
              to={"https://github.com/Abidkhan234"}
              target="_blank"
              className={`font-medium flex items-center gap-1.5 border px-1 py-2 rounded-md justify-center`}
            >
              <span className="text-3xl">
                <FaGithubSquare />
              </span>
              <span className="sm:text-xl text-lg">Visit my Github</span>
            </NavLink>
            <NavLink
              to={"https://abid-khan-portfolio.vercel.app"}
              target="_blank"
              className={`font-medium flex items-center gap-1.5 border px-1 py-2 rounded-md justify-center`}
            >
              <span className="text-xl">
                <FaLink />
              </span>
              <span className="sm:text-xl text-lg">Visit my Portfolio</span>
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
