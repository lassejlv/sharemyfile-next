export function formatSizeToMb(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}
