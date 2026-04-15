import { Hero } from "../components/Hero";
import { Mission } from "../components/Mission";
import { Interviews } from "../components/Interviews";
import { TikTokDrop } from "../components/TikTokDrop";
import { Team } from "../components/Team";

export function Home() {
  return (
    <main>
      <Hero />
      <Mission />
      <Interviews />
      <TikTokDrop />
      <Team />
    </main>
  );
}