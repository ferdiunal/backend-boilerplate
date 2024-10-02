import { TagType } from "@/types/tagType.enum";
import { relations } from "drizzle-orm";
import { bigint, bigserial, integer, pgEnum, pgTable, timestamp, uuid, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";

const TagsArray = Object.values(TagType) as [string, ...string[]];

export const tagTypes = pgEnum("tag_type", TagsArray);

export const Tag = pgTable("tags", {
    id: bigserial("id", {
        mode: "bigint",
    }).primaryKey(),
    name: varchar("name", {
        length: 100,
    }).notNull(),
    slug: varchar("slug", {
        length: 100,
    }).notNull(),
    parent_id: bigint("parent_id", {
        mode: "bigint"
    }).references((): AnyPgColumn => Tag.id, {
        onDelete: "cascade",
    }),
    type: tagTypes("type").$type<TagType>().notNull().default(TagType.Tag),
    order_column: integer("order_column").notNull().default(0),
    created_at: timestamp("created_at").notNull(),
    updated_at: timestamp("updated_at").notNull(),
})

export const tagsRelations = relations(Tag, ({one, many}) => ({
    parent: one(Tag, {
        fields: [Tag.parent_id],
        references: [Tag.id]
    }),
    children: many(Tag)
}))