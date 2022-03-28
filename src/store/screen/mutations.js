export function SET_SCREEN_TYPE(state, screenType) {
    state.screenType = screenType
}

export function SET_SCREEN_GAIN(state, screenGain) {
    state.screenGain = screenGain
}

export function SET_X(state, x) {
    state.x = x
}

export function SET_Y(state, y) {
    state.y = y
}

export function SET_Z(state, z) {
    state.z = z
}

export function SET_ROTATE_X(state, rotateX) {
    state.rotateX = rotateX
}

export function SET_ROTATE_Y(state, rotateY) {
    state.rotateY = rotateY
}

export function SET_ROTATE_Z(state, rotateZ) {
    state.rotateZ = rotateZ
}

export function SET_PLANE_ASPECT_RATIO(state, aspectRatio) {
    state.plane.aspectRatio = aspectRatio
}

export function SET_PLANE_DIAGONAL(state, diagonal) {
    state.plane.diagonal = diagonal
}

export function SET_PLANE_WIDTH(state, width) {
    state.plane.width = width
}

export function SET_PLANE_HEIGHT(state, height) {
    state.plane.height = height
}

export function SET_CURVED_ASPECT_RATIO(state, aspectRatio) {
    state.curved.aspectRatio = aspectRatio
}

export function SET_CURVED_DIAGONAL(state, diagonal) {
    state.curved.diagonal = diagonal
}

export function SET_CURVED_WIDTH(state, width) {
    state.curved.width = width
}

export function SET_CURVED_HEIGHT(state, height) {
    state.curved.height = height
}

export function SET_CURVED_RADIUS(state, radius) {
    state.curved.radius = radius
}

export function SET_CURVED_RADIAL_SEGMENTS(state, radialSegments) {
    state.curved.radialSegments = radialSegments
}

export function SET_CURVED_IS_SMOOTH(state, isSmooth) {
    state.curved.isSmooth = isSmooth
}

export function SET_SPHERE_RADIUS(state, radius) {
    state.sphere.radius = radius
}

export function SET_SPHERE_PHI_START(state, phiStart) {
    state.sphere.phiStart = phiStart
}

export function SET_SPHERE_PHI_LENGTH(state, phiLength) {
    state.sphere.phiLength = phiLength
}

export function SET_SPHERE_THETA_START(state, thetaStart) {
    state.sphere.thetaStart = thetaStart
}

export function SET_SPHERE_THETA_END(state, thetaEnd) {
    state.sphere.thetaEnd = thetaEnd
}

export function SET_CUSTOM_GEOMETRY_SRC(state, src) {
    state.custom.geometrySrc = src
}

export function SET_CUSTOM_MATERIAL_SRC(state, src) {
    state.custom.materialSrc = src
}

export function SET_SCREEN_HISTORY(state, screen) {
    state.screenType = screen.screenType
    state.screenGain = screen.screenGain
    state.x = screen.x
    state.y = screen.y
    state.z = screen.z
    state.rotateX = screen.rotateX
    state.rotateY = screen.rotateY
    state.rotateZ = screen.rotateZ
    state.plane.aspectRatio = screen.plane.aspectRatio
    state.plane.diagonal = screen.plane.diagonal
    state.plane.width = screen.plane.width
    state.plane.height = screen.plane.height
    state.curved.aspectRatio = screen.curved.aspectRatio
    state.curved.diagonal = screen.curved.diagonal
    state.curved.width = screen.curved.width
    state.curved.height = screen.curved.height
    state.curved.radius = screen.curved.radius
    state.curved.radialSegments = screen.curved.radialSegments
    state.curved.isSmooth = screen.curved.isSmooth
    state.sphere.radius = screen.sphere.radius
    state.sphere.phiStart = screen.sphere.phiStart
    state.sphere.phiLength = screen.sphere.phiLength
    state.sphere.thetaStart = screen.sphere.thetaStart
    state.sphere.thetaEnd = screen.sphere.thetaEnd
}
