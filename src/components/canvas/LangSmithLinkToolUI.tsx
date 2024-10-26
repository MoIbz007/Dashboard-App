import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipIconButton } from '../ui/icon-button/TooltipIconButton';

interface LangSmithLinkToolUIProps {
  runId?: string;
  projectId?: string;
}

export function LangSmithLinkToolUI({
  runId,
  projectId,
}: LangSmithLinkToolUIProps) {
  if (!runId || !projectId) return null;

  const langSmithUrl = `https://smith.langchain.com/public/${projectId}/r/${runId}`;

  return (
    <TooltipIconButton
      tooltip="View in LangSmith"
      onClick={() => window.open(langSmithUrl, '_blank')}
      variant="ghost"
    >
      <ExternalLink className="w-4 h-4" />
    </TooltipIconButton>
  );
}
