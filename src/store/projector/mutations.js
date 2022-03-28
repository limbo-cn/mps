export function ADD_PROJECTOR(state, projector) {
    state.projectors.push(projector)
}

export function SET_PROJECTOR(state, projector) {
    const index = state.projectors.findIndex(o => o.uId === projector.uId)
    state.projectors.splice(index, 1, projector)
}

export function SET_PROJECTOR_LENS(state, projector) {
    const index = state.projectors.findIndex(o => o.uId === projector.uId)
    if (index >= 0) {
        state.projectors[index].lensName = projector.lensName
        state.projectors[index].throwRatio = projector.throwRatio
        state.projectors[index].throwRatioMin = projector.throwRatioMin
        state.projectors[index].throwRatioMax = projector.throwRatioMax
        state.projectors[index].offset = projector.offset
    }
}

export function DELETE_PROJECTOR(state, uId) {
    const index = state.projectors.findIndex(o => o.uId === uId)
    state.projectors.splice(index, 1)
}

export function SET_SELECTED_PROJECTOR_UID(state, uId) {
    state.selectedProjectorUid = uId
}

export function SET_SELECTED_PROJECTORS(state, projectors) {
    state.selectedProjectors = projectors
}

export function SET_SELECTED_PROJECTOR_TEXTURE(state, texture) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.texture = texture
}

export function SET_SELECTED_PROJECTOR_ASPECT_RATIO(state, aspectRatio) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.aspectRatio = aspectRatio
}

export function SET_SELECTED_PROJECTOR_IMAGE_ASPECT_RATIO(state, imageAspectRatio) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.imageAspectRatio = imageAspectRatio
}

export function SET_SELECTED_PROJECTOR_SHOW_BLENDING_GUIDE_LINE(state, isShowBlendingGuideLine) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.isShowBlendingGuideLine = isShowBlendingGuideLine
}

export function SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_L(state, blendingGuideLineL) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.blendingGuideLineL = blendingGuideLineL
}

export function SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_R(state, blendingGuideLineR) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.blendingGuideLineR = blendingGuideLineR
}

export function SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_T(state, blendingGuideLineT) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.blendingGuideLineT = blendingGuideLineT
}

export function SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_B(state, blendingGuideLineB) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.blendingGuideLineB = blendingGuideLineB
}

export function SET_SELECTED_PROJECTOR_X(state, x) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.x = x
}

export function SET_PROJECTORS_X(state, { projectors, value }) {
    projectors.forEach(projector => {
        projector.x = value
    })
}

export function SET_SELECTED_PROJECTOR_Y(state, y) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.y = y
}

export function SET_PROJECTORS_Y(state, { projectors, value }) {
    projectors.forEach(projector => {
        projector.y = value
    })
}

export function SET_SELECTED_PROJECTOR_Z(state, z) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.z = z
}

export function SET_PROJECTORS_Z(state, { projectors, value }) {
    projectors.forEach(projector => {
        projector.z = value
    })
}

export function SET_SELECTED_PROJECTOR_PROJECTION_DISTANCE(state, projectionDistance) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.projectionDistance = projectionDistance
}

export function SET_SELECTED_PROJECTOR_BRIGHTNESS_NIT(state, brightnessOnScreenNit) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.brightnessOnScreenNit = brightnessOnScreenNit
}

export function SET_SELECTED_PROJECTOR_AMBITENT_CONTRAST(state, ambientContrast) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.ambientContrast = ambientContrast
}

export function SET_SELECTED_PROJECTOR_ROTATE_X(state, rotateX) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.rotateX = rotateX
}

export function SET_SELECTED_PROJECTOR_ROTATE_Y(state, rotateY) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.rotateY = rotateY
}

export function SET_SELECTED_PROJECTOR_ROTATE_Z(state, rotateZ) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.rotateZ = rotateZ
}

export function SET_SELECTED_PROJECTOR_LENS_SHIFT_H(state, lensShiftH) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.lensShiftH = lensShiftH
}

export function SET_SELECTED_PROJECTOR_LENS_SHIFT_V(state, lensShiftV) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.lensShiftV = lensShiftV
}

export function SET_SELECTED_PROJECTOR_THROW_RATIO(state, throwRatio) {
    const projector = state.projectors.find(o => o.uId === state.selectedProjectorUid)
    if (!projector) {
        return
    }
    projector.throwRatio = throwRatio
}

export function SET_PROJECTOR_HISTORY(state, projector) {
    state.projectors = projector.projectors
    state.selectedProjectorUid = projector.selectedProjectorUid
}
