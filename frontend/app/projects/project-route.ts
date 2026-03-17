export function slugifyProjectTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function buildProjectPath(project: { id: number; title: string }): string {
  const slug = slugifyProjectTitle(project.title)
  return slug ? `/projects/${project.id}-${slug}` : `/projects/${project.id}`
}

export function parseProjectIdFromParam(param: string): number | null {
  const idPart = param.split('-')[0]
  const parsed = Number.parseInt(idPart, 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null
  }
  return parsed
}
