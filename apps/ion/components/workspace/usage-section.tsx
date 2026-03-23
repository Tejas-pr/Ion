import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const usageItems = [
  {
    label: "ISR Reads",
    usage: "31K",
    limit: "1M",
  },
  {
    label: "Fast Origin Transfer",
    usage: "253.09 MB",
    limit: "10 GB",
  },
  {
    label: "Edge Requests",
    usage: "1K",
    limit: "1M",
  },
  {
    label: "Image Optimization - Transformations",
    usage: "4",
    limit: "K",
  },
];

export function UsageSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Usage</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">Last 30 days</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {usageItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-xs font-medium">{item.usage} / {item.limit}</span>
              </div>
              <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: Math.min(
                      (parseInt(item.usage) / parseInt(item.limit)) * 100,
                      100
                    ) + "%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          Upgrade
        </Button>
      </CardContent>
    </Card>
  );
}
