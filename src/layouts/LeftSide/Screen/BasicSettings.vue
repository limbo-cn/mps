<template>
  <div class="row q-pa-sm q-pl-md">
    <q-select
      dense
      v-model="screenPosition"
      :options="screenPositions"
      emit-value
      map-options
      option-value="value"
      option-label="label"
      style="width:95%"
      behavior="menu"
    >
      <template v-slot:prepend>
        <div class="text-subtitle2">{{ $t('screenPosition') }}:</div>
      </template>
    </q-select>
  </div>
</template>

<script>
import { ScreenPosition } from 'src/helper/enum'
import { mapMutations } from 'vuex'

export default {
  name: 'Screen-BasicSettings',
  data() {
    return {

    }
  },
  computed: {
    screenPosition: {
      get() {
        return this.$store.state.screen.screenPosition
      },
      set(val) {
        this.SET_SCREEN_POSTION(val)
      }
    },
    screenPositions() {
      return [
        { label: this.$t('front'), value: ScreenPosition.front },
        { label: this.$t('left'), value: ScreenPosition.left },
        { label: this.$t('right'), value: ScreenPosition.right },
        { label: this.$t('back'), value: ScreenPosition.back },
        { label: this.$t('top'), value: ScreenPosition.top },
        { label: this.$t('bottom'), value: ScreenPosition.bottom }
      ]
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_SCREEN_POSTION'])
  }
}
</script>
<style lang="scss">
</style>
