'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Mail, Send, CheckCircle2 } from 'lucide-react'

const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
})

export default function ContactUs() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: '', email: '', message: '' },
    })

    const onSubmit = () => {
        reset()
    }

    return (
        <div className="flex items-center justify-center py-10 md:py-16">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-none overflow-hidden shadow-xl">
                {/* Decorative panel */}
                <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-10">
                    <span className="font-semibold text-lg">InfinityGadgets</span>
                    <div>
                        <h2 className="text-3xl font-semibold leading-tight">
                            Let&apos;s <em className="font-serif font-normal">talk.</em>
                        </h2>
                        <p className="text-primary-foreground/60 mt-3 text-sm max-w-xs">
                            Questions about an order, a product, or anything else — we usually
                            reply within a day.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
                        <Mail className="h-4 w-4 text-accent" />
                        hello@infinitygadgets.example
                    </div>
                </div>

                {/* Form panel */}
                <div className="bg-card p-8 md:p-10 flex flex-col justify-center">
                    <h1 className="text-2xl font-semibold mb-1">Contact Us</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                        Fill out the form and we&apos;ll get back to you shortly.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" autoComplete="off" className="h-11 rounded-none" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" autoComplete="off" className="h-11 rounded-none" {...register('email')} />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" rows={4} autoComplete="off" className="rounded-none" {...register('message')} />
                            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                        </div>

                        <Button type="submit" className="w-full gap-2 h-11 mt-2" disabled={isSubmitting}>
                            <Send className="h-4 w-4" />
                            {isSubmitting ? 'Sending…' : 'Send Message'}
                        </Button>

                        {isSubmitSuccessful && (
                            <p className="flex items-center justify-center gap-1.5 text-emerald-600 text-sm">
                                <CheckCircle2 className="h-4 w-4" />
                                Message sent successfully!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
