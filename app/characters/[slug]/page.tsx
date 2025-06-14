import { CharacterEditor } from "@/components/character/character-editor"
import { getCharacterBySlug } from "@/lib/content/characters"
import { notFound } from "next/navigation"

interface CharacterPageProps {
  params: Promise<{ slug: string }>
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { slug } = await params
  const character = await getCharacterBySlug(slug)

  if (!character) {
    notFound()
  }

  return <CharacterEditor character={character} />
}
