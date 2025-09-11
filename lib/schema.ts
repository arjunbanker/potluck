import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  profileImage: text("profile_image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const recipes = pgTable(
  "recipe",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    slug: text("slug").unique(),
    privacy: text("privacy").notNull().default("private"),

    data: jsonb("data").notNull().$type<RecipeData>(),
    source: jsonb("source").$type<RecipeSource>(),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("recipe_user_id_idx").on(table.userId),
    slugIdx: index("recipe_slug_idx").on(table.slug),
    privacyIdx: index("recipe_privacy_idx").on(table.privacy),
    dataIdx: index("recipe_data_gin_idx").using("gin", table.data),
  }),
);

export const collections = pgTable(
  "collection",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    description: text("description"),

    recipes: jsonb("recipes")
      .notNull()
      .default(sql`'[]'::jsonb`)
      .$type<CollectionRecipe[]>(),
    settings: jsonb("settings").$type<CollectionSettings>(),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("collection_user_idx").on(table.userId),
  }),
);

export const shares = pgTable(
  "share",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id").notNull(),

    sharedBy: text("shared_by")
      .notNull()
      .references(() => users.id),
    token: text("token").unique().notNull(),

    settings: jsonb("settings").$type<ShareSettings>(),

    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  },
  (table) => ({
    tokenIdx: index("share_token_idx").on(table.token),
    resourceIdx: index("share_resource_idx").on(
      table.resourceType,
      table.resourceId,
    ),
  }),
);

export interface RecipeData {
  summary?: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  };

  servings?: {
    amount: number;
    unit?: string;
  };
  times?: {
    prep?: number;
    cook?: number;
    total?: number;
  };

  difficulty?: "easy" | "medium" | "hard";
  cuisine?: string;
  course?: string;
  tags?: string[];

  ingredients: {
    section?: string;
    items: {
      ingredient: string;
      quantity?: string;
      unit?: string;
      preparation?: string;
      optional?: boolean;
      alternatives?: string[];
    }[];
  }[];

  instructions: {
    step: number;
    text: string;
    tip?: string;
    warning?: string;
    duration?: number;
    temperature?: string;
    image?: string;
  }[];

  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    [key: string]: number | undefined;
  };

  notes?: string;
  tips?: string[];
  variations?: string[];

  viewCount?: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface RecipeSource {
  type: "manual" | "url" | "text" | "photo" | "ai_generated";
  method: "import" | "create" | "fork";
  url?: string;
  originalText?: string;
  importedAt?: string;
  aiModel?: string;
  parentRecipeId?: string;
}

export interface CollectionRecipe {
  recipeId: string;
  addedAt: string;
  notes?: string;
  sortOrder?: number;
}

export interface CollectionSettings {
  color?: string;
  icon?: string;
  privacy?: "private" | "friends" | "public";
  defaultView?: "grid" | "list";
}

export interface ShareSettings {
  permission?: "view" | "edit";
  sharedWith?: string[];
  requiresAuth?: boolean;
  maxViews?: number;
  currentViews?: number;
  message?: string;
}
