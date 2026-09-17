import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { products } from "@/lib/shopData"

export function SheetDemo() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">Open Shopping Cart</Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
                <div>
                    <SheetHeader>
                        <div className="w-full flex justify-between items-center mt-5">
                            <SheetTitle>Shopping Cart</SheetTitle>
                            <Link href="./yourcart" className="hover:underline text-gray-500">(open full view)</Link>
                        </div>
                    </SheetHeader>

                    <div className="grid gap-4 py-4">
                        {products.slice(0, 1).map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border-b pb-2"
                            >
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={product.cover}
                                        alt={product.title}
                                        width={60}
                                        height={60}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <div className="font-medium">{product.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {product.price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <hr />
                <SheetFooter>
                    <div className="w-full flex justify-between items-center">
                        <div className="text-lg font-medium">Total</div>
                        <div className="text-lg font-medium">$25.00</div>
                    </div>
                </SheetFooter>
                <p>Shipping and taxes will be added at the next step</p>
                <SheetClose asChild>
                    <Button className="w-full">Go to Payment</Button>
                </SheetClose>
            </SheetContent>
        </Sheet>
    )
}
