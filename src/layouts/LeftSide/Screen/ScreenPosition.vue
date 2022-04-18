<template>
  <div class="q-pa-sm q-pl-md row">
    <q-btn outline color="primary" :label="$t('autoAdjust')" @click="autoAdjust" style="width: 95%" />
    <q-input input-class="mps-input-class" v-model.number="x" @update:modelValue="setScreenPosition" :suffix="unitLabel" :title="`${x}${unitLabel}`" dense type="number" step="0.1" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:30px">
          X:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider v-model="x" @update:modelValue="setScreenPosition" :step="0.1 * unitRatio" :min="-15*unitRatio" :max="15*unitRatio" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="resetX" icon="refresh" />
          </div>
        </div>
      </template>
      <template v-slot:append>

      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="y" @update:modelValue="setScreenPosition" :suffix="unitLabel" :title="`${y}${unitLabel}`" dense type="number" step="0.1" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:30px">
          Y:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider v-model="y" @update:modelValue="setScreenPosition" :step="0.1 * unitRatio" :min="-10*unitRatio" :max="10*unitRatio" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="resetY" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-model.number="z" @update:modelValue="setScreenPosition" :title="`${z}${unitLabel}`" dense type="number" step="0.1" :suffix="unitLabel" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2" style="width:30px">
          Z:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <q-slider v-model="z" @update:modelValue="setScreenPosition" :step="0.1 * unitRatio" :min="-25*unitRatio" :max="25*unitRatio" />
        </div>
      </template>
    </q-input>
    <q-input v-show="false" input-class="mps-input-class" v-model.number="rotateX" @update:modelValue="setScreenPosition" :title="`${rotateX}°`" dense type="number" step="1" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateX')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider v-model="rotateX" @update:modelValue="setScreenPosition" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{rotateX = 0;setScreenPosition()}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input v-show="false" input-class="mps-input-class" v-model.number="rotateY" @update:modelValue="setScreenPosition" :title="`${rotateY}°`" dense type="number" step="1" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateY')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider v-model="rotateY" @update:modelValue="setScreenPosition" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{rotateY = 0;setScreenPosition()}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input v-show="false" input-class="mps-input-class" v-model.number="rotateZ" @update:modelValue="setScreenPosition" :title="`${rotateZ}°`" dense type="number" step="1" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateZ')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider v-model="rotateZ" @update:modelValue="setScreenPosition" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{rotateZ = 0;setScreenPosition()}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-ScreenPosition',
  data() {
    return {
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    x: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].x * this.$store.state.common.unitRatio
      },
      set(val) {
        const x = val / this.$store.state.common.unitRatio
        this.SET_X(x)
      }
    },
    y: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].y * this.$store.state.common.unitRatio
      },
      set(val) {
        const y = val / this.$store.state.common.unitRatio
        this.SET_Y(y)
      }
    },
    z: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].z * this.$store.state.common.unitRatio
      },
      set(val) {
        const z = val / this.$store.state.common.unitRatio
        this.SET_Z(z)
      }
    },
    rotateX: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].rotateX
      },
      set(val) {
        this.SET_ROTATE_X(val)
      }
    },
    rotateY: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].rotateY
      },
      set(val) {
        this.SET_ROTATE_Y(val)
      }
    },
    rotateZ: {
      get() {
        return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].rotateZ
      },
      set(val) {
        this.SET_ROTATE_Z(val)
      }
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    }
  },
  methods: {
    ...mapMutations('screen', ['SET_X', 'SET_Y', 'SET_Z', 'SET_ROTATE_X', 'SET_ROTATE_Y', 'SET_ROTATE_Z']),
    setScreenPosition() {
      this.$bus.emit('setScreenPosition')
    },
    autoAdjust() {
      this.$bus.emit('autoAdjustScreenPosition')
    },
    resetX() {
      this.x = this.$store.state.room.width / 2 * this.$store.state.common.unitRatio
      this.setScreenPosition()
    },
    resetY() {
      this.y = this.$store.state.room.height / 2 * this.$store.state.common.unitRatio
      this.setScreenPosition()
    }
  }
}
</script>
<style lang="scss">

</style>
