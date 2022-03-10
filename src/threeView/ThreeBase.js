import store from '../store'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import {
    WebGLRenderer, PerspectiveCamera, Scene, PointLight, DoubleSide,
    FrontSide, PlaneGeometry, Mesh, SphereGeometry, CylinderGeometry,
    Color, TextureLoader, MeshLambertMaterial, MeshBasicMaterial,
    Vector2, Raycaster, Vector3, BufferGeometry, BufferAttribute,
    VideoTexture, Cache, ArrowHelper, PointLightHelper, NormalBlending
} from 'three'
import { MeshLine, MeshLineMaterial } from 'meshline'
import { Dark } from 'quasar'
import { screenType, unitRatio } from 'src/helper/enum'
import { CalcAmbientContrast, CalcBrightnessOnScreenNit } from 'src/helper/util'

export default class ThreeBase {
    constructor() {
        this._renderer = null
        this._labelRenderer = null
        this._dom = null
        this._camera = null
        this._scene = null
        this._light = null

        this._axesX = null
        this._axesY = null
        this._axesZ = null

        this._raycaster = new Raycaster()
        this._mouse = new Vector2()
        this._hotProjectorUid = ''
        this._currentHitPoint = new Vector3(0, 0, 0)
        this._currentHitDirection = new Vector3(0, 0, 0)

        this._isInterfere = false
        this._isShowDistanceRefrence = false

        this._projectors = []

        this._textures = {}

        this._texture = { wall: null, floor: null }
        this._room = {
            material: { front: null, back: null, left: null, right: null, top: null, bottom: null },
            geometrys: { front: null, back: null, left: null, right: null, top: null, bottom: null },
            objects: { front: null, back: null, left: null, right: null, top: null, bottom: null }
        }
        this._roomSize = {
            width: 0,
            height: 0,
            depth: 0,
            widthDraw: 0,
            heightDraw: 0,
            depthDraw: 0,
            ratio: 10
        }

        this._screenType = screenType.plane
        this._screen = {
            material: null,
            geometry: null,
            object: null
        }
        this._planeScreen = {
            diagonal: 0,
            aspectRatio: 0
        }
        this._curvedScreen = {
            diagonal: 0,
            aspectRatio: 0,
            radius: 0,
            radialSegments: 3,
            isSmooth: true
        }
        this._sphereScreen = {
            radius: 0,
            phiStart: 0,
            phiLength: 100
        }
        this._customScreen = {
            geometry: '',
            material: ''
        }

        this._controls = null
    }

    _initRenderer(domSelector) {
        Cache.enabled = true

        this._dom = document.querySelector(domSelector)
        const wrapperRect = this._dom.getBoundingClientRect()

        this._renderer = new WebGLRenderer({
            antialias: true
        })
        this._dom.appendChild(this._renderer.domElement)
        this._renderer.setSize(wrapperRect.width, wrapperRect.height + 20)

        this._labelRenderer = new CSS2DRenderer()
        this._dom.appendChild(this._labelRenderer.domElement)
        this._labelRenderer.setSize(wrapperRect.width, wrapperRect.height + 20)
        this._labelRenderer.domElement.style.position = 'absolute'
        this._labelRenderer.domElement.style.top = '0px'

        this._initCamera(wrapperRect)

        this._dom.addEventListener('mousemove', (event) => { this._onMouseMove(event) }, false)
        this._dom.addEventListener('mousedown', () => { this._onMouseDown() }, false)
    }

    onWindowResize() {
        const wrapperRect = this._dom.getBoundingClientRect()

        this._camera.aspect = wrapperRect.width / wrapperRect.height
        this._camera.updateProjectionMatrix()

        this._renderer.setSize(wrapperRect.width, wrapperRect.height)
        this._labelRenderer.setSize(wrapperRect.width, wrapperRect.height)
    }

    _onMouseMove(event) {
        const wrapperRect = this._dom.getBoundingClientRect()

        this._mouse.x = (event.offsetX / wrapperRect.width) * 2 - 1
        this._mouse.y = -(event.offsetY / wrapperRect.height) * 2 + 1
    }

    _onMouseDown() {
        if (!this._hotProjectorUid) {
            return
        }
        store.commit('projector/SET_SELECTED_PROJECTOR_UID', this._hotProjectorUid)
        this._setTransformControl(this._hotProjectorUid)

        this._createAllBoundLine()
    }

    _setTransformControl(uId) {
        const projector = this._projectors.find(o => o.name === uId)
        if (this._transformControl.object !== projector) {
            this._transformControl.attach(projector)
        }
    }

    _initCamera(wrapperRect) {
        this._camera = new PerspectiveCamera(40, wrapperRect.width / wrapperRect.height, 0.1, 1000)
    }

    _initScene() {
        this._scene = new Scene()

        this._initRoomSize()
        this._initAxes()
        this._initLight()
        this.setTheme()
    }

