package functions

import (
	"context"
	"errors"

	db "github.com/fetus-care/fetus-care-fork/golang/database"
)

// RegisterUser inserts a new user into the database
func RegisterUser(name, email, password string) error {
	// Ensure the DB connection exists
	if db.DB == nil {
		return errors.New("database connection is not initialized")
	}

	defer db.CloseDB() // Ensure the connection closes after use

	// Define the SQL query
	query := `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`

	// Execute the query
	_, err := db.DB.Exec(context.Background(), query, name, email, password)
	if err != nil {
		return err
	}

	return nil
}
