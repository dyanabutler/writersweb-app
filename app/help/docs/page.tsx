"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useDesignSystem } from "@/components/design-system"
import { docsData, type DocItem } from "@/lib/docs/docs-data"
import { 
  Search,
  Clock,
  ChevronRight,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const { tokens } = useDesignSystem()
  const [searchTerm, setSearchTerm] = useState("")

  // Get all docs and filter by search
  const allDocs = docsData.flatMap(section => section.docs)
  const filteredDocs = allDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDifficultyColor = (difficulty: DocItem['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
            Documentation
          </h1>
          <p style={{ color: tokens.colors.text.muted }}>
            {filteredDocs.length} guides available
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/help">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" 
                   style={{ color: tokens.colors.icons.muted }} />
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentation List */}
      <div className="space-y-3">
        {filteredDocs.map(doc => (
          <Card key={doc.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-lg font-semibold" style={{ color: tokens.colors.text.primary }}>
                      {doc.title}
                    </h3>
                    <Badge className={getDifficultyColor(doc.difficulty)} >
                      {doc.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mb-3" style={{ color: tokens.colors.text.muted }}>
                    {doc.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs" style={{ color: tokens.colors.text.muted }}>
                    <Clock className="w-3 h-3" />
                    Updated {new Date(doc.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                
                <Button asChild>
                  <Link href={`/help/docs/${doc.id}`}>
                    Read Guide
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {searchTerm && filteredDocs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2" style={{ color: tokens.colors.text.primary }}>
              No results found
            </h3>
            <p style={{ color: tokens.colors.text.muted }}>
              Try searching with different keywords
            </p>
            <Button className="mt-4" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 