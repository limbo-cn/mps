<template>
  <div class="row q-pa-sm q-pl-md">
    <q-input input-class="mps-input-class" dense v-model.number="xx" @update:modelValue="setLight" :suffix="unitLabel" :title="`${x}${unitLabel}`" type="number" step="1" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          X:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="xx" @update:modelValue="setLight" :min="0" :max="roomWidth" />
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="yy" @update:modelValue="setLight" :suffix="unitLabel" :title="`${y}${unitLabel}`" dense type="number" step="1" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          Y:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="yy" @update:modelValue="setLight" :min="0" :max="roomHeight" />
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="zz" @update:modelValue="setLight" :title="`${z}${unitLabel}`" type="number" step="1" dense :suffix="unitLabel" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          Z:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="zz" @update:modelValue="setLight" :min="0" :max="roomDepth" />
        </div>
      </template>
    </q-input>
  </div>
</template>

<script>

export default {
  name: 'LeftSide-RoomSize',
  data() {
    return {
      x: 5,
      y: 6,
      z: 7.5
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    xx: {
      get() {
        return this.x * this.$store.state.common.unitRatio
      },
      set(val) {
        this.x = val / this.$store.state.common.unitRatio
      }
    },
    yy: {
      get() {
        return this.y * this.$store.state.common.unitRatio
      },
      set(val) {
        this.y = val / this.$store.state.common.unitRatio
      }
    },
    zz: {
      get() {
        return this.z * this.$store.state.common.unitRatio
      },
      set(val) {
        this.z = val / this.$store.state.common.unitRatio
      }
    },
    roomWidth() {
      return this.$store.state.room.width * this.unitRatio
    },
    roomHeight() {
      return this.$store.state.room.height * this.unitRatio
    },
    roomDepth() {
      return this.$store.state.room.depth * this.unitRatio
    }
  },
  methods: {
    setLight() {
      this.$bus.emit('setLight', { x: this.x, y: this.y, z: this.z })
    }
  }
}
</script>
<style lang="scss">

</style>