    _initAxes() {
        const origin = new Vector3(0.1, 0.1, 0.1)
        const dirX = new Vector3(1, 0, 0)
        const dirY = new Vector3(0, 1, 0)
        const dirZ = new Vector3(0, 0, 1)

        const colorX = 0xff0000
        const colorY = 0x00ff00
        const colorZ = 0x0000ff

        const length = 15

        this._axesX = new ArrowHelper(dirX, origin, length, colorX)
        this._axesY = new ArrowHelper(dirY, origin, length, colorY)
        this._axesZ = new ArrowHelper(dirZ, origin, length, colorZ)

        this._scene.add(this._axesX)
        this._scene.add(this._axesY)
        this._scene.add(this._axesZ)

        // const labelDivOrigin = document.createElement('div')
        // labelDivOrigin.className = 'mps-three-label axex-refer'
        // labelDivOrigin.textContent = '(0,0,0)'
        // labelDivOrigin.style = 'background-color:transparent;color:#aaa;font-weight:bold'
        // const labelOrigin = new CSS2DObject(labelDivOrigin)
        // labelOrigin.position.set(0, -3, 0)
        // this._scene.add(labelOrigin)

        const labelDivX = document.createElement('div')
        labelDivX.className = 'mps-three-label axex-refer'
        labelDivX.textContent = 'X'
        labelDivX.style = 'background-color:transparent;color:red;font-weight:bold'
        const labelX = new CSS2DObject(labelDivX)
        labelX.position.set(15, 0, 0)
        this._scene.add(labelX)

        const labelDivY = document.createElement('div')
        labelDivY.className = 'mps-three-label axex-refer'
        labelDivY.style = 'background-color:transparent;color:green;font-weight:bold'
        labelDivY.textContent = 'Y'
        const labelY = new CSS2DObject(labelDivY)
        labelY.position.set(0, 15, 0)
        this._scene.add(labelY)

        const labelDivZ = document.createElement('div')
        labelDivZ.className = 'mps-three-label axex-refer'
        labelDivZ.style = 'background-color:transparent;color:blue;font-weight:bold'
        labelDivZ.textContent = 'Z'
        const labelZ = new CSS2DObject(labelDivZ)
        labelZ.position.set(0, 0, 15)
        this._scene.add(labelZ)
    }

