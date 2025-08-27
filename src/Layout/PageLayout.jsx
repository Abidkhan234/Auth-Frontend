import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const PageLayout = () => {
  return (
    <div className="h-full w-full">
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1500,
            error: {
              duration: 2500,
            },
          }}
        />
      </>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
