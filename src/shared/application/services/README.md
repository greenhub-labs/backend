# StartupCheckService

## Purpose

`StartupCheckService` ensures that all critical infrastructure dependencies (Kafka, Prisma, Redis) are available and healthy before the application starts serving traffic. This prevents the app from running in a degraded or broken state due to missing connections to essential services.

## How it works

- On application startup, the service attempts to connect to:
  - **Kafka** (using the global Kafka client)
  - **Prisma** (database client)
  - **Redis** (cache client)
- Each connection is retried up to 5 times (default) with a 2-second delay between attempts.
- If any dependency is still unavailable after all retries, the application startup is aborted (`process.exit(1)`).
- If all checks pass, the app continues to start normally.

## Configuration

- **Max retries**: You can change the `maxRetries` property in `StartupCheckService` to increase or decrease the number of attempts.
- **Retry delay**: Adjust the `retryDelayMs` property for the wait time between retries (in milliseconds).

## Extending

To add more health checks (e.g., for other services), add a new method to `StartupCheckService` and call it from `onModuleInit()` using `checkWithRetry()`.

## Example log output

```
[Nest] 12345   - 07/12/2025, 12:00:00 AM   LOG [StartupCheckService] Kafka connection OK
[Nest] 12345   - 07/12/2025, 12:00:01 AM   LOG [StartupCheckService] Prisma connection OK
[Nest] 12345   - 07/12/2025, 12:00:02 AM   LOG [StartupCheckService] Redis connection OK
[Nest] 12345   - 07/12/2025, 12:00:02 AM   LOG [StartupCheckService] All critical dependencies are connected. App startup continues.
```

If a dependency fails:

```
[Nest] 12345   - 07/12/2025, 12:00:00 AM   WARN [StartupCheckService] Kafka connection failed (attempt 1/5): Connection refused
...
[Nest] 12345   - 07/12/2025, 12:00:10 AM   ERROR [StartupCheckService] Kafka connection failed after 5 attempts. Exiting.
```

## Location

This service is located at:

```
src/shared/application/services/startup-check.service.ts
```

---

**Best practice:** Use this pattern in all distributed systems to ensure robust, predictable startup and fail-fast behavior if critical dependencies are missing.
