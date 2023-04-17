import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createHabit, createHabitBodySchema } from "./use-cases/create-habit";
import {
  getHabitsByDate,
  getHabitsByDateQueryStringSchema,
} from "./use-cases/get-habits-by-date";
import { getSummary } from './use-cases/get-summary';
import {
  toggleHabitComplete,
  toggleHabitCompleteParamsSchema,
  toggleHabitCompleteQueryStringSchema,
} from "./use-cases/toggle-habit-complete";

export const appRoutes: FastifyPluginAsync = async (app) => {
  app.withTypeProvider<ZodTypeProvider>().post("/habits", {
    schema: {
      body: createHabitBodySchema,
    },
    handler: async (request) => {
      return createHabit(request.body);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().get("/day", {
    schema: {
      querystring: getHabitsByDateQueryStringSchema,
    },
    handler: async (request) => {
      return getHabitsByDate(request.query);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().patch("/habits/:id/toggle", {
    schema: {
      params: toggleHabitCompleteParamsSchema,
      querystring: toggleHabitCompleteQueryStringSchema,
    },
    handler: async (request) => {
      return toggleHabitComplete(request.params, request.query);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().get("/summary", {
    schema: {},
    handler: async (request) => {
      return getSummary();
    }
  });
};
