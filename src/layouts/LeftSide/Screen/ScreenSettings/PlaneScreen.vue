<template>
  <q-select
    dense
    v-model="planeAspectRatio"
    @update:modelValue="changePlaneAspectRatio"
    :options="aspectRatios"
    emit-value
    map-options
    option-value="value"
    option-label="label"
    style="width:95%"
    behavior="menu"
  >
    <template v-slot:prepend>
      <div class="text-subtitle2">{{ $t('aspectRatio') }}:</div>
    </template>
  </q-select>
  <q-input
    input-class="mps-input-class"
    v-model.number="planeDiagonal"
    :readonly="planeAspectRatio === 0"
    @update:modelValue="changePlaneDiagonal"
    dense
    :suffix="$t('inch')"
    :title="`${planeDiagonal}${$t('inch')}`"
    type="number"
    step="1"
    style="width:95%"
  >
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">{{ $t('diagonal') }}:</div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider
          :disable="planeAspectRatio === 0"
          v-model="planeDiagonal"
          @update:modelValue="changePlaneDiagonal"
          :min="0"
          :max="1000"
        />
      </div>
    </template>
  </q-input>
  <q-input
    input-class="mps-input-class"
    v-model.number="planeWdith"
    :readonly="planeAspectRatio !== 0"
    @update:modelValue="changePlaneSize"
    dense
    :suffix="unitLabel"
    :title="`${planeWdith}${unitLabel}`"
    type="number"
    step="0.1"
    style="width:95%"
  >
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">{{ $t('width') }}:</div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider
          :disable="planeAspectRatio !== 0"
          v-model="planeWdith"
          @update:modelValue="changePlaneSize"
          :min="0"
          :max="30 * unitRatio"
        />
      </div>
    </template>
  </q-input>
  <q-input
    input-class="mps-input-class"
    v-model.number="planeHeight"
    :readonly="planeAspectRatio !== 0"
    @update:modelValue="changePlaneSize"
    dense
    :suffix="unitLabel"
    :title="`${planeHeight}${unitLabel}`"
    type="number"
    step="0.1"
    style="width:95%"
  >
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">{{ $t('height') }}:</div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider
          :disable="planeAspectRatio !== 0"
          v-model="planeHeight"
          @update:modelValue="changePlaneSize"
          :min="0"
          :max="20 * unitRatio"
        />
      </div>
    </template>
  </q-input>
</template>

<script>
import { screenType, unitRatio } from 'src/helper/enum'
import { mapMutations } from 'vuex'

export default {
  name: 'ScreenSettings-PlaneScreen',
  props: ['aspectRatios', 'unitLabel'],
  data() {
    return {
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    planeAspectRatio: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].plane.aspectRatio
      },
      set(val) {
        this.SET_PLANE_ASPECT_RATIO(val)
      }
    },
    planeDiagonal: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].plane.diagonal
      },
      set(val) {
        this.SET_PLANE_DIAGONAL(val)
      }
    },
    planeWdith: {
      get() {
        return (this.$store.state.screen.screens[this.$store.state.screen.screenPosition].plane.width * this.$store.state.common.unitRatio)
      },
      set(val) {
        this.SET_PLANE_WIDTH(val / this.$store.state.common.unitRatio)
      }
    },
    planeHeight: {
      get() {
        return (this.$store.state.screen.screens[this.$store.state.screen.screenPosition].plane.height * this.$store.state.common.unitRatio)
      },
      set(val) {
        this.SET_PLANE_HEIGHT(val / this.$store.state.common.unitRatio)
      }
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_PLANE_ASPECT_RATIO', 'SET_PLANE_DIAGONAL', 'SET_PLANE_WIDTH', 'SET_PLANE_HEIGHT']),
    setScreen() {
      this.$bus.emit('setScreen', screenType.plane)
    },
    changePlaneAspectRatio(val) {
      if (val === 0) {
        return
      }
      this.changePlaneDiagonal(this.planeDiagonal)
    },
    changePlaneDiagonal(val) {
      const diagonalM = val / unitRatio.inch
      const aspectAngle = Math.atan(this.planeAspectRatio)
      const width = diagonalM * Math.sin(aspectAngle)
      const height = diagonalM * Math.cos(aspectAngle)
      this.SET_PLANE_WIDTH(width.toFixed(2))
      this.SET_PLANE_HEIGHT(height.toFixed(2))
      this.setScreen()
    },
    changePlaneSize() {
      const screen = this.$store.state.screen.screens[this.$store.state.screen.screenPosition]
      const diagonal = Math.sqrt(Math.pow(screen.plane.width, 2) + Math.pow(screen.plane.height, 2)) * unitRatio.inch
      this.SET_PLANE_DIAGONAL(diagonal.toFixed(2))
      this.setScreen()
    }
  }
}
</script>
<style lang="scss">
</style>
