<template>
  <q-page class="flex flex-center" :style-fn="stylePage">
    <div class="fit" id="threeView">
      <q-btn push dense text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'" icon="crop_din"
        class="q-ml-sm q-mt-sm absolute-top-left" style="z-index:10" @click="frontCamera">
        <q-tooltip>{{ $t('frontView') }}</q-tooltip>
      </q-btn>
      <q-btn push dense text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'" icon="navigate_before"
        style="z-index:10;top:40px;" class="q-ml-sm q-mt-sm absolute-top-left" @click="sideCamera">
        <q-tooltip>{{ $t('sideView') }}</q-tooltip>
      </q-btn>
      <q-btn push dense text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'" icon="expand_more"
        style="z-index:10;top:80px;" class="q-ml-sm q-mt-sm absolute-top-left" @click="topCamera">
        <q-tooltip>{{ $t('topView') }}</q-tooltip>
      </q-btn>
      <q-btn push dense v-show="showUndo" text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'"
        icon="undo" style="z-index:999;right:40px" class="q-mr-sm q-mb-sm absolute-bottom-right" @click="undo">
      </q-btn>
      <q-btn push dense v-show="showRedo" text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'"
        icon="redo" style="z-index:999;" class="q-mr-sm q-mb-sm absolute-bottom-right" @click="redo">
      </q-btn>

      <!-- <q-btn fab text-color="primary" :color="$q.dark.isActive ? 'grey-8' : 'white'" label="News"
        style="z-index:999;bottom:60px;right:20px;background-image: url('../assets/delta_btn.png');" class="q-mr-sm q-mb-sm absolute-bottom-right">
        <q-popup-proxy>
          <div class="q-pa-md">
            <q-carousel animated v-model="slide" navigation infinite :autoplay="false" arrows
              transition-prev="slide-right" transition-next="slide-left" @mouseenter="autoplay = false"
              @mouseleave="autoplay = true" keep-alive style="width:1000px">
              <q-carousel-slide :name="1" img-src="https://www.vivitek.eu/media/287180/Thank-You_1920x360.jpg" />
              <q-carousel-slide :name="2" img-src="https://www.vivitek.eu/media/284346/AV-News-banner-1920x360.png" />
              <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
              <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
            </q-carousel>
          </div>
        </q-popup-proxy>
      </q-btn> -->

      <q-list v-show="isShowContextmenu" class="absolute" @contextmenu.prevent=""
        :style="{ background: $q.dark.isActive ? '#121212' : '#ffffff', left: contextmenuLeft, top: contextmenuTop }"
        style="max-width: 350px ;z-index:10;" bordered>
        <q-item clickable v-ripple @mousedown="clickDeleteProjector">
          <q-item-section>{{ $t('delete') }}</q-item-section>
          <q-item-section avatar>
            <q-icon name="delete_outline" color="primary" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @mousedown="clickCopyProjector">
          <q-item-section>{{ $t('copy') }}</q-item-section>
          <q-item-section avatar>
            <q-icon name="file_copy" color="primary" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @mousedown="clickEditProjector">
          <q-item-section>{{ $t('edit') }}</q-item-section>
          <q-item-section avatar>
            <q-icon name="edit" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>

      <ProjectorDetail />
      <q-resize-observer @resize="resizeCanvas" debounce="100" />
    </div>
  </q-page>
</template>

<script>
import { MOUSE } from 'three'
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
    this.$bus.on('updateShowLightBound', this.updateShowLightBound)
    this.$bus.on('updateShowDistanceHelper', this.updateShowDistanceHelper)
    this.$bus.on('updateShowGrid', this.updateShowGrid)
    this.$bus.on('updateRoomBrightness', this.updateRoomBrightness)
    this.$bus.on('setLight', this.setLight)
    this.$bus.on('changeSelectedProjector', this.changeSelectedProjector)
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
    this.$bus.off('updateShowLightBound', this.updateShowLightBound)
    this.$bus.off('updateShowDistanceHelper', this.updateShowDistanceHelper)
    this.$bus.off('updateShowGrid', this.updateShowGrid)
    this.$bus.off('updateRoomBrightness', this.updateRoomBrightness)
    this.$bus.off('setLight', this.setLight)
    this.$bus.off('changeSelectedProjector', this.changeSelectedProjector)
  },
  mounted() {
    view = new ThreeView('#threeView')
    view.animate()

    document.getElementById('threeView').addEventListener('mousedown', e => {
      if (e.button === MOUSE.RIGHT) {
        if (this.$store.state.common.isToShowContextmenu) {
          this.contextmenuLeft = `${e.offsetX}px`
          this.contextmenuTop = `${e.offsetY}px`
          this.isShowContextmenu = true
        }
      } if (e.button === MOUSE.LEFT && this.isShowContextmenu) {
        this.isShowContextmenu = false
      }
    })
  },
  data() {
    return {
      view: null,
      isShowContextmenu: false,
      contextmenuLeft: '0px',
      contextmenuTop: '0px',
      slide: 1
    }
  },
  computed: {
    showUndo() {
      return this.$store.state.common.showUndo
    },
    showRedo() {
      return this.$store.state.common.showRedo
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
    undo() {
      view.undo()
    },
    redo() {
      view.redo()
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
    updateShowLightBound(val) {
      view.updateShowLightBound(val)
    },
    updateShowGrid(val) {
      view.updateShowGrid(val)
    },
    updateShowDistanceHelper(val) {
      view.updateShowDistanceHelper(val)
    },
    setLight(val) {
      view.setLight(val)
    },
    updateRoomBrightness(val) {
      view.updateRoomBrightness(val)
    },
    changeSelectedProjector(val) {
      view.changeSelectedProjector(val)
    },
    clickDeleteProjector() {
      this.$bus.emit('clickDeleteProjector')
      this.isShowContextmenu = false
    },
    clickCopyProjector() {
      this.$bus.emit('clickCopyProjector')
      this.isShowContextmenu = false
    },
    clickEditProjector() {
      this.$bus.emit('clickEditProjector')
      this.isShowContextmenu = false
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
