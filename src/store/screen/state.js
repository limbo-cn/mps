export default function () {
  return {
    screenType: 0,
    screenGain: 1,
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    plane: {
      aspectRatio: 16 / 9,
      diagonal: 400,
      width: 8.86,
      height: 4.98
    },
    curved: {
      aspectRatio: 16 / 9,
      radialSegments: 4,
      isSmooth: true,
      diagonal: 400,
      width: 8.86,
      height: 4.98,
      radius: 5
    },
    sphere: {
      radius: 2,
      phiStart: 0,
      phiLength: 360,
      thetaStart: 0,
      thetaEnd: 0
    },
    custom: {
      geometrySrc: '',
      materialSrc: ''
    }
  }
}
