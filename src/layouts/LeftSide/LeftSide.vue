
<template>
  <q-drawer show-if-above bordered :width="$q.platform.is.mobile ? 300 : 400">
    <div class="q-gutter-sm row q-pa-none full-width">
      <q-tabs
        v-model="tab"
        no-caps
        outside-arrows
        mobile-arrows
        active-bg-color="primary"
        :active-color="$q.dark.isActive ? `black` : `white`"
        indicator-color="yellow-3"
        class="text-primary shadow-4 full-width"
      >
        <q-tab name="room" :label="`1.${$t('space')}`" />
        <q-tab name="screen" :label="`2.${$t('screen')}`" />
        <q-tab name="projector" :label="`3.${$t('projector')}`" />
        <q-tab name="result" :label="`4.${$t('result')}`" />
      </q-tabs>
    </div>
    <q-separator />
    <q-scroll-area class style="height:calc(100% - 100px)">
      <q-tab-panels keep-alive v-model="tab" animated>
        <q-tab-panel name="room" class="q-pa-none">
          <q-list>
            <q-expansion-item
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('basicSettings')"
            >
              <BasicSettings />
            </q-expansion-item>
            <q-expansion-item
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('roomSize')"
            >
              <RoomSettings />
            </q-expansion-item>
            <!-- <q-expansion-item
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('light')"
            >
              <Light />
            </q-expansion-item> -->
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="screen" class="q-pa-none">
          <q-list>
            <q-expansion-item
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('basicSettings')"
            >
              <ScreenBasicSettings />
            </q-expansion-item>
            <q-expansion-item
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('screenShape')"
            >
              <ScreenSettings />
            </q-expansion-item>
            <q-expansion-item
              v-show="screenType !== 100"
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('screenPosition')"
            >
              <ScreenPosition />
            </q-expansion-item>
            <q-expansion-item
              v-show="screenType !== 100"
              dense
              :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
              default-opened
              :label="$t('ScreenMap')"
            >
              <ScreenMap />
            </q-expansion-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="projector" class="q-pa-none">
          <q-list>
            <Projector ref="projector" />
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="result" class="q-pa-none">
          <q-list>
            <Result />
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

      <div
        class="row fixed-bottom"
        style="justify-content: right;height:50px ; border-top:1px solid #ccc"
      >
        <div id="textureVideo" style="height:0px" />
        <q-btn
          flat
          v-show="tab === 'room'"
          :label="`${$t('next')} →`"
          @click="tab = 'screen'"
          text-color="primary"
        />

        <q-btn
          flat
          v-show="tab === 'screen'"
          :label="`← ${$t('previous')}`"
          @click="tab = 'room'"
          text-color="primary"
        />
        <q-btn
          flat
          v-show="tab === 'screen'"
          :label="`${$t('next')} →`"
          @click="tab = 'projector'"
          text-color="primary"
        />

        <q-btn
          flat
          v-show="tab === 'projector'"
          :label="`← ${$t('previous')}`"
          @click="tab = 'screen'"
          text-color="primary"
        />
        <q-btn
          flat
          v-show="tab === 'projector'"
          :label="`${$t('next')} →`"
          @click="tab = 'result'"
          text-color="primary"
        />

        <q-btn
          flat
          v-show="tab === 'result'"
          :label="`← ${$t('previous')}`"
          @click="tab = 'projector'"
          text-color="primary"
        />
        <q-btn
          flat
          v-show="tab === 'result'"
          :label="`${$t('exportPdf')}`"
          icon="picture_as_pdf"
          @click="showDlgPDF = true"
          text-color="primary"
        />
      </div>

      <PDF v-model:showDialog="showDlgPDF" />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import Projector from './Projector/Projector'
import RoomSettings from './Space/RoomSettings'
import BasicSettings from './Space/BasicSettings'
// import Light from './Space/Light'
import ScreenBasicSettings from './Screen/BasicSettings'
import ScreenSettings from './Screen/ScreenSettings/ScreenSettings'
import ScreenPosition from './Screen/ScreenPosition'
import ScreenMap from './Screen/ScreenMap'
import Result from './Report/Result'

import PDF from '../../components/PDF'

export default {
  name: 'LeftSide',
  components: {
    Projector,
    RoomSettings,
    BasicSettings,
    // Light,
    ScreenBasicSettings,
    ScreenSettings,
    ScreenPosition,
    ScreenMap,
    Result,
    PDF
  },
  mounted() {
  },
  data() {
    return {
      tab: 'room',
      url: '',
      showDlgPDF: false
    }
  },
  computed: {
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    },
    screenType() {
      return this.$store.state.screen.screens[this.$store.state.screen.screenPosition].screenType
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
.left-header-dark {
  background-color: #445a4d;
  font-size: 16px;
}
.left-header-light {
  background-color: #f2f2f2;
  font-size: 16px;
}
.driver-highlighted-element {
  border: 3px solid #cf4949;
  box-shadow: 0px 0px 5px 0px #cf4949;
}
</style>
