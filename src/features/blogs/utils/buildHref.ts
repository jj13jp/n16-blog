export function buildHref(page: number, isAsc: boolean): string {
  const params = new URLSearchParams()
  if (isAsc) params.set("order", "asc")
  if (page > 1) params.set("page", String(page))
  const qs = params.toString()
  return qs ? `/blogs?${qs}` : "/blogs"
}
