"use client"
import * as React from "react"
import { useState } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/context/auth-context"
import { LogIn, CheckCircle2 } from "lucide-react"

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
    const [success, setSuccess] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()

        const result = loginSchema.safeParse({ email, password })

        if (!result.success) {
            const errors = result.error.flatten().fieldErrors
            setEmailError(errors.email?.[0] || "")
            setPasswordError(errors.password?.[0] || "")
            setSuccess(false)
            return
        }

        setEmailError("")
        setPasswordError("")
        setSuccess(true)
        login(email)

        setTimeout(() => {
            router.push("/profile")
        }, 500)
    }

    return (
        <div className="flex items-center justify-center py-10 md:py-16">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-xl">
                {/* Decorative panel */}
                <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10">
                    <span className="font-semibold text-lg">InfinityGadgets</span>
                    <div>
                        <h2 className="text-3xl font-semibold leading-tight">
                            Welcome <em className="font-serif font-normal">back.</em>
                        </h2>
                        <p className="text-primary-foreground/60 mt-3 text-sm max-w-xs">
                            Sign in to track orders, save favorites, and check out faster.
                        </p>
                    </div>
                    <span className="text-xs text-primary-foreground/40">
                        © {new Date().getFullYear()} InfinityGadgets
                    </span>
                </div>

                {/* Form panel */}
                <div className="bg-card p-8 md:p-10 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold mb-1">Sign In</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Enter your credentials to access your account.
                    </p>

                    <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="login@example.com"
                                className="h-11 rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                required
                            />
                            {emailError && <p className="text-sm text-destructive">{emailError}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="h-11 rounded-xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                        </div>

                        {success && (
                            <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                Login successful — redirecting…
                            </p>
                        )}

                        <Button className="h-11 w-full gap-2 mt-2" type="submit">
                            <LogIn className="h-4 w-4" />
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
