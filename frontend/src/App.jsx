import SideNavbar from "./components/SideNavbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {
  excludeRecommendationbarRoutes,
  excludeSideNavbarRoutes,
} from "./utils/routeUtil";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import { useEffect, useRef } from "react";
import { fetchUser } from "./redux/user/userSlice";

export default function App() {
  const location = useLocation();

  // set friendrequests seen to true
  // <div data-theme="light" className="flex flex-col md:flex-row">
  //   <div
  //     className={`flex shrink flex-col md:order-last md:w-[calc(100%-12.25rem)] ${excludeSideNavbarRoutes.includes(location.pathname) && "md:flex-1"}`}
  //   >
  //     {/* <div className="hidden h-6 w-full bg-yellow-200" /> */}
  //     <PageRoutes />
  //   </div>
  //   <SideNavbar />
  // </div>;

  return (
    <div data-theme="light" className="flex min-h-screen flex-col md:flex-row">
      <div
        className={`flex flex-1 flex-col bg-orange-200 md:order-last md:w-[calc(100%-12.25rem)] ${excludeSideNavbarRoutes.includes(location.pathname) && "md:w-full"}`}
      >
        {/* <div className="h-6 w-full bg-yellow-200" /> */}
        <div className="flex flex-1 bg-white">
          <div
            className={`flex min-h-screen w-full bg-red-200 lg:w-[calc(100%-20rem)] ${excludeRecommendationbarRoutes.includes(location.pathname) && "lg:w-full"}`}
          >
            <PageRoutes />
          </div>
          {!excludeRecommendationbarRoutes.includes(location.pathname) && (
            <div className="hidden flex-1 border-l-2 border-gray-300 bg-gray-200 bg-opacity-70 lg:flex" />
          )}
        </div>
      </div>
      <SideNavbar />
    </div>
  );
}
function PageRoutes() {
  const { authUser } = useSelector((state) => state.user);
  const authUserRef = useRef(authUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = () => dispatch(fetchUser());
    console.log("user refresh");

    authUserRef.current?._id && fetchUserData();
    const fetchUserIntervalId = setInterval(fetchUserData, 10000 * 60 * 1000);
    return () => clearInterval(fetchUserIntervalId);
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={authUser ? "/home" : "/login"} />}
      />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/signup"
        element={authUser ? <Navigate to="/home" /> : <SignupPage />}
      />
      <Route
        path="/login"
        element={authUser ? <Navigate to="/home" /> : <LoginPage />}
      />
      <Route path="/profile/" element={<ProfilePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route
        path="/:test"
        element={
          <div className="min-h-screen text-center font-black">
            Page not found
          </div>
        }
      />
    </Routes>
  );
}
