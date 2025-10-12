
import React from 'react';
import { changelogData } from '@/lib/changelog-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';

const ChangelogTag = ({ type, text }: { type: string, text: string }) => {
  const typeStyles: { [key: string]: string } = {
    New: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Improved: 'bg-green-500/20 text-green-300 border-green-500/30',
    Fixed: 'bg-red-500/20 text-red-300 border-red-500/30',
    Docs: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Strategy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };
  const style = typeStyles[type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  return (
    <div className="flex items-start space-x-3">
      <Badge variant="outline" className={`flex-shrink-0 ${style}`}>{type}</Badge>
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
};

const ChangelogPage = () => {
  const recentVersions = changelogData.versions; // Show all versions

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Changelog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Stay up to date with the latest features and improvements for Xeref.ai.
          </p>
        </header>

        <Card className="mb-12 bg-gradient-to-r from-purple-500/10 to-indigo-600/10 border-purple-500/20">
          {/* ... Community Card ... */}
        </Card>

        <div className="space-y-12">
          {recentVersions.map((entry, idx) => (
            <Card key={entry.version} className="bg-card border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-bold flex items-center gap-2">
                    {entry.version}
                    {idx === 0 && <Rocket className="h-6 w-6 text-purple-400" />}
                  </CardTitle>
                  <Badge variant="secondary">{entry.date}</Badge>
                </div>
                <CardDescription className="pt-2">
                  {entry.version === changelogData.latestVersion && "Future planned updates for the next version."}
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {entry.changes.map((change, index) => (
                    <ChangelogTag key={index} type={change.type} text={change.description} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
