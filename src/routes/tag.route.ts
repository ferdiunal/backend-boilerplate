import { createApp } from "@/libs/createApp";
import { db } from "@/libs/database/db";
import { zValidator } from "@/middlewares/zodValidator.middleware";
import { Tag } from "@/models";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const TagRoute = createApp()
  .basePath("/tags")
  .get("/", async (c) => {
    const tags = db.query.Tag.findMany();

    return c.json(tags);
  })
  .get("/:id", async (c) => {
    const tag = db.query.Tag.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, BigInt(c.req.param().id));
      },
    });

    return c.json(tag);
  })
  .put(
    "/:id",
    zValidator(
      "json",
      z.object({
        parent_id: z.number().int().optional(),
        order_column: z.number().int().optional(),
        name: z.string().min(2).max(100),
        slug: z.string().min(2).max(100),
      })
    ),
    async (c) => {
      const id = BigInt(c.req.param().id);
      const { parent_id, order_column, name, slug } = c.req.valid("json");

      const _tag = await db.query.Tag.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, id);
        },
      });

      if (!_tag) {
        return c.json({ message: "Tag not found" }, 404);
      }

      const tag = await db.update(Tag).set({
          parent_id: parent_id ? BigInt(parent_id) : null,
          order_column:
            _tag.order_column !== order_column
              ? order_column
              : _tag.order_column,
          name,
          slug,
        })
        .where(eq(Tag.id, id));

      return c.json(tag);
    }
  )
  .delete("/:id", async (c) => {
    const id = BigInt(c.req.param().id);

    try {
        await db.delete(Tag).where(eq(Tag.id, id));
    } catch (error) {}

    return c.status(204);
  })
