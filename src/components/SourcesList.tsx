
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible } from '@/components/ui/collapsible';
import { SourceItem } from '@/components/SourceItem';

interface Source {
  title: string;
  type: 'case' | 'statute' | 'treatise' | 'regulation';
  relevance: number;
  page?: number;
  section?: string;
  snippet?: string;
  url?: string;
}

interface SourcesListProps {
  sources: Source[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const toggleSourceExpansion = (index: number) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSources(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Supporting Sources
          <Badge variant="secondary">{sources.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {sources.map((source, index) => (
              <Collapsible key={index}>
                <SourceItem
                  source={source}
                  index={index}
                  isExpanded={expandedSources.has(index)}
                  onToggleExpansion={toggleSourceExpansion}
                />
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
