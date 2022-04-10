package common

type Content struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  
  Exec    []Exec    `json:"exec,omitempty"`
  Kiosk   []Kiosk   `json:"exec,omitempty"`
  Mapping []Mapping `json:"mapping,omitempty"`
  Sound   []Sound   `json:"sound,omitempty"`
}

type Exec struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  
  Command     string `json:"command"`
}

type Kiosk struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`

  Location [2]int16  `json:"location"`

  URL *string        `json:"url,omitempty"`

  Sync *[]string     `json:"sync,omitempty"`
}

type Mapping struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`

  Location [2]int16  `json:"location"`

  Frames   []Frame   `json:"frames,omitempty"`
  Textures []Texture `json:"textures,omitempty"`
  FPS      *uint8    `json:"fps,omitempty"`

  URL *string        `json:"url,omitempty"`
  
  Sync *[]string     `json:"sync,omitempty"`
}

type Frame struct {
  Id uint8           `json:"id"`

  Size    [2]uint16  `json:"size"`
  Corners [8]int16   `json:"corners"`
  
  Texture [9]float32 `json:"texture,omitempty"`
  Mask    [9]float32 `json:"mask,omitempty"`
}

type Texture struct {
  Id uint8          `json:"id"`

  URL    *string    `json:"url,omitempty"`
  Volume *uint8     `json:"volume,omitempty"`
  Loop   *bool      `json:"loop,omitempty"`

  Color *[2]uint8   `json:"color,omitempty"`

  Mask *TextureMask `json:"mask,omitempty"`
}

type TextureMask struct {
  Size [2]uint16 `json:"size"`

  Start  *uint16 `json:"start,omitempty"`
  End    *uint16 `json:"end,omitempty"`
  Rotate *uint8  `json:"rotate,omitempty"`

  URL *string    `json:"url,omitempty"`
}

type Sound struct {
  Id          string  `json:"id"`
  Title       string  `json:"title"`
  Description string  `json:"description"`

  URL string          `json:"url"`

  Volume uint8        `json:"Volume"`

  Loop *bool          `json:"loop,omitempty"`
  Timer *uint16       `json:"timer,omitempty"`

  Sync *[]string      `json:"sync,omitempty"`
}
