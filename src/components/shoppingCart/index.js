"use client";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import { products } from "@/lib/shopData";

export function ShoppingCart() {
    const [cartItems, setCartItems] = useState(
        products.slice(0, 2).map((product) => ({ ...product, quantity: 1 }))
    );

    const incrementQuantity = (index) => {
        const updatedCart = [...cartItems];
        updatedCart[index].quantity += 1;
        setCartItems(updatedCart);
    };

    const decrementQuantity = (index) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            updatedCart.splice(index, 1);
        }
        setCartItems(updatedCart);
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, product) => {
            const priceNumber = Number(product.price.replace(/[^0-9.-]+/g, ""));
            return acc + priceNumber * product.quantity;
        }, 0);
    };

    return (
        <div className="mt-20 mb-20">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-black">Image</TableHead>
                        <TableHead className="font-bold text-black">Product</TableHead>
                        <TableHead className="font-bold text-black">Price</TableHead>
                        <TableHead className="font-bold text-black">Quantity</TableHead>
                        <TableHead className="text-right font-bold text-black">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cartItems.map((product, index) => {
                        const priceNumber = Number(product.price.replace(/[^0-9.-]+/g, ""));
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <Image
                                        src={product.cover.url}
                                        alt={product.title}
                                        width={100}
                                        height={100}
                                        className="object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.title}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => decrementQuantity(index)}
                                            className="px-2 py-1 bg-gray-300 rounded"
                                        >
                                            -
                                        </button>
                                        {product.quantity}
                                        <button
                                            onClick={() => incrementQuantity(index)}
                                            className="px-2 py-1 bg-gray-300 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    ${(priceNumber * product.quantity).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>TOTAL</TableCell>
                        <TableCell className="text-right">
                            ${calculateTotal().toFixed(2)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
