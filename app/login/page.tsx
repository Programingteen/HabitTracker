import LoginPage from "@/components/auth/login";
import { redirect } from "next/navigation";
import { getAuthenticatedDestination } from "@/lib/auth/destination";

export default async function Page() {
  const destination = await getAuthenticatedDestination();
  if (destination) redirect(destination);
  return <LoginPage />;
}
