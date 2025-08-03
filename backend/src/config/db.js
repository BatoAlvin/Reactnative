import {neon} from "@neondatabase/serverless"
import "dotenv/config"

//Creates sql connection
export const sql = neon(process.env.DATABASE_URL)
console.log("passed")

export async function initDB() {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    ); 
    `
    console.log("Database created")
  } catch (error) {
    console.log("DB connection failed",error)
    process.exit(1);
  }
}