CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
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
	"photo" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "students_passport_number_unique" UNIQUE("passport_number")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" integer DEFAULT 1,
	"login" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "welder_certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificates_name" text,
	"intro_statement" text,
	"theory_grade" varchar(50),
	"practice_grade" varchar(50),
	"qualification_details" text,
	"issuance_basis" text,
	"issuing_body" varchar(255),
	"city" varchar(100),
	"certificate_no" varchar(50),
	"issue_date" date,
	"expiry_date" date,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "login_idx" ON "users" USING btree ("login");