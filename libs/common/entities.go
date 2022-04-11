package common

type Content struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  
  Exec    []Exec    `json:"exec,omitempty"`
  Kiosk   []Kiosk   `json:"kiosk,omitempty"`
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

  Sync *[]string     `json:"sync,omitempty"`
}

type Frame struct {
  Id uint8           `json:"id"`

  Size    [2]uint16  `json:"size"`
  Corners [8]int16   `json:"corners"`
  
  Texture [9]float32 `json:"texture,omitempty"`
  Mask    Mask       `json:"mask"`
}

type Texture struct {
  Id uint8          `json:"id"`

  URL    *string    `json:"url,omitempty"`
  Volume *uint8     `json:"volume,omitempty"`
  Loop   *bool      `json:"loop,omitempty"`

  Color *[2]uint16  `json:"color,omitempty"`
}

type Mask struct {
  Size uint16 `json:"size"`
  From uint16 `json:"from"`
  To   uint16 `json:"to"`
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
