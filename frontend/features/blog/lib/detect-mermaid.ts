// Declarations supported by the installed Mermaid version. This is only a cheap
// filter: syntax validation by Mermaid remains the source of truth.
const declarations = new Set([
  'graph',
  'flowchart',
  'flowchart-elk',
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'stateDiagram-v2',
  'erDiagram',
  'gantt',
  'pie',
  'journey',
  'gitGraph',
  'mindmap',
  'timeline',
  'quadrantChart',
  'requirement',
  'requirementDiagram',
  'C4Context',
  'C4Container',
  'C4Component',
  'C4Dynamic',
  'C4Deployment',
  'xychart',
  'xychart-beta',
  'block',
  'block-beta',
  'packet',
  'packet-beta',
  'kanban',
  'architecture',
  'architecture-beta',
  'radar-beta',
  'sankey',
  'sankey-beta',
  'treemap',
  'treemap-beta',
  'agentflow-beta',
  'swimlane-beta',
  'treeView-beta',
  'eventmodeling',
  'venn-beta',
  'usecase-beta',
  'cynefin-beta',
  'info',
])

/** Identify candidates cheaply; Mermaid's parser confirms them in the browser. */
export function isMermaidCandidate(source: string): boolean {
  let definition = source.replace(/^\uFEFF/, '').trimStart()

  // Comments/directives can appear before the diagram declaration or frontmatter.
  while (definition) {
    if (definition.startsWith('%%{')) {
      const end = definition.indexOf('}%%')
      if (end === -1) return false
      definition = definition.slice(end + 3).trimStart()
    } else if (definition.startsWith('%%')) {
      const end = definition.indexOf('\n')
      if (end === -1) return false
      definition = definition.slice(end + 1).trimStart()
    } else if (/^---[\t ]*\r?\n/.test(definition)) {
      const remaining = definition.slice(definition.indexOf('\n') + 1)
      const end = /^---[\t ]*(?:\r?\n|$)/m.exec(remaining)
      if (!end) return false
      definition = remaining.slice(end.index + end[0].length).trimStart()
    } else {
      break
    }
  }

  const declaration = /^([A-Za-z][A-Za-z0-9-]*)(?=[\s;:]|$)/.exec(definition)?.[1]
  if (!declaration) return false
  return (
    declarations.has(declaration) ||
    /^(?:ishikawa(?:-beta)?|railroad(?:-ebnf|-abnf|-peg)?-beta)$/i.test(declaration)
  )
}
