import Dashboard from "@/components/dashboard/Dashboard";
import { getDashboardData } from "@/lib/dashboard/data";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <Dashboard data={data} />;
}
