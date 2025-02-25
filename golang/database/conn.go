package db

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

var DB *pgx.Conn // Global database connection

// Connect initializes the database connection
func Connect() {
	// Load environment variables from .env file (if present)
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found. Using system environment variables.")
	}

	// Get database URL from environment variable
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	// Connect to the database
	DB, err = pgx.Connect(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Connected to PostgreSQL database successfully.")
}

// CloseDB closes the database connection
func CloseDB() {
	if DB != nil {
		DB.Close(context.Background())
		log.Println("Database connection closed.")
	}
}
