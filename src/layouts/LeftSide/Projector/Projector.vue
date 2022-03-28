<template>
  <div class="row q-pl-md q-pa-sm">
    <div class="q-mb-sm" :class="`col-12`">
      <q-btn id="leftside-addprojector" outline color="white" text-color="primary" :label="$t('addProjector')" @click="()=>{showDlgChooseProjector = true; isEdit = false}" icon="add" style="width: 95%" />
    </div>
    <template v-if="projectors.length > 0">
      <div class="col-4" v-show="projectors.length>0">
        <q-btn @click="deleteProjector" outline color="primary" icon="delete_outline" style="width: 90%" />
      </div>
      <div class="col-4">
        <q-btn @click="showDlgCopyProjector = true" outline color="primary" icon="file_copy" style="width: 90%" />
      </div>
      <div class="col-4">
        <q-btn outline color="primary" @click="editProjector" icon="loop" style="width: 90%" />
      </div>
      <div class="col-12">
        <q-select dense v-model="selectedProjectorId" @update:modelValue="changeSelectedProjector" :options="projectors" emit-value map-options option-value="value" option-label="label" style="width:95%" behavior="menu">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('selectedProjector')}}:
            </div>
          </template>
        </q-select>
      </div>

    </template>
    <template v-if="selectedProjectorOptionalLenss && selectedProjectorOptionalLenss.length > 0">
      <q-select dense :model-value="selectedProjector.lensName" @update:modelValue="changeSelectedProjectorLens" :options="selectedProjectorOptionalLenss" style="width:95%" behavior="menu">
        <template v-slot:prepend>
          <div class="text-subtitle2">
            {{$t('selectedLens')}}:
          </div>
        </template>
      </q-select>
    </template>
  </div>

  <q-expansion-item v-if="selectedProjector" dense :header-class="$q.dark.isActive? 'left-header-dark' : 'left-header-light'" default-opened :label="$t('layout')">
    <Layout />
  </q-expansion-item>

  <q-expansion-item v-if="selectedProjector" dense :header-class="$q.dark.isActive? 'left-header-dark' : 'left-header-light'" default-opened :label="$t('position')">
    <Position />
  </q-expansion-item>

  <q-expansion-item v-if="selectedProjector" dense :header-class="$q.dark.isActive? 'left-header-dark' : 'left-header-light'" default-opened :label="$t('projection')">
    <Projection />
  </q-expansion-item>

  <q-expansion-item v-if="selectedProjector" dense :header-class="$q.dark.isActive? 'left-header-dark' : 'left-header-light'" default-opened :label="$t('blending')">
    <Blending />
  </q-expansion-item>

  <q-dialog v-model="showDlgCopyProjector" @show="initDlgCopyProjector">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h5">{{$t('copyProjector')}}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input v-model="copyName" style="width:100%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('customName')}}:
            </div>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn flat :label="$t('yes')" color="primary" @click="copyProjector" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showDlgChooseProjector" @show="initDlgChooseProjector">
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section v-show="!isEdit">
        <div class="text-h5">{{$t('addProjector')}}</div>
      </q-card-section>
      <q-card-section v-show="isEdit">
        <div class="text-h5">{{$t('editProjector')}}</div>
      </q-card-section>

      <q-card-section class="q-pa-sm q-ma-sm" style="border:1px solid #ccc;border-radius:5px">
        <div class="row q-mb-md q-ml-lg text-h6">
          {{$t('installationCondition')}}
        </div>
        <div class="row q-mb-md">
          <q-input outlined dense v-model="throwDistance" class="q-pl-md" type="number" :suffix="unitLabel" min="0" style="width:50%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('throwDistance')}}:
              </div>
            </template>
          </q-input>
          <q-checkbox v-model="lensShiftOnly" :label="$t('lensShiftOnly')" />
          <q-checkbox v-model="optionalLensOnly" :label="$t('optionalLensOnly')" />
        </div>
        <div class="row q-mb-md">
          <q-select clearable outlined dense v-model="brightness" :options="brightnessOptions" class="q-pl-md" suffix="Lumen" style="width:50%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('brightness')}}:
              </div>
            </template>
          </q-select>
          <q-select clearable outlined dense v-model="resolution" :options="resolutionOptions" class="q-pl-md q-pr-md" style="width:50%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('resolution')}}:
              </div>
            </template>
          </q-select>
        </div>
        <div class="row q-mb-md">
          <q-select clearable outlined dense v-model="throwRatio" :options="throwRatioOptions" class="q-pl-md" style="width:33%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('throwRatio')}}:
              </div>
            </template>
          </q-select>
          <q-select clearable outlined dense v-model="aspectRatio" :options="aspectRatioOptions" class="q-pl-md" style="width:33%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('aspectRatio')}}:
              </div>
            </template>
          </q-select>
          <q-select clearable outlined dense v-model="weight" :options="weightOptions" suffix="kg" class="q-pl-md" style="width:33%">
            <template v-slot:prepend>
              <div class="text-subtitle2">
                {{$t('weight')}}:
              </div>
            </template>
          </q-select>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="addProjectorModelName" @update:modelValue="changeProjectorName" :options="projectorModels" style="width:100%" behavior="menu">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('modelName')}}:
            </div>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="addCustomName" style="width:100%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('customName')}}:
            </div>
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
        <q-btn flat :label="$t('yes')" color="primary" @click="addModel" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import Position from './Position'
