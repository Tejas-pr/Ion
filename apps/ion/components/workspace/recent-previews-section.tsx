import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye } from "lucide-react";

export function RecentPreviewsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Previews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Eye className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Preview deployments that you have recently visited or created will appear here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
