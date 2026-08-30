import DateDecider from "@/components/Activities/DeciderBoard";
import Favorites from "@/components/Activities/Favorites";
import FutureCapsule from "@/components/Activities/FutureLetters";
import LoveNotes from "@/components/Activities/LoveNotes";
import TriviaQuiz from "@/components/Activities/TriviaQuiz";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Fun Activities | R ❁ A",
  description: "Interactive activities for RayHan and Afrin.",
};

export default async function ActivitiesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="luxury-shell pt-24">
      <LoveNotes />
      <FutureCapsule />
      <Favorites />
      <DateDecider />
      <TriviaQuiz />
    </main>
  );
}
