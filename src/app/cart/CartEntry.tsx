"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTranstion] = useTransition();

  return (
    <div>
      <div className="flex items-center gap-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link href={`/products/${product.id}`} className="font-bold">
            {product.name}
          </Link>
          <div className="mt-3">Price: {formatPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className={"select select-bordered w-full max-w-[80px]"}
              defaultValue={quantity}
              disabled={isPending}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);

                startTranstion(async () => {
                  await setProductQuantity(product.id, newQuantity);
                });
              }}
            >
              {Array.from(Array(100).keys()).map((item) => {
                return item === 0 ? (
                  <option value={item} key={item}>
                    {item} (Remove)
                  </option>
                ) : (
                  <option value={item} key={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className={`flex items-center gap-3 ${isPending && "opacity-50"}`}
          >
            Total: {formatPrice(product.price * quantity)}
            {isPending && (
              <span className="loading loading-spinner loading-sm" />
            )}
          </div>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}
