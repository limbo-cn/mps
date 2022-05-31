import store from '../store'
import ThreeBase from './ThreeBase.js'
import { DoubleSide, MeshBasicMaterial, Quaternion, Vector3 } from 'three'
import { screenType } from 'src/helper/enum'

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
        this._screens[store.state.screen.screenPosition].screenType = type
        this._initScreen(this._screens[store.state.screen.screenPosition])

        this._screens[store.state.screen.screenPosition].screenObject.object.updateMatrixWorld()

        this._createAllBoundLine()
    }

    setScreens(screens) {
        screens.forEach((screen, index) => {
            this._screens[index].screenType = screen.screenType

            this._screens[index].screenObject.geometry && this._screens[index].screenObject.geometry.dispose()
            this._screens[index].screenObject.object && this._scene.remove(this._screens[index].screenObject.object)

            this._screens[index].screenType === screenType.plane && this._createPlaneScreen(this._screens[index])
            this._screens[index].screenType === screenType.curved && this._createCurveScreen(this._screens[index])
            this._screens[index].screenType === screenType.sphere && this._createSphereScreen(this._screens[index])
            this._screens[index].screenType === screenType.custom && this._createCustomScreen(this._screens[index])

            if (this._screens[index].screenObject.object) {
                this._screens[index].screenObject.object.position.x = screen.x * this._roomSize.ratio
                this._screens[index].screenObject.object.position.y = screen.y * this._roomSize.ratio
                this._screens[index].screenObject.object.position.z = screen.z * this._roomSize.ratio
                this._screens[index].screenObject.object.rotation.x = screen.rotateX / 180 * Math.PI
                this._screens[index].screenObject.object.rotation.y = screen.rotateY / 180 * Math.PI
                this._screens[index].screenObject.object.rotation.z = screen.rotateZ / 180 * Math.PI
            }
        })

        this._createAllBoundLine()
    }

    setRoomSize() {
        this._initRoom()
        this._initLight()
    }

    setScreenPosition() {
        const screenState = store.state.screen.screens[store.state.screen.screenPosition]

        this._screens[store.state.screen.screenPosition].screenObject.object.position.x = screenState.x * this._roomSize.ratio
        this._screens[store.state.screen.screenPosition].screenObject.object.position.y = screenState.y * this._roomSize.ratio
        this._screens[store.state.screen.screenPosition].screenObject.object.position.z = screenState.z * this._roomSize.ratio
        this._screens[store.state.screen.screenPosition].screenObject.object.rotation.x = screenState.rotateX / 180 * Math.PI
        this._screens[store.state.screen.screenPosition].screenObject.object.rotation.y = screenState.rotateY / 180 * Math.PI
        this._screens[store.state.screen.screenPosition].screenObject.object.rotation.z = screenState.rotateZ / 180 * Math.PI

        this._screens[store.state.screen.screenPosition].screenObject.object.updateMatrixWorld()

        this._createAllBoundLine()
    }

    addProjector(uId) {
        store.commit('common/SET_IS_LOADING_MODEL', true)
        this._addProjector(uId).then(projector => {
            this._projectors.push(projector)
            store.commit('projector/SET_SELECTED_PROJECTOR_X', projector.position.x / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Y', projector.position.y / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Z', projector.position.z / this._roomSize.ratio)

            this._createAllBoundLine()
        })
        store.commit('common/SET_IS_LOADING_MODEL', false)
    }

    async addProjectorsHistory(projectors) {
        for (const projector of projectors) {
            await this._addProjector(projector.uId).then(projectorObj => {
                this._projectors.push(projectorObj)

                this.applayProjectorPosition(projectorObj, projector)

                this.applayProjectorRotation(projectorObj, projector)
            })
        }

        store.commit('projector/SET_SELECTED_PROJECTOR_UID', projectors[projectors.length - 1].uId)

        this._createAllBoundLine()
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

        this.applayProjectorPosition(projectorObject, projector)

        this.applayProjectorRotation(projectorObject, projector)

        if (this._isInterfere) {
            this._analyzeInterfere()
        }

        this._createAllBoundLine()
    }

    setProjectors(projectors) {
        projectors.forEach(projector => {
            const projectorObject = this._projectors.find(o => o.name === projector.uId)

            this.applayProjectorPosition(projectorObject, projector)

            this.applayProjectorRotation(projectorObject, projector)
        })

        this._createAllBoundLine()
    }

    applayProjectorPosition(projectorObject, projectorState) {
        projectorObject.position.x = projectorState.x * this._roomSize.ratio
        projectorObject.position.y = projectorState.y * this._roomSize.ratio
        projectorObject.position.z = projectorState.z * this._roomSize.ratio
    }

    applayProjectorRotation(projectorObject, projectorState) {
        projectorObject.rotation.x = 0
        projectorObject.rotation.y = 0
        projectorObject.rotation.z = 0

        // projectorObject.rotateX(-projectorState.rotateX / 180 * Math.PI)

        // projectorObject.rotateY(Math.PI + projectorState.rotateY / 180 * Math.PI)

        // projectorObject.rotateZ(-projectorState.rotateZ / 180 * Math.PI)
        if (projectorObject.directionCenter && projectorState.rotateZ !== 0) {
            const quaternions = new Quaternion()
            quaternions.setFromUnitVectors(new Vector3(0, 0, 1), projectorObject.directionCenter.normalize())

            projectorObject.setRotationFromQuaternion(quaternions)
        } else {
            const axisX = new Vector3(1, 0, 0)
            const axisY = new Vector3(0, 1, 0)
            const axisZ = new Vector3(0, 0, 1)

            axisX.applyAxisAngle(axisY, Math.PI + projectorState.rotateY / 180 * Math.PI)

            axisZ.applyAxisAngle(axisY, Math.PI + projectorState.rotateY / 180 * Math.PI)

            projectorObject.rotateOnAxis(axisX, projectorState.rotateX / 180 * Math.PI)
            projectorObject.rotateOnAxis(axisY, Math.PI + projectorState.rotateY / 180 * Math.PI)
            projectorObject.rotateOnAxis(axisZ, projectorState.rotateZ / 180 * Math.PI)
        }
    }

    deleteProjector(uId) {
        const index = this._projectors.findIndex(o => o.name === uId)
        const projectorObject = this._projectors[index]

        if (this._transformControl.object === projectorObject) {
            this._transformControl.detach()
        }

        this._disposeBoundLine(uId)
        this._disposeDistanceHelperObject(projectorObject)
        this._disposeDistanceHelperLabel(projectorObject)
        this._disposeProjectionSizeLabel(projectorObject)

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
                this._screens[store.state.screen.screenPosition].screenObject.material = new MeshBasicMaterial({
                    map: texture,
                    side: DoubleSide,
                    transparent: true,
                    opacity: 0.8
                })
                this._initScreen(this._screens[store.state.screen.screenPosition])
            })
        } else {
            this._screens[store.state.screen.screenPosition].screenObject.material = new MeshBasicMaterial({
                map: this._textures[patternSrc],
                side: DoubleSide,
                transparent: true,
                opacity: 0.8
            })
            this._initScreen(this._screens[store.state.screen.screenPosition])
        }
    }

    getDataUrl() {
        this._renderer.preserveDrawingBuffer = true
        this._render()// 这里只渲染一帧，否则会影响性能
        const dataUrl = this._renderer.domElement.toDataURL('image/jpeg')
        this._renderer.preserveDrawingBuffer = false
        return dataUrl
    }

    frontCamera() {
        this._camera.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw / 2, this._roomSize.depthDraw * 1.6)
        this._camera.lookAt(this._roomSize.widthDraw / 2, this._roomSize.heightDraw / 2, 0)
        this._controls.target.copy(new Vector3(this._roomSize.widthDraw / 2, this._roomSize.heightDraw / 2, 0))
    }

    sideCamera() {
        this._camera.position.set(this._roomSize.widthDraw * 2.5, this._roomSize.heightDraw / 2, this._roomSize.depthDraw / 2)
        this._camera.lookAt(0, this._roomSize.heightDraw / 2, this._roomSize.depthDraw / 2)
        this._controls.target.copy(new Vector3(0, this._roomSize.heightDraw / 2, this._roomSize.depthDraw / 2))
    }

    topCamera() {
        this._camera.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw * 4, this._roomSize.depthDraw / 2)
        this._camera.lookAt(this._roomSize.widthDraw / 2, 0, this._roomSize.depthDraw / 2)
        this._controls.target.copy(new Vector3(this._roomSize.widthDraw / 2, 0, this._roomSize.depthDraw / 2))
    }

    undo() {
        const projectorObject = this._transformControl.object
        if (projectorObject.historyIndex > 0) {
            const point = projectorObject.historyPoints[projectorObject.historyIndex - 1]

            store.commit('projector/SET_SELECTED_PROJECTOR_X', point.x / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Y', point.y / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Z', point.z / this._roomSize.ratio)

            projectorObject.position.x = point.x
            projectorObject.position.y = point.y
            projectorObject.position.z = point.z

            if (this._isInterfere) {
                this._analyzeInterfere()
            }

            this._createBoundLine(this._transformControl.object.name)

            projectorObject.historyIndex--

            if (projectorObject) {
                this._analyzeUndoRedo(projectorObject)
            }
        }
    }

    redo() {
        const projectorObject = this._transformControl.object
        if (projectorObject.historyPoints?.length - 1 > projectorObject.historyIndex) {
            const point = projectorObject.historyPoints[projectorObject.historyIndex + 1]

            store.commit('projector/SET_SELECTED_PROJECTOR_X', point.x / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Y', point.y / this._roomSize.ratio)
            store.commit('projector/SET_SELECTED_PROJECTOR_Z', point.z / this._roomSize.ratio)

            projectorObject.position.x = point.x
            projectorObject.position.y = point.y
            projectorObject.position.z = point.z

            if (this._isInterfere) {
                this._analyzeInterfere()
            }

            this._createBoundLine(this._transformControl.object.name)

            projectorObject.historyIndex++

            this._analyzeUndoRedo(projectorObject)
        }
    }

    changeSelectedProjector(val) {
        const projectorObject = this._projectors.find(o => o.name === val)
        if (projectorObject) {
            this._analyzeUndoRedo(projectorObject)
        } else {
            this._analyzeUndoRedo({})
        }
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

    updateShowLightBound(val) {
        this._isShowLightBound = val
        this._createAllBoundLine()
    }

    updateShowDistanceHelper(val) {
        if (val !== undefined) {
            this._isShowDistanceHelper = val
        }
        this._createAllBoundLine()
    }

    updateShowGrid(val) {
        if (val) {
            this._scene.add(this._gridHelper)
        } else {
            this._scene.remove(this._gridHelper)
        }
    }

    updateRoomBrightness(val) {
        this._light.power = 4 * Math.PI * val / 250
        this._createAllBoundLine()
    }

    setLight(val) {
        const { x, y, z } = val
        this._light.position.set(x * this._roomSize.ratio, y * this._roomSize.ratio, z * this._roomSize.ratio)
    }
}
