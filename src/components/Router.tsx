import {Navigate, Route, Routes} from "react-router-dom";
import HomePage from "../pages/home";
import React from "react";
import PostListPage from "../pages/posts";
import PostDetailPage from "../pages/posts/detail";
import PostNewPage from "../pages/posts/new";
import PostEditPage from "../pages/posts/edit";
import ProfilePage from "../pages/profile";
import ProfileEditPage from "../pages/profile/edit";
import SearchPage from "../pages/search";
import NotificationsPage from "../pages/notifications";
import LoginPage from "../pages/users/login";
import SignupPage from "../pages/users/signup";
import {isCursorAtEnd} from "@testing-library/user-event/dist/utils";
interface RouterProps {
    isAuthenticated : boolean;
}

export default function Router({isAuthenticated}:RouterProps){
    return (
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path={"/"} element={<HomePage />} />
                    <Route path={"/posts"} element={<PostListPage />} />
                    <Route path={"/posts/:id"} element={<PostDetailPage />} />
                    <Route path={"/posts/new"} element={<PostNewPage />} />
                    <Route path={"/posts/edit/:id"} element={<PostEditPage />} />
                    <Route path={"/profile"} element={<ProfilePage />} />
                    <Route path={"/profile/edit"} element={<ProfileEditPage />} />
                    <Route path={"/notifications"} element={<NotificationsPage/>} />
                    <Route path={"/search"} element={<SearchPage/>} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </>
            ) : (
                <>
                    <Route path={"/users/login"} element={<LoginPage/>} />
                    <Route path={"/users/signup"} element={<SignupPage/>} />
                    <Route path="*" element={<Navigate replace to="/users/login" />} />
                </>
            )}


        </Routes>
    );
}