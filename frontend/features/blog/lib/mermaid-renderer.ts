type MermaidApi = (typeof import('mermaid'))['default']

let apiPromise: Promise<MermaidApi> | undefined
let queue: Promise<unknown> = Promise.resolve()
let diagramId = 0

function loadMermaid() {
  if (!apiPromise) {
    apiPromise = import('mermaid')
      .then((module) => module.default)
      .catch((error) => {
        apiPromise = undefined
        throw error
      })
  }
  return apiPromise
}

// Mermaid uses shared configuration. Serialize parse/render across all blocks.
function withMermaid<T>(dark: boolean, work: (api: MermaidApi) => Promise<T>): Promise<T> {
  const task = queue.then(async () => {
    const api = await loadMermaid()
    api.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: dark ? 'dark' : 'default',
      htmlLabels: false,
      maxTextSize: 50000,
      maxEdges: 500,
      secure: [
        'secure',
        'securityLevel',
        'startOnLoad',
        'suppressErrorRendering',
        'maxTextSize',
        'maxEdges',
        'htmlLabels',
        'dompurifyConfig',
      ],
    })
    return work(api)
  })
  queue = task.catch(() => undefined)
  return task
}

export function validateMermaid(source: string): Promise<boolean> {
  if (source.length > 50000) return Promise.resolve(false)
  return withMermaid(false, async (api) =>
    Boolean(await api.parse(source, { suppressErrors: true }))
  )
}

export function renderMermaid(source: string, dark: boolean): Promise<string> {
  return withMermaid(dark, async (api) => {
    await document.fonts?.ready
    const { svg } = await api.render(`blog-mermaid-${++diagramId}`, source)
    return svg
  })
}
