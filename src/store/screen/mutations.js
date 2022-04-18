export function SET_SCREEN_POSTION(state, screenPosition) {
    state.screenPosition = screenPosition
}

export function SET_SCREEN_TYPE(state, screenType) {
    state.screens[state.screenPosition].screenType = screenType
}

export function SET_SCREEN_GAIN(state, screenGain) {
    state.screenGain = screenGain
}

export function SET_X(state, x) {
    state.screens[state.screenPosition].x = x
}

export function SET_Y(state, y) {
    state.screens[state.screenPosition].y = y
}

export function SET_Z(state, z) {
    state.screens[state.screenPosition].z = z
}

export function SET_ROTATE_X(state, rotateX) {
    state.screens[state.screenPosition].rotateX = rotateX
}

export function SET_ROTATE_Y(state, rotateY) {
    state.screens[state.screenPosition].rotateY = rotateY
}

export function SET_ROTATE_Z(state, rotateZ) {
    state.screens[state.screenPosition].rotateZ = rotateZ
}

export function SET_PLANE_ASPECT_RATIO(state, aspectRatio) {
    state.screens[state.screenPosition].plane.aspectRatio = aspectRatio
}

export function SET_PLANE_DIAGONAL(state, diagonal) {
    state.screens[state.screenPosition].plane.diagonal = diagonal
}

export function SET_PLANE_WIDTH(state, width) {
    state.screens[state.screenPosition].plane.width = width
}

export function SET_PLANE_HEIGHT(state, height) {
    state.screens[state.screenPosition].plane.height = height
}

export function SET_CURVED_ASPECT_RATIO(state, aspectRatio) {
    state.screens[state.screenPosition].curved.aspectRatio = aspectRatio
}

export function SET_CURVED_DIAGONAL(state, diagonal) {
    state.screens[state.screenPosition].curved.diagonal = diagonal
}

export function SET_CURVED_WIDTH(state, width) {
    state.screens[state.screenPosition].curved.width = width
}

export function SET_CURVED_HEIGHT(state, height) {
    state.screens[state.screenPosition].curved.height = height
}

export function SET_CURVED_RADIUS(state, radius) {
    state.screens[state.screenPosition].curved.radius = radius
}

export function SET_CURVED_RADIAL_SEGMENTS(state, radialSegments) {
    state.screens[state.screenPosition].curved.radialSegments = radialSegments
}

export function SET_CURVED_IS_SMOOTH(state, isSmooth) {
    state.screens[state.screenPosition].curved.isSmooth = isSmooth
}

export function SET_SPHERE_RADIUS(state, radius) {
    state.screens[state.screenPosition].sphere.radius = radius
}

export function SET_SPHERE_PHI_START(state, phiStart) {
    state.screens[state.screenPosition].sphere.phiStart = phiStart
}

export function SET_SPHERE_PHI_LENGTH(state, phiLength) {
    state.screens[state.screenPosition].sphere.phiLength = phiLength
}

export function SET_SPHERE_THETA_START(state, thetaStart) {
    state.screens[state.screenPosition].sphere.thetaStart = thetaStart
}

export function SET_SPHERE_THETA_END(state, thetaEnd) {
    state.screens[state.screenPosition].sphere.thetaEnd = thetaEnd
}

export function SET_CUSTOM_GEOMETRY_SRC(state, src) {
    state.screens[state.screenPosition].custom.geometrySrc = src
}

export function SET_CUSTOM_MATERIAL_SRC(state, src) {
    state.screens[state.screenPosition].custom.materialSrc = src
}

export function SET_SCREEN_HISTORY(state, screen) {
    state.screenGain = screen.screenGain
    screen.screens.forEach((screen, index) => {
        state.screens[index].screenType = screen.screenType
        state.screens[index].screenGain = screen.screenGain
        state.screens[index].x = screen.x
        state.screens[index].y = screen.y
        state.screens[index].z = screen.z
        state.screens[index].rotateX = screen.rotateX
        state.screens[index].rotateY = screen.rotateY
        state.screens[index].rotateZ = screen.rotateZ
        state.screens[index].plane.aspectRatio = screen.plane.aspectRatio
        state.screens[index].plane.diagonal = screen.plane.diagonal
        state.screens[index].plane.width = screen.plane.width
        state.screens[index].plane.height = screen.plane.height
        state.screens[index].curved.aspectRatio = screen.curved.aspectRatio
        state.screens[index].curved.diagonal = screen.curved.diagonal
        state.screens[index].curved.width = screen.curved.width
        state.screens[index].curved.height = screen.curved.height
        state.screens[index].curved.radius = screen.curved.radius
        state.screens[index].curved.radialSegments = screen.curved.radialSegments
        state.screens[index].curved.isSmooth = screen.curved.isSmooth
        state.screens[index].sphere.radius = screen.sphere.radius
        state.screens[index].sphere.phiStart = screen.sphere.phiStart
        state.screens[index].sphere.phiLength = screen.sphere.phiLength
        state.screens[index].sphere.thetaStart = screen.sphere.thetaStart
        state.screens[index].sphere.thetaEnd = screen.sphere.thetaEnd
    })
}
