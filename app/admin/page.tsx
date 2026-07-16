import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AdminPanel from "@/components/admin-panel";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  
  if (!userCookie || !token) {
    notFound();
  }

  const user = JSON.parse(decodeURIComponent(userCookie));

  if (user?.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="flex flex-col p-4 mt-5">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminPanel token={token} />
    </div>
  );
}
