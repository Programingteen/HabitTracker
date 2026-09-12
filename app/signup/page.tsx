import Signup from "@/components/auth/signup";
import { redirect } from "next/navigation";
import { getAuthenticatedDestination } from "@/lib/auth/destination";

export default async function Page() {
  const destination = await getAuthenticatedDestination();
  if (destination) redirect(destination);
  return <Signup />;
}
