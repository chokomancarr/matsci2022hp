varying vec3 v2f_nrm;

void main() {
    v2f_nrm = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}