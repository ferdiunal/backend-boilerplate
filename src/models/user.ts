import type { GenderType, UidType } from "@/types/auth";
import { AuthRole } from "@/types/auth.enum";
import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
  customType,
  date,
  char,
  pgEnum,
  uuid,
  foreignKey,
  pgSchema,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

const AuthRoleArray = Object.values(AuthRole) as [string, ...string[]];

export const genderType = pgEnum("user_gender", ["male", "female", "other"]);

export const userTypes = pgEnum("user_role_type", AuthRoleArray);

const authSchema = pgSchema("auth");

const authUser = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const uidType = customType<{
  data: string;
  notNull: true;
  default: true;
}>({
  dataType() {
    return "char(24)";
  },
});

export const User = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .references(() => authUser.id, {
        onDelete: "cascade",
      }),
    first_name: varchar("first_name", {
      length: 100,
    }),
    last_name: varchar("last_name", {
      length: 100,
    }),
    id_number: varchar("id_number", {
      length: 11,
    }).unique(),
    email: varchar("email", {
      length: 100,
    })
      .notNull()
      .unique(),
    phone: varchar("phone", {
      length: 20,
    }).unique(),
    gender: genderType("gender").$type<GenderType>(),
    role: userTypes("role").$type<AuthRole>().default(AuthRole.CLIENT),
    birth_date: date("birth_date"),
    password: varchar("password", {
      length: 64,
    }).unique(),
    recovery_codes: varchar("recovery_codes", {
      length: 12,
    }).array(),
    last_activity: timestamp("last_activity", {
      withTimezone: true,
      precision: 3,
    }),
    email_verified_at: timestamp("email_verified_at", {
      withTimezone: true,
      precision: 3,
    }),
    last_sign_in_at: timestamp("last_sign_in_at", {
      withTimezone: true,
      precision: 3,
    }),
    created_at: timestamp("created_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      precision: 3,
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP(3)`),
    deleted_at: timestamp("deleted_at", {
      withTimezone: true,
      precision: 3,
    }),
  },
  (table) => {
    return {
      idx_name: index("users_name_idx").on(table.first_name, table.last_name),
      idx_firstName: index("users_first_name_idx").on(table.first_name),
      idx_lastName: index("users_last_name_idx").on(table.last_name),
      idx_email: uniqueIndex("users_email_idx").on(table.email),
      idx_password: uniqueIndex("users_password_idx").on(table.password),
      idx_phone: uniqueIndex("users_phone_idx").on(table.phone),
      idx_idNumber: uniqueIndex("users_id_number_idx").on(table.id_number),
      idx_gender: index("users_gender_idx").on(table.gender),
      idx_role: index("users_role_idx").on(table.role),
      last_activity_idx: index("users_last_activity_idx").on(
        table.last_activity
      ),
      email_verified_at_idx: index("users_email_verified_at_idx").on(
        table.email_verified_at
      ),
      created_at_idx: index("users_created_at_idx").on(table.created_at),
      updated_at_idx: index("users_updated_at_idx").on(table.updated_at),
      deleted_at_idx: index("users_deleted_at_idx").on(table.deleted_at),
      last_sign_in_at_idx: index("users_last_sign_in_at_idx").on(
        table.last_sign_in_at
      ),
    };
  }
);

export const UserInsertSchema = createInsertSchema(User).omit({
  password: true,
  last_activity: true,
  email_verified_at: true,
  last_sign_in_at: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  role: true,
  id: true,
});

export const UserSelectSchema = createSelectSchema(User).omit({
  password: true,
});

export type UserSelectSchemaType = z.infer<typeof UserSelectSchema>;
export type UserInsertSchemaType = z.infer<typeof UserInsertSchema>;
