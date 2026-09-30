"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Pencil, Check, X } from "lucide-react";

export default function Profile() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/userlogin");
        }
    }, [user, router]);

    const [userData, setUserData] = useState({
        fullName: "UmberTech",
        image: "",
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
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEdit = () => {
        if (!isEditing) {
            setEditedUser({ ...userData, createdAt: new Date().toISOString() });
        } else {
            setUserData(editedUser);
        }
        setIsEditing(!isEditing);
    };

    const cancelEdit = () => {
        setEditedUser(userData);
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <main className="flex items-center justify-center py-10 md:py-16">
            <div className="w-full max-w-md bg-card rounded-[2.5rem] shadow-xl p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="relative">
                        <Avatar className="w-28 h-28 ring-4 ring-accent/20">
                            <AvatarImage src={previewImage} alt={userData.fullName} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                {userData.fullName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="image-upload"
                            className="absolute bottom-0 right-0 bg-accent text-accent-foreground p-2 rounded-full shadow-sm hover:bg-accent/90 transition cursor-pointer"
                            title="Change profile picture"
                        >
                            <Upload size={14} />
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
                        <Input
                            name="fullName"
                            value={editedUser.fullName}
                            onChange={handleChange}
                            autoComplete="off"
                            className="text-center text-xl font-semibold mt-4 h-11 rounded-xl max-w-xs"
                        />
                    ) : (
                        <h1 className="text-2xl font-semibold mt-4">{userData.fullName}</h1>
                    )}

                    <p className="text-sm text-muted-foreground mt-1">
                        Joined {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="space-y-4 mt-8">
                    <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Email</Label>
                        {isEditing ? (
                            <Input
                                type="email"
                                name="email"
                                value={editedUser.email}
                                onChange={handleChange}
                                autoComplete="off"
                                className="mt-1.5 h-11 rounded-xl"
                            />
                        ) : (
                            <p className="mt-1">{userData.email || "—"}</p>
                        )}
                    </div>

                    <div>
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Contact</Label>
                        {isEditing ? (
                            <Input
                                name="contact"
                                value={editedUser.contact}
                                onChange={handleChange}
                                autoComplete="off"
                                className="mt-1.5 h-11 rounded-xl"
                            />
                        ) : (
                            <p className="mt-1">{userData.contact}</p>
                        )}
                    </div>

                    <div className="flex gap-2 mt-6">
                        <Button variant={isEditing ? "default" : "outline"} className="w-full gap-2" onClick={toggleEdit}>
                            {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                        {isEditing && (
                            <Button variant="ghost" className="w-full gap-2 text-destructive hover:text-destructive" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
