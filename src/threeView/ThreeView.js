import store from '../store'
import ThreeBase from './ThreeBase.js'
import { DoubleSide, MeshBasicMaterial } from 'three'

export default class ThreeView extends ThreeBase {
    constructor(domSelector) {
        super()

        this._init(domSelector)
    }

    _init(domSelector) {
        this._initRenderer(domSelector)
        this._initScene()
        this._initControls()
        this._initTransformControl()
        this._initTexture().then(() => {
            this._initRoom()
            this._initScreen()
        })
        this.setTheme()
    }

    setScreen(type) {
        this._screenType = type
        this._initScreen()

        this._screen.object.updateMatrixWorld()

        this._createAllBoundLine()
    }

    setRoomSize() {
        this._initRoom()
        this._initLight()
    }

    setScreenPosition() {
        this._screen.object.position.x = store.state.screen.x * this._roomSize.ratio
        this._screen.object.position.y = store.state.screen.y * this._roomSize.ratio
        this._screen.object.position.z = store.state.screen.z * this._roomSize.ratio
        this._screen.object.rotation.x = store.state.screen.rotateX / 180 * Math.PI
        this._screen.object.rotation.y = store.state.screen.rotateY / 180 * Math.PI
        this._screen.object.rotation.z = store.state.screen.rotateZ / 180 * Math.PI

        this._screen.object.updateMatrixWorld()

        this._createAllBoundLine()
    }

    addProjector(uId) {
        this._addProjecotr(uId).then(projector => {
            this._projectors.push(projector)
            store.commit('projector/SET_SELECTED_PROJECTOR_X', projector.position.x / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Y', projector.position.y / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Z', projector.position.z / this._roomSize.ratio)

            this._createAllBoundLine()
        })
    }

    editProjector(uId) {
        const projector = this._projectors.find(o => o.name === uId)
        if (projector) {
            document.getElementById(uId).textContent = store.state.projector.projectors.find(o => o.uId === uId).customName
            this._createAllBoundLine()
        }
    }

    setProjector(projector) {
        this._setTransformControl(projector.uId)

        const projectorObject = this._projectors.find(o => o.name === projector.uId)
        projectorObject.position.x = projector.x * this._roomSize.ratio
        projectorObject.position.y = projector.y * this._roomSize.ratio
        projectorObject.position.z = projector.z * this._roomSize.ratio
        projectorObject.rotation.x = projector.rotateX / 180 * Math.PI
        projectorObject.rotation.y = Math.PI + projector.rotateY / 180 * Math.PI
        projectorObject.rotation.z = projector.rotateZ / 180 * Math.PI

        this._createAllBoundLine()
    }

    setProjectors(projectors) {
        projectors.forEach(projector => {
            const projectorObject = this._projectors.find(o => o.name === projector.uId)
            projectorObject.position.x = projector.x * this._roomSize.ratio
            projectorObject.position.y = projector.y * this._roomSize.ratio
            projectorObject.position.z = projector.z * this._roomSize.ratio
            projectorObject.rotation.x = projector.rotateX / 180 * Math.PI
            projectorObject.rotation.y = Math.PI + projector.rotateY / 180 * Math.PI
            projectorObject.rotation.z = projector.rotateZ / 180 * Math.PI
        })

        this._createAllBoundLine()
    }

    deleteProjector(uId) {
        const index = this._projectors.findIndex(o => o.name === uId)
        const projectorObject = this._projectors[index]

        if (this._transformControl.object === projectorObject) {
            this._transformControl.detach()
        }

        this._disposeBoundLine(uId)

        document.getElementById(uId).remove()

        this._projectors.splice(index, 1)
        this._scene.remove(projectorObject)
    }

    setProjectorTexture({ patternSrc, isVideo }) {
        store.commit('projector/SET_SELECTED_PROJECTOR_TEXTURE', patternSrc)
        if (!this._textures[patternSrc] && !!patternSrc) {
            this._loadTexture(patternSrc, isVideo).then(texture => {
                this._textures[patternSrc] = texture
                this._createAllBoundLine()
            })
        } else {
            this._createAllBoundLine()
        }
    }

    setScreenTexture({ patternSrc, isVideo }) {
        if (!this._textures[patternSrc] && !!patternSrc) {
            this._loadTexture(patternSrc, isVideo).then(texture => {
                this._textures[patternSrc] = texture
                this._screen.material = new MeshBasicMaterial({
                    map: texture,
                    side: DoubleSide,
                    transparent: true,
                    opacity: 0.8
                })
                this._initScreen()
            })
        } else {
            this._screen.material = new MeshBasicMaterial({
                map: this._textures[patternSrc],
                side: DoubleSide,
                transparent: true,
                opacity: 0.8
            })
            this._initScreen()
        }
    }

    getDataUrl() {
        this._renderer.preserveDrawingBuffer = true
        this._render()// 这里只渲染一帧，否则会影响性能
        const dataUrl = this._renderer.domElement.toDataURL('image/jpeg')
        this._renderer.preserveDrawingBuffer = false
        return dataUrl
    }

    changeCamera() {
        this._controls.saveState()

        this._camera.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw / 2, this._roomSize.depthDraw)
        this._camera.lookAt(this._roomSize.widthDraw / 2, this._roomSize.heightDraw / 2, 0)
    }

    resetCamera() {
        this._controls.reset()
    }

    updateShowRefrence(val) {
        if (val) {
            this._scene.add(this._axesX)
            this._scene.add(this._axesY)
            this._scene.add(this._axesZ)
            const labels = document.getElementsByClassName('axex-refer')
            for (let i = 0; i < labels.length; ++i) {
                labels[i].style.visibility = ''
            }
        } else {
            this._scene.remove(this._axesX)
            this._scene.remove(this._axesY)
            this._scene.remove(this._axesZ)
            const labels = document.getElementsByClassName('axex-refer')
            for (let i = 0; i < labels.length; ++i) {
                labels[i].style.visibility = 'hidden'
            }
        }
    }

    updateShowProjectorInterfere(val) {
        this._isInterfere = val
        this._createAllBoundLine()
        this._analyzeInterfere()
    }

    updateShowProjectionDistanceRefrence(val) {
        this._isShowDistanceRefrence = val
        this._createAllBoundLine()
    }

    setLight(val) {
        const { x, y, z } = val
        this._light.position.set(x * this._roomSize.ratio, y * this._roomSize.ratio, z * this._roomSize.ratio)
    }
}
