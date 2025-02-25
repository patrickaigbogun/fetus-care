package logger

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type Logger struct {
	logger *log.Logger
}

// New initializes the logger with custom directory and prefix
func New(logDir string, prefix string) *Logger {
	if _, err := os.Stat(logDir); os.IsNotExist(err) {
		os.Mkdir(logDir, 0755)
	}

	currentDate := time.Now().Format("2006-01-02")
	logFile, err := os.OpenFile(fmt.Sprintf("%s/%s.log", logDir, currentDate), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}

	multiWriter := io.MultiWriter(os.Stdout, logFile)

	return &Logger{
		logger: log.New(multiWriter, fmt.Sprintf("%s ", prefix), log.Ldate|log.Ltime|log.Lshortfile),
	}
}

// Middleware logs HTTP requests
func (l *Logger) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, statusCode: http.StatusOK}
		next.ServeHTTP(rec, r)
		duration := time.Since(start)
		l.logger.Printf("[%s] %s %s %d %s\n", r.Method, r.RequestURI, r.RemoteAddr, rec.statusCode, duration)
	})
}

// statusRecorder captures HTTP status codes
type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(code int) {
	rec.statusCode = code
	rec.ResponseWriter.WriteHeader(code)
}

// Info logs a standard message
func (l *Logger) Info(message string) {
	l.logger.Println("INFO: " + message)
}

// Error logs an error message
func (l *Logger) Error(err error) {
	l.logger.Println("ERROR: " + err.Error())
}
