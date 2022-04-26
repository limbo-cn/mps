import { Notify } from 'quasar'
import store from '../store'

export function showConfirm(message, confirmButtonLabel, cancelButtonLabel, comfirmFunc) {
    Notify.create({
        message: message,
        color: 'primary',
        position: 'top',
        actions: [
            {
                label: confirmButtonLabel,
                color: 'yellow',
                handler: () => {
                    comfirmFunc()
                }
            },
            { label: cancelButtonLabel, color: 'white', handler: () => { } }
        ]
    })
}

export function showAlert(message, confirmButtonLabel) {
    Notify.create({
        message: message,
        color: 'negative',
        position: 'top',
        actions: [
            { label: confirmButtonLabel, color: 'yellow', handler: () => { } }
        ]
    })
}

export const downloadFile = (fileName, content) => {
    const aLink = document.createElement('a')
    const blob = base64ToBlob(content)

    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true)
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)

    aLink.click()

    aLink.remove()
}

const base64ToBlob = code => {
    const parts = code.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length

    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
}

export const CalcAmbientContrast = uId => {
    const selectedProjector = store.state.projector.projectors.find(o => o.uId === uId)
    if (!selectedProjector) {
        return 1
    }
    const screenWidth = selectedProjector.projectionDistance / selectedProjector.throwRatio
    const screenHeight = screenWidth / selectedProjector.aspectRatio
    const screenArea = screenWidth * screenHeight
    const luminous = store.state.projector.projectorModels.vvkProjectorModels.find(model => model.ModelName === selectedProjector.modelName).Brightness.value
    const brightnessOnScreenLx = luminous / screenArea
    const contrast = (brightnessOnScreenLx + store.state.room.brightness) / store.state.room.brightness
    return contrast.toFixed(2)
}

export const CalcBrightnessOnScreenNit = uId => {
    const selectedProjector = store.state.projector.projectors.find(o => o.uId === uId)
    if (!selectedProjector) {
        return 1
    }
    const screenWidth = selectedProjector.projectionDistance / selectedProjector.throwRatio
    const screenHeight = screenWidth / selectedProjector.aspectRatio
    const screenArea = screenWidth * screenHeight
    const luminous = store.state.projector.projectorModels.vvkProjectorModels.find(model => model.ModelName === selectedProjector.modelName).Brightness.value
    const brightnessOnScreenLx = luminous / screenArea
    const brightnessOnScreenNit = brightnessOnScreenLx * store.state.screen.screenGain / Math.PI
    return brightnessOnScreenNit.toFixed(1)
}

export const filterLensShift = o => {
    return !!o['Lens Shift']
}

export const filterOptionalLens = o => {
    return !!o['Optional Lens']
}

export const filterThrowDistance = (o, input) => {
    const throwDistance = input / store.state.common.unitRatio
    if (!o.Distance) {
        for (let i = 0; i < o['Optional Lens'].length; i++) {
            const lens = store.state.projector.projectorLens.vvkOptionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
            if (!lens) {
                continue
            } else if (lens.Distance.max >= throwDistance && lens.Distance.min <= throwDistance) {
                return true
            }
            continue
        }
        return false
    }
    return o.Distance.min <= throwDistance && o.Distance.max >= throwDistance
}

export const filterModelName = (o, input) => {
    return o.ModelName.toLowerCase().includes(input.toLowerCase())
}

export const filterBrightness = (o, input) => {
    const [min, max] = input.split('-')
    return o.Brightness.value >= +min && o.Brightness.value <= +max
}

export const filterResolution = (o, input) => {
    return o.Resolution.Desc === input
}

export const filterAspectRatio = (o, input) => {
    return o.AspectRatio === input
}

export const filterThrowRatio = (o, input) => {
    const [min, max] = input.split('-')
    if (!o['Throw Ratio']) {
        for (let i = 0; i < o['Optional Lens'].length; i++) {
            const lens = store.state.projector.projectorLens.vvkOptionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
            if (!lens) {
                continue
            } else if ((lens['Throw Ratio'].min >= +min && lens['Throw Ratio'].min <= +max) || (lens['Throw Ratio'].max >= +min && lens['Throw Ratio'].max <= +max)) {
                return true
            }
            continue
        }
        return false
    }
    return (o['Throw Ratio'].min >= +min && o['Throw Ratio'].min <= +max) || (o['Throw Ratio'].max >= +min && o['Throw Ratio'].max <= +max)
}

export const filterWeight = (o, input) => {
    const [min, max] = input.split('-')
    const weight = o.Weight.unit === 'kg' ? o.Weight.value : o.Weight.value / 1000
    return weight >= +min && weight <= +max
}
