"use client"
import * as React from "react"
import { useState } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/auth-context"

// Zod schema for login
const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(8, "At least 8 characters")
        .regex(/[A-Z]/, "At least one uppercase letter")
        .regex(/[a-z]/, "At least one lowercase letter")
        .regex(/[0-9]/, "At least one number")
        .regex(/[\W_]/, "At least one special character"),
})

export function Login() {
    const router = useRouter()
    const { login } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [message, setMessage] = useState("")
    const [messageColor, setMessageColor] = useState("")

    const handleLogin = (e) => {
        e.preventDefault()

        const result = loginSchema.safeParse({ email, password })

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors
            setEmailError(errors.email?.[0] || "")
            setPasswordError(errors.password?.[0] || "")
            setMessage("Login failed. Please try again.")
            setMessageColor("text-red-500")
            return
        }

        // Clear errors
        setEmailError("")
        setPasswordError("")
        setMessage("Login successful!")
        setMessageColor("text-green-600")

        // Set user in AuthContext
        login(email)

        // Redirect to /profile after short delay
        setTimeout(() => {
            router.push("/profile")
        }, 500)
    }

    return (
        <div className="flex items-center justify-center mt-32 mb-32">
            <Card className="w-[400px] p-4">
                <CardHeader>
                    <CardTitle className="text-3xl">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your profile</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="login@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                            </div>

                            {message && <p className={`text-sm ${messageColor}`}>{message}</p>}
                        </div>
                        <CardFooter className="flex items-center justify-center mt-4 p-0">
                            <Button className="h-10 w-full" type="submit">Login</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
