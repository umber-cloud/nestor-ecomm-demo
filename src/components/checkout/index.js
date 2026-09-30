"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import Link from "next/link"
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
import { ShieldCheck, CreditCard, CheckCircle2, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cartContext"
import { formatPrice } from "@/lib/formatPrice"
import { CartItemThumbnail } from "@/components/CartItemThumbnail"

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
    const { cart, getCartTotal, clearCart } = useCart()
    const [isComplete, setIsComplete] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
    })

    const emailValue = watch("email")

    const onSubmit = async () => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        clearCart()
        setIsComplete(true)
    }

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <h1 className="font-serif text-3xl">
                    Order <em className="font-serif font-normal">confirmed.</em>
                </h1>
                <p className="text-muted-foreground max-w-sm">
                    Thanks for shopping with us — a confirmation has been sent to your inbox.
                </p>
                <Button asChild className="mt-2 h-11 px-8">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                <h1 className="font-serif text-2xl">Your bag is empty</h1>
                <p className="text-muted-foreground max-w-sm">
                    Add some products to your bag before checking out.
                </p>
                <Button asChild className="mt-2 h-11 px-8">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="py-4 mt-12 mb-16">
            <h1 className="font-serif text-3xl md:text-4xl">
                Secure <em className="font-serif font-normal">Checkout</em>
            </h1>
            <p className="text-muted-foreground mt-2">Provide billing and shipping details below.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
                <div className="lg:w-2/3 bg-card rounded-[2rem] shadow-xl p-6 md:p-8 space-y-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Contact</h2>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" autoComplete="email" className="rounded-xl mt-1.5 h-11" {...register("email")} />
                            {errors.email ? (
                                <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                            ) : emailValue?.length > 0 ? (
                                <p className="text-emerald-600 text-sm mt-1">Valid email</p>
                            ) : null}
                        </div>
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" type="text" autoComplete="name" className="rounded-xl mt-1.5 h-11" {...register("name")} />
                            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="space-y-4">
                        <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Shipping</h2>
                        <div>
                            <Label htmlFor="country">Country or Region</Label>
                            <Select onValueChange={(value) => setValue("country", value, { shouldValidate: true })}>
                                <SelectTrigger id="country" className="rounded-xl mt-1.5 h-11">
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
                            <Input id="address" type="text" autoComplete="street-address" className="rounded-xl mt-1.5 h-11" {...register("address")} />
                            {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="billing-same" defaultChecked />
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
                        <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative mt-1.5">
                                <Input
                                    id="card-number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    {...register("cardNumber")}
                                    placeholder="1234 5678 9012 3456"
                                    className="rounded-xl h-11 pr-10"
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
                                <Input id="exp-date" type="text" autoComplete="cc-exp" placeholder="MM/YY" className="rounded-xl mt-1.5 h-11" {...register("expDate")} />
                                {errors.expDate && (
                                    <p className="text-destructive text-sm mt-1">{errors.expDate.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="cvc">Security Code</Label>
                                <Input id="cvc" type="password" autoComplete="cc-csc" className="rounded-xl mt-1.5 h-11" {...register("cvc")} />
                                {errors.cvc && (
                                    <p className="text-destructive text-sm mt-1">{errors.cvc.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Your payment information is encrypted and secure.
                    </p>
                </div>

                {/* Order summary */}
                <div className="lg:w-1/3">
                    <div className="bg-muted rounded-3xl p-6 lg:sticky lg:top-24">
                        <h2 className="font-serif text-xl mb-5">Order Summary</h2>
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="relative w-14 h-14 bg-card shrink-0 overflow-hidden rounded-xl">
                                        <CartItemThumbnail item={item} className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-medium shrink-0">
                                        ${formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3 text-sm border-t border-border mt-5 pt-5">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${formatPrice(getCartTotal())}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t border-border pt-3 mt-3">
                                <div className="flex justify-between font-medium text-base">
                                    <span>Total</span>
                                    <span>${formatPrice(getCartTotal())}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full mt-6 h-12 text-base gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing…" : "Pay Now"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
