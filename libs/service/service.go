package service

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"
)

type Service struct {
	mux      *http.ServeMux
	server   *http.Server
	certFile string
	keyFile  string
}

func New(port uint32, certFile, keyFile string) *Service {
	certFile, err := filepath.Abs(certFile)
	if err != nil {
		log.Fatalf("Incorrect certFile path: %v\n", err)
	}

	keyFile, err = filepath.Abs(keyFile)
	if err != nil {
		log.Fatalf("Incorrect keyFile path: %v\n", err)
	}

	service := &Service{
		mux: http.NewServeMux(),
		certFile: certFile,
		keyFile: keyFile,
	}

	tlsConfig := &tls.Config{
    MinVersion: tls.VersionTLS13,
    CurvePreferences: []tls.CurveID{tls.CurveP521, tls.CurveP384, tls.CurveP256},
    CipherSuites: []uint16{
    	tls.TLS_AES_128_GCM_SHA256,
    	tls.TLS_AES_256_GCM_SHA384,
    },
    InsecureSkipVerify: true,
  }

	service.server = &http.Server{
		Addr: fmt.Sprintf(":%d", port),
		Handler: service.mux,
		TLSConfig: tlsConfig,
	}

	return service
}

func (service *Service) ListenAndServe() {
	go func() {
		log.Printf("Service listening on https://0.0.0.0%s\n", service.server.Addr)
		err := service.server.ListenAndServeTLS(service.certFile, service.keyFile) 
		if err != http.ErrServerClosed {
			log.Fatalf("Service init error: %v\n", err)
		}
	}()
}

func (service *Service) Shutdown() {
	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()
	
	err := service.server.Shutdown(ctx)
	if err != nil {
		log.Printf("Service shutdown error: %v\n", err)
		return
	}
	log.Println("Service stopped")
}

func (service *Service) FS(pattern string, handler http.Handler) {
	service.mux.Handle(pattern, NoCache(handler))
}

func (service *Service) HandleFunc(pattern string, handler http.HandlerFunc) {
	service.mux.HandleFunc(pattern, handler)
}

func (service *Service) API(pattern string) *API {
	pattern = removeFinalSlashes(pattern)
	api := &API{
		trees: make(map[string]*Node),
		pattern: pattern,
	}
	service.mux.Handle(pattern + "/", NoCache(api))
	return api
}
