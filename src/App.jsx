import "./App.css";
import { Route, Routes } from "react-router";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import PageLayout from "./Layout/PageLayout";
import ProtectedRoutes from "./Layout/ProtectedRoutes";
import VerifyOtpPage from "./Pages/Verify-otp";
import ForgetPasswordPage from "./Pages/ForgetPasswordPage";
import NewPasswordPage from "./Pages/NewPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const App = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route index element={<RegisterPage />} />
          <Route path="/verify-otp/:email" element={<VerifyOtpPage />} />
          <Route path="/new-password/:email" element={<NewPasswordPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
