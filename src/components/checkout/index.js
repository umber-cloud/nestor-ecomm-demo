"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ShieldCheck, CreditCard, CheckCircle2, XCircle } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(1, { message: "Full name is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }),
    expDate: z.string().min(1, { message: "Expiration date is required" }),
    cvc: z.string().min(3, { message: "CVC must be at least 3 digits" }),
})

export default function CheckoutPage() {
    const [paymentStatus, setPaymentStatus] = useState(null)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
    })

    const emailValue = watch("email")

    const onSubmit = () => {
        setPaymentStatus("success")
    }

    return (
        <div className="min-h-screen py-4 mt-12">
            <div className="max-w-xl mx-auto space-y-8">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl">Checkout</h1>
                    <p className="text-muted-foreground mt-2">Provide billing and shipping details below.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="rounded-3xl border-border">
                        <CardContent className="space-y-8 p-6 md:p-8">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Contact</h2>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" className="rounded-xl mt-1.5" {...register("email")} />
                                    {errors.email ? (
                                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                                    ) : emailValue?.length > 0 ? (
                                        <p className="text-emerald-600 text-sm mt-1">Valid email</p>
                                    ) : null}
                                </div>
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" className="rounded-xl mt-1.5" {...register("name")} />
                                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Shipping</h2>
                                <div>
                                    <Label htmlFor="country">Country or Region</Label>
                                    <Select onValueChange={(value) => setValue("country", value, { shouldValidate: true })}>
                                        <SelectTrigger id="country" className="rounded-xl mt-1.5">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in">India</SelectItem>
                                            <SelectItem value="us">United States</SelectItem>
                                            <SelectItem value="ca">Canada</SelectItem>
                                            <SelectItem value="uk">United Kingdom</SelectItem>
                                            <SelectItem value="au">Australia</SelectItem>
                                            <SelectItem value="de">Germany</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.country && (
                                        <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" type="text" className="rounded-xl mt-1.5" {...register("address")} />
                                    {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="billing-same" />
                                    <Label htmlFor="billing-same" className="font-normal">Billing address same as shipping</Label>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Payment</h2>
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                                        Secure checkout
                                    </span>
                                </div>
                                <div className="relative">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <div className="relative mt-1.5">
                                        <Input
                                            id="card-number"
                                            type="text"
                                            {...register("cardNumber")}
                                            placeholder="1234 5678 9012 3456"
                                            className="rounded-xl pr-10"
                                        />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    {errors.cardNumber && (
                                        <p className="text-destructive text-sm mt-1">{errors.cardNumber.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="exp-date">Expiration Date</Label>
                                        <Input id="exp-date" type="text" placeholder="MM/YY" className="rounded-xl mt-1.5" {...register("expDate")} />
                                        {errors.expDate && (
                                            <p className="text-destructive text-sm mt-1">{errors.expDate.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">Security Code</Label>
                                        <Input id="cvc" type="password" className="rounded-xl mt-1.5" {...register("cvc")} />
                                        {errors.cvc && (
                                            <p className="text-destructive text-sm mt-1">{errors.cvc.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base"
                            >
                                Pay Now
                            </Button>

                            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Your payment information is encrypted and secure.
                            </p>
                        </CardContent>
                    </Card>

                    {paymentStatus === "success" && (
                        <p className="flex items-center justify-center gap-2 text-emerald-600 font-medium mt-4">
                            <CheckCircle2 className="h-4 w-4" />
                            Payment successfully done!
                        </p>
                    )}
                    {paymentStatus === "error" && (
                        <p className="flex items-center justify-center gap-2 text-destructive font-medium mt-4">
                            <XCircle className="h-4 w-4" />
                            Payment failed. Try again.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
