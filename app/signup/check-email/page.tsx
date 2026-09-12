import CheckEmail from "@/components/auth/CheckEmail";

export default async function Page({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <CheckEmail email={email} />;
}
