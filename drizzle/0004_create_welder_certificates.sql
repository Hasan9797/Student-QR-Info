CREATE TABLE "welder_certificates" (
  "id" serial PRIMARY KEY NOT NULL,
  "intro_statement" text,
  "full_name" varchar(255),
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
