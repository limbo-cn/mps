<template>
  <q-select dense v-model="pattern" @update:modelValue="changePattern" :options="patterns" emit-value map-options option-value="value" option-label="label" style="width:95%" behavior="menu">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('patterns')}}:
      </div>
    </template>
  </q-select>
  <q-input v-model.number="radialSegments" :disable="isSmooth" @update:modelValue="setScreen" dense :title="`${radialSegments}`" type="number" min="3" max="10" step="1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('edges')}}:
      </div>
    </template>
    <template v-slot:after>
      <q-checkbox v-model="isSmooth" @update:modelValue="setScreen" :label="$t('smooth')" class="text-subtitle2" />
    </template>
  </q-input>
  <q-select dense v-model="curvedAspectRatio" @update:modelValue="changeCurvedAspectRatio" :options="aspectRatios" emit-value map-options option-value="value" option-label="label" style="width:95%" behavior="menu">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('aspectRatio')}}:
      </div>
    </template>
  </q-select>
  <q-input input-class="mps-input-class" v-model.number="curvedDiagonal" :readonly="curvedAspectRatio === 0" @update:modelValue="changeCurvedDiagonal" dense :suffix="$t('inch')" :title="`${curvedDiagonal}${$t('inch')}`" type="number" step="1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">
        {{$t('diagonal')}}:
      </div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider :disable="curvedAspectRatio === 0" v-model="curvedDiagonal" @update:modelValue="changeCurvedDiagonal" :min="0" :max="1000" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="curvedWdith" :readonly="curvedAspectRatio !== 0" @update:modelValue="changeCurvedSize" dense :suffix="unitLabel" :title="`${curvedWdith}${unitLabel}`" type="number" step="0.1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">
        {{$t('width')}}:
      </div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider :disable="curvedAspectRatio !== 0" v-model="curvedWdith" @update:modelValue="changeCurvedSize" :min="0" :max="30*unitRatio" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="curvedHeight" :readonly="curvedAspectRatio !== 0" @update:modelValue="changeCurvedSize" dense :suffix="unitLabel" :title="`${curvedHeight}${unitLabel}`" type="number" step="0.1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">
        {{$t('height')}}:
      </div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider :disable="curvedAspectRatio !== 0" v-model="curvedHeight" @update:modelValue="changeCurvedSize" :min="0" :max="20*unitRatio" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="curvedRadius" @update:modelValue="setScreen" dense :suffix="unitLabel" :title="`${curvedRadius}${unitLabel}`" type="number" step="0.1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">
        {{$t('radius')}}:
      </div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="curvedRadius" @update:modelValue="setScreen" :step="0.1*unitRatio" :min="0" :max="10*unitRatio" />
      </div>
    </template>
  </q-input>
</template>

<script>
import { screenType, unitRatio } from 'src/helper/enum'
import { mapMutations } from 'vuex'

const patternType = {
  defaultPattern: 0,
  halfSurround: 1,
  surround: 2,
  wall3: 3,
  wall4: 4
}

