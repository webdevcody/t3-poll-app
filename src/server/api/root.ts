import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { pollRouter } from "./routers/poll";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  poll: pollRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
