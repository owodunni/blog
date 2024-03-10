package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"

	"github.com/NYTimes/gziphandler"
)

func main() {
	handler, err := gziphandler.GzipHandlerWithOpts(gziphandler.MinSize(gziphandler.DefaultMinSize))

	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", handler(http.HandlerFunc(serve)))

	log.Print("Listening on :3000...")
	err = http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func serve(w http.ResponseWriter, r *http.Request) {
	fp, err := findFile(r.URL.Path)

	if err != nil {
		log.Print(err)
		log.Print(fmt.Sprintf("404, could not find path %s", r.URL.Path))
		fp = filepath.Join("build", "404.html")
		errorPage, err := os.ReadFile(fp)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		w.Header().Add("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintln(w, string(errorPage))
		return
	}

	http.ServeFile(w, r, fp)
}

func findFile(path string) (string, error) {
	fp := filepath.Join("build", filepath.Clean(path))

	if path == "/" || path == "" {
		fp = filepath.Join("build", "index.html")
	}

	// Regular expression pattern to check if the path matches '/_app'
	regex := regexp.MustCompile(`^.*?\/_app`)

	// Check if the path matches the pattern
	if regex.MatchString(path) {
		// Regular expression pattern to capture the part after '/_app'
		captureRegex := regexp.MustCompile(`^.*?\/_app(.*)$`)

		// Replace matching part with the capture group
		convertedPath := captureRegex.ReplaceAllString(path, "_app$1")
		fp = filepath.Join("build", filepath.Clean(convertedPath))
    _, err := os.Stat(fp)
		return fp, err
	}

	info, err := os.Stat(fp)
	if err != nil || info.IsDir() {
		info, err = os.Stat(fp + ".html")
		if err != nil {
			return "", err
		}
		fp = filepath.Join("build", filepath.Clean(path)+".html")
		return fp, nil
	}

	return fp, nil
}