import Projection from './Projection'
import Blending from './Blending'
import Layout from './Layout'

import { uid } from 'quasar'
import { mapMutations } from 'vuex'
import { Projector } from '../../../helper/object'
import { filterAspectRatio, filterBrightness, filterLensShift, filterOptionalLens, filterResolution, filterThrowDistance, filterThrowRatio, filterWeight, showConfirm } from '../../../helper/util'

export default {
  name: 'LeftSide-Projector',
  components: {
    Position,
    Projection,
    Blending,
    Layout
  },
  data() {
    return {
      lensShiftOnly: false,
      optionalLensOnly: false,
      throwDistance: '',
      brightness: '',
      brightnessOptions: ['0-2000', '2000-4000', '4000-6000', '6000-8000', '8000-10000', '10000-15000', '15000-20000', '20000-30000'],
      resolution: '',
      resolutionOptions: ['480p', '720p', '1080p', 'XGA', 'WXGA', 'WUXGA', 'UHD'],
      throwRatio: '',
      throwRatioOptions: ['0-0.5', '0.5-1', '1-1.5', '1.5-2', '2-3', '3-5', '5-10'],
      aspectRatio: '',
      aspectRatioOptions: ['16/10', '16/9', '4/3'],
      weight: '',
      weightOptions: ['0-2', '1-5', '5-10', '10-20', '20-50'],
      showDlgCopyProjector: false,
      copyName: '',
      showDlgChooseProjector: false,
      addProjectorModelName: '',
      addCustomName: '',
      isEdit: false
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    projectors() {
      return this.$store.state.projector.projectors.map(o => {
        return {
          label: o.customName,
          value: o.uId
        }
      })
    },
    selectedProjectorId: {
      get() {
        return this.$store.state.projector.selectedProjectorUid
      },
      set(val) {
        this.SET_SELECTED_PROJECTOR_UID(val)
      }
    },
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    },
    selectedProjectorOptionalLenss() {
      if (!this.selectedProjector) {
        return null
      }
      const modelName = this.selectedProjector.modelName
      return this.$store.state.projector.projectorModels.vvkProjectorModels.find(o => o.ModelName === modelName)['Optional Lens']
    },
    projectorModels() {
      const models = this.$store.state.projector.projectorModels.vvkProjectorModels

      const modelsFiltered = models.filter(o => !this.lensShiftOnly || filterLensShift(o))
        .filter(o => !this.optionalLensOnly || filterOptionalLens(o))
        .filter(o => !this.throwDistance || filterThrowDistance(o, this.throwDistance))
        .filter(o => !this.brightness || filterBrightness(o, this.brightness))
        .filter(o => !this.resolution || filterResolution(o, this.resolution))
        .filter(o => !this.throwRatio || filterThrowRatio(o, this.throwRatio))
        .filter(o => !this.aspectRatio || filterAspectRatio(o, this.aspectRatio))
        .filter(o => !this.weight || filterWeight(o, this.weight))
        .map(o => o.ModelName)

      return modelsFiltered
    },
    projectorModel() {
      return this.$store.state.projector.projectorModels.vvkProjectorModels.find(o => o.ModelName === this.addProjectorModelName)
    }
  },
  watch: {
    projectorModels(val) {
      if (val.length > 0) {
        this.addProjectorModelName = val[0]
        this.addCustomName = val[0]
      } else {
        this.addProjectorModelName = ''
        this.addCustomName = ''
      }
    }
  },
  methods: {
    ...mapMutations('projector', ['ADD_PROJECTOR', 'SET_PROJECTOR', 'SET_PROJECTOR_LENS', 'DELETE_PROJECTOR', 'SET_SELECTED_PROJECTOR_UID',
      'SET_SELECTED_PROJECTOR_TEXTURE']),
    changeSelectedProjector() {
      this.$bus.emit('setProjector', this.selectedProjector)
    },
    changeSelectedProjectorLens(val) {
      const projector = new Projector()
      projector.uId = this.selectedProjector.uId
      projector.lensName = val
      const lens = this.$store.state.projector.projectorLens.vvkOptionalLens.find(o => o['Part Name'] === projector.lensName)
      projector.throwRatio = lens['Throw Ratio'].min
      projector.throwRatioMin = lens['Throw Ratio'].min
      projector.throwRatioMax = lens['Throw Ratio'].max
      projector.minDistance = lens.Distance.min
      projector.maxDistance = lens.Distance.max
      projector.offset = lens.Offset
      this.SET_PROJECTOR_LENS(projector)

      this.$bus.emit('setProjector', this.selectedProjector)
    },
    initDlgChooseProjector() {
      if (this.isEdit) {
        this.addProjectorModelName = this.selectedProjector.modelName
        this.addCustomName = this.selectedProjector.customName
      } else {
        this.addProjectorModelName = 'DH833'
        this.addCustomName = 'DH833'
      }
    },
    changeProjectorType() {
      if (!this.projectorModels) {
        return
      }
      this.addProjectorModelName = this.projectorModels[0]
      this.addCustomName = this.projectorModels[0]
    },
    changeProjectorName(val) {
      this.addCustomName = val
    },
    addModel() {
      if (!this.addProjectorModelName || !this.addCustomName) {
        return
      }

      const projector = new Projector()

      projector.uId = uid()
      projector.customName = this.addCustomName
      projector.modelName = this.addProjectorModelName
      projector.offset = this.projectorModel.Offset
      projector.aspectRatio = eval(this.projectorModel.AspectRatio) // dangerous
      projector.imageAspectRatio = eval(this.projectorModel.AspectRatio) // dangerous
      projector.resolutionX = this.projectorModel.Resolution.width
      projector.resolutionY = this.projectorModel.Resolution.height
      if (this.projectorModel['Throw Ratio']) {
        projector.throwRatio = this.projectorModel['Throw Ratio'].min
        projector.throwRatioMin = this.projectorModel['Throw Ratio'].min
        projector.throwRatioMax = this.projectorModel['Throw Ratio'].max
      }
      if (this.projectorModel['Lens Shift'] && this.projectorModel['Lens Shift'].Horizontal) {
        projector.lensShiftHMin = this.projectorModel['Lens Shift'].Horizontal.min
        projector.lensShiftHMax = this.projectorModel['Lens Shift'].Horizontal.max
      }
      if (this.projectorModel['Lens Shift'] && this.projectorModel['Lens Shift'].Vertical) {
        projector.lensShiftVMin = this.projectorModel['Lens Shift'].Vertical.min
        projector.lensShiftVMax = this.projectorModel['Lens Shift'].Vertical.max
      }
      if (this.projectorModel.Distance) {
        projector.minDistance = this.projectorModel.Distance.min
        projector.maxDistance = this.projectorModel.Distance.max
      }
      if (this.projectorModel['Optional Lens']?.length > 0) {
        projector.lensName = this.projectorModel['Optional Lens'][0]
        const lens = this.$store.state.projector.projectorLens.vvkOptionalLens.find(o => o['Part Name'] === projector.lensName)
        projector.throwRatio = lens['Throw Ratio'].min
        projector.throwRatioMin = lens['Throw Ratio'].min
        projector.throwRatioMax = lens['Throw Ratio'].max
        projector.minDistance = lens.Distance.min
        projector.maxDistance = lens.Distance.max
        projector.offset = lens.Offset
      }
      if (this.isEdit) {
        projector.uId = this.selectedProjectorId
        this.SET_PROJECTOR(projector)
        this.$bus.emit('editProjector', projector.uId)
      } else {
        this.ADD_PROJECTOR(projector)
        this.SET_SELECTED_PROJECTOR_UID(projector.uId)
        this.$bus.emit('addProjector', projector.uId)
      }

      this.showDlgChooseProjector = false
    },
    deleteProjector() {
      showConfirm(this.$t('sureToDelete'), this.$t('yes'), this.$t('cancel'), () => {
        this.DELETE_PROJECTOR(this.selectedProjectorId)
        this.$bus.emit('deleteProjector', this.selectedProjectorId)
        if (this.projectors.length > 0) {
          this.SET_SELECTED_PROJECTOR_UID(this.projectors[0]?.value)
          this.changeSelectedProjector()
        }
      })
    },
    copyProjector() {
      const projector = new Projector()
      Object.keys(this.selectedProjector).forEach(key => {
        projector[key] = this.selectedProjector[key]
      })
      projector.uId = uid()
      projector.customName = this.copyName

      this.ADD_PROJECTOR(projector)

      this.$bus.emit('addProjector', projector.uId)
      this.showDlgCopyProjector = false
    },
    initDlgCopyProjector() {
      this.copyName = `${this.selectedProjector.customName}-copy`
    },
    editProjector() {
      this.showDlgChooseProjector = true
      this.isEdit = true
    }
  }
}
</script>
<style lang="scss">

</style>
