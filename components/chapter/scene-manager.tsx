"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, GripVertical, Trash2, Edit } from "lucide-react"
import type { Scene } from "@/lib/types"

interface SceneManagerProps {
  chapterSlug: string
}

export function SceneManager({ chapterSlug }: SceneManagerProps) {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: "1",
      title: "Opening Scene",
      slug: "opening-scene",
      order: 1,
      summary: "Character introduction and setting establishment",
      content: "",
      chapterSlug,
    },
  ])
  const [editingScene, setEditingScene] = useState<string | null>(null)

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      title: "New Scene",
      slug: `scene-${scenes.length + 1}`,
      order: scenes.length + 1,
      summary: "",
      content: "",
      chapterSlug,
    }
    setScenes([...scenes, newScene])
    setEditingScene(newScene.id)
  }

  const updateScene = (sceneId: string, updates: Partial<Scene>) => {
    setScenes(scenes.map((scene) => (scene.id === sceneId ? { ...scene, ...updates } : scene)))
  }

  const deleteScene = (sceneId: string) => {
    setScenes(scenes.filter((scene) => scene.id !== sceneId))
  }

  const reorderScenes = (dragIndex: number, hoverIndex: number) => {
    const dragScene = scenes[dragIndex]
    const newScenes = [...scenes]
    newScenes.splice(dragIndex, 1)
    newScenes.splice(hoverIndex, 0, dragScene)

    // Update order numbers
    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index + 1,
    }))

    setScenes(reorderedScenes)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scenes</CardTitle>
          <Button onClick={addScene} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Scene
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenes.map((scene, index) => (
          <div key={scene.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <span className="text-sm text-gray-500">Scene {scene.order}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingScene(editingScene === scene.id ? null : scene.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteScene(scene.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {editingScene === scene.id ? (
              <div className="space-y-3">
                <Input
                  value={scene.title}
                  onChange={(e) => updateScene(scene.id, { title: e.target.value })}
                  placeholder="Scene title"
                />
                <Input
                  value={scene.slug}
                  onChange={(e) => updateScene(scene.id, { slug: e.target.value })}
                  placeholder="scene-slug"
                />
                <Textarea
                  value={scene.summary}
                  onChange={(e) => updateScene(scene.id, { summary: e.target.value })}
                  placeholder="Scene summary"
                  rows={2}
                />
              </div>
            ) : (
              <div>
                <h4 className="font-medium">{scene.title}</h4>
                {scene.summary && <p className="text-sm text-gray-600 mt-1">{scene.summary}</p>}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
