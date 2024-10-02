import type { EnvType } from "@/config/env";
import { Hono } from "hono";

type Variables = {
	user: {
		id: string;
		email: string;
		created_at: string;
		updated_at: string;
	}
};


export const createApp = () => new Hono<{
    Bindings: EnvType,
    Variables: Variables
}>()