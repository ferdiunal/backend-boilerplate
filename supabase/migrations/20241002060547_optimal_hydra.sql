DO $$ BEGIN
 CREATE TYPE "public"."user_gender" AS ENUM('male', 'female', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "public"."user_role_type" AS ENUM('admin', 'user', 'brand', 'influencer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"id_number" varchar(11),
	"email" varchar(100) NOT NULL,
	"phone" varchar(20),
	"gender" "user_gender",
	"role" "user_role_type" DEFAULT 'user',
	"birth_date" date,
	"password" varchar(64),
	"recovery_codes" varchar(12)[],
	"last_activity" timestamp (3) with time zone,
	"email_verified_at" timestamp (3) with time zone,
	"last_sign_in_at" timestamp (3) with time zone,
	"created_at" timestamp (3) with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"deleted_at" timestamp (3) with time zone,
	CONSTRAINT "users_id_number_unique" UNIQUE("id_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_password_unique" UNIQUE("password")
);

DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "users_name_idx" ON "users" USING btree ("first_name","last_name");
CREATE INDEX IF NOT EXISTS "users_first_name_idx" ON "users" USING btree ("first_name");
CREATE INDEX IF NOT EXISTS "users_last_name_idx" ON "users" USING btree ("last_name");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "users_password_idx" ON "users" USING btree ("password");
CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_idx" ON "users" USING btree ("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "users_id_number_idx" ON "users" USING btree ("id_number");
CREATE INDEX IF NOT EXISTS "users_gender_idx" ON "users" USING btree ("gender");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" USING btree ("role");
CREATE INDEX IF NOT EXISTS "users_last_activity_idx" ON "users" USING btree ("last_activity");
CREATE INDEX IF NOT EXISTS "users_email_verified_at_idx" ON "users" USING btree ("email_verified_at");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "users_deleted_at_idx" ON "users" USING btree ("deleted_at");
CREATE INDEX IF NOT EXISTS "users_last_sign_in_at_idx" ON "users" USING btree ("last_sign_in_at");