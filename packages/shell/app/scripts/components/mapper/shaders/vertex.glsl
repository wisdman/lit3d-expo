#version 300 es

in vec4 a_position;
in vec2 a_texcoord;
in vec2 a_maskcoord;

out vec2 v_texcoord;
out vec2 v_maskcoord;

void main() {
  gl_Position = a_position;
  v_texcoord = a_texcoord;
  v_maskcoord = a_maskcoord;
}
