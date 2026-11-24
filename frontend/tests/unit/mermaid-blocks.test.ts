import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Components } from 'react-markdown'
import type { Root } from 'hast'
import { isMermaidCandidate } from '../../features/blog/lib/detect-mermaid'
import rehypeMermaid from '../../features/blog/lib/rehype-mermaid'

test('recognizes unlabelled diagram declarations across Mermaid diagram families', () => {
  for (const source of [
    'classDiagram\n  class Customer {\n    +name: str\n  }',
    'sequenceDiagram\n  Alice->>Bob: Xin chào',
    'flowchart LR\n  A --> B',
    'graph TD; A-->B',
    'stateDiagram-v2\n  [*] --> Active',
    'erDiagram\n  USER ||--o{ BLOG : writes',
    'gitGraph\n  commit',
    'mindmap\n  root((DUT AI))',
    'xychart-beta\n  x-axis [a, b]',
    'architecture-beta\n  service api(server)[API]',
  ]) {
    assert.equal(isMermaidCandidate(source), true, source)
  }
})

test('recognizes diagrams after comments, directives, BOM and YAML frontmatter', () => {
  const prefix =
    '\uFEFF\n%% A comment\n%%{init: {\n "theme": "dark"\n}}%%\n---\ntitle: Diagram\n---\n\n'
  assert.equal(isMermaidCandidate(`${prefix}classDiagram\n  A --> B`), true)
  assert.equal(isMermaidCandidate('---\ntitle: Missing end\nclassDiagram'), false)
  assert.equal(isMermaidCandidate('%%{init: {'), false)
})

test('ordinary code and mentions inside strings are not Mermaid candidates', () => {
  for (const source of [
    '',
    'def generate_report(db):\n  return db.get_data()',
    'const diagram = "classDiagram"',
    'print("sequenceDiagram")',
    '# Example\nclassDiagram\n  A --> B',
    'classDiagramFactory()',
    'function flowchart() {}',
    'SELECT * FROM blogs;',
    '%% Only a comment',
  ]) {
    assert.equal(isMermaidCandidate(source), false, source)
  }
})

test('rehype preserves the complete source and the original fallback node', () => {
  const source = 'classDiagram\n  class Order {\n    +add(item): void\n  }\n\n'
  const pre = {
    type: 'element' as const,
    tagName: 'pre',
    properties: {},
    children: [
      {
        type: 'element' as const,
        tagName: 'code',
        properties: {},
        children: [{ type: 'text' as const, value: `${source}\n` }],
      },
    ],
  }
  const tree: Root = { type: 'root', children: [pre] }
  rehypeMermaid()(tree)
  const wrapper = tree.children[0]
  assert.equal(wrapper.type, 'element')
  if (wrapper.type !== 'element') return
  assert.equal(wrapper.tagName, 'mermaid-block')
  assert.equal(wrapper.properties.source, source)
  assert.equal(wrapper.children[0], pre)
})

function Probe({ source, children }: { source: string; children?: React.ReactNode }) {
  return React.createElement('section', { 'data-mermaid-source': source }, children)
}

const mixedMarkdown = [
  '```python\ndef example():\n  return "classDiagram"\n```',
  '```\nclassDiagram\n  class Customer {\n    +name: str\n  }\n```',
  '```javascript\nconst count = 1\n```',
  // A mismatched or missing language label must not control detection.
  '```text\nsequenceDiagram\n  User->>API: POST /checkout\n```',
].join('\n\n')

test('public MDX recognizes mixed unlabelled/mislabelled Mermaid before highlighting', async () => {
  const { compileMDX } = await import('next-mdx-remote/rsc')
  const { default: rehypePrettyCode } = await import('rehype-pretty-code')
  const { content } = await compileMDX({
    source: mixedMarkdown,
    options: {
      mdxOptions: { rehypePlugins: [rehypeMermaid, [rehypePrettyCode, { theme: 'github-dark' }]] },
    },
    components: { 'mermaid-block': Probe },
  })
  const html = renderToStaticMarkup(content)
  assert.equal((html.match(/data-mermaid-source=/g) || []).length, 2)
  assert.match(html, /class Customer/)
  assert.match(html, /data-language="python"/)
  assert.match(html, /data-language="javascript"/)
  assert.doesNotMatch(html, /<mermaid-block/)
})

test('editor Markdown uses the same detection and preserves code without language labels', async () => {
  const { default: ReactMarkdown } = await import('react-markdown')
  const html = renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        rehypePlugins: [rehypeMermaid],
        components: { 'mermaid-block': Probe } as Components,
      },
      mixedMarkdown
    )
  )
  assert.equal((html.match(/data-mermaid-source=/g) || []).length, 2)
  assert.match(html, /class Customer/)
  assert.match(html, /language-python/)
  assert.match(html, /language-javascript/)
})

test('Mermaid-looking strings in ordinary blocks leave the original tree unchanged', () => {
  const tree: Root = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'code',
            properties: { className: ['language-python'] },
            children: [{ type: 'text', value: 'print("classDiagram")\n' }],
          },
        ],
      },
    ],
  }
  const original = JSON.stringify(tree)
  rehypeMermaid()(tree)
  assert.equal(JSON.stringify(tree), original)
})
