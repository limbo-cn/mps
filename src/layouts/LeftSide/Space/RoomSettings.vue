<template>
  <div class="row q-pa-sm q-pl-md">
    <q-input input-class="mps-input-class" dense v-model.number="roomWidth" @update:modelValue="setRoom"
      :suffix="unitLabel" :title="`${roomWidth}${unitLabel}`" type="number" step="1" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          {{ $t('width') }}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="roomWidth" @update:modelValue="setRoom" :min="(3 * unitRatio)" :max="(30 * unitRatio)" />
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="roomHeight" @update:modelValue="setRoom" :suffix="unitLabel"
      :title="`${roomHeight}${unitLabel}`" dense type="number" step="1" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          {{ $t('height') }}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="roomHeight" @update:modelValue="setRoom" :min="(2 * unitRatio)" :max="(20 * unitRatio)" />
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="roomDepth" @update:modelValue="setRoom"
      :title="`${roomDepth}${unitLabel}`" type="number" step="1" dense :suffix="unitLabel" style="width: 100%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:60px">
          {{ $t('depth') }}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm">
          <q-slider v-model="roomDepth" @update:modelValue="setRoom" :min="(5 * unitRatio)" :max="(50 * unitRatio)" />
        </div>
      </template>
    </q-input>
    <q-field dense borderless style="width: 100%">
      <q-checkbox v-model="isShowGrid" @update:modelValue="updateShowGrid" left-label :label="$t('showGrid')" />
    </q-field>
    <q-field dense borderless style="width: 100%" v-show="isShowGrid">
      <div class="text-subtitle">
        {{ $t('gridSize') }} : {{gridSize}} x {{gridSize}}
      </div>
    </q-field>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-RoomSize',
  data() {
    return {
      isShowGrid: false
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    roomWidth: {
      get() {
        return this.$store.state.room.width * this.$store.state.common.unitRatio
      },
      set(val) {
        const roomWidth = val / this.$store.state.common.unitRatio
        this.SET_WIDTH(roomWidth)
      }
    },
    roomHeight: {
      get() {
        return this.$store.state.room.height * this.$store.state.common.unitRatio
      },
      set(val) {
        const roomHeight = val / this.$store.state.common.unitRatio
        this.SET_HEIGHT(roomHeight)
      }
    },
    roomDepth: {
      get() {
        return this.$store.state.room.depth * this.$store.state.common.unitRatio
      },
      set(val) {
        const roomDepth = val / this.$store.state.common.unitRatio
        this.SET_DEPTH(roomDepth)
      }
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    gridSize() {
      return `${1 * this.$store.state.common.unitRatio} ${this.unitLabel}`
    }
  },
  methods: {
    ...mapMutations('room', ['SET_WIDTH', 'SET_HEIGHT', 'SET_DEPTH']),
    setRoom() {
      this.$bus.emit('setRoomSize')
    },
    updateShowGrid(val) {
      this.$bus.emit('updateShowGrid', val)
    }
  }
}
</script>
<style lang="scss">
.mps-input-class {
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
}

.mps-three-label {
  color: white;
  background-color: grey;
  border-radius: 5px;
  padding: 0 3px;
}
</style>
