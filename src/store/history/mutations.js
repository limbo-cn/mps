export function ADD_ITEM(state, item) {
    state.historys.unshift(item)
}

export function DELETE_ITEM(state, uId) {
    const index = state.historys.findIndex(o => o.uId === uId)
    if (index >= 0) {
        state.historys.splice(index, 1)
    }
}

export function UPDATE_ITEM(state, { oldUid, newItem }) {
    const index = state.historys.findIndex(o => o.uId === oldUid)
    if (index >= 0) {
        state.historys.splice(index, 1, newItem)
    }
}
