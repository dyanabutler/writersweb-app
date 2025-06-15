"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDesignSystem } from "@/components/design-system"
import { getDocById } from "@/lib/docs/docs-data"
import { MarkdownRenderer } from "@/components/docs/markdown-renderer"
import { ArrowLeft, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DocPage() {
  const { tokens } = useDesignSystem()
  const params = useParams()
  const slug = params.slug as string
  
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const doc = getDocById(slug)

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/docs/${slug}`)
        
        if (response.ok) {
          const data = await response.json()
          setContent(data.content)
        } else {
          setError('Documentation not found')
        }
      } catch (err) {
        setError('Failed to load documentation')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [slug])

  if (!doc) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Documentation Not Found</h1>
        <p className="mb-4">The requested documentation page could not be found.</p>
        <Button asChild>
          <Link href="/help/docs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
        </Button>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/help/docs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Badge className={getDifficultyColor(doc.difficulty)}>
            {doc.difficulty}
          </Badge>
        </div>
      </div>

      {/* Doc Header */}
      <Card>
        <CardHeader className="pb-4">
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
            {doc.title}
          </h1>
          <p className="text-lg" style={{ color: tokens.colors.text.muted }}>
            {doc.description}
          </p>
          <div className="flex items-center gap-2 text-sm pt-2" style={{ color: tokens.colors.text.muted }}>
            <Clock className="w-4 h-4" />
            Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
          </div>
        </CardHeader>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading documentation...
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
          
          {content && <MarkdownRenderer content={content} />}
        </CardContent>
      </Card>
    </div>
  )
} 