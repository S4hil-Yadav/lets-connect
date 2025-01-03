import SideNavbar from "./components/SideNavbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import {
  excludeSidebarRoutes,
  excludeSideNavbarRoutes,
} from "./utils/routeUtil";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./pages/SettingsPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function App() {
  const { isLoading, status } = useQuery({
    queryKey: ["authUser"],
    queryFn: () =>
      axios.get("/api/v1/users/get-auth-user").then((res) => res.data),
    retry: (count, error) => count < 3 && error.response?.status === 500,
  });

  const location = useLocation();

  const includeSideNavbar = !excludeSideNavbarRoutes.includes(
    location.pathname.split("/").filter(Boolean)[0] || "",
  );
  const includeSidebar = !excludeSidebarRoutes.includes(
    location.pathname.split("/").filter(Boolean)[0] || "",
  );

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div
        className={`flex w-full flex-col bg-orange-200 md:order-last ${includeSideNavbar && "md:w-[calc(100%-12.24rem)]"}`}
      >
        <div className="hidden h-10 w-full bg-yellow-200" />
        <div className="flex w-full bg-gray-50">
          <div
            className={`flex min-h-screen w-full ${includeSidebar && "lg:w-[calc(100%-20rem)]"}`}
          >
            <PageRoutes isAuthUser={status === "success"} />
          </div>
          {includeSidebar && <Sidebar />}
        </div>
      </div>
      {includeSideNavbar ? <SideNavbar /> : null}
    </div>
  );
}

function PageRoutes({ isAuthUser }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthUser ? "/home" : "/login"} />}
      />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/signup"
        element={isAuthUser ? <Navigate to="/home" /> : <SignupPage />}
      />
      <Route
        path="/login"
        element={isAuthUser ? <Navigate to="/home" /> : <LoginPage />}
      />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/create" element={<CreatePostPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
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
