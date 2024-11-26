import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY,
        "email" varchar UNIQUE NOT NULL,
        "username" varchar NOT NULL,
        "password" varchar NOT NULL,
        "role" varchar CHECK(role IN ('creator', 'user')) DEFAULT 'user',
        "avatar" varchar,
        "social_link" varchar,
        "description" text,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        "updated_at" datetime DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Roulettes table
    await queryRunner.query(`
      CREATE TABLE "roulettes" (
        "id" varchar PRIMARY KEY,
        "creator_id" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text,
        "items" text NOT NULL,
        "packages" text NOT NULL,
        "likes" integer DEFAULT 0,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        "updated_at" datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    // Access codes table
    await queryRunner.query(`
      CREATE TABLE "access_codes" (
        "id" varchar PRIMARY KEY,
        "roulette_id" varchar NOT NULL,
        "code" varchar(8) NOT NULL,
        "spins_left" integer NOT NULL,
        "total_spins" integer NOT NULL,
        "is_used" boolean DEFAULT 0,
        "expires_at" datetime,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("roulette_id") REFERENCES "roulettes" ("id") ON DELETE CASCADE
      )
    `);

    // Wins table
    await queryRunner.query(`
      CREATE TABLE "wins" (
        "id" varchar PRIMARY KEY,
        "user_id" varchar NOT NULL,
        "roulette_id" varchar NOT NULL,
        "prize" text NOT NULL,
        "claimed" boolean DEFAULT 0,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("roulette_id") REFERENCES "roulettes" ("id") ON DELETE CASCADE
      )
    `);

    // Likes table
    await queryRunner.query(`
      CREATE TABLE "likes" (
        "id" varchar PRIMARY KEY,
        "user_id" varchar NOT NULL,
        "roulette_id" varchar NOT NULL,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
        FOREIGN KEY ("roulette_id") REFERENCES "roulettes" ("id") ON DELETE CASCADE,
        UNIQUE("user_id", "roulette_id")
      )
    `);

    // Social links table
    await queryRunner.query(`
      CREATE TABLE "social_links" (
        "id" varchar PRIMARY KEY,
        "user_id" varchar NOT NULL,
        "platform" varchar(50) NOT NULL,
        "url" varchar NOT NULL,
        "created_at" datetime DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "social_links"');
    await queryRunner.query('DROP TABLE IF EXISTS "likes"');
    await queryRunner.query('DROP TABLE IF EXISTS "wins"');
    await queryRunner.query('DROP TABLE IF EXISTS "access_codes"');
    await queryRunner.query('DROP TABLE IF EXISTS "roulettes"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}