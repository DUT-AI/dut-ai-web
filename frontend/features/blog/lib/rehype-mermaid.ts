import type { Root, Element } from 'hast'
import { visit, SKIP } from 'unist-util-visit'
import { isMermaidCandidate } from './detect-mermaid'

/** Shared by MDX and the editor preview, before syntax highlighting. */
export default function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (element: Element, index, parent) => {
      if (element.tagName !== 'pre' || index === undefined || !parent) return
      const code = element.children[0]
      if (code?.type !== 'element' || code.tagName !== 'code') return
      if (!code.children.every((child) => child.type === 'text')) return

      const text = code.children.map((child) => (child.type === 'text' ? child.value : '')).join('')
      // mdast-util-to-hast appends one newline when converting a fenced code node.
      const source = text.endsWith('\n') ? text.slice(0, -1) : text
      if (!isMermaidCandidate(source)) return

      // Retain the original node for ordinary-code fallback if parsing rejects it.
      parent.children[index] = {
        type: 'element',
        tagName: 'mermaid-block',
        properties: { source },
        children: [element],
      }
      return SKIP
    })
  }
}
