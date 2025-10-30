// src/app/(shop)/account/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return <div>Welcome back, {user.name}</div>;
}
