export function getScaledDimensions(
  viewBox: string,
  size: number,
): { width: number; height: number } {
  const parts = viewBox.trim().split(/[\s,]+/)
  if (parts.length !== 4) {
    return { width: size, height: size }
  }
  const width = Number.parseFloat(parts[2] ?? "0") || 0
  const height = Number.parseFloat(parts[3] ?? "0") || 0
  if (!width || !height) {
    return { width: size, height: size }
  }
  if (width === height) {
    return { width: size, height: size }
  }
  if (width > height) {
    return { width: size, height: (height / width) * size }
  }

  return { width: (width / height) * size, height: size }
}
