<template>
  <div class="q-pa-sm q-pl-md">
    <div class="row">
      <q-select dense :model-value="selectedProjector.texture" @update:modelValue="changeProjectionPattern" :options="texturePatterns" map-options option-value="value" option-label="label" style="width:80%" behavior="menu">
        <template v-slot:prepend>
          <div class="text-subtitle2">
            {{$t('projectionPattern')}}:
          </div>
        </template>
      </q-select>
      <q-btn flat color="primary" icon="add" @click="uploadTexture" />
      <div style="height:0px">
        <input id="upload_texture" hidden type="file" accept="image/*,video/mp4,video/ogg" @change="changeFileTexture" />
      </div>
    </div>
    <q-select dense :model-value="selectedProjector.imageAspectRatio" @update:modelValue="changeImageAspectRatio" :options="aspectRatios" emit-value map-options option-value="value" option-label="label" style="width:95%" behavior="menu">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('aspectRatio')}}:
        </div>
      </template>
    </q-select>
    <q-input input-class="mps-input-class" v-show="!(selectedProjector.lensShiftHMin === 0 && selectedProjector.lensShiftHMax === 0) " :model-value="selectedProjector.lensShiftH" @update:modelValue="setLensShiftH" :title="`${selectedProjector.lensShiftH}%`" dense type="number" :min="selectedProjector.lensShiftHMin" :max="selectedProjector.lensShiftHMax" step="1" suffix="%" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('lensShiftH')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.lensShiftH" @update:modelValue="setLensShiftH" :min="selectedProjector.lensShiftHMin" :max="selectedProjector.lensShiftHMax" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setLensShiftH(0)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" v-show="!(selectedProjector.lensShiftHMin === 0 && selectedProjector.lensShiftHMax === 0) " :model-value="selectedProjector.lensShiftV" @update:modelValue="setLensShiftV" :title="`${selectedProjector.lensShiftV}%`" dense type="number" :min="selectedProjector.lensShiftVMin" :max="selectedProjector.lensShiftVMax" step="1" suffix="%" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('lensShiftV')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.lensShiftV" @update:modelValue="setLensShiftV" :min="selectedProjector.lensShiftVMin" :max="selectedProjector.lensShiftVMax" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setLensShiftV(0)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
    <q-input input-class="mps-input-class" :disable="selectedProjector.throwRatioMin === selectedProjector.throwRatio && selectedProjector.throwRatioMax === selectedProjector.throwRatio" :model-value="selectedProjector.throwRatio" @update:modelValue="setThrowRatio" :title="`${selectedProjector.throwRatio}`" dense type="number" :min="selectedProjector.throwRatioMin" :max="selectedProjector.throwRatioMax" step="0.1" style="width:95%">
      <template v-slot:prepend>
        <div class="text-subtitle2">
          {{$t('throwRatio')}}:
        </div>
        <div style="width:160px" class="q-pl-sm q-pr-sm row">
          <div class="col-9">
            <q-slider :model-value="selectedProjector.throwRatio" @update:modelValue="setThrowRatio" :step="0.01" :min="selectedProjector.throwRatioMin" :max="selectedProjector.throwRatioMax" />
          </div>
          <div class="col">
            <q-btn flat color="primary" @click="()=>{setThrowRatio(selectedProjector.throwRatioMin)}" icon="refresh" />
          </div>
        </div>
      </template>
    </q-input>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { showAlert } from '../../../helper/util'

export default ({
  name: 'Projector-Detail',
  data() {
    return {
      aspectRatios: [
        { label: '16:9', value: 16 / 9 },
        { label: '16:10', value: 16 / 10 },
        { label: '4:3', value: 4 / 3 }
      ],
      texturePatterns: [
        { label: this.$t('default'), value: '', isVideo: false },
        { label: 'pattern1', value: 'texture/pattern1.jpg', isVideo: false },
        { label: 'pattern2', value: 'texture/pattern2.jpg', isVideo: false },
        { label: 'pattern3', value: 'texture/pattern3.jpg', isVideo: false },
        { label: 'video pattern1', value: 'texture/video_pattern1.mp4', isVideo: true },
        { label: 'video pattern2', value: 'texture/video_pattern2.mp4', isVideo: true }
      ]
    }
  },
  computed: {
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_SELECTED_PROJECTOR_LENS_SHIFT_H', 'SET_SELECTED_PROJECTOR_LENS_SHIFT_V',
      'SET_SELECTED_PROJECTOR_THROW_RATIO', 'SET_SELECTED_PROJECTOR_IMAGE_ASPECT_RATIO']),
    changeProjectionPattern(pattern) {
      this.$bus.emit('setProjectorTexture', { patternSrc: pattern.value, isVideo: pattern.isVideo })
    },
    uploadTexture() {
      document.querySelector('#upload_texture').click()
    },
    changeFileTexture(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      const file = files[0]
      let isVideo = false
      if (file.type.includes('image')) {
        isVideo = false
      } else if (file.type === 'video/mp4' || file.type === 'video/ogg') {
        isVideo = true
      } else {
        showAlert(this.$t('uploadFail'), this.$t('yes'))
        return
      }
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(file)
      this.texturePatterns.push({ label: file.name, value: src, isVideo: isVideo })
      this.$bus.emit('setProjectorTexture', { patternSrc: src, isVideo: isVideo })
    },
    setLensShiftH(val) {
      this.SET_SELECTED_PROJECTOR_LENS_SHIFT_H(+val)
      this.setProjector()
    },
    setLensShiftV(val) {
      this.SET_SELECTED_PROJECTOR_LENS_SHIFT_V(+val)
      this.setProjector()
    },
    setThrowRatio(val) {
      this.SET_SELECTED_PROJECTOR_THROW_RATIO(+val)
      this.setProjector()
    },
    changeImageAspectRatio(val) {
      this.SET_SELECTED_PROJECTOR_IMAGE_ASPECT_RATIO(+val)
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
