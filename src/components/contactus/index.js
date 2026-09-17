'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    })

    const onSubmit = (data) => {
        console.log('Form submitted:', data)
        // You can replace this with an API call
        reset()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 mt-16">
            <Card className="w-full max-w-lg shadow-xl rounded-2xl p-6">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email')} />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" rows={4} {...register('message')} />
                            {errors.message && (
                                <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>

                        {isSubmitSuccessful && (
                            <p className="text-green-600 text-sm text-center mt-2">
                                Message sent successfully!
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
