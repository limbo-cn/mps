<template>
  <div class="q-pa-sm q-pl-md">
    <div class="text-body1">{{ $t('single') }}</div>
    <div class="q-gutter-sm row q-pa-sm">
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('desktop')" @click="desktop" />
      </div>
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('ceiling')" @click="ceiling" />
      </div>
      <div class="col-5 text-center">
        <q-btn
          class="full-width"
          v-show="screenType === 0"
          outline
          color="primary"
          :label="$t('fullScreen')"
          @click="fullscreen"
        />
      </div>
    </div>
    <div class="text-body1">{{ $t('multiple') }}</div>
    <div
      class="text-subtitle2 text-primary q-pa-sm"
      v-if="selectedRows.length === 0"
    >{{ $t('selectProjectors') }}</div>
    <div class="q-gutter-sm row q-pa-sm" v-show="selectedRows.length > 0">
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('xAlign')" @click="xAlign" />
      </div>
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('yAlign')" @click="yAlign" />
      </div>
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('zAlign')" @click="zAlign" />
      </div>
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('row')" @click="row" />
      </div>
      <div class="col-5 text-center">
        <q-btn class="full-width" outline color="primary" :label="$t('column')" @click="column" />
      </div>
      <q-input v-model="gridX" type="number" min="1" max="10" style="width:85%">
        <template v-slot:prepend>
          <div class="text-subtitle2">x:</div>
        </template>
        <template v-slot:append>
          <q-btn outline color="primary" :label="$t('grid')" @click="grid" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default ({
  name: 'Projector-Detail',
  data() {
    return {
      gridX: 3
    }
  },
  computed: {
    screenType() {
      return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].screenType
    },
    selectedRows: {
      get() {
        return this.$store.state.projector.selectedProjectors
      },
      set(val) {
        this.SET_SELECTED_PROJECTORS(val)
      }
    },
    selectedProjectorId: {
      get() {
        return this.$store.state.projector.selectedProjectorUid
      },
      set(val) {
        this.SET_SELECTED_PROJECTOR_UID(val)
      }
    },
    projectors() {
      return this.$store.state.projector.projectors.map(o => {
        return {
          label: `${o.customName}(${o.modelName})`,
          value: o.uId
        }
      })
    },
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_SELECTED_PROJECTOR_UID', 'SET_SELECTED_PROJECTORS',
      'SET_PROJECTORS_X', 'SET_PROJECTORS_Y', 'SET_PROJECTORS_Z', 'SET_SELECTED_PROJECTOR_ROTATE_Z',
      'SET_SELECTED_PROJECTOR_X', 'SET_SELECTED_PROJECTOR_Y', 'SET_SELECTED_PROJECTOR_Z',
      'SET_SELECTED_PROJECTOR_ROTATE_X', 'SET_SELECTED_PROJECTOR_ROTATE_Y', 'SET_SELECTED_PROJECTOR_ROTATE_Z']),
    changeSelectedProjector() {
      this.$bus.emit('setProjector', this.selectedProjector)
    },
    xAlign() {
      this.SET_PROJECTORS_X({ projectors: this.selectedRows, value: this.selectedProjector.x })
      this.setProjectors(this.selectedRows)
    },
    yAlign() {
      this.SET_PROJECTORS_Y({ projectors: this.selectedRows, value: this.selectedProjector.y })
      this.setProjectors(this.selectedRows)
    },
    zAlign() {
      this.SET_PROJECTORS_Z({ projectors: this.selectedRows, value: this.selectedProjector.z })
      this.setProjectors(this.selectedRows)
    },
    row() {
      this.SET_PROJECTORS_Y({ projectors: this.selectedRows, value: this.selectedProjector.y })
      this.SET_PROJECTORS_Z({ projectors: this.selectedRows, value: this.selectedProjector.z })
      const screenWidth = this.selectedProjector.projectionDistance / this.selectedProjector.throwRatio
      let count = 1
      this.selectedRows.forEach(row => {
        if (row.uId === this.selectedProjector.uId) {
          return
        }
        if (count % 2 === 0) {
          this.SET_PROJECTORS_X({ projectors: [row], value: this.selectedProjector.x - screenWidth * Math.ceil(count / 2) })
        } else {
          this.SET_PROJECTORS_X({ projectors: [row], value: this.selectedProjector.x + screenWidth * Math.ceil(count / 2) })
        }
        count++
      })

      this.setProjectors(this.selectedRows)
    },
    column() {
      this.SET_PROJECTORS_X({ projectors: this.selectedRows, value: this.selectedProjector.x })
      this.SET_PROJECTORS_Z({ projectors: this.selectedRows, value: this.selectedProjector.z })
      const screenWidth = this.selectedProjector.projectionDistance / this.selectedProjector.throwRatio
      const screenHeight = screenWidth / this.selectedProjector.aspectRatio
      let count = 1
      this.selectedRows.forEach(row => {
        if (row.uId === this.selectedProjector.uId) {
          return
        }
        if (count % 2 === 0) {
          this.SET_PROJECTORS_Y({ projectors: [row], value: this.selectedProjector.y - screenHeight * Math.ceil(count / 2) })
        } else {
          this.SET_PROJECTORS_Y({ projectors: [row], value: this.selectedProjector.y + screenHeight * Math.ceil(count / 2) })
        }
        count++
      })

      this.setProjectors(this.selectedRows)
    },
    fullscreen() {
      const screen = this.$store.state.screen.screens[this.$store.state.screen.screenPosition]
      const screenWidth = screen.plane.width
      const screenHeight = screen.plane.height
      const screenAspectratio = screen.plane.width / screen.plane.height
      const projectionAspectratio = this.selectedProjector.aspectRatio
      let targetProjectionDistance = 0
      if (screenAspectratio > projectionAspectratio) {
        const projectionHeight = screenHeight
        const projectionWidth = projectionHeight * projectionAspectratio
        targetProjectionDistance = projectionWidth * this.selectedProjector.throwRatio
      } else {
        const projectionWidth = screenWidth
        targetProjectionDistance = projectionWidth * this.selectedProjector.throwRatio
      }
      const fixTanV = 1 / this.selectedProjector.throwRatio / this.selectedProjector.aspectRatio / 2
      const lenShiftTopRatio = 1 + (this.selectedProjector.lensShiftV * 2 + this.selectedProjector.offset) / 100
      const fixedAngleTop = Math.atan(fixTanV * lenShiftTopRatio)
      const lenShiftBottomRatio = 1 - (this.selectedProjector.lensShiftV * 2 + this.selectedProjector.offset) / 100
      const fixedAngleBottom = Math.atan(fixTanV * lenShiftBottomRatio)

      const fixTanH = 1 / this.selectedProjector.throwRatio / 2
      const lenShiftLeftRatio = 1 + this.selectedProjector.lensShiftH * 2 / 100
      const fixedAngleRight = Math.atan(fixTanH * lenShiftLeftRatio)
      const lenShiftRightRatio = 1 - this.selectedProjector.lensShiftH * 2 / 100
      const fixedAngleLeft = Math.atan(fixTanH * lenShiftRightRatio)

      const fixedAngleCenterV = (fixedAngleTop - fixedAngleBottom) / 2
      const fixedAngleCenterH = (fixedAngleLeft - fixedAngleRight) / 2
      const zOffset = targetProjectionDistance
      const yOffset = Math.tan(fixedAngleCenterV) * targetProjectionDistance
      const xOffset = Math.sin(fixedAngleCenterH) * targetProjectionDistance

      // console.log(this.selectedProjector.projectionDistance, targetProjectionDistance)
      this.SET_SELECTED_PROJECTOR_X(screen.x + xOffset)
      this.SET_SELECTED_PROJECTOR_Y(screen.y - yOffset)
      this.SET_SELECTED_PROJECTOR_Z(screen.z + zOffset)
      this.SET_SELECTED_PROJECTOR_ROTATE_X(0)
      this.SET_SELECTED_PROJECTOR_ROTATE_Y(0)
      this.SET_SELECTED_PROJECTOR_ROTATE_Z(0)

      this.setProjector()
    },
    desktop() {
      this.SET_SELECTED_PROJECTOR_ROTATE_Z(0)
      this.setProjector()
    },
    ceiling() {
      this.SET_SELECTED_PROJECTOR_ROTATE_Z(180)
      this.setProjector()
    },
    grid() {
      this.SET_PROJECTORS_Z({ projectors: this.selectedRows, value: this.selectedProjector.z })
      const screenWidth = this.selectedProjector.projectionDistance / this.selectedProjector.throwRatio
      const screenHeight = screenWidth / this.selectedProjector.aspectRatio
      let rowCount = 0
      let colCount = 1
      this.selectedRows.forEach(row => {
        if (row.uId === this.selectedProjector.uId) {
          return
        }
        this.SET_PROJECTORS_X({ projectors: [row], value: this.selectedProjector.x - screenWidth * colCount })
        this.SET_PROJECTORS_Y({ projectors: [row], value: this.selectedProjector.y - screenHeight * rowCount })
        colCount++
        if (colCount >= this.gridX) {
          colCount = 0
          rowCount++
        }
      })

      this.setProjectors(this.selectedRows)
    },
    setProjector() {
      this.$bus.emit('setProjector', this.selectedProjector)
    },
    setProjectors(projectors) {
      this.$bus.emit('setProjectors', projectors)
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
<style lang="sass">

</style>
