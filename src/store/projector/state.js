import projectorType from '../../assets/dataSource/vvkProjectorTypes.json'
import projectorModels from '../../assets/dataSource/vvkProjectorModels.json'
import projectorLens from '../../assets/dataSource/vvkOptionalLens.json'

export default function () {
  return {
    projectorType: projectorType,
    projectorModels: projectorModels,
    projectorLens: projectorLens,
    selectedProjectorUid: '',
    projectors: [],
    selectedProjectors: []
  }
}
