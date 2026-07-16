"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();

    // Redirect if no user is logged in (optional)
    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    // Initial dummy user profile info
    const [userData, setUserData] = useState({
        fullName: "UmberTech",
        image: "/images/Umber.jpg",
        email: user?.email || "",
        contact: "+91 **********",
        createdAt: "2024-08-14T10:00:00Z",
    });

    const [previewImage, setPreviewImage] = useState(userData.image);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(userData);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => {
        if (!isEditing) {
            setEditedUser({
                ...userData,
                createdAt: new Date().toISOString(),
            });
        } else {
            setUserData(editedUser);
        }
        setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
        setEditedUser(userData);
        setIsEditing(false);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4 mt-20 mb-16">
            <Card className="max-w-md w-full rounded-2xl shadow-xl border border-gray-200">
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <Avatar className="w-28 h-28 mb-4 ring-4 ring-white shadow-lg transition-transform group-hover:scale-105">
                            <AvatarImage src={previewImage} alt={userData.fullName} />
                            <AvatarFallback>{userData.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="image-upload"
                            className="absolute bottom-0 right-0 bg-white border border-gray-300 p-1.5 rounded-full shadow-sm hover:bg-gray-100 transition cursor-pointer"
                            title="Change profile picture"
                        >
                            <Upload size={16} className="text-gray-600" />
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {isEditing ? (
                        <input
                            type="text"
                            name="fullName"
                            value={editedUser.fullName}
                            onChange={handleChange}
                            className="text-xl font-bold text-center text-gray-800 mt-2 px-3 py-1 rounded-md border"
                        />
                    ) : (
                        <CardTitle className="text-2xl font-bold text-gray-800 mt-2">
                            {userData.fullName}
                        </CardTitle>
                    )}

                    <p className="text-sm text-gray-500">
                        Joined on {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                            />
                        ) : (
                            <p className="text-base text-gray-900">{userData.email}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-600">Contact</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="contact"
                                value={editedUser.contact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                            />
                        ) : (
                            <p className="text-base text-gray-900">{userData.contact}</p>
                        )}
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button variant="default" className="w-full" onClick={toggleEdit}>
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                        {isEditing && (
                            <Button variant="ghost" className="w-full text-red-500" onClick={cancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
