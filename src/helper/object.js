export class Projector {
    constructor() {
        this.uId = ''
        this.customName = ''

        this.modelName = ''
        this.lensName = ''
        this.aspectRatio = 0
        this.imageAspectRatio = 0
        this.offset = 0

        this.texture = ''

        this.throwRatio = 0
        this.throwRatioMin = 0
        this.throwRatioMax = 0

        this.x = 0
        this.y = 0
        this.z = 0

        this.projectionDistance = 0
        this.ambientContrast = 1
        this.brightnessOnScreenNit = 1

        this.rotateX = 0
        this.rotateY = 0
        this.rotateZ = 0

        this.lensShiftH = 0
        this.lensShiftHMin = 0
        this.lensShiftHMax = 0
        this.lensShiftV = 0
        this.lensShiftVMin = 0
        this.lensShiftVMax = 0

        this.isShowBlendingGuideLine = false
        this.blendingGuideLineL = 0
        this.blendingGuideLineR = 0
        this.blendingGuideLineT = 0
        this.blendingGuideLineB = 0

        this.resolutionX = 0
        this.resolutionY = 0

        this.minDistance = 0
        this.maxDistance = 0
    }
}
