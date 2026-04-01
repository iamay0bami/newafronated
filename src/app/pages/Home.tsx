import { Hero } from "../components/Hero";
import { Mission } from "../components/Mission";
import { Interviews } from "../components/Interviews";
import { Team } from "../components/Team";

export function Home() {
  return (
    <main>
      <Hero />
      <Mission />
      <Interviews />
      <Team />
    </main>
  );
}
