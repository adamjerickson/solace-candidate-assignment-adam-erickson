import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("specialties").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  firstNameIdx: index("advocates_first_name_idx").on(table.firstName),
  lastNameIdx: index("advocates_last_name_idx").on(table.lastName),
  cityIdx: index("advocates_city_idx").on(table.city),
  specialtiesGinIdx: index("advocates_specialties_gin_idx")
    .using("gin", table.specialties),
  experienceIdx: index("advocates_experience_idx").on(table.yearsOfExperience),
  degreeIdx: index("advocates_degree_idx").on(table.degree),
}));

export { advocates };
