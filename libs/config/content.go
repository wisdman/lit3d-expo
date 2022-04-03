package config

type Content struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  
  Exec    *[]string  `json:"exec,omitempty"`
  Mapping *[]Mapping `json:"mapping,omitempty"`
  Sound   *[]Sound   `json:"sound,omitempty"`
}

type Mapping struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`

  Location [2]int16  `json:"location"`
  
  Frames   *[]Frame   `json:"frames,omitempty"`
  Textures *[]Texture `json:"textures,omitempty"`

  URL *string `json:"url,omitempty"`

  Sync *[]string `json:"sync,omitempty"`
}

type Frame struct {
  Id       uint8           `json:"id"`
  Corners  [8]int16        `json:"corners"`
  Size     [2]uint16       `json:"size"`
  Textures *[]FrameTexture `json:"textures,omitempty"`
  Mask     *FrameMask      `json:"mask,omitempty"`
}

type FrameTexture struct {
  Id    uint8      `json:"id"`
  Cords [4]float32 `json:"cords"`
}

type FrameMask struct {
  Cords  *[4]float32 `json:"cords,omitempty"`
  Radius *float32    `json:"radius,omitempty"`
  URL    *string     `json:"url,omitempty"`
}

type Texture struct {
  URL    string `json:"url"`
  Volume *uint8 `json:"volume,omitempty"`
}

type Sound struct {
  Id          string `json:"id"`
  Title       string `json:"title"`
  Description string `json:"description"`
  
  URL string `json:"url"`

  Loop   *bool `json:"loop,omitempty"`
  Volume uint8 `json:"volume"`
}