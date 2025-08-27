import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { accessToken, refreshToken } = useSelector((state) => state.auth);
  if (!accessToken || !refreshToken) {
    return <Navigate to={"/login"} replace />;
  }
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
};

export default ProtectedRoutes;
