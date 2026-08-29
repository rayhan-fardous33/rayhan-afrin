import OurStoryPageClient from "./OurStoryPageClient";

export const metadata = {
  title: "Our Love Story | RayHan & Afrin",
  description: "The complete romantic timeline, love chapters, and cherished milestones of RayHan and Afrin.",
};

export default function StoryPage() {
  return (
    <main className="luxury-shell min-h-screen pt-24 pb-20">
      <OurStoryPageClient />
    </main>
  );
}
