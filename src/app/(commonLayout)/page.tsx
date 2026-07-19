import { Hero } from "@/components/modules/Home/Hero";
import Specialties from "@/components/modules/Home/Specialties";
import TopRatedDoctors from "@/components/modules/Home/TopRatedDoctor";

export default function Home() {
  return (
    <>
      <Hero />
      <Specialties/>
      <TopRatedDoctors/>
    </>
  );
}
