<template>
  <q-page class="flex flex-center" :style-fn="stylePage">
    <div class="fit" id="threeView">
      <q-btn
        push
        dense
        text-color="primary"
        :color="$q.dark.isActive ? 'grey-8' : 'white'"
        icon="crop_din"
        class="q-ml-sm q-mt-sm absolute-top-left"
        style="z-index:10"
        @click="frontCamera"
      >
        <q-tooltip>{{ $t('frontView') }}</q-tooltip>
      </q-btn>
      <q-btn
        push
        dense
        text-color="primary"
        :color="$q.dark.isActive ? 'grey-8' : 'white'"
        icon="navigate_before"
        style="z-index:10;top:40px;"
        class="q-ml-sm q-mt-sm absolute-top-left"
        @click="sideCamera"
      >
        <q-tooltip>{{ $t('sideView') }}</q-tooltip>
      </q-btn>
      <q-btn
        push
        dense
        text-color="primary"
        :color="$q.dark.isActive ? 'grey-8' : 'white'"
        icon="expand_more"
        style="z-index:10;top:80px;"
        class="q-ml-sm q-mt-sm absolute-top-left"
        @click="topCamera"
      >
        <q-tooltip>{{ $t('topView') }}</q-tooltip>
      </q-btn>
      <ProjectorDetail />
      <q-resize-observer @resize="resizeCanvas" debounce="100" />
    </div>
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'

import ProjectorDetail from '../components/ProjectorTable'

import ThreeView from '../threeView/ThreeView.js'

let view = null

export default ({
  name: 'PageIndex',
  components: {
    ProjectorDetail
  },
  created() {
    this.$bus.on('setScreen', this.setScreen)
    this.$bus.on('setScreens', this.setScreens)
    this.$bus.on('setScreenPosition', this.setScreenPosition)
    this.$bus.on('autoAdjustScreenPosition', this.autoAdjustScreenPosition)
    this.$bus.on('setRoomSize', this.setRoomSize)
    this.$bus.on('addProjector', this.addProjector)
    this.$bus.on('addProjectorsHistory', this.addProjectorsHistory)
    this.$bus.on('editProjector', this.editProjector)
    this.$bus.on('setProjector', this.setProjector)
    this.$bus.on('setProjectors', this.setProjectors)
    this.$bus.on('deleteProjector', this.deleteProjector)
    this.$bus.on('setProjectorTexture', this.setProjectorTexture)
    this.$bus.on('setScreenTexture', this.setScreenTexture)
    this.$bus.on('initThreeViewImage', this.initThreeViewImage)
    this.$bus.on('setTheme', this.setTheme)
    this.$bus.on('updateShowRefrence', this.updateShowRefrence)
    this.$bus.on('updateShowProjectorInterfere', this.updateShowProjectorInterfere)
    this.$bus.on('updateShowProjectionDistanceRefrence', this.updateShowProjectionDistanceRefrence)
    this.$bus.on('updateRoomBrightness', this.updateRoomBrightness)
    this.$bus.on('setLight', this.setLight)
  },
  beforeUnmount() {
    this.$bus.off('setScreen', this.setScreen)
    this.$bus.off('setScreens', this.setScreens)
    this.$bus.off('setScreenPosition', this.setScreenPosition)
    this.$bus.off('autoAdjustScreenPosition', this.autoAdjustScreenPosition)
    this.$bus.off('setRoomSize', this.setRoomSize)
    this.$bus.off('addProjector', this.addProjector)
    this.$bus.off('addProjectorsHistory', this.addProjectorsHistory)
    this.$bus.off('editProjector', this.editProjector)
    this.$bus.off('setProjector', this.setProjector)
    this.$bus.off('setProjectors', this.setProjectors)
    this.$bus.off('deleteProjector', this.deleteProjector)
    this.$bus.off('setProjectorTexture', this.setProjectorTexture)
    this.$bus.off('setScreenTexture', this.setScreenTexture)
    this.$bus.off('initThreeViewImage', this.initThreeViewImage)
    this.$bus.off('setTheme', this.setTheme)
    this.$bus.off('updateShowRefrence', this.updateShowRefrence)
    this.$bus.off('updateShowProjectorInterfere', this.updateShowProjectorInterfere)
    this.$bus.off('updateShowProjectionDistanceRefrence', this.updateShowProjectionDistanceRefrence)
    this.$bus.off('updateRoomBrightness', this.updateRoomBrightness)
    this.$bus.off('setLight', this.setLight)
  },
  mounted() {
    view = new ThreeView('#threeView')
    view.animate()
  },
  data() {
    return {
      view: null
    }
  },
  methods: {
    ...mapMutations('common', ['SET_THREE_VIEW_IMAGE']),
    stylePage(offset, height) {
      return { height: `${height - offset}px` }
    },
    resizeCanvas() {
      view.onWindowResize()
    },
    setRoomSize() {
      view.setRoomSize()
    },
    setScreen(val) {
      view.setScreen(val)
    },
    setScreens(val) {
      view.setScreens(val)
    },
    setScreenPosition() {
      view.setScreenPosition()
    },
    autoAdjustScreenPosition() {
      view.adjustScreenPosition()
    },
    addProjector(uId) {
      view.addProjector(uId)
    },
    addProjectorsHistory(uId) {
      view.addProjectorsHistory(uId)
    },
    editProjector(uId) {
      view.editProjector(uId)
    },
    setProjector(projector) {
      view.setProjector(projector)
    },
    setProjectors(projectors) {
      view.setProjectors(projectors)
    },
    deleteProjector(uId) {
      view.deleteProjector(uId)
    },
    setProjectorTexture(pattern) {
      view.setProjectorTexture(pattern)
    },
    setScreenTexture(pattern) {
      view.setScreenTexture(pattern)
    },
    initThreeViewImage() {
      const image = view.getDataUrl()
      this.SET_THREE_VIEW_IMAGE(image)
    },
    frontCamera() {
      view.frontCamera()
    },
    sideCamera() {
      view.sideCamera()
    },
    topCamera() {
      view.topCamera()
    },
    setTheme() {
      view.setTheme()
    },
    updateShowRefrence(val) {
      view.updateShowRefrence(val)
    },
    updateShowProjectorInterfere(val) {
      view.updateShowProjectorInterfere(val)
    },
    updateShowProjectionDistanceRefrence(val) {
      view.updateShowProjectionDistanceRefrence(val)
    },
    setLight(val) {
      view.setLight(val)
    },
    updateRoomBrightness(val) {
      view.updateRoomBrightness(val)
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
