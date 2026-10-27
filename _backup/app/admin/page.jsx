import { notFound } from "next/navigation";
import AdminApp from "../../components/admin/AdminApp";

export const metadata = { title: "Admin" };

export default function Page() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <AdminApp />;
}
