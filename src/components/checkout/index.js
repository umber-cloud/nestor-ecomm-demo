"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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
    address: z.string().min(1, { message: "Address is required" }),
    cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }),
    expDate: z.string().min(1, { message: "Expiration date is required" }),
    cvc: z.string().min(3, { message: "CVC must be at least 3 digits" }),
})

export default function CheckoutPage() {
    const [country, setCountry] = useState("")
    const [paymentStatus, setPaymentStatus] = useState(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange", // ✅ Live validation
    })

    const emailValue = watch("email")

    const onSubmit = (data) => {
        if (!country) {
            setPaymentStatus("error")
            return
        }

        const isSuccess = true

        if (isSuccess) {
            setPaymentStatus("success")
        } else {
            setPaymentStatus("error")
        }
    }

    return (
        <div className="min-h-screen p-6 mt-11">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-black">Checkout</h1>
                <p className="text-black">Provide billing and shipping details below.</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="bg-white">
                        <CardContent className="space-y-6 p-6 text-black">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} />
                                    {errors.email ? (
                                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                                    ) : emailValue?.length > 0 ? (
                                        <p className="text-green-600 text-sm">Valid Email Id</p>
                                    ) : null}
                                </div>
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" {...register("name")} />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="country">Country or Region</Label>
                                    <Select onValueChange={(value) => setCountry(value)}>
                                        <SelectTrigger id="country">
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
                                    {country === "" && (
                                        <p className="text-red-500 text-sm">Country is required</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" type="text" {...register("address")} />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="billing-same" />
                                    <Label htmlFor="billing-same">Billing address same as payment</Label>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                        id="card-number"
                                        type="text"
                                        {...register("cardNumber")}
                                        placeholder="1234 5678 9012 3456"
                                        className="pr-20 p-6"
                                    />
                                    {errors.cardNumber && (
                                        <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
                                    )}
                                    <div className="absolute right-3 top-[38px] flex items-center space-x-1">
                                        <Image src="/images/visacard.png" alt="Visa" width={28} height={24} />
                                        <Image src="/images/mastercard.png" alt="MasterCard" width={28} height={24} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="exp-date">Expiration Date</Label>
                                        <Input id="exp-date" type="text" {...register("expDate")} />
                                        {errors.expDate && (
                                            <p className="text-red-500 text-sm">{errors.expDate.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="cvc">Security Code</Label>
                                        <Input id="cvc" type="password" {...register("cvc")} />
                                        {errors.cvc && (
                                            <p className="text-red-500 text-sm">{errors.cvc.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pay Now Button */}
                            <Button
                                type="submit"
                                className="w-full bg-black text-white hover:bg-black/80 rounded-full"
                            >
                                Pay Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Status Message */}
                    {paymentStatus === "success" && (
                        <p className="text-green-600 font-medium mt-4 text-center">
                            ✅ Payment successfully done!
                        </p>
                    )}
                    {paymentStatus === "error" && (
                        <p className="text-red-600 font-medium mt-4 text-center">
                            ❌ Payment failed. Try again.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
