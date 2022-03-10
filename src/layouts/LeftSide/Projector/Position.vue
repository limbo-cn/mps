<template>
  <div class="q-pa-sm q-pl-md">
    <q-input input-class="mps-input-class" :model-value="selectedProjector.x.toFixed(2)" @update:modelValue="setX" :suffix="unitLabel" :title="`${selectedProjector.x}${unitLabel}`" dense type="number" step="0.1" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          X:
        </div>
        <div style="width:200px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.x" @update:modelValue="setX" :step="0.1*unitRatio" :min="(-15*unitRatio)" :max="(15*unitRatio)" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="resetX" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :model-value="selectedProjector.y.toFixed(2)" @update:modelValue="setY" :suffix="unitLabel" :title="`${selectedProjector.y}${unitLabel}`" dense type="number" step="0.1" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          Y:
        </div>
        <div style="width:200px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.y" @update:modelValue="setY" :step="0.1*unitRatio" :min="(-10*unitRatio)" :max="(10*unitRatio)" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="resetY" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :model-value="selectedProjector.z.toFixed(2)" @update:modelValue="setZ" :title="`${selectedProjector.z}${unitLabel}`" dense type="number" step="0.1" :suffix="unitLabel" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          Z:
        </div>
        <div style="width:200px" class="q-pl-sm q-pr-sm row">
          <q-slider :model-value="selectedProjector.z" @update:modelValue="setZ" :step="0.1*unitRatio" :min="0" :max="(20*unitRatio)" />
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :model-value="selectedProjector.rotateX" @update:modelValue="setRotateX" :title="`${selectedProjector.rotateX}°`" dense type="number" step="2" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateX')}}:
        </div>
        <div style="width:150px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.rotateX" @update:modelValue="setRotateX" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setRotateX(0)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :model-value="selectedProjector.rotateY" @update:modelValue="setRotateY" :title="`${selectedProjector.rotateY}°`" dense type="number" step="2" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateY')}}:
        </div>
        <div style="width:150px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.rotateY" @update:modelValue="setRotateY" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setRotateY(0)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :model-value="selectedProjector.rotateZ" @update:modelValue="setRotateZ" :title="`${selectedProjector.rotateZ}°`" dense type="number" step="2" min="-180" max="180" suffix="°" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('rotateZ')}}:
        </div>
        <div style="width:150px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.rotateZ" @update:modelValue="setRotateZ" :min="-180" :max="180" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setRotateZ(0)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default ({
  name: 'Projector-Position',
  data() {
    return {

    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_SELECTED_PROJECTOR_X', 'SET_SELECTED_PROJECTOR_Y', 'SET_SELECTED_PROJECTOR_Z',
      'SET_SELECTED_PROJECTOR_ROTATE_X', 'SET_SELECTED_PROJECTOR_ROTATE_Y', 'SET_SELECTED_PROJECTOR_ROTATE_Z']),
    setX(val) {
      this.SET_SELECTED_PROJECTOR_X(+val / this.$store.state.common.unitRatio)
      this.setProjector()
    },
    resetX() {
      this.SET_SELECTED_PROJECTOR_X(this.$store.state.room.width / 2)
      this.setProjector()
    },
    setY(val) {
      this.SET_SELECTED_PROJECTOR_Y(+val / this.$store.state.common.unitRatio)
      this.setProjector()
    },
    resetY() {
      this.SET_SELECTED_PROJECTOR_Y(this.$store.state.room.height / 2)
      this.setProjector()
    },
    setZ(val) {
      this.SET_SELECTED_PROJECTOR_Z(+val / this.$store.state.common.unitRatio)
      this.setProjector()
    },
    setRotateX(val) {
      this.SET_SELECTED_PROJECTOR_ROTATE_X(+val)
      this.setProjector()
    },
    setRotateY(val) {
      this.SET_SELECTED_PROJECTOR_ROTATE_Y(+val)
      this.setProjector()
    },
    setRotateZ(val) {
      this.SET_SELECTED_PROJECTOR_ROTATE_Z(+val)
      this.setProjector()
    },
    setProjector() {
      this.$bus.emit('setProjector', this.selectedProjector)
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
