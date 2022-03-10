<template>
  <q-select dense v-model="geometry" @update:modelValue="changeGeometry" :options="geometrys" emit-value map-options option-value="value" option-label="label" style="width:80%">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('geometry')}}:
      </div>
    </template>
  </q-select>
  <q-btn flat color="primary" icon="add" @click="uploadGeometry" />
  <input id="upload_geometry" hidden type="file" @change="changeFileGeometry" />
  <q-select dense v-model="material" @update:modelValue="changeMaterial" :options="materials" emit-value map-options option-value="value" option-label="label" style="width:80%">
    <template v-slot:prepend>
      <div class="text-subtitle2">
        {{$t('material')}}:
      </div>
    </template>
  </q-select>
  <q-btn flat color="primary" icon="add" @click="uploadMaterial" />
  <input id="upload_material" hidden type="file" @change="changeFileMaterial" />
</template>

<script>
import { screenType } from 'src/helper/enum'
import { mapMutations } from 'vuex'

export default {
  name: 'ScreenSettings-Custom',
  data() {
    return {
      geometrys: [
        { label: 'N/A', value: '' }
      ],
      materials: [
        { label: 'N/A', value: '' }
      ]
    }
  },
  computed: {
    geometry: {
      get() {
        return this.$store.state.screen.custom.geometrySrc
      },
      set(src) {
        this.SET_CUSTOM_GEOMETRY_SRC(src)
      }
    },
    material: {
      get() {
        return this.$store.state.screen.custom.materialSrc
      },
      set(src) {
        this.SET_CUSTOM_MATERIAL_SRC(src)
      }
    }

  },
  methods: {
    ...mapMutations('screen', ['SET_CUSTOM_GEOMETRY_SRC', 'SET_CUSTOM_MATERIAL_SRC']),
    setScreen() {
      this.$bus.emit('setScreen', screenType.custom)
    },
    changeGeometry() {
      this.setScreen()
    },
    uploadGeometry() {
      document.querySelector('#upload_geometry').click()
    },
    changeFileGeometry(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      const file = files[0]
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(file)
      this.geometrys.push({
        label: file.name,
        value: src
      })
      this.SET_CUSTOM_GEOMETRY_SRC(src)
      this.setScreen()
    },
    changeMaterial() {
      this.setScreen()
    },
    uploadMaterial() {
      document.querySelector('#upload_material').click()
    },
    changeFileMaterial(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      const file = files[0]
      const URL = window.URL || window.webkitURL
      const src = URL.createObjectURL(file)
      this.materials.push({
        label: file.name,
        value: src
      })
      this.SET_CUSTOM_MATERIAL_SRC(src)
      this.setScreen()
    }
  }
}
</script>
<style lang="scss">

</style>
