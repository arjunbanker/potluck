CREATE TABLE "collection" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"recipes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"privacy" text DEFAULT 'private' NOT NULL,
	"data" jsonb NOT NULL,
	"source" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "recipe_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "share" (
	"id" text PRIMARY KEY NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"shared_by" text NOT NULL,
	"token" text NOT NULL,
	"settings" jsonb,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "share_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "collection" ADD CONSTRAINT "collection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "share" ADD CONSTRAINT "share_shared_by_user_id_fk" FOREIGN KEY ("shared_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collection_user_idx" ON "collection" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipe_user_id_idx" ON "recipe" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipe_slug_idx" ON "recipe" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "recipe_privacy_idx" ON "recipe" USING btree ("privacy");--> statement-breakpoint
CREATE INDEX "recipe_data_gin_idx" ON "recipe" USING gin ("data");--> statement-breakpoint
CREATE INDEX "share_token_idx" ON "share" USING btree ("token");--> statement-breakpoint
CREATE INDEX "share_resource_idx" ON "share" USING btree ("resource_type","resource_id");