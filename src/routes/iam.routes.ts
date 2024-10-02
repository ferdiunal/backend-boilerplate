import { createApp } from "@/libs/createApp";
import authMiddleware from "@/middlewares/auth.middleware";

const iamRoutes = createApp()
	.basePath("/iam")
	.use("*", authMiddleware)
	.get("/", async (c) => {
		const user = c.get("user");

		return c.json({ user, allUsers: 0 });
	});

export default iamRoutes;
