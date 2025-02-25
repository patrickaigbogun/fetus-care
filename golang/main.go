package main

import (
	"net/http"

	db "github.com/fetus-care/fetus-care-fork/golang/database"
	"github.com/fetus-care/fetus-care-fork/golang/handlers"
	"github.com/fetus-care/fetus-care-fork/golang/logger"
)

func main() {
	port := "7000"
	// Initialize database
	db.Connect()

	// Initialize logger
	log := logger.New("logs", "AUTH-SERVICE")

	mux := http.NewServeMux()
	mux.HandleFunc("/register", handlers.RegisterHandler)

	// Add middleware
	loggedMux := log.Middleware(mux)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: loggedMux,
	}

	log.Info("Server running on port " + port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Error(err)
	}
	log.Info("Server stopped")
}
