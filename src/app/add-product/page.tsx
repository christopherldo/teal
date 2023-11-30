import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

import FormSubmitButton from "@/components/FormSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getAllowedUsers } from "../api/auth/allowedUsers";

export const metadata = {
  title: "Add Product - Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  const allowedUsers = await getAllowedUsers();

  if (!session) redirect("/api/auth/signin?callbackUrl=/add-product");

  const {
    user: { email: userEmail },
  } = session;

  if (!userEmail || !allowedUsers.includes(userEmail)) redirect("/");

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });

  redirect("/");
}

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  const allowedUsers = await getAllowedUsers();

  if (!session) redirect("/api/auth/signin?callbackUrl=/add-product");

  const {
    user: { email: userEmail },
  } = session;

  if (!userEmail || !allowedUsers.includes(userEmail)) redirect("/");

  return (
    <div className="w-full">
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>

      <form action={addProduct}>
        <input
          type="text"
          className="input input-bordered mb-3 w-full"
          required
          name="name"
          placeholder="Name"
        />
        <textarea
          className="textarea textarea-bordered mb-3 w-full"
          required
          name="description"
          placeholder="Description"
        />
        <input
          type="url"
          className="input input-bordered mb-3 w-full"
          required
          name="imageUrl"
          placeholder="Image URL"
        />
        <input
          type="number"
          className="input input-bordered mb-3 w-full"
          required
          name="price"
          placeholder="Price"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
}
