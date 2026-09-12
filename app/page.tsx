import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Consistency from "@/components/landing/Consistency";
import Progress from "@/components/landing/Progress";
import Recovery from "@/components/landing/Recovery";
import Philosophy from "@/components/landing/Philosophy";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import { redirect } from "next/navigation";
import { getAuthenticatedDestination } from "@/lib/auth/destination";

export default async function Home() {
  const destination = await getAuthenticatedDestination();
  if (destination) redirect(destination);
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Consistency />
        <Progress />
        <Recovery />
        <Philosophy />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
