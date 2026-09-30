"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

// Zod schema for email
const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

function Footer() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = emailSchema.safeParse({ email });

        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }

        // If valid
        setError("");
        console.log("Subscribed with:", email);
        alert(`Subscribed with: ${email}`);
        setEmail("");
    };

    return (
        <footer className="bg-slate-50 p-7 w-full">
            <div className='flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0'>

                {/* Subscription Section */}
                <div className='w-full md:w-1/2 flex flex-col items-start'>
                    <h4 className='text-sm font-bold p-3'>Subscribe to our newsletter</h4>
                    <form onSubmit={handleSubmit} className="relative w-full flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full md:w-60 h-9 px-3 border"
                        />
                        <Button type="submit" className="bg-black text-white rounded-full px-4 h-9">
                            Subscribe
                        </Button>
                    </form>
                    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
                    <div className='m-2 p-2 text-gray-800 text-sm'>
                        <span>
                            © 2026 Your Nestor Store
                            <br />
                            InfinityGadgets commerce for everyone.
                        </span>
                    </div>
                </div>

                {/* Links Section */}
                <div className='w-full md:w-1/2 flex justify-center md:justify-end'>
                    <table className="p-5">
                        <thead>
                            <tr>
                                <th className="font-bold px-4 py-2">Products</th>
                                <th className="font-bold px-4 py-2">Support</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-800'>
                            <tr>
                                <td className="px-4 py-2"><a href="#" className="hover:underline">Apparel</a></td>
                                <td className="px-4 py-2"><a href="/contactus" className="hover:underline">Contact Us</a></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2"><a href="#" className="hover:underline">Accessories</a></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2"><a href="#" className="hover:underline">Digital</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
