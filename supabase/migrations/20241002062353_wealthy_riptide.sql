DO $$ BEGIN
 CREATE TYPE "public"."tag_type" AS ENUM('category', 'tag', 'size', 'color');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "tags" ADD COLUMN "type" "tag_type" DEFAULT 'tag' NOT NULL;