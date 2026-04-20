import { Hero } from "../components/Hero";
import { Mission } from "../components/Mission";
import { Interviews } from "../components/Interviews";
import { TikTokDrop } from "../components/TikTokDrop";
import { Team } from "../components/Team";
import { useYouTubeVideos } from "../hooks/useYouTubeVideos";

export function Home() {
  const { shorts, longForm, loading } = useYouTubeVideos();

  return (
    <main>
      <Hero />
      <Mission />
      <Interviews
        dynamicVideos={longForm}
        dynamicLoading={loading}
        shorts={shorts}
        shortsLoading={loading}
      />
      <TikTokDrop />
      <Team />
    </main>
  );
}