import SideNavbar from "./components/SideNavbar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import { excludeSidebarRoutes, excludeSideNavbarRoutes } from "./lib/routes";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./pages/SettingsPage";
import { useGetAuthQuery } from "./lib/queries/auth.queries";
import PostModal from "./components/postComponents/PostModal";
import EditProfile from "./components/profilePageComponents/EditProfile";
import { useQueryClient } from "@tanstack/react-query";
import SavedPostsPage from "./pages/SavedPostsPage";
import LikedPostsPage from "./pages/LikedPostsPage";
import RestrictedPage from "./pages/RestrictedPage";
import { ImSpinner2 } from "react-icons/im";

export default function App() {
  const { isLoading, isSuccess } = useGetAuthQuery();

  const location = useLocation(),
    navLoc = location.state?.backgroundLocation
      ? location.state?.backgroundLocation.pathname
      : location.pathname;

  const includeSideNavbar = !excludeSideNavbarRoutes.includes(
    navLoc.split("/").filter(Boolean)[0] || "",
  );
  const includeSidebar = !excludeSidebarRoutes.includes(
    navLoc.split("/").filter(Boolean)[0] || "",
  );

  if (isLoading)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <ImSpinner2 className="size-12 animate-spin text-violet-700" />
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div
        className={`flex w-full flex-col md:order-last ${includeSideNavbar && "md:w-[calc(100%-12.24rem)]"}`}
      >
        <div className="flex w-full">
          <div
            className={`flex min-h-screen w-full flex-col ${includeSidebar && "lg:w-[calc(100%-20rem)]"}`}
          >
            <PageRoutes isAuthUser={isSuccess} />
          </div>
          {includeSidebar && <Sidebar />}
        </div>
      </div>
      {includeSideNavbar ? <SideNavbar /> : null}
    </div>
  );
}

function PageRoutes({ isAuthUser }) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  const location = useLocation(),
    pathRoot = location.pathname.split("/").filter(Boolean)[0];

  const bgLocation =
    !location.state?.backgroundLocation && pathRoot === "post"
      ? { pathname: "/home" }
      : !location.state?.backgroundLocation && pathRoot === "edit-profile"
        ? { pathname: "/profile/" + authUser?._id }
        : location.state?.backgroundLocation;

  return (
    <>
      <Routes location={bgLocation || location}>
        <Route path="/" element={<Navigate to="/home" />} />
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
        <Route
          path="/create"
          element={isAuthUser ? <CreatePostPage /> : <RestrictedPage />}
        />
        <Route
          path="/notifications"
          element={isAuthUser ? <NotificationPage /> : <RestrictedPage />}
        />
        <Route
          path="/settings"
          element={isAuthUser ? <SettingsPage /> : <RestrictedPage />}
        />
        <Route
          path="/profile/"
          element={
            isAuthUser ? (
              <Navigate to={"/profile/" + authUser._id} />
            ) : (
              <RestrictedPage />
            )
          }
        />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route
          path="/liked-posts"
          element={isAuthUser ? <LikedPostsPage /> : <RestrictedPage />}
        />
        <Route
          path="/saved-posts"
          element={isAuthUser ? <SavedPostsPage /> : <RestrictedPage />}
        />
        <Route
          path="*"
          element={
            <div className="min-h-screen text-center font-black">
              Page not found
            </div>
          }
        />
      </Routes>
      {bgLocation && (
        <Routes>
          <Route path="/post/:postId" element={<PostModal />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element />
        </Routes>
      )}
    </>
  );
}
