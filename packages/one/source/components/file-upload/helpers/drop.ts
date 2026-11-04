export function hasFileData(
  dataTransfer: DataTransfer | null | undefined,
): boolean {
  return Array.from(dataTransfer?.types ?? []).includes('Files');
}
