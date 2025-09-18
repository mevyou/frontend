"use client";

import { useParams } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";
import { GameDescriptionPage } from "@/components/GameDescriptionPage";

export default function GameDescriptionPageRoute() {
  const params = useParams();
  const gameId = params.id as string;

  return (
    <MainLayout>
      <GameDescriptionPage gameId={gameId} />
    </MainLayout>
  );
}
