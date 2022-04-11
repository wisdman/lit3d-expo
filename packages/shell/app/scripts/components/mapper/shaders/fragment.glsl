#version 300 es
precision highp float;

in vec2 v_texcoord;
in vec2 v_maskcoord;

uniform sampler2D u_texture;
uniform sampler2D u_mask;

out vec4 outColor;

void main() {
  vec4 texel = texture(u_texture, v_texcoord);
  float alpha = texture(u_mask, v_maskcoord).r;
  outColor = texel * alpha;
}