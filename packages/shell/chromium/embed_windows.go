//go:build windows

package chromium

import (
	"archive/zip"
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
)

//go:embed chromium-100.0.4896.75-Win64.zip
var chromiumZipBytes []byte

func (c *Chromium) Extract() error {
  log.Printf("Chromium [Extract] Extracting Chromium to dir \"%s\"\n", c.path)

  b := bytes.NewReader(chromiumZipBytes)
  archive, err := zip.NewReader(b, int64(b.Len()))
  if err != nil {
    return fmt.Errorf("Chromium [Extract] Zip reader error: %w", err)
  }

  for _, f := range archive.File {
    log.Printf("Chromium [Extract] Unzipping \"%s\"\n", f.Name)
    filePath := filepath.Join(c.path, f.Name)
    
    if f.FileInfo().IsDir() {
      log.Printf("Chromium [Extract] Creating directory \"%s\"\n", filePath)
      err := os.MkdirAll(filePath, os.ModePerm)
      if err != nil {
        return fmt.Errorf("Chromium [Extract] Creating directory error: %w", err)
      }
      continue
    }

    dstFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
    if err != nil {
      return fmt.Errorf("Chromium [Extract] Open fs file error: %w", err)
    }

    fileInArchive, err := f.Open()
    if err != nil {
      dstFile.Close()
      return fmt.Errorf("Chromium [Extract] Open archive file error: %w", err)
    }

    if _, err := io.Copy(dstFile, fileInArchive); err != nil {
      dstFile.Close()
      fileInArchive.Close()
      return fmt.Errorf("Chromium [Extract] Data copy error: %w", err)
    }

    dstFile.Close()
    fileInArchive.Close()
  }

  log.Printf("Chromium [Extract] Extracted complite\n")
  return nil
}