varying vec3 v2f_nrm;

uniform vec3 col1;
uniform vec3 col2;

void main() {
    float dl = dot(vec3(1.0, 1.0, 1.0), v2f_nrm);
    vec3 col = mix(col1, col2, dl * 0.5 + 0.5);
    gl_FragColor = vec4(col, 1.0);
}