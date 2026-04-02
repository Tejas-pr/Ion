import { Registry, collectDefaultMetrics, Histogram } from "prom-client";
import { Request, Response, NextFunction } from "express";

// Create a Registry
export const register = new Registry();

// Enable default metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// Custom HTTP metric
const httpRequestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

register.registerMetric(httpRequestDuration);

// Middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;

        httpRequestDuration
            .labels(req.method, req.route?.path || req.url, res.statusCode.toString())
            .observe(duration);
    });

    next();
};

// Metrics endpoint handler
export const metricsHandler = async (_req: Request, res: Response) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
};