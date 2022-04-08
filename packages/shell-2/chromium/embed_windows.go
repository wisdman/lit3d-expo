//go:build windows

package chromium

const {
	chromiumZipFileName = "chromium-100.0.4896.75-Win64.zip"
}

//go:embed chromium-100.0.4896.75-Win64.zip
var chromiumZipFileFS embed.FS

func (c *Chromium) Extract() error {
	log.Printf("Chromium [Extract] Extract Chromium to dir \"%s\"", c.path)
	log.Printf("Chromium [Extract] Darwin OS not supported")
	return nil
}