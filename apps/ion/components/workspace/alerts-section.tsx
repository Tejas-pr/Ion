import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function AlertsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Get alerted for anomalies</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically monitor your projects for anomalies and get notified.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Upgrade to Observability Plus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
