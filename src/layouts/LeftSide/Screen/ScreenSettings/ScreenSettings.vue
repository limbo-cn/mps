<template>
  <div class="q-pa-sm q-pl-md row">
    <q-select dense v-model="screenType" @update:modelValue="setScreen" :options="screenTypes" emit-value map-options
      option-value="value" option-label="label" style="width:95%" behavior="menu">
      <template v-slot:prepend>
        <div class="text-subtitle2">{{ $t('screenType') }}:</div>
      </template>
    </q-select>

    <q-input v-show="screenType !== 100" v-model.number="screenGain" suffix="lx" dense type="number" step="1" :min="0"
      style="width: 95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">{{ $t('screenGain') }}:</div>
      </template>
    </q-input>

    <PlaneScreen v-if="screenType === 0" :aspectRatios="aspectRatios" :unitLabel="unitLabel" />
    <CurvedScreen v-if="screenType === 1" :aspectRatios="aspectRatios" :unitLabel="unitLabel" />
    <Sphere v-if="screenType === 2" :unitLabel="unitLabel" />
    <Custom v-if="screenType === 3" />
  </div>
</template>

<script>
import { screenType } from 'src/helper/enum'
import { mapMutations } from 'vuex'

import PlaneScreen from './PlaneScreen'
import CurvedScreen from './CurvedScreen'
import Sphere from './Sphere'
import Custom from './Custom'

export default {
  name: 'LeftSide-ScreenSettings',
  components: {
    PlaneScreen,
    CurvedScreen,
    Sphere,
    Custom
  },
  data() {
    return {
    }
  },
  computed: {
    aspectRatios() {
      return [
        { label: '16:9', value: 16 / 9 },
        { label: '16:10', value: 16 / 10 },
        { label: '4:3', value: 4 / 3 },
        { label: '17:9', value: 17 / 9 },
        { label: '2.35:1', value: 2.35 / 1 },
        { label: '1:1', value: 1 / 1 },
        { label: this.$t('custom'), value: 0 }
      ]
    },
    screenType: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].screenType
      },
      set(val) {
        this.SET_SCREEN_TYPE(val)
      }
    },
    screenGain: {
      get() {
        return this.$store.state.screen.screenGain
      },
      set(val) {
        this.SET_SCREEN_GAIN(val)
      }
    },
    screenTypes() {
      return [
        { label: this.$t('none'), value: screenType.none },
        { label: this.$t('planeScreen'), value: screenType.plane },
        { label: this.$t('curvedScreen'), value: screenType.curved },
        { label: this.$t('SphereScreen'), value: screenType.sphere },
        { label: this.$t('custom'), value: screenType.custom }
      ]
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_SCREEN_TYPE', 'SET_SCREEN_GAIN']),
    setScreen() {
      this.$bus.emit('setScreen', this.screenType)
      window.gtag('event', `SetScreenShape-${this.screenType}`)
    }
  }
}
</script>
<style lang="scss">
</style>
