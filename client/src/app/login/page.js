
import { Suspense } from "react";
import UserLoginPage from "./UserLoginPage";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <UserLoginPage />
        </Suspense>
    );
}