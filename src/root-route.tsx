import { Navigate, Route, Routes } from "react-router";
import SignInPage from "./pages/sing-in-page";
import SignUpPage from "./pages/sign-up-page";
import ForgetPasswordPage from "./pages/forget-passwrod-page";
import IndexPage from "./pages/index-page";
import PostDetailPage from "./pages/post-detail-page";
import ProfileDetailPage from "./pages/profile-detail-page";
import ResetPasswordPage from "./pages/reset-password-page";
import GlobalLayout from "./components/ui/layout/global-layout";
import GuestOnlyLayout from "./components/ui/layout/global-only-layout";
import MemberOnlyLayout from "./components/ui/layout/member-only-layout";

export default function RootRoute(){
    return (
      <Routes>
         <Route element={<GlobalLayout /> }>
            <Route element={<GuestOnlyLayout />}>
            <Route path="/sign-in" element={<SignInPage/>} />
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/forget-password"element={<ForgetPasswordPage/>} />
            </Route>

        <Route element={<MemberOnlyLayout />}>
            <Route path="/" element={<IndexPage/>}/>
            <Route path="/post/:postId" element={<PostDetailPage/>}/>
            <Route path="/profile/:userId" element={<ProfileDetailPage/>} />
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
        </Route>

            <Route path="*" element={<Navigate to={'/'} />} />
        </Route>
    </Routes>
    );
}