"use client"

import { useDesignSystem } from "@/components/design-system"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { tokens } = useDesignSystem()

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let currentSection: string[] = []
    let inCodeBlock = false
    let codeLanguage = ''
    let listItems: string[] = []
    let inList = false

    const flushList = (index: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-6 ml-6">
            {listItems.map((item, i) => (
              <li key={i} className="leading-relaxed" style={{ color: tokens.colors.text.secondary }}>
                {item}
              </li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (!inList) flushList(index)
        inList = false

        if (inCodeBlock) {
          elements.push(
            <div key={index} className="my-6">
              <pre 
                className="p-6 rounded-lg overflow-x-auto text-sm leading-relaxed"
                style={{ 
                  backgroundColor: tokens.colors.neutral[100],
                  color: tokens.colors.text.primary 
                }}
              >
                <code>{currentSection.join('\n')}</code>
              </pre>
            </div>
          )
          currentSection = []
          inCodeBlock = false
          codeLanguage = ''
        } else {
          codeLanguage = line.substring(3)
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        currentSection.push(line)
        return
      }

      // Handle list items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        inList = true
        listItems.push(line.substring(2))
        return
      } else if (inList) {
        flushList(index)
        inList = false
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-4xl font-bold mb-6 mt-8 leading-tight" 
              style={{ color: tokens.colors.text.primary }}>
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mb-4 mt-8 leading-tight" 
              style={{ color: tokens.colors.text.primary }}>
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold mb-3 mt-6 leading-tight" 
              style={{ color: tokens.colors.text.primary }}>
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-lg font-semibold mb-2 mt-4" 
              style={{ color: tokens.colors.text.primary }}>
            {line.substring(5)}
          </h4>
        )
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />)
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold mb-4 leading-relaxed" 
             style={{ color: tokens.colors.text.primary }}>
            {line.substring(2, line.length - 2)}
          </p>
        )
      } else if (line.trim() !== '') {
        // Regular paragraph with better spacing
        elements.push(
          <p key={index} className="mb-4 leading-relaxed text-base" 
             style={{ color: tokens.colors.text.secondary }}>
            {line}
          </p>
        )
      }
    })

    // Flush any remaining list items
    flushList(lines.length)

    return elements
  }

  return (
    <div className="prose max-w-none">
      <div className="px-6 py-4">
        {parseMarkdown(content)}
      </div>
    </div>
  )
} 