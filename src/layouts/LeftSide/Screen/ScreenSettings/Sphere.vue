<template>
  <q-select dense v-model="pattern" @update:modelValue="changePattern" :options="patterns" emit-value map-options option-value="value" option-label="label" style="width:95%" behavior="menu">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('patterns')}}:
      </div>
    </template>
  </q-select>
  <q-input input-class="mps-input-class" v-model.number="sphereRadius" @update:modelValue="setScreen" dense :suffix="unitLabel" :title="`${sphereRadius}${unitLabel}`" type="number" step="0.1" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:60px">
        {{$t('radius')}}:
      </div>
      <div style="width:150px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="sphereRadius" @update:modelValue="setScreen" :step="0.1*unitRatio" :min="0" :max="10*unitRatio" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="spherePhiStart" @update:modelValue="setScreen" dense suffix="°" :title="`${spherePhiStart}°`" type="number" step="1" min="0" max="360" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:120px">
        {{$t('horizontalStartAngle')}}:
      </div>
      <div style="width:100px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="spherePhiStart" @update:modelValue="setScreen" :min="0" :max="360" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="spherePhiLength" @update:modelValue="setScreen" dense suffix="°" :title="`${spherePhiLength}°`" type="number" step="1" min="0" max="360" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:120px">
        {{$t('horizontalOccupyAngle')}}:
      </div>
      <div style="width:100px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="spherePhiLength" @update:modelValue="setScreen" :min="0" :max="360" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="sphereThetaStart" @update:modelValue="setScreen" dense suffix="°" :title="`${sphereThetaStart}°`" type="number" step="1" min="0" :max="180 - sphereThetaEnd" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:120px">
        {{$t('verticalTopCutAngle')}}:
      </div>
      <div style="width:100px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="sphereThetaStart" @update:modelValue="setScreen" :min="0" :max="180 - sphereThetaEnd" />
      </div>
    </template>
  </q-input>
  <q-input input-class="mps-input-class" v-model.number="sphereThetaEnd" @update:modelValue="setScreen" dense suffix="°" :title="`${sphereThetaEnd}°`" type="number" step="1" min="0" :max="180 - sphereThetaStart" style="width:95%">
    <template v-slot:prepend>
      <div class="text-subtitle2" style="width:120px">
        {{$t('verticalBottomCutAngle')}}:
      </div>
      <div style="width:100px" class="q-pl-sm q-pr-sm">
        <q-slider v-model="sphereThetaEnd" @update:modelValue="setScreen" :min="0" :max="180 - sphereThetaStart" />
      </div>
    </template>
  </q-input>
</template>

<script>
import { screenType } from 'src/helper/enum'
import { mapMutations } from 'vuex'

const patternType = {
  defaultPattern: 0,
  halfSphere: 1,
  halfSphere2: 2,
  partialSphere: 3
}

export default {
  name: 'ScreenSettings-SphereScreen',
  props: ['unitLabel'],
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
        { label: this.$t('halfSphere'), value: patternType.halfSphere },
        { label: `${this.$t('halfSphere')}2`, value: patternType.halfSphere2 },
        { label: this.$t('partialSphere'), value: patternType.partialSphere }
      ]
    },
    sphereRadius: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].sphere.radius * this.$store.state.common.unitRatio
      },
      set(val) {
        this.SET_SPHERE_RADIUS(val / this.$store.state.common.unitRatio)
      }
    },
    spherePhiStart: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].sphere.phiStart
      },
      set(val) {
        this.SET_SPHERE_PHI_START(val)
      }
    },
    spherePhiLength: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].sphere.phiLength
      },
      set(val) {
        this.SET_SPHERE_PHI_LENGTH(val)
      }
    },
    sphereThetaStart: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].sphere.thetaStart
      },
      set(val) {
        this.SET_SPHERE_THETA_START(val)
      }
    },
    sphereThetaEnd: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].sphere.thetaEnd
      },
      set(val) {
        this.SET_SPHERE_THETA_END(val)
      }
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_SPHERE_RADIUS', 'SET_SPHERE_PHI_START',
      'SET_SPHERE_PHI_LENGTH', 'SET_SPHERE_THETA_START', 'SET_SPHERE_THETA_END']),
    setScreen() {
      this.$bus.emit('setScreen', screenType.sphere)
    },
    changePattern(val) {
      if (val === patternType.defaultPattern) {
        this.sphereRadius = 2
        this.spherePhiStart = 0
        this.spherePhiLength = 360
        this.sphereThetaStart = 0
        this.sphereThetaEnd = 0
      } else if (val === patternType.halfSphere) {
        this.sphereRadius = 2
        this.spherePhiStart = 0
        this.spherePhiLength = 180
        this.sphereThetaStart = 0
        this.sphereThetaEnd = 0
      } else if (val === patternType.halfSphere2) {
        this.sphereRadius = 2
        this.spherePhiStart = 0
        this.spherePhiLength = 360
        this.sphereThetaStart = 0
        this.sphereThetaEnd = 90
      } else if (val === patternType.partialSphere) {
        this.spherePhiStart = 0
        this.spherePhiLength = 180
        this.sphereThetaStart = 50
        this.sphereThetaEnd = 50
      }

      this.setScreen()
    }
  }
}
</script>
<style lang="scss">

</style>
