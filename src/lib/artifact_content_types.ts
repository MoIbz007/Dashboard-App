import { ArtifactContentV3, ArtifactCodeV3, ArtifactMarkdownV3 } from './types';

export function isArtifactCodeContent(
  content: ArtifactContentV3
): content is ArtifactCodeV3 {
  return content.type === 'code';
}

export function isArtifactMarkdownContent(
  content: ArtifactContentV3
): content is ArtifactMarkdownV3 {
  return content.type === 'text';
}

export function getArtifactContent(
  artifact: { contents: ArtifactContentV3[]; currentIndex: number }
): ArtifactContentV3 | undefined {
  return artifact.contents.find(
    (content) => content.index === artifact.currentIndex
  );
}

export function getCurrentArtifactContent<T extends ArtifactContentV3>(
  artifact: { contents: ArtifactContentV3[]; currentIndex: number },
  typeGuard: (content: ArtifactContentV3) => content is T
): T | undefined {
  const content = getArtifactContent(artifact);
  if (content && typeGuard(content)) {
    return content;
  }
  return undefined;
}

export function getCurrentCodeContent(
  artifact: { contents: ArtifactContentV3[]; currentIndex: number }
): ArtifactCodeV3 | undefined {
  return getCurrentArtifactContent(artifact, isArtifactCodeContent);
}

export function getCurrentMarkdownContent(
  artifact: { contents: ArtifactContentV3[]; currentIndex: number }
): ArtifactMarkdownV3 | undefined {
  return getCurrentArtifactContent(artifact, isArtifactMarkdownContent);
}
