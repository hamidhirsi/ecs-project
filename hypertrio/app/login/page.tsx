import { Suspense } from "react"
import LoginForm from "../ui/login-form"
import Nav from "../ui/nav"

export default function Login() {
    return(
        <div>
            <Nav />
            <Suspense />
                <LoginForm />
            <Suspense />
        </div>

    )
}