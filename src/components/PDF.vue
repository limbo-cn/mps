<template>
  <q-dialog :model-value="showDialog" @hide="hideDialog" @show="showPDF" full-height>
    <q-layout view="hHh lpR fFf" container class="bg-white" style="width: 1250px; max-width: 90vw;">
      <q-header class="delta-gradient-bg" :style="{ background: $q.dark.isActive ? '#445a4d' : '' }">
        <q-toolbar>
          <q-toolbar-title>{{ $t('report') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container style="min-width:800px">
        <q-page class="text-black" id="pdf-card" style="overflow:auto">
          <div class="row">
            <div class="col">
              <div class="q-pa-sm row items-start q-gutter-sm">
                <div class="text-h6">
                  {{ $t('report') }}
                  <img
                    :src="logo"
                    class="rounded-borders absolute-top-right"
                    style="height: 30px;padding: 2px; margin:24px;"
                  />
                </div>
              </div>
              <div class="q-pl-md row items-start q-gutter-sm">
                <div class="text-body1">{{ $t('room') }}</div>
              </div>
              <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                <div class="text-body2">
                  {{ $t('width') }}
                  <span style="font-weight: bold;">(R1)</span>
                  :{{ roomWidth }}{{ unitLabel }}
                </div>
                <div class="text-body2">
                  {{ $t('height') }}
                  <span style="font-weight: bold;">(R2)</span>
                  :{{ roomHeight }}{{ unitLabel }}
                </div>
                <div class="text-body2">
                  {{ $t('depth') }}
                  <span style="font-weight: bold;">(R3)</span>
                  :{{ roomDepth }}{{ unitLabel }}
                </div>
              </div>
              <div class="q-pl-md row items-start q-gutter-sm">
                <div class="text-body1">{{ $t('screen') }}</div>
              </div>
              <template v-for="(screen, index) in screens" :key="index">
                <template v-if="screen.screenType !== 100">
                  <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                    <div
                      class="text-body2"
                    >{{ $t('screenType') }}:{{ screenTypeLabel(screen.screenType) }}</div>
                    <template v-if="screen.screenType === 0">
                      <div
                        class="text-body2"
                      >{{ $t('aspectRatio') }}:{{ aspectRatio(screen.plane.aspectRatio) }}</div>
                      <div class="text-body2">{{ $t('diagonal') }}:{{ screen.plane.diagonal }}''</div>
                    </template>
                    <template v-if="screen.screenType === 1">
                      <div
                        class="text-body2"
                      >{{ $t('aspectRatio') }}:{{ aspectRatio(screen.curved.aspectRatio) }}</div>
                      <div class="text-body2">{{ $t('diagonal') }}:{{ screen.curved.diagonal }}''</div>
                      <div
                        class="text-body2"
                      >{{ $t('radius') }}:{{ toUnitRatio(screen.curved.radius) }}{{ unitLabel }}</div>
                    </template>
                    <template v-if="screen.screenType === 2">
                      <div
                        class="text-body2"
                      >{{ $t('radius') }}:{{ toUnitRatio(screen.sphere.radius) }}{{ unitLabel }}</div>
                    </template>
                  </div>
                  <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                    <div class="text-body2">
                      X
                      <span style="font-weight: bold;color: cornflowerblue;">(S1)</span>
                      {{ toUnitRatio(screen.x) }}{{ unitLabel }}
                    </div>
                    <div class="text-body2">
                      Y
                      <span style="font-weight: bold;color: cornflowerblue;">(S2)</span>
                      :{{ toUnitRatio(screen.y) }}{{ unitLabel }}
                    </div>
                    <div class="text-body2">
                      Z
                      <span style="font-weight: bold;color: cornflowerblue;">(S3)</span>
                      :{{ toUnitRatio(screen.z) }}{{ unitLabel }}
                    </div>
                    <!-- <div class="text-body2">{{ $t('rotateX') }}:{{ screen.rotateX }}</div>
                  <div class="text-body2">{{ $t('rotateY') }}:{{ screen.rotateY }}</div>
                    <div class="text-body2">{{ $t('rotateZ') }}:{{ screen.rotateZ }}</div>-->
                  </div>
                </template>
              </template>
            </div>
            <div class="col" v-if="isContainPlane">
              <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                <q-img src="../assets/xyz_plane.jpg" style="width: 300px;" />
              </div>
            </div>
            <div class="col" v-if="isContainCurved">
              <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                <q-img src="../assets/xyz_curved.jpg" style="width: 300px;" />
              </div>
            </div>
            <div class="col" v-if="isContainSphere">
              <div class="q-pa-sm q-pl-md row items-start q-gutter-sm">
                <q-img src="../assets/xyz_sphere.jpg" style="width: 300px;" />
              </div>
            </div>
          </div>
          <div class="q-pl-md row items-start q-gutter-sm">
            <div class="text-body1">{{ $t('projectors') }}</div>
          </div>
          <div class="q-pa-none q-pt-sm row items-start q-gutter-sm">
            <q-table
              :dark="false"
              :rows="projectors"
              :columns="columns"
              row-key="uId"
              :pagination="{ rowsPerPage: 100 }"
              hide-bottom
              dense
              flat
              bordered
              square
            />
          </div>
          <div class="q-pa-md row items-start q-gutter-sm">
            <div class="text-body1">{{ $t('threeDView') }}</div>
          </div>
          <div class="q-pa-none row items-start q-gutter-sm">
            <q-img
              class="rounded-borders view-image"
              :class="{ light: !$q.dark.isActive }"
              :src="threeViewImage"
            />
          </div>
        </q-page>
      </q-page-container>

      <q-footer  class="delta-gradient-bg-2" :style="{ background: $q.dark.isActive ? '#445a4d' : '' }">
        <q-toolbar>
          <q-input
            filled
            dense
            :color="$q.dark.isActive ? 'primary' : 'white'"
            dark
            v-model="pdfName"
            suffix=".pdf/.png"
          ></q-input>
          <q-space />
          <q-btn
            flat
            :color="$q.dark.isActive ? 'primary' : 'white'"
            :label="$t('exportPdf')"
            :loading="downloadingPDF"
            @click="exportPDF"
          />
          <q-btn
            flat
            :color="$q.dark.isActive ? 'primary' : 'white'"
            :label="$t('saveAsImage')"
            :loading="savingImage"
            @click="saveAsImage"
          />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { downloadFile } from 'src/helper/util'
import { screenType } from 'src/helper/enum'

export default {
  name: 'Export-PDF',
  props: ['showDialog'],
  data() {
    return {
      downloadingPDF: false,
      savingImage: false,
      pdfName: 'Simulation Report',
      logo: require('../assets/Vivitek Logo.png')
    }
  },
  computed: {
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    unitRatio() {
      return this.$store.state.common.unitRatio
    },
    roomWidth() {
      return this.$store.state.room.width * this.$store.state.common.unitRatio
    },
    roomHeight() {
      return this.$store.state.room.height * this.$store.state.common.unitRatio
    },
    roomDepth() {
      return this.$store.state.room.depth * this.$store.state.common.unitRatio
    },
    screens() {
      return this.$store.state.screen.screens
    },
    aspectRatios() {
      return [
        { label: '16:9', value: 16 / 9 },
        { label: '16:10', value: 16 / 10 },
        { label: '4:3', value: 4 / 3 },
        { label: '17:9', value: 17 / 9 },
        { label: '2.35:1', value: 2.35 / 1 },
        { label: '1:1', value: 1 / 1 },
        { label: this.$t('custom'), value: 0 }
      ]
    },
    screenType() {
      return this.$store.state.screen.screenType
    },
    isContainPlane() {
      return this.screens.findIndex(screen => screen.screenType === screenType.plane) >= 0
    },
    isContainCurved() {
      return this.screens.findIndex(screen => screen.screenType === screenType.curved) >= 0
    },
    isContainSphere() {
      return this.screens.findIndex(screen => screen.screenType === screenType.sphere) >= 0
    },
    columns() {
      return [
        { name: 'modelName', required: true, label: this.$t('modelName'), field: 'modelName', align: 'left' },
        { name: 'lensName', required: true, label: this.$t('lensName'), field: 'lensName', align: 'left', format: val => `${val || 'fixed'}` },
        {
          name: 'x',
          required: true,
          label: 'x(P1)',
          field: 'x',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel}`
        },
        {
          name: 'y',
          required: true,
          label: 'y(P2)',
          field: 'y',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel})`
        },
        {
          name: 'z',
          required: true,
          label: 'z(P3)',
          field: 'z',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel}`
        },
        { name: 'rotateX', required: true, label: `${this.$t('rotateX')}(RX)`, field: 'rotateX', align: 'left' },
        { name: 'rotateY', required: true, label: `${this.$t('rotateY')}(RY)`, field: 'rotateY', align: 'left' },
        { name: 'rotateZ', required: true, label: `${this.$t('rotateZ')}`, field: 'rotateZ', align: 'left' },
        { name: 'throwRatio', required: true, label: this.$t('throwRatio'), field: 'throwRatio', align: 'left' },
        { name: 'lensShiftH', required: true, label: `${this.$t('lensShiftH')}(%)`, field: 'lensShiftH', align: 'left' },
        { name: 'lensShiftV', required: true, label: `${this.$t('lensShiftV')}(%)`, field: 'lensShiftV', align: 'left' },
        { name: 'brightnessOnScreenNit', required: true, label: this.$t('brightnessOnScreenNit'), field: 'brightnessOnScreenNit', align: 'left' },
        { name: 'ambientContrast', required: true, label: this.$t('ambientContrast'), field: 'ambientContrast', align: 'left', format: val => `${val}:1` },
        {
          name: 'blending',
          required: true,
          label: this.$t('blending'),
          field: 'blending',
          align: 'left',
          format: (val, row) => {
            return row.isShowBlendingGuideLine ? `↑${row.blendingGuideLineT}% →${row.blendingGuideLineR}% ↓${row.blendingGuideLineB}% ←${row.blendingGuideLineL}%` : 'N/A'
          }
        }
      ]
    },
    projectors() {
      return this.$store.state.projector.projectors
    },
    threeViewImage() {
      return this.$store.state.common.threeViewImage
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:showDialog', false)
    },
    showPDF() {
      this.$bus.emit('initThreeViewImage')
    },
    async exportPDF() {
      const pdf = new JsPDF()
      this.downloadingPDF = true

      const canvasP = await html2canvas(document.querySelector('#pdf-card'))
      pdf.addImage(canvasP.toDataURL('image/png', 1), 'PNG', 5, 5, 200, 250, '', 'NONE')

      pdf.save(`${this.pdfName}.pdf`)

      this.downloadingPDF = false
    },
    async saveAsImage() {
      this.savingImage = true
      const dom = document.querySelector('#pdf-card')
      const canvas = await html2canvas(dom)
      const dataURI = canvas.toDataURL('image/png', 1)
      downloadFile(`${this.pdfName}.png`, dataURI)
      this.savingImage = false
    },
    screenTypeLabel(type) {
      return [
        { label: this.$t('planeScreen'), value: screenType.plane },
        { label: this.$t('curvedScreen'), value: screenType.curved },
        { label: this.$t('SphereScreen'), value: screenType.sphere },
        { label: this.$t('custom'), value: screenType.custom }
      ].find(o => o.value === type).label
    },
    aspectRatio(aspectRatio) {
      return this.aspectRatios.find(o => o.value === aspectRatio).label
    },
    toUnitRatio(val) {
      return val * this.$store.state.common.unitRatio
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
