export function selectedProjector(state) {
    const index = state.projectors.findIndex(o => o.uId === state.selectedProjectorUid)
    return state.projectors[index]
}
