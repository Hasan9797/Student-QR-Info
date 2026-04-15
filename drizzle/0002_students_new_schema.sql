DROP TABLE IF EXISTS "students";
--> statement-breakpoint
CREATE TABLE "students" (
  "id" serial PRIMARY KEY NOT NULL,
  "given" text NOT NULL,
  "last_name" text NOT NULL,
  "first_name" text NOT NULL,
  "patronymic" text NOT NULL,
  "specialty" text NOT NULL,
  "qualification" text NOT NULL,
  "birth_date" text NOT NULL,
  "passport_number" text NOT NULL,
  "certificate_number" integer NOT NULL,
  "protocol_number" text NOT NULL,
  "protocol_registration_date" text NOT NULL,
  "commission_chairman" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
