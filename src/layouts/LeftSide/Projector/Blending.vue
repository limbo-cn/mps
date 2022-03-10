<template>
  <div class="q-pa-sm q-pl-md">
    <q-checkbox :model-value="selectedProjector.isShowBlendingGuideLine" @update:modelValue="setShowBlendingGuideLine" left-label :label="$t('blendingGuideLine')" />
    <div v-show="selectedProjector.isShowBlendingGuideLine">
      <q-input input-class="mps-input-class" :disable="!selectedProjector.isShowBlendingGuideLine" :model-value="selectedProjector.blendingGuideLineL" @update:modelValue="setBlendingGuideLineL" dense type="number" step="2" min="0" max="100" suffix="%" style="width:95%">
        <template v-slot:prepend>
          <div class="text-subtitle2" style="width:50px">
            {{$t('left')}}:
          </div>
          <div style="width:120px" class="q-pl-sm q-pr-sm row">
            <div class="col-8">
              <q-slider :model-value="selectedProjector.blendingGuideLineL" @update:modelValue="setBlendingGuideLineL" :min="0" :max="100" />
            </div>
            <div class="col">
              <q-btn flat color="primary" @click="()=>{setBlendingGuideLineL(0)}" icon="refresh" />
            </div>
          </div>
        </template>
        <template v-slot:append>
          <div class="text-subtitle2">
            {{`${blendingLeftPixel} ${$t('pixel')}`}}:
          </div>
        </template>
      </q-input>
      <q-input input-class="mps-input-class" :disable="!selectedProjector.isShowBlendingGuideLine" :model-value="selectedProjector.blendingGuideLineR" @update:modelValue="setBlendingGuideLineR" dense type="number" step="2" min="0" max="100" suffix="%" style="width:95%">
        <template v-slot:prepend>
          <div class="text-subtitle2" style="width:50px">
            {{$t('right')}}:
          </div>
          <div style="width:120px" class="q-pl-sm q-pr-sm row">
            <div class="col-8">
              <q-slider :model-value="selectedProjector.blendingGuideLineR" @update:modelValue="setBlendingGuideLineR" :min="0" :max="100" />
            </div>
            <div class="col">
              <q-btn flat color="primary" @click="()=>{setBlendingGuideLineR(0)}" icon="refresh" />
            </div>
          </div>
        </template>
        <template v-slot:append>
          <div class="text-subtitle2">
            {{`${blendingRightPixel} ${$t('pixel')}`}}:
          </div>
        </template>
      </q-input>
      <q-input input-class="mps-input-class" :disable="!selectedProjector.isShowBlendingGuideLine" :model-value="selectedProjector.blendingGuideLineT" @update:modelValue="setBlendingGuideLineT" dense type="number" step="2" min="0" max="100" suffix="%" style="width:95%">
        <template v-slot:prepend>
          <div class="text-subtitle2" style="width:50px">
            {{$t('top')}}:
          </div>
          <div style="width:120px" class="q-pl-sm q-pr-sm row">
            <div class="col-8">
              <q-slider :model-value="selectedProjector.blendingGuideLineT" @update:modelValue="setBlendingGuideLineT" :min="0" :max="100" />
            </div>
            <div class="col">
              <q-btn flat color="primary" @click="()=>{setBlendingGuideLineT(0)}" icon="refresh" />
            </div>
          </div>
        </template>
        <template v-slot:append>
          <div class="text-subtitle2">
            {{`${blendingTopPixel} ${$t('pixel')}`}}:
          </div>
        </template>
      </q-input>
      <q-input input-class="mps-input-class" :disable="!selectedProjector.isShowBlendingGuideLine" :model-value="selectedProjector.blendingGuideLineB" @update:modelValue="setBlendingGuideLineB" dense type="number" step="2" min="0" max="100" suffix="%" style="width:95%">
        <template v-slot:prepend>
          <div class="text-subtitle2" style="width:50px">
            {{$t('bottom')}}:
          </div>
          <div style="width:120px" class="q-pl-sm q-pr-sm row">
            <div class="col-8">
              <q-slider :model-value="selectedProjector.blendingGuideLineB" @update:modelValue="setBlendingGuideLineB" :min="0" :max="100" />
            </div>
            <div class="col">
              <q-btn flat color="primary" @click="()=>{setBlendingGuideLineB(0)}" icon="refresh" />
            </div>
          </div>
        </template>
        <template v-slot:append>
          <div class="text-subtitle2">
            {{`${blendingBottomPixel} ${$t('pixel')}`}}:
          </div>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default ({
  name: 'Projector-Detail',
  data() {
    return {

    }
  },
  computed: {
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    },
    blendingLeftPixel() {
      if (!this.selectedProjector) {
        return 0
      }
      return ((this.selectedProjector.resolutionX / 2) * (this.selectedProjector.blendingGuideLineL / 100)).toFixed(0)
    },
    blendingRightPixel() {
      if (!this.selectedProjector) {
        return 0
      }
      return ((this.selectedProjector.resolutionX / 2) * (this.selectedProjector.blendingGuideLineR / 100)).toFixed(0)
    },
    blendingTopPixel() {
      if (!this.selectedProjector) {
        return 0
      }
      return ((this.selectedProjector.resolutionX / 2) * (this.selectedProjector.blendingGuideLineT / 100)).toFixed(0)
    },
    blendingBottomPixel() {
      if (!this.selectedProjector) {
        return 0
      }
      return ((this.selectedProjector.resolutionX / 2) * (this.selectedProjector.blendingGuideLineB / 100)).toFixed(0)
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_SELECTED_PROJECTOR_SHOW_BLENDING_GUIDE_LINE', 'SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_L',
      'SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_R', 'SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_T', 'SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_B']),
    setShowBlendingGuideLine(val) {
      this.SET_SELECTED_PROJECTOR_SHOW_BLENDING_GUIDE_LINE(val)
      this.setProjector()
    },
    setBlendingGuideLineL(val) {
      this.SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_L(+val)
      this.setProjector()
    },
    setBlendingGuideLineR(val) {
      this.SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_R(+val)
      this.setProjector()
    },
    setBlendingGuideLineT(val) {
      this.SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_T(+val)
      this.setProjector()
    },
    setBlendingGuideLineB(val) {
      this.SET_SELECTED_PROJECTOR_BLENDING_GUIDE_LINE_B(+val)
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
<style lang="sass">
</style>
