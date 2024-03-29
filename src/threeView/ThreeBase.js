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
    VideoTexture, Cache, ArrowHelper, NormalBlending, GridHelper
} from 'three'
import { MeshLine, MeshLineMaterial } from 'meshline'
import { Dark, extend } from 'quasar'
import { ScreenPosition, screenType, unitRatio } from 'src/helper/enum'
import { CalcAmbientContrast, CalcBrightnessOnScreenNit, randomColor } from 'src/helper/util'

export default class ThreeBase {
    constructor() {
        this._renderer = null
        this._labelRenderer = null
        this._dom = null
        this._camera = null
        this._scene = null
        this._light = null

        this._gridHelper = null

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
        this._isShowLightBound = true
        this._isShowDistanceHelper = false

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

        this._screens = [
            {
                screenPosition: ScreenPosition.front,
                screenType: screenType.plane,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            },
            {
                screenPosition: ScreenPosition.left,
                screenType: screenType.none,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            },
            {
                screenPosition: ScreenPosition.right,
                screenType: screenType.none,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            },
            {
                screenPosition: ScreenPosition.back,
                screenType: screenType.none,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            },
            {
                screenPosition: ScreenPosition.top,
                screenType: screenType.none,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            },
            {
                screenPosition: ScreenPosition.bottom,
                screenType: screenType.none,
                screenObject: {
                    material: null,
                    geometry: null,
                    object: null
                },
                planeScreen: {
                    diagonal: 0,
                    aspectRatio: 0
                },
                curvedScreen: {
                    diagonal: 0,
                    aspectRatio: 0,
                    radius: 0,
                    radialSegments: 3,
                    isSmooth: true
                },
                sphereScreen: {
                    radius: 0,
                    phiStart: 0,
                    phiLength: 100
                },
                customScreen: {
                    geometry: '',
                    material: ''
                }
            }
        ]

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

        const size = 1000
        const divisions = 100

        this._gridHelper = new GridHelper(size, divisions)

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
        this._light = new PointLight(0xffffff, 1, 0, 2)
        this._light.position.set(this._roomSize.widthDraw / 2, this._roomSize.heightDraw, this._roomSize.depthDraw / 2)
        this._scene.add(this._light)
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

            const projectorObject = this._transformControl.object
            !projectorObject.historyPoints && (projectorObject.historyPoints = [])
            // 相同就不記錄
            if (projectorObject.historyPoints.length > 0) {
                const lastPoint = projectorObject.historyPoints[projectorObject.historyPoints.length - 1]
                if (lastPoint.x === projectorObject.position.x && lastPoint.y === projectorObject.position.y && lastPoint.z === projectorObject.position.z) {
                    return
                }
            }
            if (projectorObject.historyIndex && projectorObject.historyIndex !== projectorObject.historyPoints.length - 1) {
                projectorObject.historyPoints.splice(projectorObject.historyIndex)
            }
            projectorObject.historyPoints.push({ x: projectorObject.position.x, y: projectorObject.position.y, z: projectorObject.position.z })
            projectorObject.historyIndex = projectorObject.historyPoints.length - 1

            if (projectorObject) {
                this._analyzeUndoRedo(projectorObject)
            }
        })
        let throttleCount = 0
        this._transformControl.addEventListener('change', event => {
            throttleCount++
            if (throttleCount % 2 === 0 && this._transformControl.object) {
                store.commit('projector/SET_SELECTED_PROJECTOR_X', this._transformControl.object.position?.x / this._roomSize.ratio)
                store.commit('projector/SET_SELECTED_PROJECTOR_Y', this._transformControl.object.position?.y / this._roomSize.ratio)
                store.commit('projector/SET_SELECTED_PROJECTOR_Z', this._transformControl.object.position?.z / this._roomSize.ratio)

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
        if (this._hotProjectorUid && !store.state.common.isToShowContextmenu) {
            store.commit('common/SET_IS_TO_SHOW_CONTEXTMENU', true)
        } else if (!this._hotProjectorUid && store.state.common.isToShowContextmenu) {
            store.commit('common/SET_IS_TO_SHOW_CONTEXTMENU', false)
        }

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
                this._screens.forEach(screen => {
                    screen.screenObject.material = screenMaterial
                })
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

    _initScreen(screen) {
        if (!screen) {
            this._screens.forEach(screen => {
                screen.screenObject.geometry && screen.screenObject.geometry.dispose()
                screen.screenObject.object && this._scene.remove(screen.screenObject.object)

                screen.screenType === screenType.plane && this._createPlaneScreen(screen)
                screen.screenType === screenType.curved && this._createCurveScreen(screen)
                screen.screenType === screenType.sphere && this._createSphereScreen(screen)
                screen.screenType === screenType.custom && this._createCustomScreen(screen)

                store.commit('screen/SET_SCREEN_POSTION', screen.screenPosition)

                this.adjustScreenPosition(screen)
            })

            store.commit('screen/SET_SCREEN_POSTION', ScreenPosition.front)
        } else {
            screen.screenObject.geometry && screen.screenObject.geometry.dispose()
            screen.screenObject.object && this._scene.remove(screen.screenObject.object)

            screen.screenType === screenType.plane && this._createPlaneScreen(screen)
            screen.screenType === screenType.curved && this._createCurveScreen(screen)
            screen.screenType === screenType.sphere && this._createSphereScreen(screen)
            screen.screenType === screenType.custom && this._createCustomScreen(screen)

            this.adjustScreenPosition(screen)
        }
    }

    adjustScreenPosition(screen) {
        if (!screen) {
            screen = this._screens[store.state.screen.screenPosition]
        }
        if (screen.screenType === screenType.none) {
            return
        }
        const positionArray = screen.screenObject.geometry.attributes.position.array
        const pointLength = screen.screenObject.geometry.attributes.position.count

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

        // 因为都经过旋转，所以都以Z来判断边界
        if (screen.screenPosition === ScreenPosition.front) {
            screen.screenObject.object.position.x = this._roomSize.widthDraw / 2
            screen.screenObject.object.position.y = this._roomSize.heightDraw / 2
            screen.screenObject.object.position.z = (1 * this._roomSize.ratio) - zMin
        } else if (screen.screenPosition === ScreenPosition.left) {
            screen.screenObject.object.position.x = (0.5 * this._roomSize.ratio) - zMin
            screen.screenObject.object.position.y = this._roomSize.heightDraw / 2
            screen.screenObject.object.position.z = this._roomSize.depthDraw / 2
        } else if (screen.screenPosition === ScreenPosition.right) {
            screen.screenObject.object.position.x = this._roomSize.widthDraw + zMin - (0.5 * this._roomSize.ratio)
            screen.screenObject.object.position.y = this._roomSize.heightDraw / 2
            screen.screenObject.object.position.z = this._roomSize.depthDraw / 2
        } else if (screen.screenPosition === ScreenPosition.back) {
            screen.screenObject.object.position.x = this._roomSize.widthDraw / 2
            screen.screenObject.object.position.y = this._roomSize.heightDraw / 2
            screen.screenObject.object.position.z = this._roomSize.depthDraw + zMin - (1 * this._roomSize.ratio)
        } else if (screen.screenPosition === ScreenPosition.top) {
            screen.screenObject.object.position.x = this._roomSize.widthDraw / 2
            screen.screenObject.object.position.y = this._roomSize.heightDraw + zMin - (0.5 * this._roomSize.ratio)
            screen.screenObject.object.position.z = this._roomSize.depthDraw / 2
        } else if (screen.screenPosition === ScreenPosition.bottom) {
            screen.screenObject.object.position.x = this._roomSize.widthDraw / 2
            screen.screenObject.object.position.y = (0.5 * this._roomSize.ratio) - zMin
            screen.screenObject.object.position.z = this._roomSize.depthDraw / 2
        }

        store.commit('screen/SET_X', screen.screenObject.object.position.x / this._roomSize.ratio)
        store.commit('screen/SET_Y', screen.screenObject.object.position.y / this._roomSize.ratio)
        store.commit('screen/SET_Z', screen.screenObject.object.position.z / this._roomSize.ratio)
        store.commit('screen/SET_ROTATE_X', screen.screenObject.object.rotation.x / Math.PI * 180)
        store.commit('screen/SET_ROTATE_Y', screen.screenObject.object.rotation.y / Math.PI * 180)
        store.commit('screen/SET_ROTATE_Z', screen.screenObject.object.rotation.z / Math.PI * 180)

        screen.screenObject.object.updateMatrixWorld()

        this._createAllBoundLine()
    }

    _createPlaneScreen(screen) {
        const screenState = store.state.screen.screens[screen.screenPosition]
        screen.planeScreen.diagonal = screenState.plane.diagonal
        screen.planeScreen.aspectRatio = screenState.plane.aspectRatio

        if (screen.planeScreen.aspectRatio === 0) { // custom
            screen.planeScreen.aspectRatio = screenState.plane.width / screenState.plane.height
        }

        const diagonalM = screen.planeScreen.diagonal / unitRatio.inch
        const aspectAngle = Math.atan(screen.planeScreen.aspectRatio)
        const screenWidth = diagonalM * Math.sin(aspectAngle)
        const screenHeight = screenWidth / screen.planeScreen.aspectRatio

        screen.screenObject.geometry = new PlaneGeometry(screenWidth * this._roomSize.ratio, screenHeight * this._roomSize.ratio)
        screen.screenObject.object = new Mesh(screen.screenObject.geometry, screen.screenObject.material)

        if (screen.screenPosition === ScreenPosition.left) {
            screen.screenObject.object.rotation.y = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.right) {
            screen.screenObject.object.rotation.y = Math.PI * 1.5
        } else if (screen.screenPosition === ScreenPosition.back) {
            screen.screenObject.object.rotation.y = Math.PI
        } else if (screen.screenPosition === ScreenPosition.top) {
            screen.screenObject.object.rotation.x = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.bottom) {
            screen.screenObject.object.rotation.x = Math.PI * 1.5
        }
        this._scene.add(screen.screenObject.object)
    }

    _createCurveScreen(screen) {
        const screenState = store.state.screen.screens[screen.screenPosition]

        screen.curvedScreen.diagonal = screenState.curved.diagonal
        screen.curvedScreen.aspectRatio = screenState.curved.aspectRatio
        screen.curvedScreen.radius = screenState.curved.radius * this._roomSize.ratio
        screen.curvedScreen.radialSegments = screenState.curved.radialSegments
        screen.curvedScreen.isSmooth = screenState.curved.isSmooth

        if (screen.curvedScreen.aspectRatio === 0) { // custom
            screen.curvedScreen.aspectRatio = screenState.curved.width / screenState.curved.height
        }

        const diagonalM = screen.curvedScreen.diagonal / unitRatio.inch
        const aspectAngle = Math.atan(screen.curvedScreen.aspectRatio)
        const screenWidth = diagonalM * Math.sin(aspectAngle)
        const screenHeight = screenWidth / screen.curvedScreen.aspectRatio

        const radian = screenWidth * this._roomSize.ratio / screen.curvedScreen.radius // 弧长 = 弧度 * 半径

        screen.screenObject.geometry = new CylinderGeometry(screen.curvedScreen.radius, screen.curvedScreen.radius,
            screenHeight * this._roomSize.ratio, screen.curvedScreen.isSmooth ? 128 : screen.curvedScreen.radialSegments,
            1, true, Math.PI - radian / 2, radian)
        screen.screenObject.object = new Mesh(screen.screenObject.geometry, screen.screenObject.material)

        if (screen.screenPosition === ScreenPosition.left) {
            screen.screenObject.object.rotation.y = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.right) {
            screen.screenObject.object.rotation.y = Math.PI * 1.5
        } else if (screen.screenPosition === ScreenPosition.back) {
            screen.screenObject.object.rotation.y = Math.PI
        } else if (screen.screenPosition === ScreenPosition.top) {
            screen.screenObject.object.rotation.x = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.bottom) {
            screen.screenObject.object.rotation.x = Math.PI * 1.5
        }

        this._scene.add(screen.screenObject.object)
    }

    _createSphereScreen(screen) {
        const screenState = store.state.screen.screens[screen.screenPosition]

        screen.sphereScreen.radius = screenState.sphere.radius * this._roomSize.ratio
        screen.sphereScreen.phiStart = Math.PI + screenState.sphere.phiStart / 180 * Math.PI
        screen.sphereScreen.phiLength = screenState.sphere.phiLength / 180 * Math.PI
        screen.sphereScreen.thetaStart = screenState.sphere.thetaStart / 180 * Math.PI
        screen.sphereScreen.thetaLength = (1 - screenState.sphere.thetaEnd / 180 - screenState.sphere.thetaStart / 180) * Math.PI

        screen.screenObject.geometry = new SphereGeometry(screen.sphereScreen.radius, 16, 16,
            screen.sphereScreen.phiStart, screen.sphereScreen.phiLength,
            screen.sphereScreen.thetaStart, screen.sphereScreen.thetaLength)
        screen.screenObject.object = new Mesh(screen.screenObject.geometry, screen.screenObject.material)

        if (screen.screenPosition === ScreenPosition.left) {
            screen.screenObject.object.rotation.y = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.right) {
            screen.screenObject.object.rotation.y = Math.PI * 1.5
        } else if (screen.screenPosition === ScreenPosition.back) {
            screen.screenObject.object.rotation.y = Math.PI
        } else if (screen.screenPosition === ScreenPosition.top) {
            screen.screenObject.object.rotation.x = Math.PI * 0.5
        } else if (screen.screenPosition === ScreenPosition.bottom) {
            screen.screenObject.object.rotation.x = Math.PI * 1.5
        }

        this._scene.add(screen.screenObject.object)
    }

    _createCustomScreen(screen) {
        const screenState = store.state.screen.screens[screen.screenPosition]

        const geometrySrc = screenState.custom.geometrySrc
        const materialSrc = screenState.custom.materialSrc
        if (geometrySrc === '') {
            screen.screenObject.object = new Mesh()
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
                screen.screenObject.object = objects
                this._scene.add(objects)
                this.adjustScreenPosition(screen)
            })
        })
    }

    _addProjector(uId) {
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
        this._applayDirectionRotation(directionLT, projector)
        const directionRT = new Vector3()
        directionRT.set(-Math.tan(fixedAngleRight * Math.PI / 180), Math.tan(fixedAngleTop * Math.PI / 180), 1)
        const directionOriginRT = directionRT.clone()
        this._applayDirectionRotation(directionRT, projector)
        const directionLB = new Vector3()
        directionLB.set(Math.tan(fixedAngleLeft * Math.PI / 180), -Math.tan(fixedAngleBottom * Math.PI / 180), 1)
        const directionOriginLB = directionLB.clone()
        this._applayDirectionRotation(directionLB, projector)
        const directionRB = new Vector3()
        directionRB.set(-Math.tan(fixedAngleRight * Math.PI / 180), -Math.tan(fixedAngleBottom * Math.PI / 180), 1)
        const directionOriginRB = directionRB.clone()
        this._applayDirectionRotation(directionRB, projector)
        const directionCenter = new Vector3()
        directionCenter.set(Math.tan(fixedAngleCenterH * Math.PI / 180), Math.tan(fixedAngleCenterV * Math.PI / 180), 1)
        this._applayDirectionRotation(directionCenter, projector)

        projectorObject.lightBoundLT = this._createRayLine(projectorObject.position, directionLT, isSelected)
        projectorObject.lightBoundRT = this._createRayLine(projectorObject.position, directionRT, isSelected)
        projectorObject.lightBoundLB = this._createRayLine(projectorObject.position, directionLB, isSelected)
        projectorObject.lightBoundRB = this._createRayLine(projectorObject.position, directionRB, isSelected)

        const projectionDistance = this._calcHitDistance(projectorObject.position, directionCenter) / this._roomSize.ratio
        store.commit('projector/SET_SELECTED_PROJECTOR_PROJECTION_DISTANCE', projectionDistance)
        projectorObject.directionCenter = directionCenter
        projectorObject.projectionDistance = projectionDistance

        store.commit('projector/SET_SELECTED_PROJECTOR_AMBITENT_CONTRAST', CalcAmbientContrast(uId))
        store.commit('projector/SET_SELECTED_PROJECTOR_BRIGHTNESS_NIT', CalcBrightnessOnScreenNit(uId))

        projectorObject.screenBoundL = this._createScreenBoundLine(projectorObject.position, directionOriginLT, directionOriginLB, 'y', projector, isSelected)
        projectorObject.screenBoundR = this._createScreenBoundLine(projectorObject.position, directionOriginRT, directionOriginRB, 'y', projector, isSelected)
        projectorObject.screenBoundT = this._createScreenBoundLine(projectorObject.position, directionOriginLT, directionOriginRT, 'x', projector, isSelected)
        projectorObject.screenBoundB = this._createScreenBoundLine(projectorObject.position, directionOriginLB, directionOriginRB, 'x', projector, isSelected)

        if (this._isShowDistanceRefrence) {
            if (projectionDistance >= projector.minDistance && projectionDistance <= projector.maxDistance) {
                // projectorObject.screenBoundL.object.material.color.g = 1
                // projectorObject.screenBoundR.object.material.color.g = 1
                // projectorObject.screenBoundT.object.material.color.g = 1
                // projectorObject.screenBoundB.object.material.color.g = 1
                // projectorObject.lightBoundLT.object.material.color.g = 1
                // projectorObject.lightBoundRT.object.material.color.g = 1
                // projectorObject.lightBoundLB.object.material.color.g = 1
                // projectorObject.lightBoundRB.object.material.color.g = 1
            } else {
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
            projectorObject.blendingGuideLineL = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLT, blendingDirectionOriginLB, 'y', projector, isSelected)
            projectorObject.blendingGuideLineR = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginRT, blendingDirectionOriginRB, 'y', projector, isSelected)
            projectorObject.blendingGuideLineT = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLT, blendingDirectionOriginRT, 'x', projector, isSelected)
            projectorObject.blendingGuideLineB = this._createBlendingGuideLine(projectorObject.position, blendingDirectionOriginLB, blendingDirectionOriginRB, 'x', projector, isSelected)
        }

        projectorObject.screenPlane = this._createScreenPlane(projectorObject.position, directionOriginLT, directionOriginLB, directionOriginRB, projector, isSelected)

        // Distance Helper
        this._createDistanceHelper(projectorObject, projector)
        // Projection Size
        this._createProjectionSize(projectorObject, projector, directionCenter)
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

    _applayDirectionRotation(direction, projectorState) {
        const axisX = new Vector3(1, 0, 0)
        const axisY = new Vector3(0, 1, 0)
        const axisZ = new Vector3(0, 0, 1)

        direction.applyAxisAngle(axisX, projectorState.rotateX / 180 * Math.PI)
        direction.applyAxisAngle(axisY, Math.PI + projectorState.rotateY / 180 * Math.PI)
        direction.applyAxisAngle(axisZ, projectorState.rotateZ / 180 * Math.PI)
    }

    _createScreenBoundLine(originPoint, directionFrom, directionTo, axis, projectorState, isSelected) {
        const hitPoints = this._calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorState)

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

    _createBlendingGuideLine(originPoint, directionFrom, directionTo, axis, projectorState, isSelected) {
        const hitPoints = this._calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorState)

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

    _createScreenPlane(originPoint, directionOriginLT, directionOriginLB, directionOriginRB, projectorState, isSelected) {
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
            hitPoints[i] = this._calcDivideCutPoints(originPoint, directionL, directionR, 'x', projectorState)
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

    _createDistanceHelper(projectorObject, projectorState) {
        this._disposeDistanceHelperObject(projectorObject)
        const isProjectorSelected = store.state.projector.selectedProjectors.findIndex(o => o.uId === projectorObject.name) >= 0

        if (!this._isShowDistanceHelper || !isProjectorSelected) {
            this._disposeDistanceHelperLabel(projectorObject)
        } else {
            const dirXLeft = new Vector3(-1, 0, 0)
            const dirXRight = new Vector3(1, 0, 0)
            const dirYTop = new Vector3(0, 1, 0)
            const dirYBottom = new Vector3(0, -1, 0)
            const dirZFront = new Vector3(0, 0, 1)
            const dirZBack = new Vector3(0, 0, -1)

            !projectorObject.distanceHelperColor && (projectorObject.distanceHelperColor = randomColor())

            const positionX = extend(true, {}, projectorObject.position)
            positionX.x /= 2
            projectorObject.distanceHelperXLeft = new ArrowHelper(dirXLeft, positionX, projectorObject.position.x / 2, projectorObject.distanceHelperColor)
            projectorObject.distanceHelperXRight = new ArrowHelper(dirXRight, positionX, projectorObject.position.x / 2, projectorObject.distanceHelperColor)

            const positionY = extend(true, {}, projectorObject.position)
            positionY.y /= 2
            projectorObject.distanceHelperYTop = new ArrowHelper(dirYTop, positionY, projectorObject.position.y / 2, projectorObject.distanceHelperColor)
            projectorObject.distanceHelperYBottom = new ArrowHelper(dirYBottom, positionY, projectorObject.position.y / 2, projectorObject.distanceHelperColor)

            const positionZ = extend(true, {}, projectorObject.position)
            positionZ.z /= 2
            projectorObject.distanceHelperZFront = new ArrowHelper(dirZFront, positionZ, projectorObject.position.z / 2, projectorObject.distanceHelperColor)
            projectorObject.distanceHelperZBack = new ArrowHelper(dirZBack, positionZ, projectorObject.position.z / 2, projectorObject.distanceHelperColor)

            if (projectorObject.distanceHelperXLabel) {
                projectorObject.distanceHelperXLabel.position.set(positionX.x, positionX.y + 2, positionX.z - 2)
                const labelDivX = document.getElementById(`distance-helper-x-${projectorObject.name}`)
                labelDivX.textContent = (projectorState.x * store.state.common.unitRatio).toFixed(2)
            } else {
                const labelDivX = document.createElement('div')
                labelDivX.className = 'mps-three-label'
                labelDivX.id = `distance-helper-x-${projectorObject.name}`
                labelDivX.textContent = (projectorState.x * store.state.common.unitRatio).toFixed(2)
                labelDivX.style = `background-color:transparent;color:${projectorObject.distanceHelperColor};font-weight:bold;font-size:20px`
                projectorObject.distanceHelperXLabel = new CSS2DObject(labelDivX)
                projectorObject.distanceHelperXLabel.position.set(positionX.x, positionX.y + 2, positionX.z - 2)
                this._scene.add(projectorObject.distanceHelperXLabel)
            }

            if (projectorObject.distanceHelperYLabel) {
                projectorObject.distanceHelperYLabel.position.set(positionY.x + 3, positionY.y, positionY.z - 3)
                const labelDivY = document.getElementById(`distance-helper-y-${projectorObject.name}`)
                labelDivY.textContent = (projectorState.y * store.state.common.unitRatio).toFixed(2)
            } else {
                const labelDivY = document.createElement('div')
                labelDivY.className = 'mps-three-label'
                labelDivY.id = `distance-helper-y-${projectorObject.name}`
                labelDivY.textContent = (projectorState.y * store.state.common.unitRatio).toFixed(2)
                labelDivY.style = `background-color:transparent;color:${projectorObject.distanceHelperColor};font-weight:bold;font-size:20px`
                projectorObject.distanceHelperYLabel = new CSS2DObject(labelDivY)
                projectorObject.distanceHelperYLabel.position.set(positionY.x + 3, positionY.y, positionY.z - 3)
                this._scene.add(projectorObject.distanceHelperYLabel)
            }

            if (projectorObject.distanceHelperZLabel) {
                projectorObject.distanceHelperZLabel.position.set(positionZ.x + 3, positionZ.y + 2, positionZ.z)
                const labelDivZ = document.getElementById(`distance-helper-z-${projectorObject.name}`)
                labelDivZ.textContent = (projectorState.z * store.state.common.unitRatio).toFixed(2)
            } else {
                const labelDivZ = document.createElement('div')
                labelDivZ.className = 'mps-three-label'
                labelDivZ.id = `distance-helper-z-${projectorObject.name}`
                labelDivZ.textContent = (projectorState.y * store.state.common.unitRatio).toFixed(2)
                labelDivZ.style = `background-color:transparent;color:${projectorObject.distanceHelperColor};font-weight:bold;font-size:20px`
                projectorObject.distanceHelperZLabel = new CSS2DObject(labelDivZ)
                projectorObject.distanceHelperZLabel.position.set(positionZ.x + 3, positionZ.y + 2, positionZ.z)
                this._scene.add(projectorObject.distanceHelperZLabel)
            }

            this._scene.add(projectorObject.distanceHelperXLeft)
            this._scene.add(projectorObject.distanceHelperXRight)
            this._scene.add(projectorObject.distanceHelperYTop)
            this._scene.add(projectorObject.distanceHelperYBottom)
            this._scene.add(projectorObject.distanceHelperZFront)
            this._scene.add(projectorObject.distanceHelperZBack)
        }
    }

    _disposeDistanceHelperObject(projectorObject) {
        projectorObject.distanceHelperXLeft && (this._scene.remove(projectorObject.distanceHelperXLeft))
        projectorObject.distanceHelperXRight && this._scene.remove(projectorObject.distanceHelperXRight)
        projectorObject.distanceHelperYTop && this._scene.remove(projectorObject.distanceHelperYTop)
        projectorObject.distanceHelperYBottom && this._scene.remove(projectorObject.distanceHelperYBottom)
        projectorObject.distanceHelperZFront && this._scene.remove(projectorObject.distanceHelperZFront)
        projectorObject.distanceHelperZBack && this._scene.remove(projectorObject.distanceHelperZBack)
    }

    _disposeDistanceHelperLabel(projectorObject) {
        if (projectorObject.distanceHelperXLabel) {
            this._scene.remove(projectorObject.distanceHelperXLabel)
            projectorObject.distanceHelperXLabel = null
        }
        if (projectorObject.distanceHelperYLabel) {
            this._scene.remove(projectorObject.distanceHelperYLabel)
            projectorObject.distanceHelperYLabel = null
        }
        if (projectorObject.distanceHelperZLabel) {
            this._scene.remove(projectorObject.distanceHelperZLabel)
            projectorObject.distanceHelperZLabel = null
        }
    }

    _createProjectionSize(projectorObject, projectorObjectState, directionCenter) {
        projectorObject.lightBoundC?.geometry && projectorObject.lightBoundC?.geometry.dispose()
        projectorObject.lightBoundC?.object && this._scene.remove(projectorObject.lightBoundC?.object)

        const isProjectorSelected = store.state.projector.selectedProjectors.findIndex(o => o.uId === projectorObject.name) >= 0

        if (!this._isShowDistanceHelper || !isProjectorSelected) {
            this._disposeProjectionSizeLabel(projectorObject)
        } else {
            const screenWidth = projectorObject.projectionDistance / projectorObjectState.throwRatio
            const screenHeight = screenWidth / projectorObjectState.aspectRatio
            const screenDiagonal = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) * unitRatio.inch

            projectorObject.lightBoundC = this._createRayLine(projectorObject.position, directionCenter, true, new Color(projectorObject.distanceHelperColor), true)
            const hitPoint = projectorObject.lightBoundC.object.geometry.points[1]

            if (projectorObject.projectionDistanceLabel) {
                projectorObject.projectionDistanceLabel.position.set(hitPoint.x, hitPoint.y + 2, hitPoint.z)
                const labelDivProjectionDistance = document.getElementById(`distance-helper-projection-distance-${projectorObject.name}`)
                labelDivProjectionDistance.textContent = `${projectorObject.projectionDistance.toFixed(2)}`
            } else {
                const labelDivProjectionDistance = document.createElement('div')
                labelDivProjectionDistance.className = 'mps-three-label'
                labelDivProjectionDistance.id = `distance-helper-projection-distance-${projectorObject.name}`
                labelDivProjectionDistance.textContent = `${projectorObject.projectionDistance.toFixed(2)}`
                labelDivProjectionDistance.style = `background-color:transparent;color:${projectorObject.distanceHelperColor};font-weight:bold;font-size:20px`
                projectorObject.projectionDistanceLabel = new CSS2DObject(labelDivProjectionDistance)
                projectorObject.projectionDistanceLabel.position.set(hitPoint.x, hitPoint.y + 2, hitPoint.z)
                this._scene.add(projectorObject.projectionDistanceLabel)
            }
            if (projectorObject.projectionSizeLabel) {
                projectorObject.projectionSizeLabel.position.set(hitPoint.x, hitPoint.y + 8, hitPoint.z)
                const labelDivProjectionSize = document.getElementById(`distance-helper-projection-size-${projectorObject.name}`)
                labelDivProjectionSize.textContent = `${screenDiagonal.toFixed(2)}''`
            } else {
                const labelDivProjectionSize = document.createElement('div')
                labelDivProjectionSize.className = 'mps-three-label'
                labelDivProjectionSize.id = `distance-helper-projection-size-${projectorObject.name}`
                labelDivProjectionSize.textContent = `${screenDiagonal.toFixed(2)}''`
                labelDivProjectionSize.style = `background-color:transparent;color:${projectorObject.distanceHelperColor};font-weight:bold;font-size:20px`
                projectorObject.projectionSizeLabel = new CSS2DObject(labelDivProjectionSize)
                projectorObject.projectionSizeLabel.position.set(hitPoint.x, hitPoint.y + 8, hitPoint.z)
                this._scene.add(projectorObject.projectionSizeLabel)
            }
        }
    }

    _disposeProjectionSizeLabel(projectorObject) {
        if (projectorObject.projectionSizeLabel) {
            this._scene.remove(projectorObject.projectionSizeLabel)
            projectorObject.projectionSizeLabel = null
        }
        if (projectorObject.projectionDistanceLabel) {
            this._scene.remove(projectorObject.projectionDistanceLabel)
            projectorObject.projectionDistanceLabel = null
        }
    }

    _calcDivideCutPoints(originPoint, directionFrom, directionTo, axis, projectorState) {
        const hitPoints = []
        const cutDivide = 30
        const axisX = new Vector3(1, 0, 0)
        const axisY = new Vector3(0, 1, 0)
        const axisZ = new Vector3(0, 0, 1)

        const offset = (directionFrom[axis] - directionTo[axis]) / cutDivide
        for (let i = 0; i <= cutDivide; i++) {
            const direction = directionFrom.clone()
            direction[axis] -= offset * i
            direction.applyAxisAngle(axisX, projectorState.rotateX / 180 * Math.PI)
            direction.applyAxisAngle(axisY, Math.PI + projectorState.rotateY / 180 * Math.PI)
            direction.applyAxisAngle(axisZ, projectorState.rotateZ / 180 * Math.PI)
            const point = this._calcHitPoint(originPoint, direction)
            hitPoints.push(point)
        }

        return hitPoints
    }

    _createRayLine(originPoint, direction, isSelected, color = 0x50504e, isShowLightBound) {
        const hitPoint = this._calcHitPoint(originPoint, direction)
        const points = [originPoint, hitPoint]

        if (!isShowLightBound) {
            isShowLightBound = this._isShowLightBound
        }

        const object3D = { geometry: null, object: null }
        object3D.geometry = new MeshLine()
        object3D.geometry.setPoints(points)
        const lightBoundMaterial = new MeshLineMaterial({
            color: color,
            lineWidth: isShowLightBound ? 0.2 : 0,
            transparent: !isSelected || isShowLightBound,
            opacity: isShowLightBound ? 0.2 : 0
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

        const screenObjects = []
        this._screens.forEach(screen => {
            if (screen.screenType !== screenType.none) {
                screenObjects.push(screen.screenObject.object)
                screen.screenObject.object.children.forEach(child => {
                    screenObjects.push(child)
                })
            }
        })

        const objects = [this._room.objects.back, this._room.objects.front, this._room.objects.left,
        this._room.objects.right, this._room.objects.top, this._room.objects.bottom, ...screenObjects, ...otherProjectorMesh]

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

    _analyzeUndoRedo(projectorObject) {
        if (projectorObject?.historyIndex > 0) {
            store.commit('common/SET_SHOW_UNDO', true)
        } else {
            store.commit('common/SET_SHOW_UNDO', false)
        }
        if (projectorObject?.historyIndex < projectorObject?.historyPoints?.length - 1) {
            store.commit('common/SET_SHOW_REDO', true)
        } else {
            store.commit('common/SET_SHOW_REDO', false)
        }
    }
}
