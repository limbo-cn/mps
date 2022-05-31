<template>
  <div class="row q-pa-sm q-pl-md">
    <q-field dense borderless>
      <template v-slot:control>
        <span class="text-subtitle2 text-grey-7">{{ $t('unit') }}:</span>
        <q-radio size="sm" v-for="optionUnit in optionUnits" :key="optionUnit.value" @update:modelValue="changeUnit"
          v-model="unit" :val="optionUnit.value" :label="optionUnit.label" />
      </template>
    </q-field>
    <q-field dense borderless style="width: 100%;">
      <q-checkbox v-model="isShowRefrence" @update:modelValue="updateShowRefrence" left-label
        :label="$t('showReference')" />
    </q-field>
    <q-field dense borderless style="width: 100%;">
      <q-checkbox v-model="isShowProjectorInterfere" @update:modelValue="updateShowProjectorInterfere" left-label
        :label="$t('showProjectorInterfere')" />
    </q-field>
    <q-field dense borderless style="width: 100%;">
      <q-checkbox v-model="isShowProjectionDistanceRefrence" @update:modelValue="updateShowProjectionDistanceRefrence"
        left-label :label="$t('showProjectionDistanceRefrence')" />
    </q-field>
    <q-field dense borderless style="width: 100%;">
      <q-checkbox v-model="isShowLightBound" @update:modelValue="updateShowLightBound" left-label
        :label="$t('showProjectorLightBound')" />
    </q-field>
    <q-field dense borderless style="width: 100%;">
      <q-checkbox v-model="isShowDistanceHelper" @update:modelValue="updateShowDistanceHelper" left-label
        :label="$t('showDistanceHelper')" />
    </q-field>
    <q-field dense borderless>
      <q-input input-class="mps-input-class" v-model.number="roomBrightness" @update:modelValue="updateRoomBrightness"
        suffix="lx" dense type="number" step="1" :min="0" :max="500" style="width: 100%">
        <template v-slot:prepend>
          <div class="text-subtitle2" style="width:120px">{{ $t('roomBrightness') }}:</div>
          <div style="width:120px" class="q-pl-sm q-pr-sm">
            <q-slider v-model="roomBrightness" @update:modelValue="updateRoomBrightness" :min="0" :max="500" />
          </div>
        </template>
      </q-input>
    </q-field>
  </div>
</template>

<script>
import { unitRatio, unitType } from 'src/helper/enum'
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-BasicSettings',
  data() {
    return {
      unit: unitType.m,
      isShowRefrence: true,
      isShowProjectorInterfere: false,
      isShowProjectionDistanceRefrence: false,
      isShowLightBound: true,
      isShowDistanceHelper: false
    }
  },
  computed: {
    roomBrightness: {
      get() {
        return this.$store.state.room.brightness
      },
      set(val) {
        this.SET_BRIGHTNESS(val)
      }
    },
    optionUnits() {
      return [
        { label: 'm', value: unitType.m },
        { label: 'cm', value: unitType.cm },
        { label: 'mm', value: unitType.mm },
        { label: 'inch', value: unitType.inch },
        { label: 'feet', value: unitType.feet }
      ]
    }
  },
  methods: {
    ...mapMutations('common', ['SET_UNIT_LABEL', 'SET_UNIT_RATIO']),
    ...mapMutations('room', ['SET_BRIGHTNESS']),
    updateShowRefrence(val) {
      this.$bus.emit('updateShowRefrence', val)
    },
    updateShowProjectorInterfere(val) {
      this.$bus.emit('updateShowProjectorInterfere', val)
    },
    updateShowProjectionDistanceRefrence(val) {
      this.$bus.emit('updateShowProjectionDistanceRefrence', val)
    },
    updateShowLightBound(val) {
      this.$bus.emit('updateShowLightBound', val)
    },
    updateShowDistanceHelper(val) {
      this.$bus.emit('updateShowDistanceHelper', val)
    },
    changeUnit(val) {
      if (val === unitType.m) {
        this.SET_UNIT_LABEL('m')
        this.SET_UNIT_RATIO(unitRatio.m)
      } else if (val === unitType.cm) {
        this.SET_UNIT_LABEL('cm')
        this.SET_UNIT_RATIO(unitRatio.cm)
      } else if (val === unitType.mm) {
        this.SET_UNIT_LABEL('mm')
        this.SET_UNIT_RATIO(unitRatio.mm)
      } else if (val === unitType.inch) {
        this.SET_UNIT_LABEL(this.$t('inch'))
        this.SET_UNIT_RATIO(unitRatio.inch)
      } else if (val === unitType.feet) {
        this.SET_UNIT_LABEL(this.$t('feet'))
        this.SET_UNIT_RATIO(unitRatio.feet)
      }
    },
    updateRoomBrightness(val) {
      this.$bus.emit('updateRoomBrightness', val)
    }
  }
}
</script>
<style lang="scss">
</style>
