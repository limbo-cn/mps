<template>
  <q-dialog :model-value="showDialog" @show="show" @hide="hide" full-height>
    <q-layout view="hHh lpR fFf" container class="bg-white" style="width: 1250px; max-width: 90vw;">
      <q-header :style="{ background: $q.dark.isActive ? '#445a4d' : '#3aaa35' }">
        <q-toolbar>
          <q-toolbar-title>{{ $t('history') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container style="min-width:800px">
        <q-page class="text-black" style="overflow:auto">
          <div class="q-pa-md row items-start q-gutter-sm">
            <q-card v-if="currentItem" :key="currentItem.uId">
              <q-card-section>
                <div class="row">
                  <q-img :src="currentItem.threeViewImage" :img-style="{ 'background-size': 'contain' }"
                    style="width:350px;min-height:200px" />
                </div>
                <div class="row q-mt-sm">
                  <div class="col-10">
                    <q-input outlined dense :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="currentName"
                      :label="$t('customName')" />
                  </div>
                  <div class="col">
                    <q-btn round :color="$q.dark.isActive ? 'primary' : 'positive'" flat label icon="add"
                      @click.prevent="addItem" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card v-for="item in historys" :key="item.uId">
              <q-card-section>
                <div class="row">
                  <q-img :src="item.threeViewImage" :img-style="{ 'background-size': 'contain' }"
                    style="width:350px;min-height:200px" />
                </div>
                <div class="row q-mt-sm">
                  <div class="col-7" style="margin:auto">{{ item.name }}</div>
                  <div class="col">
                    <q-btn :color="$q.dark.isActive ? 'primary' : 'positive'" round flat label icon="delete_outline"
                      @click.prevent="deleteItem(item.uId)" />
                    <!-- <q-btn
                      :color="$q.dark.isActive ? 'primary' : 'positive'"
                      round
                      flat
                      label
                      icon="compare_arrows"
                      @click.prevent="updateItem(item.uId)"
                    />-->
                    <q-btn :color="$q.dark.isActive ? 'primary' : 'positive'" round flat label icon="check"
                      @click.prevent="loadItem(item.uId)" />
                    <q-btn :color="$q.dark.isActive ? 'primary' : 'positive'" round flat label icon="download"
                      @click.prevent="downloadItem(item)" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </q-page-container>

      <q-footer :style="{ background: $q.dark.isActive ? '#445a4d' : '#3aaa35' }">
        <q-toolbar>
          <div style="height:0px">
            <input id="upload_storage" hidden type="file" accept="application/json" @change="uploadStorage" />
          </div>
          <q-space>
          </q-space>
          <q-btn class="right" flat :color="$q.dark.isActive ? 'primary' : 'white'" icon="upload"
            @click="clickUpload" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { extend } from 'quasar'
import { downloadJsonOrTxt, showConfirm } from 'src/helper/util'
import { mapMutations } from 'vuex'

export default {
  name: 'History',
  props: ['showDialog'],
  data() {
    return {
      currentItem: null,
      currentName: ''
    }
  },
  computed: {
    historys() {
      const historys = extend(true, {}, this.$store.state.history.historys)
      return historys
    }
  },
  methods: {
    ...mapMutations('history', ['ADD_ITEM', 'DELETE_ITEM', 'UPDATE_ITEM']),
    ...mapMutations('room', ['SET_ROOM_HISTORY']),
    ...mapMutations('screen', ['SET_SCREEN_HISTORY']),
    ...mapMutations('projector', ['ADD_PROJECTOR', 'DELETE_PROJECTOR', 'SET_SELECTED_PROJECTOR_UID']),
    show() {
      this.$bus.emit('initThreeViewImage')
      this.initCurrentItem()
    },
    hide() {
      this.$emit('update:showDialog', false)
    },
    initCurrentItem() {
      const uId = new Date().getTime()

      const threeViewImage = this.$store.state.common.threeViewImage

      const item = {
        uId: uId,
        name: '',
        threeViewImage: threeViewImage,
        room: extend(true, {}, this.$store.state.room),
        screen: extend(true, {}, this.$store.state.screen),
        projector: extend(true, {}, this.$store.state.projector)
      }

      this.currentItem = item
    },
    addItem() {
      if (!this.currentName) {
        return
      }

      this.currentItem.name = this.currentName
      this.ADD_ITEM(this.currentItem)
      this.currentItem = null
    },
    deleteItem(uId) {
      showConfirm(this.$t('sureToDelete'), this.$t('yes'), this.$t('cancel'), () => {
        this.DELETE_ITEM(uId)
      })
    },
    updateItem(uId) {
      let oldItem = null
      for (const index in this.historys) {
        if (this.historys[index].uId === uId) {
          oldItem = extend(true, {}, this.historys[index])
        }
      }
      const newItem = extend(true, {}, this.currentItem)
      newItem.name = oldItem.name
      this.UPDATE_ITEM({ oldUid: uId, newItem: newItem })
      this.currentItem = null
    },
    loadItem(uId) {
      let history = null
      for (const index in this.historys) {
        if (this.historys[index].uId === uId) {
          history = extend(true, {}, this.historys[index])
        }
      }
      if (!history) {
        return
      }

      this.clearProjectors()

      this.SET_ROOM_HISTORY(history.room)
      this.$bus.emit('setRoomSize')
      this.SET_SCREEN_HISTORY(history.screen)
      this.$bus.emit('setScreens', history.screen.screens)
      history.projector.projectors.forEach(projector => {
        this.ADD_PROJECTOR(projector)
      })
      this.$bus.emit('addProjectorsHistory', history.projector.projectors)

      this.$emit('update:showDialog', false)
    },
    downloadItem(item) {
      downloadJsonOrTxt(`${item.name}.json`, JSON.stringify(item))
    },
    clickUpload() {
      document.querySelector('#upload_storage').click()
    },
    uploadStorage(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      const file = files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = (evt) => {
        const fileString = evt.target.result
        const item = JSON.parse(fileString)
        if (item.threeViewImage) {
          item.uId = new Date().getTime()
          this.ADD_ITEM(item)
        }
      }
    },
    clearProjectors() {
      const projectors = this.$store.state.projector.projectors
      projectors.map(o => o.uId).forEach(uId => {
        this.DELETE_PROJECTOR(uId)
        this.$bus.emit('deleteProjector', uId)
      })

      this.SET_SELECTED_PROJECTOR_UID(null)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