export default {
  name: 'ScreenSettings-CurvedScreen',
  props: ['aspectRatios', 'unitLabel'],
  data() {
    return {
      pattern: 0
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    patterns() {
      return [
        { label: this.$t('default'), value: patternType.defaultPattern },
        { label: this.$t('halfSurround'), value: patternType.halfSurround },
        { label: this.$t('surround'), value: patternType.surround },
        { label: this.$t('threeSideWall'), value: patternType.wall3 },
        { label: this.$t('fourSideWall'), value: patternType.wall4 }
      ]
    },
    curvedAspectRatio: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.aspectRatio
      },
      set(val) {
        this.SET_CURVED_ASPECT_RATIO(val)
      }
    },
    curvedDiagonal: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.diagonal
      },
      set(val) {
        this.SET_CURVED_DIAGONAL(val)
      }
    },
    radialSegments: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.radialSegments
      },
      set(val) {
        this.SET_CURVED_RADIAL_SEGMENTS(val)
      }
    },
    isSmooth: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.isSmooth
      },
      set(val) {
        this.SET_CURVED_IS_SMOOTH(val)
      }
    },
    curvedWdith: {
      get() {
        return (this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.width * this.$store.state.common.unitRatio)
      },
      set(val) {
        this.SET_CURVED_WIDTH(val / this.$store.state.common.unitRatio)
      }
    },
    curvedHeight: {
      get() {
        return (this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.height * this.$store.state.common.unitRatio)
      },
      set(val) {
        this.SET_CURVED_HEIGHT(val / this.$store.state.common.unitRatio)
      }
    },
    curvedRadius: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].curved.radius * this.$store.state.common.unitRatio
      },
      set(val) {
        this.SET_CURVED_RADIUS(val / this.$store.state.common.unitRatio)
      }
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_CURVED_ASPECT_RATIO', 'SET_CURVED_DIAGONAL',
      'SET_CURVED_WIDTH', 'SET_CURVED_HEIGHT', 'SET_CURVED_RADIUS', 'SET_CURVED_RADIAL_SEGMENTS',
      'SET_CURVED_IS_SMOOTH']),
    setScreen() {
      this.$bus.emit('setScreen', screenType.curved)
    },
    changePattern(val) {
      if (val === patternType.defaultPattern) {
        this.curvedAspectRatio = 16 / 9
        this.curvedDiagonal = 200
        this.curvedRadius = 5 * this.$store.state.common.unitRatio
        this.changeCurvedDiagonal()
      } else if (val === patternType.halfSurround) {
        this.curvedAspectRatio = 0
        this.curvedWdith = 2 * Math.PI * this.$store.state.common.unitRatio
        this.curvedHeight = 3 * this.$store.state.common.unitRatio
        this.curvedRadius = 2 * this.$store.state.common.unitRatio
        this.isSmooth = true
        this.changeCurvedSize()
      } else if (val === patternType.surround) {
        this.curvedAspectRatio = 0
        this.curvedWdith = 4 * Math.PI * 2 * this.$store.state.common.unitRatio
        this.curvedHeight = 3 * this.$store.state.common.unitRatio
        this.curvedRadius = 4 * this.$store.state.common.unitRatio
        this.isSmooth = true
        this.changeCurvedSize()
      } else if (val === patternType.wall3) {
        this.curvedAspectRatio = 0
        this.curvedWdith = 28.5 * this.$store.state.common.unitRatio
        this.curvedHeight = 5 * this.$store.state.common.unitRatio
        this.curvedRadius = 6 * this.$store.state.common.unitRatio
        this.isSmooth = false
        this.radialSegments = 3
        this.changeCurvedSize()
      } else if (val === patternType.wall4) {
        this.curvedAspectRatio = 0
        this.curvedWdith = 17 * this.$store.state.common.unitRatio
        this.curvedHeight = 5 * this.$store.state.common.unitRatio
        this.curvedRadius = 4 * this.$store.state.common.unitRatio
        this.isSmooth = false
        this.radialSegments = 4
        this.changeCurvedSize()
      }
    },
    changeCurvedAspectRatio(val) {
      if (val === 0) {
        return
      }
      this.changeCurvedDiagonal()
    },
    changeCurvedDiagonal() {
      const diagonalM = this.curvedDiagonal / unitRatio.inch
      const aspectAngle = Math.atan(this.curvedAspectRatio)
      const width = diagonalM * Math.sin(aspectAngle)
      const height = diagonalM * Math.cos(aspectAngle)
      this.SET_CURVED_WIDTH(width.toFixed(2))
      this.SET_CURVED_HEIGHT(height.toFixed(2))
      this.setScreen()
    },
    changeCurvedSize() {
      const screen = this.$store.state.screen.screens[this.$store.state.screen.screenPosition]
      const diagonal = Math.sqrt(Math.pow(screen.curved.width, 2) + Math.pow(screen.curved.height, 2)) * unitRatio.inch
      this.SET_CURVED_DIAGONAL(diagonal.toFixed(2))
      this.setScreen()
    }
  }
}
</script>
<style lang="scss">

</style>
