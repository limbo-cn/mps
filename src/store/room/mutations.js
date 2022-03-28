export function SET_WIDTH(state, width) {
    state.width = width
}
export function SET_HEIGHT(state, height) {
    state.height = height
}
export function SET_DEPTH(state, depth) {
    state.depth = depth
}
export function SET_BRIGHTNESS(state, brightness) {
    state.brightness = brightness
}
export function SET_ROOM_HISTORY(state, room) {
    state.width = room.width
    state.height = room.height
    state.depth = room.depth
    state.brightness = room.brightness
}
