import Banner from "@/components/Banner";
import Memories from "@/components/Memories";
import OurStory from "@/components/OurStory";
import MixtapeJukebox from "@/components/MixtapeJukebox";

export default function Home() {
  return (
    <main className="luxury-shell">
      <Banner/>
      <OurStory/>
      <Memories/>
      <MixtapeJukebox/>
    </main>
  );
}