    _initLight() {
        if (this._light) {
            this._light.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw, this._roomSize.depthDraw / 2)
            return
        }
        this._light = new PointLight(0xffffff, 1.2, 0, 2)
        this._light.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw, this._roomSize.depthDraw / 2)
        this._scene.add(this._light)

        const sphereSize = 1
        const pointLightHelper = new PointLightHelper(this._light, sphereSize)
        this._scene.add(pointLightHelper)
    }

    _initControls() {
        this._controls = new OrbitControls(this._camera, this._labelRenderer.domElement)

        this._camera.position.set(93.00186725385036, 47.36734865791704, 227.17171251812294)
        this._camera.lookAt(0, 0, 0)

        this._controls.addEventListener('change', () => {
        })
    }

    _initTransformControl() {
        this._transformControl = new TransformControls(this._camera, this._labelRenderer.domElement)
        this._transformControl.size = 0.5
        this._transformControl.addEventListener('dragging-changed', event => {
            this._controls.enabled = !event.value
        })
        let throttleCount = 0
        this._transformControl.addEventListener('change', event => {
            throttleCount++
            if (throttleCount % 2 === 0 && this._transformControl.object) {
                store.commit('projector/SET_SELECTED_PROJECTOR_X', this._transformControl.object.position.x / this._roomSize.ratio)
                store.commit('projector/SET_SELECTED_PROJECTOR_Y', this._transformControl.object.position.y / this._roomSize.ratio)
                store.commit('projector/SET_SELECTED_PROJECTOR_Z', this._transformControl.object.position.z / this._roomSize.ratio)

                if (this._isInterfere) {
                    this._analyzeInterfere()
                }

                this._createBoundLine(this._transformControl.object.name)
            }
        })

        this._scene.add(this._transformControl)
    }

    _render() {
        this._raycaster.setFromCamera(this._mouse, this._camera)

        this._hotProjectorUid = null
        this._projectors.forEach(projector => {
            const intersects = this._raycaster.intersectObjects(projector.children)
            if (intersects.length > 0) {
                projector.children.forEach(mesh => {
                    if (mesh.material) {
                        mesh.material.emissive.setHex(0x0000ff)
                        this._hotProjectorUid = projector.name
                    }
                })
            } else {
                projector.children.forEach(mesh => {
                    if (mesh.material) {
                        if ((projector.isProjectorInterfere || projector.isProjectionInterfere) && this._isInterfere) {
                            mesh.material.emissive.setHex(0xff0000)
                        } else {
                            mesh.material.emissive.setHex(0x000000)
                        }
                    }
                })
            }
        })

        this._renderer.render(this._scene, this._camera)
        this._labelRenderer.render(this._scene, this._camera)
    }

    setTheme() {
        this._scene.background = Dark.isActive ? new Color(0xc9c7b9) : new Color(0xf7ffef)
    }

    animate() {
        requestAnimationFrame(() => { this.animate() })
        this._render()
    }

    _initTexture() {
        const textureLoader = new TextureLoader()
        const wallLoader = new Promise((resolve, reject) => {
            textureLoader.load('texture/wall_grey.jfif', texture => {
                const wallMaterial = new MeshLambertMaterial({
                    map: texture,
                    side: FrontSide,
                    emissive: 0xfefefe,
                    emissiveIntensity: 0.2
                })
                this._room.material.front = wallMaterial
                this._room.material.back = wallMaterial
                this._room.material.left = wallMaterial
                this._room.material.right = wallMaterial
                this._room.material.top = wallMaterial
                resolve(texture)
            }, null, error => {
                reject(error)
            })
        })

        const floorLoader = new Promise((resolve, reject) => {
            textureLoader.load('texture/floor_grey.jfif', texture => {
                const wallMaterial = new MeshLambertMaterial({
                    map: texture,
                    side: FrontSide,
                    emissive: 0xfefefe,
                    emissiveIntensity: 0.2
                })
                this._room.material.bottom = wallMaterial
                resolve(texture)
            }, null, error => {
                reject(error)
            })
        })

        const screenLoader = new Promise((resolve, reject) => {
            textureLoader.load('texture/screen.jfif', texture => {
                const screenMaterial = new MeshBasicMaterial({
                    map: texture,
                    side: DoubleSide,
                    transparent: true,
                    opacity: 0.8
                })
                this._screen.material = screenMaterial
                resolve(texture)
            }, null, error => {
                reject(error)
            })
        })

        return Promise.all([wallLoader, floorLoader, screenLoader])
    }

    _loadTexture(patternSrc, isVideo) {
        const textureLoader = new TextureLoader()
        return new Promise((resolve, reject) => {
            if (isVideo) {
                const videoDom = document.createElement('video')
                videoDom.src = patternSrc
                videoDom.style.width = '0px'
                videoDom.autoplay = true
                videoDom.muted = true
                videoDom.loop = true
                videoDom.controls = true
                const parent = document.getElementById('textureVideo')
                parent.appendChild(videoDom)
                const texture = new VideoTexture(videoDom)
                resolve(texture)
            } else {
                textureLoader.load(patternSrc, texture => {
                    resolve(texture)
                }, null, error => {
                    reject(error)
                })
            }
        })
    }

    _initRoomSize() {
        this._roomSize.width = store.state.room.width
        this._roomSize.height = store.state.room.height
        this._roomSize.depth = store.state.room.depth
        this._roomSize.widthDraw = this._roomSize.width * this._roomSize.ratio
        this._roomSize.heightDraw = this._roomSize.height * this._roomSize.ratio
        this._roomSize.depthDraw = this._roomSize.depth * this._roomSize.ratio
    }

    _initRoom() {
        if (this._room) {
            Object.values(this._room.geometrys).forEach(geometry => {
                geometry && geometry.dispose()
            })
            Object.values(this._room.objects).forEach(object => {
                object && this._scene.remove(object)
            })
        }

        this._initRoomSize()

        // front
        this._room.geometrys.front = new PlaneGeometry(this._roomSize.widthDraw, this._roomSize.heightDraw)
        this._room.objects.front = new Mesh(this._room.geometrys.front, this._room.material.front)
        this._room.objects.front.position.x = this._roomSize.widthDraw / 2
        this._room.objects.front.position.z = this._roomSize.depthDraw
        this._room.objects.front.position.y = this._roomSize.heightDraw / 2
        this._room.objects.front.rotateY(1 * Math.PI)
        this._scene.add(this._room.objects.front)

        // back
        this._room.geometrys.back = new PlaneGeometry(this._roomSize.widthDraw, this._roomSize.heightDraw)
        this._room.objects.back = new Mesh(this._room.geometrys.back, this._room.material.back)
        this._room.objects.back.position.x = this._roomSize.widthDraw / 2
        this._room.objects.back.position.y = this._roomSize.heightDraw / 2
        this._scene.add(this._room.objects.back)

        // top
        this._room.geometrys.top = new PlaneGeometry(this._roomSize.widthDraw, this._roomSize.depthDraw)
        this._room.objects.top = new Mesh(this._room.geometrys.top, this._room.material.top)
        this._room.objects.top.position.x = this._roomSize.widthDraw / 2
        this._room.objects.top.position.y = this._roomSize.heightDraw
        this._room.objects.top.position.z = this._roomSize.depthDraw / 2
        this._room.objects.top.rotateX(0.5 * Math.PI)
        this._scene.add(this._room.objects.top)

        // bottom
        this._room.geometrys.bottom = new PlaneGeometry(this._roomSize.widthDraw, this._roomSize.depthDraw)
        this._room.objects.bottom = new Mesh(this._room.geometrys.bottom, this._room.material.bottom)
        this._room.objects.bottom.position.x = this._roomSize.widthDraw / 2
        this._room.objects.bottom.position.z = this._roomSize.depthDraw / 2
        this._room.objects.bottom.rotateX(-0.5 * Math.PI)
        this._scene.add(this._room.objects.bottom)

        // left
        this._room.geometrys.left = new PlaneGeometry(this._roomSize.depthDraw, this._roomSize.heightDraw)
        this._room.objects.left = new Mesh(this._room.geometrys.left, this._room.material.left)
        this._room.objects.left.position.x = this._roomSize.widthDraw
        this._room.objects.left.position.y = this._roomSize.heightDraw / 2
        this._room.objects.left.position.z = this._roomSize.depthDraw / 2
        this._room.objects.left.rotateY(-0.5 * Math.PI)
        this._scene.add(this._room.objects.left)

        // right
        this._room.geometrys.right = new PlaneGeometry(this._roomSize.depthDraw, this._roomSize.heightDraw)
        this._room.objects.right = new Mesh(this._room.geometrys.right, this._room.material.right)
        this._room.objects.right.position.x = 0
        this._room.objects.right.position.y = this._roomSize.heightDraw / 2
        this._room.objects.right.position.z = this._roomSize.depthDraw / 2
        this._room.objects.right.rotateY(0.5 * Math.PI)
        this._scene.add(this._room.objects.right)
    }

    _initScreen() {
        this._screen.geometry && this._screen.geometry.dispose()
        this._screen.object && this._scene.remove(this._screen.object)

        this._screenType === screenType.plane && this._createPlaneScreen()
        this._screenType === screenType.curved && this._createCurveScreen()
        this._screenType === screenType.sphere && this._createSphereScreen()
        this._screenType === screenType.custom && this._createCustomScreen()

        this.adjustScreenPosition()
    }

    adjustScreenPosition() {
        const positionArray = this._screen.geometry.attributes.position.array
        const pointLength = this._screen.geometry.attributes.position.count
        let xMin = 0, xMax = 0, yMin = 0, yMax = 0, zMax = 0, zMin = 0
        for (let i = 0; i < pointLength; i++) {
            const [x, y, z] = [positionArray[i * 3], positionArray[i * 3 + 1], positionArray[i * 3 + 2]]
            x < xMin && (xMin = x)
            x > xMax && (xMax = x)
            y < yMin && (yMin = y)
            y > yMax && (yMax = y)
            z > zMax && (zMax = z)
            z < zMin && (zMin = z)
        }

        this._screen.object.position.x = (this._roomSize.widthDraw / 2 - xMax) - (xMin - (-this._roomSize.widthDraw / 2))
        this._screen.object.position.y = (this._roomSize.heightDraw / 2 - yMax) - (yMin - (-this._roomSize.heightDraw / 2))
        this._screen.object.position.z = (1 * this._roomSize.ratio) - zMin

        // 暂时不考虑xy
        this._screen.object.position.x = this._roomSize.widthDraw / 2
        this._screen.object.position.y = this._roomSize.heightDraw / 2
        this._screen.object.position.z = (1 * this._roomSize.ratio) - zMin

        store.commit('screen/SET_X', this._screen.object.position.x / this._roomSize.ratio)
        store.commit('screen/SET_Y', this._screen.object.position.y / this._roomSize.ratio)
        store.commit('screen/SET_Z', this._screen.object.position.z / this._roomSize.ratio)
        store.commit('screen/SET_ROTATE_X', this._screen.object.rotation.x / Math.PI * 180)
        store.commit('screen/SET_ROTATE_Y', this._screen.object.rotation.y / Math.PI * 180)
        store.commit('screen/SET_ROTATE_Z', this._screen.object.rotation.z / Math.PI * 180)

        this._screen.object.updateMatrixWorld()
        this._createAllBoundLine()
    }

    _createPlaneScreen() {
        this._planeScreen.diagonal = store.state.screen.plane.diagonal
        this._planeScreen.aspectRatio = store.state.screen.plane.aspectRatio
        if (this._planeScreen.aspectRatio === 0) { // custom
            this._planeScreen.aspectRatio = store.state.screen.plane.width / store.state.screen.plane.height
        }

        const diagonalM = this._planeScreen.diagonal / unitRatio.inch
        const aspectAngle = Math.atan(this._planeScreen.aspectRatio)
        const screenWidth = diagonalM * Math.sin(aspectAngle)
        const screenHeight = screenWidth / this._planeScreen.aspectRatio

        this._screen.geometry = new PlaneGeometry(screenWidth * this._roomSize.ratio, screenHeight * this._roomSize.ratio)
        this._screen.object = new Mesh(this._screen.geometry, this._screen.material)
        this._scene.add(this._screen.object)
    }

    _createCurveScreen() {
        this._curvedScreen.diagonal = store.state.screen.curved.diagonal
        this._curvedScreen.aspectRatio = store.state.screen.curved.aspectRatio
        this._curvedScreen.radius = store.state.screen.curved.radius * this._roomSize.ratio
        this._curvedScreen.radialSegments = store.state.screen.curved.radialSegments
        this._curvedScreen.isSmooth = store.state.screen.curved.isSmooth

        if (this._curvedScreen.aspectRatio === 0) { // custom
            this._curvedScreen.aspectRatio = store.state.screen.curved.width / store.state.screen.curved.height
        }

        const diagonalM = this._curvedScreen.diagonal / unitRatio.inch
        const aspectAngle = Math.atan(this._curvedScreen.aspectRatio)
        const screenWidth = diagonalM * Math.sin(aspectAngle)
        const screenHeight = screenWidth / this._curvedScreen.aspectRatio

        const radian = screenWidth * this._roomSize.ratio / this._curvedScreen.radius // 弧长 = 弧度 * 半径

        this._screen.geometry = new CylinderGeometry(this._curvedScreen.radius, this._curvedScreen.radius,
            screenHeight * this._roomSize.ratio, this._curvedScreen.isSmooth ? 128 : this._curvedScreen.radialSegments,
            1, true, Math.PI - radian / 2, radian)
        this._screen.object = new Mesh(this._screen.geometry, this._screen.material)
        this._scene.add(this._screen.object)
    }

    _createSphereScreen() {
        this._sphereScreen.radius = store.state.screen.sphere.radius * this._roomSize.ratio
        this._sphereScreen.phiStart = Math.PI + store.state.screen.sphere.phiStart / 180 * Math.PI
        this._sphereScreen.phiLength = store.state.screen.sphere.phiLength / 180 * Math.PI
        this._sphereScreen.thetaStart = store.state.screen.sphere.thetaStart / 180 * Math.PI
        this._sphereScreen.thetaLength = (1 - store.state.screen.sphere.thetaEnd / 180 - store.state.screen.sphere.thetaStart / 180) * Math.PI

        this._screen.geometry = new SphereGeometry(this._sphereScreen.radius, 16, 16,
            this._sphereScreen.phiStart, this._sphereScreen.phiLength,
            this._sphereScreen.thetaStart, this._sphereScreen.thetaLength)
        this._screen.object = new Mesh(this._screen.geometry, this._screen.material)
        this._scene.add(this._screen.object)
    }

    _createCustomScreen() {
        const geometrySrc = store.state.screen.custom.geometrySrc
        const materialSrc = store.state.screen.custom.materialSrc
        if (geometrySrc === '') {
            this._screen.object = new Mesh()
            return
        }
        const mtlLoader = new MTLLoader()
        const objLoader = new OBJLoader()
        mtlLoader.loadAsync(materialSrc).then(materials => {
            objLoader.setMaterials(materials)
            objLoader.loadAsync(geometrySrc).then(objects => {
                objects.children.forEach(object => {
                    object.geometry.computeBoundingBox()
                    object.geometry.center()
                })
                objects.isScreen = true
                this._screen.object = objects
                this._scene.add(objects)
                this.adjustScreenPosition()
            })
        })
    }

    _addProjecotr(uId) {
        const mtlLoader = new MTLLoader()
        const objLoader = new OBJLoader()
        const p = new Promise((resolve, reject) => {
            mtlLoader.load('models/H7T_Laset7.mtl', materials => {
                objLoader.setMaterials(materials)
                objLoader.load('models/H7T_Laset7.obj', objects => {
                    objects.children.forEach(object => {
                        object.geometry.computeBoundingBox()
                        object.geometry.center()
                    })
                    objects.name = uId

                    objects.position.x = this._roomSize.widthDraw / 2
                    objects.position.y = this._roomSize.heightDraw / 2
                    objects.position.z = this._roomSize.depthDraw / 2
                    objects.rotation.y = Math.PI

                    const labelDiv = document.createElement('div')
                    labelDiv.className = 'mps-three-label'
                    labelDiv.id = uId
                    labelDiv.textContent = store.state.projector.projectors.find(o => o.uId === uId).customName
                    const label = new CSS2DObject(labelDiv)
                    label.position.set(0, 3, 0)
                    objects.add(label)

                    this._scene.add(objects)

                    this._transformControl.attach(objects)

                    resolve(objects)
                }, undefined, error => {
                    reject(error)
                })
            }, undefined, error => {
                reject(error)
            })
        })
        return p
    }

    _disposeBoundLine(uId) {
        const projectorObject = this._projectors.find(o => o.name === uId)

        projectorObject.lightBoundLT?.geometry && projectorObject.lightBoundLT?.geometry.dispose()
        projectorObject.lightBoundLT?.object && this._scene.remove(projectorObject.lightBoundLT?.object)
        projectorObject.lightBoundRT?.geometry && projectorObject.lightBoundRT?.geometry.dispose()
        projectorObject.lightBoundRT?.object && this._scene.remove(projectorObject.lightBoundRT?.object)
        projectorObject.lightBoundLB?.geometry && projectorObject.lightBoundLB?.geometry.dispose()
        projectorObject.lightBoundLB?.object && this._scene.remove(projectorObject.lightBoundLB?.object)
        projectorObject.lightBoundRB?.geometry && projectorObject.lightBoundRB?.geometry.dispose()
        projectorObject.lightBoundRB?.object && this._scene.remove(projectorObject.lightBoundRB?.object)
        projectorObject.lightBoundC?.geometry && projectorObject.lightBoundC?.geometry.dispose()
        projectorObject.lightBoundC?.object && this._scene.remove(projectorObject.lightBoundC?.object)

        projectorObject.screenBoundL?.geometry && projectorObject.screenBoundL?.geometry.dispose()
        projectorObject.screenBoundL?.object && this._scene.remove(projectorObject.screenBoundL?.object)
        projectorObject.screenBoundR?.geometry && projectorObject.screenBoundR?.geometry.dispose()
        projectorObject.screenBoundR?.object && this._scene.remove(projectorObject.screenBoundR?.object)
        projectorObject.screenBoundT?.geometry && projectorObject.screenBoundT?.geometry.dispose()
        projectorObject.screenBoundT?.object && this._scene.remove(projectorObject.screenBoundT?.object)
        projectorObject.screenBoundB?.geometry && projectorObject.screenBoundB?.geometry.dispose()
        projectorObject.screenBoundB?.object && this._scene.remove(projectorObject.screenBoundB?.object)

        projectorObject.blendingGuideLineL?.geometry && projectorObject.blendingGuideLineL?.geometry.dispose()
        projectorObject.blendingGuideLineL?.object && this._scene.remove(projectorObject.blendingGuideLineL?.object)
        projectorObject.blendingGuideLineR?.geometry && projectorObject.blendingGuideLineR?.geometry.dispose()
        projectorObject.blendingGuideLineR?.object && this._scene.remove(projectorObject.blendingGuideLineR?.object)
        projectorObject.blendingGuideLineT?.geometry && projectorObject.blendingGuideLineT?.geometry.dispose()
        projectorObject.blendingGuideLineT?.object && this._scene.remove(projectorObject.blendingGuideLineT?.object)
        projectorObject.blendingGuideLineB?.geometry && projectorObject.blendingGuideLineB?.geometry.dispose()
        projectorObject.blendingGuideLineB?.object && this._scene.remove(projectorObject.blendingGuideLineB?.object)

        projectorObject.screenPlane?.geometry && projectorObject.screenPlane?.geometry.dispose()
        projectorObject.screenPlane?.object && this._scene.remove(projectorObject.screenPlane?.object)
        projectorObject.screenPlane?.label && this._scene.remove(projectorObject.screenPlane?.label)
    }

    _createBoundLine(uId) {
        const projectorObject = this._projectors.find(o => o.name === uId)
        const projector = store.state.projector.projectors.find(o => o.uId === uId)
        const isSelected = store.state.projector.selectedProjectorUid === uId
        if (!projectorObject || !projector) {
            return
        }

        this._disposeBoundLine(uId)

        const fixTanV = 1 / projector.throwRatio / projector.aspectRatio / 2
        const lenShiftTopRatio = 1 + (projector.lensShiftV * 2 + projector.offset) / 100
        const fixedAngleTop = Math.atan(fixTanV * lenShiftTopRatio) * 180 / Math.PI
        const lenShiftBottomRatio = 1 - (projector.lensShiftV * 2 + projector.offset) / 100
        const fixedAngleBottom = Math.atan(fixTanV * lenShiftBottomRatio) * 180 / Math.PI

        const fixTanH = 1 / projector.throwRatio / 2
        const lenShiftLeftRatio = 1 + projector.lensShiftH * 2 / 100
        const fixedAngleRight = Math.atan(fixTanH * lenShiftLeftRatio) * 180 / Math.PI
        const lenShiftRightRatio = 1 - projector.lensShiftH * 2 / 100
        const fixedAngleLeft = Math.atan(fixTanH * lenShiftRightRatio) * 180 / Math.PI

        const fixedAngleCenterV = (fixedAngleTop - fixedAngleBottom) / 2
        const fixedAngleCenterH = (fixedAngleLeft - fixedAngleRight) / 2

        const directionLT = new Vector3()
        directionLT.set(Math.tan(fixedAngleLeft * Math.PI / 180), Math.tan(fixedAngleTop * Math.PI / 180), 1)
        const directionOriginLT = directionLT.clone()
        this._applayDirectionRotation(directionLT, projectorObject)
        const directionRT = new Vector3()
        directionRT.set(-Math.tan(fixedAngleRight * Math.PI / 180), Math.tan(fixedAngleTop * Math.PI / 180), 1)
        const directionOriginRT = directionRT.clone()
        this._applayDirectionRotation(directionRT, projectorObject)
        const directionLB = new Vector3()
        directionLB.set(Math.tan(fixedAngleLeft * Math.PI / 180), -Math.tan(fixedAngleBottom * Math.PI / 180), 1)
        const directionOriginLB = directionLB.clone()
        this._applayDirectionRotation(directionLB, projectorObject)
        const directionRB = new Vector3()
        directionRB.set(-Math.tan(fixedAngleRight * Math.PI / 180), -Math.tan(fixedAngleBottom * Math.PI / 180), 1)
        const directionOriginRB = directionRB.clone()
        this._applayDirectionRotation(directionRB, projectorObject)
        const directionCenter = new Vector3()
        directionCenter.set(Math.tan(fixedAngleCenterH * Math.PI / 180), Math.tan(fixedAngleCenterV * Math.PI / 180), 1)
        this._applayDirectionRotation(directionCenter, projectorObject)

        projectorObject.lightBoundLT = this._createRayLine(projectorObject.position, directionLT, isSelected)
        projectorObject.lightBoundRT = this._createRayLine(projectorObject.position, directionRT, isSelected)
        projectorObject.lightBoundLB = this._createRayLine(projectorObject.position, directionLB, isSelected)
        projectorObject.lightBoundRB = this._createRayLine(projectorObject.position, directionRB, isSelected)

        const projectionDistance = this._calcHitDistance(projectorObject.position, directionCenter) / this._roomSize.ratio
        store.commit('projector/SET_SELECTED_PROJECTOR_PROJECTION_DISTANCE', projectionDistance)

        store.commit('projector/SET_SELECTED_PROJECTOR_AMBITENT_CONTRAST', CalcAmbientContrast(uId))
        store.commit('projector/SET_SELECTED_PROJECTOR_BRIGHTNESS_NIT', CalcBrightnessOnScreenNit(uId))

        projectorObject.screenBoundL = this._createScreenBoundLine(projectorObject.position, directionOriginLT, directionOriginLB, 'y', projectorObject, isSelected)
        projectorObject.screenBoundR = this._createScreenBoundLine(projectorObject.position, directionOriginRT, directionOriginRB, 'y', projectorObject, isSelected)
        projectorObject.screenBoundT = this._createScreenBoundLine(projectorObject.position, directionOriginLT, directionOriginRT, 'x', projectorObject, isSelected)
        projectorObject.screenBoundB = this._createScreenBoundLine(projectorObject.position, directionOriginLB, directionOriginRB, 'x', projectorObject, isSelected)

        if (this._isShowDistanceRefrence) {
            // projectorObject.lightBoundC = this._createRayLine(projectorObject.position, directionCenter, isSelected)
            if (projectionDistance >= projector.minDistance && projectionDistance <= projector.maxDistance) {
                // projectorObject.lightBoundC.object.material.color.g = 1
                projectorObject.screenBoundL.object.material.color.g = 1
                projectorObject.screenBoundR.object.material.color.g = 1
                projectorObject.screenBoundT.object.material.color.g = 1
                projectorObject.screenBoundB.object.material.color.g = 1
                projectorObject.lightBoundLT.object.material.color.g = 1
                projectorObject.lightBoundRT.object.material.color.g = 1
                projectorObject.lightBoundLB.object.material.color.g = 1
                projectorObject.lightBoundRB.object.material.color.g = 1
            } else {
                // projectorObject.lightBoundC.object.material.color.r = 1
                projectorObject.screenBoundL.object.material.color.r = 1
                projectorObject.screenBoundR.object.material.color.r = 1
                projectorObject.screenBoundT.object.material.color.r = 1
                projectorObject.screenBoundB.object.material.color.r = 1
                projectorObject.lightBoundLT.object.material.color.r = 1
                projectorObject.lightBoundRT.object.material.color.r = 1
                projectorObject.lightBoundLB.object.material.color.r = 1
                projectorObject.lightBoundRB.object.material.color.r = 1
            }
        }

        // blending
        if (projector.isShowBlendingGuideLine) {
            const blendingDirectionOriginLT = directionOriginLT.clone()
            const blendingDirectionOriginRT = directionOriginRT.clone()
            const blendingDirectionOriginLB = directionOriginLB.clone()
            const blendingDirectionOriginRB = directionOriginRB.clone()
            const deltaL = (blendingDirectionOriginRT.x - blendingDirectionOriginLT.x) * projector.blendingGuideLineL / 100 / 2
            const deltaR = (blendingDirectionOriginRT.x - blendingDirectionOriginLT.x) * projector.blendingGuideLineR / 100 / 2
            const deltaT = (blendingDirectionOriginLB.y - blendingDirectionOriginLT.y) * projector.blendingGuideLineT / 100 / 2
            const deltaB = (blendingDirectionOriginLB.y - blendingDirectionOriginLT.y) * projector.blendingGuideLineB / 100 / 2
            blendingDirectionOriginLT.x += deltaL
            blendingDirectionOriginLT.y += deltaT
            blendingDirectionOriginRT.x -= deltaR
            blendingDirectionOriginRT.y += deltaT
            blendingDirectionOriginLB.x += deltaL
            blendingDirectionOriginLB.y -= deltaB
            blendingDirectionOriginRB.x -= deltaR
            blendingDirectionOriginRB.y -= deltaB
            projectorObject.blendingGuideLineL = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLT, blendingDirectionOriginLB, 'y', projectorObject, isSelected)
            projectorObject.blendingGuideLineR = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginRT, blendingDirectionOriginRB, 'y', projectorObject, isSelected)
            projectorObject.blendingGuideLineT = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLT, blendingDirectionOriginRT, 'x', projectorObject, isSelected)
            projectorObject.blendingGuideLineB = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLB, blendingDirectionOriginRB, 'x', projectorObject, isSelected)
        }

        projectorObject.screenPlane = this._createScreenPlane(projectorObject.position, directionOriginLT, directionOriginLB, directionOriginRB, projectorObject, projector, isSelected)
    }

    _analyzeInterfere() {
        this._projectors.forEach(projector => {
            projector.isProjectionInterfere = false
            let isFound = false
            this._projectors.forEach(projectorC => {
                if (projectorC.name !== projector.name) {
                    if (Math.abs(projectorC.position.x - projector.position.x) < 5 &&
                        Math.abs(projectorC.position.y - projector.position.y) < 2 &&
                        Math.abs(projectorC.position.z - projector.position.z) < 5
                    ) {
                        isFound = true
                    }
                }
            })
            projector.isProjectorInterfere = isFound
        })
    }

    _applayDirectionRotation(direction, projectorObject) {
        const axisX = new Vector3(1, 0, 0)
        const axisY = new Vector3(0, 1, 0)
        const axisZ = new Vector3(0, 0, 1)

        direction.applyAxisAngle(axisX, projectorObject.rotation.x)
        direction.applyAxisAngle(axisY, projectorObject.rotation.y)
        direction.applyAxisAngle(axisZ, projectorObject.rotation.z)
    }

    _createScreenBoundLine(originPoint, directionFrom, directionTo, axis, projectorObject, isSelected) {
        const hitPoints = this._calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorObject)

        const object3D = { geometry: null, object: null }
        object3D.geometry = new MeshLine()
        object3D.geometry.setPoints(hitPoints)
        const lightBoundMaterial = new MeshLineMaterial({
            color: 0x888888,
            lineWidth: 0.4,
            transparent: !isSelected,
            opacity: 0.6
        })
        object3D.object = new Mesh(object3D.geometry, lightBoundMaterial)

        this._scene.add(object3D.object)

        return object3D
    }

    _createBlendingGuideLine(originPoint, directionFrom, directionTo, axis, projectorObject, isSelected) {
        const hitPoints = this._calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorObject)

        const object3D = { geometry: null, object: null }
        object3D.geometry = new MeshLine()
        object3D.geometry.setPoints(hitPoints)
        const lightBoundMaterial = new MeshLineMaterial({
            color: 0x0000ff,
            lineWidth: 0.4,
            transparent: !isSelected,
            opacity: 0.6
        })
        object3D.object = new Mesh(object3D.geometry, lightBoundMaterial)

        this._scene.add(object3D.object)

        return object3D
    }

    _createScreenPlane(originPoint, directionOriginLT, directionOriginLB, directionOriginRB, projectorObject, projectorState, isSelected) {
        if (projectorState.imageAspectRatio > projectorState.aspectRatio) {
            const delta = (projectorState.imageAspectRatio - projectorState.aspectRatio) / projectorState.imageAspectRatio * (directionOriginLT.y - directionOriginLB.y)
            directionOriginLT.y -= delta / 2
            directionOriginLB.y += delta / 2
        } else if (projectorState.imageAspectRatio < projectorState.aspectRatio) {
            const delta = (projectorState.aspectRatio - projectorState.imageAspectRatio) / projectorState.aspectRatio * (directionOriginLB.x - directionOriginRB.x)
            directionOriginLB.x -= delta / 2
            directionOriginRB.x += delta / 2
        }
        const cutDivide = 30
        const bufferPoints = []
        const normalPoints = []// 定义法向量
        const uvPoints = [] // 定义uv
        const hitPoints = []
        const offset = (directionOriginLT.y - directionOriginLB.y) / cutDivide
        for (let i = 0; i <= cutDivide; i++) {
            const directionL = directionOriginLB.clone()
            directionL.y += offset * i
            const directionR = directionOriginRB.clone()
            directionR.y += offset * i
            hitPoints[i] = this._calcDivideCutPoints(originPoint, directionL, directionR, 'x', projectorObject)
        }

        for (let i = 0; i < hitPoints.length; i++) {
            for (let j = 0; j < hitPoints[i].length; j++) {
                if (hitPoints[i + 1] && hitPoints[i][j + 1]) { // 最后一层和每层的最后一个点不用管其他的
                    // 第一个三角
                    bufferPoints.push(hitPoints[i][j].x)
                    bufferPoints.push(hitPoints[i][j].y)
                    bufferPoints.push(hitPoints[i][j].z)
                    bufferPoints.push(hitPoints[i + 1][j].x)
                    bufferPoints.push(hitPoints[i + 1][j].y)
                    bufferPoints.push(hitPoints[i + 1][j].z)
                    bufferPoints.push(hitPoints[i + 1][j + 1].x)
                    bufferPoints.push(hitPoints[i + 1][j + 1].y)
                    bufferPoints.push(hitPoints[i + 1][j + 1].z)
                    uvPoints.push(j / cutDivide)
                    uvPoints.push(i / cutDivide)
                    uvPoints.push(j / cutDivide)
                    uvPoints.push((i + 1) / cutDivide)
                    uvPoints.push((j + 1) / cutDivide)
                    uvPoints.push((i + 1) / cutDivide)

                    // 第二个三角
                    bufferPoints.push(hitPoints[i][j].x)
                    bufferPoints.push(hitPoints[i][j].y)
                    bufferPoints.push(hitPoints[i][j].z)
                    bufferPoints.push(hitPoints[i + 1][j + 1].x)
                    bufferPoints.push(hitPoints[i + 1][j + 1].y)
                    bufferPoints.push(hitPoints[i + 1][j + 1].z)
                    bufferPoints.push(hitPoints[i][j + 1].x)
                    bufferPoints.push(hitPoints[i][j + 1].y)
                    bufferPoints.push(hitPoints[i][j + 1].z)
                    uvPoints.push(j / cutDivide)
                    uvPoints.push((i) / cutDivide)
                    uvPoints.push((j + 1) / cutDivide)
                    uvPoints.push((i + 1) / cutDivide)
                    uvPoints.push((j + 1) / cutDivide)
                    uvPoints.push((i) / cutDivide)

                    for (let k = 0; k < 6; k++) {
                        normalPoints.push(0)
                        normalPoints.push(0)
                        normalPoints.push(1)
                    }
                }
            }
        }

        const object3D = { geometry: null, object: null, label: null }
        object3D.geometry = new BufferGeometry()
        const vertices = new Float32Array(bufferPoints)
        const normals = new Float32Array(normalPoints)
        const uvs = new Float32Array(uvPoints)
        object3D.geometry.setAttribute('position', new BufferAttribute(vertices, 3))
        object3D.geometry.setAttribute('normal', new BufferAttribute(normals, 3))
        object3D.geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
        const material = new MeshBasicMaterial({ side: DoubleSide, transparent: true, opacity: isSelected ? 1 : 0.6, color: 0xfffcdf, blending: NormalBlending })
        material.map = this._textures[projectorState.texture]
        object3D.object = new Mesh(object3D.geometry, material)

        this._scene.add(object3D.object)

        return object3D
    }

    _calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorObject) {
        const hitPoints = []
        const cutDivide = 30
        const axisX = new Vector3(1, 0, 0)
        const axisY = new Vector3(0, 1, 0)
        const axisZ = new Vector3(0, 0, 1)

        const offset = (directionFrom[axis] - directionTo[axis]) / cutDivide
        for (let i = 0; i <= cutDivide; i++) {
            const direction = directionFrom.clone()
            direction[axis] -= offset * i
            direction.applyAxisAngle(axisX, projectorObject.rotation.x)
            direction.applyAxisAngle(axisY, projectorObject.rotation.y)
            direction.applyAxisAngle(axisZ, projectorObject.rotation.z)
            const point = this._calcHitPoint(originPoint, direction)
            hitPoints.push(point)
        }

        return hitPoints
    }

    _createRayLine(originPoint, direction, isSelected) {
        const hitPoint = this._calcHitPoint(originPoint, direction)
        const points = [originPoint, hitPoint]

        const object3D = { geometry: null, object: null }
        object3D.geometry = new MeshLine()
        object3D.geometry.setPoints(points)
        const lightBoundMaterial = new MeshLineMaterial({
            color: 0x50504e,
            lineWidth: isSelected ? 0.2 : 0,
            transparent: !isSelected,
            opacity: 0
        })
        object3D.object = new Mesh(object3D.geometry, lightBoundMaterial)

        this._scene.add(object3D.object)

        return object3D
    }

    _createAllBoundLine() {
        this._projectors.forEach(projector => {
            this._createBoundLine(projector.name)
        })
    }

    _calcHitPoint(oringin, direction) {
        const directionNormalized = direction.normalize()
        const ray = new Raycaster(oringin, directionNormalized)

        const otherProjectorMesh = []
        if (this._isInterfere) {
            const thisProjector = this._projectors.find(o => o.position.x === oringin.x && o.position.y === oringin.y && o.position.z === oringin.z)
            this._projectors.forEach(projector => {
                if (projector.name !== thisProjector.name) {
                    otherProjectorMesh.push(projector.children[0])
                    otherProjectorMesh.push(projector.children[1])
                    otherProjectorMesh.push(projector.children[2])

                    if (ray.intersectObjects([projector.children[0], projector.children[1], projector.children[2]]).length > 0) {
                        projector.isProjectionInterfere = true
                    }
                }
            })
        }

        const objects = [this._room.objects.back, this._room.objects.front, this._room.objects.left,
        this._room.objects.right, this._room.objects.top, this._room.objects.bottom, this._screen.object,
        ...this._screen.object.children, ...otherProjectorMesh]

        const hitPoints = ray.intersectObjects(objects)

        if (hitPoints.length === 0) {
            return null
        }

        // 在这里解决z-fighting的问题
        // const ramdomRatio = Math.abs(oringin.x + oringin.y + oringin.z) % 10
        hitPoints[0].point.x -= directionNormalized.x
        hitPoints[0].point.y -= directionNormalized.y
        hitPoints[0].point.z -= directionNormalized.z

        return hitPoints[0].point
    }

    _calcHitDistance(originPoint, direction) {
        const hitPoint = this._calcHitPoint(originPoint, direction)
        this._currentHitPoint = hitPoint
        this._currentHitDirection = direction
        return hitPoint.distanceTo(originPoint)
    }
}
