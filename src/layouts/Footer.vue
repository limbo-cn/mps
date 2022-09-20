<template>
  <q-footer class="shadow-2" :style="{ 'background-color': $q.dark.isActive ? '#222222' : '#ffffff' }">
    <q-toolbar style="height:30px;min-height:30px;">
      <q-toolbar-title class="text-caption text-left">
        <q-btn flat dense icon-right="arrow_drop_up" :color="$q.dark.isActive ? 'white' : 'primary'"
          v-show="showProjectorDetail === false" @click="showProjectorDetail = !showProjectorDetail">
          <q-badge align="middle" class="q-mr-sm" :color="$q.dark.isActive ? 'white' : 'primary'"
            :text-color="$q.dark.isActive ? 'black' : 'white'" :label="`${projectors.length}`" />
          <span :class="{ 'text-white': $q.dark.isActive, 'text-primary': !$q.dark.isActive }">{{ $t('projectors')
          }}</span>
        </q-btn>
        <q-btn flat dense icon-right="arrow_drop_down" v-show="showProjectorDetail === true"
          @click="showProjectorDetail = !showProjectorDetail" :color="$q.dark.isActive ? 'white' : 'primary'">
          <q-badge align="middle" class="q-mr-sm" :color="$q.dark.isActive ? 'white' : 'primary'"
            :text-color="$q.dark.isActive ? 'black' : 'white'" :label="`${projectors.length}`" />
          <span :class="{ 'text-white': $q.dark.isActive, 'text-primary': !$q.dark.isActive }">{{ $t('projectors') }}</span>
        </q-btn>
      </q-toolbar-title>
      <q-toolbar-title class="text-caption text-right">
        <!-- <q-btn flat dense icon="error_outline" class="text-caption">
          <q-tooltip>
            <ul>
              <li></li>
            </ul>
          </q-tooltip>
        </q-btn>-->
        <span :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }"> MPS v 1.3.2 © Copyright 2022
          Vivitek. All Rights Reserved. |
        </span>
        <a href="https://www.vivitek.eu/support/contact-support" target="_blank"
          :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">Contact Us</a>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    },
    showProjectorDetail: {
      get() {
        return this.$store.state.common.showProjectorDetail
      },
      set(val) {
        this.SET_SHOW_PROJECTOR_DETAIL(val)
      }
    },
    projectors() {
      return this.$store.state.projector.projectors
    }
  },
  methods: {
    ...mapMutations('common', ['SET_SHOW_PROJECTOR_DETAIL'])
  }
}
</script>
<style lang="scss" scoped>
</style>
