<template>
  <div class="row q-pa-sm">
    <q-item dense class="full-width">
      <q-item-section class="text-h6">{{$t('room')}}</q-item-section>
    </q-item>
    <q-item clickable dense class="full-width">
      <q-item-section>{{$t('width')}}</q-item-section>
      <q-item-section>{{roomHeight}}{{unitLabel}}</q-item-section>
    </q-item>
    <q-item clickable dense class="full-width">
      <q-item-section>{{$t('height')}}</q-item-section>
      <q-item-section>{{roomHeight}}{{unitLabel}}</q-item-section>
    </q-item>
    <q-item clickable dense class="full-width">
      <q-item-section>{{$t('depth')}}</q-item-section>
      <q-item-section>{{roomDepth}}{{unitLabel}}</q-item-section>
    </q-item>

    <q-item dense class="full-width">
      <q-item-section class="text-h6">{{$t('screen')}}</q-item-section>
    </q-item>
    <q-item clickable dense class="full-width">
      <q-item-section> {{$t('screenType')}}</q-item-section>
      <q-item-section>{{screenTypeLabel}}</q-item-section>
    </q-item>
    <template v-if="screenType === 0">
      <q-item clickable dense class="full-width">
        <q-item-section>{{$t('aspectRatio')}}</q-item-section>
        <q-item-section>{{planeAspectRatio}}</q-item-section>
      </q-item>
      <q-item clickable dense class="full-width">
        <q-item-section>{{$t('diagonal')}}</q-item-section>
        <q-item-section>{{planeDiagonal}}''</q-item-section>
      </q-item>
    </template>
    <template v-if="screenType === 1">
      <q-item clickable dense class="full-width">
        <q-item-section>{{$t('aspectRatio')}}</q-item-section>
        <q-item-section>{{curvedAspectRatio}}</q-item-section>
      </q-item>
      <q-item clickable dense class="full-width">
        <q-item-section>{{$t('diagonal')}}</q-item-section>
        <q-item-section>{{curvedDiagonal}}''</q-item-section>
      </q-item>
      <q-item clickable dense class="full-width">
        <q-item-section>{{$t('radius')}}</q-item-section>
        <q-item-section>{{curvedRadius}}{{unitLabel}}</q-item-section>
      </q-item>
    </template>

    <q-item dense class="full-width">
      <q-item-section class="text-h6">{{$t('projectors')}}</q-item-section>
    </q-item>

    <q-item dense class="full-width">
      <q-table class="full-width" :rows="projectors" :columns="columns" grid row-key="uId">
        <template v-slot:item="props">
          <div class="full-width q-mb-md">
            <div class="row q-pb-md" style="justify-content: center;">
              <q-badge outline color="primary" text-color="white" :label="props.rowIndex + 1" />
            </div>
            <q-card>
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('customName')}}</div>
                <div class="col-6">{{ props.row.customName}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('modelName')}}</div>
                <div class="col-6">{{ props.row.modelName}}</div>
              </q-card-section>
              <q-separator />
              <template v-if="!!props.row.lensName">
                <q-card-section class="text-center q-pa-sm row">
                  <div class="col-6">{{$t('lensName')}}</div>
                  <div class="col-6">{{ props.row.lensName}}</div>
                </q-card-section>
                <q-separator />
              </template>
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('throwRatio')}}</div>
                <div class="col-6">{{ props.row.throwRatio}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">x({{$t('fromLeftWall')}})</div>
                <div class="col-6">{{Number(props.row.x * unitRatio).toFixed(2)}}{{unitLabel}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">y({{$t('fromFloor')}})</div>
                <div class="col-6">{{Number(props.row.y * unitRatio).toFixed(2)}}{{unitLabel}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">z({{$t('fromFrontWall')}})</div>
                <div class="col-6">{{Number(props.row.z * unitRatio).toFixed(2)}}{{unitLabel}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('rotateX')}}</div>
                <div class="col-6">{{props.row.rotateX}}°</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('rotateY')}}</div>
                <div class="col-6">{{ props.row.rotateY}}°</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('rotateZ')}}</div>
                <div class="col-6">{{ props.row.rotateZ}}°</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('lensShiftH')}}</div>
                <div class="col-6">{{ props.row.lensShiftH}}%</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('lensShiftV')}}</div>
                <div class="col-6">{{ props.row.lensShiftV}}%</div>
              </q-card-section>
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('brightnessOnScreenNit')}}</div>
                <div class="col-6">{{ props.row.brightnessOnScreenNit}}</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('ambientContrast')}}</div>
                <div class="col-6">{{ props.row.ambientContrast}}:1</div>
              </q-card-section>
               <q-card-section class="text-center q-pa-sm row">
                <div class="col-6">{{$t('blending')}}</div>
                <div class="col-6">{{ props.row.isShowBlendingGuideLine ?`↑${props.row.blendingGuideLineT}% →${props.row.blendingGuideLineR}% ↓${props.row.blendingGuideLineB}% ←${props.row.blendingGuideLineL}%` :'N/A'}}</div>
              </q-card-section>
              <q-separator />
            </q-card>
          </div>
        </template>
      </q-table>
    </q-item>
  </div>

</template>

<script>
import { screenType } from 'src/helper/enum'

export default {
  name: 'LeftSide-RoomSize',
  data() {
    return {
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
    screenTypeLabel() {
      return [
        { label: this.$t('planeScreen'), value: screenType.plane },
        { label: this.$t('curvedScreen'), value: screenType.curved },
        { label: this.$t('SphereScreen'), value: screenType.sphere },
        { label: this.$t('custom'), value: screenType.custom }
      ].find(o => o.value === this.screenType).label
    },
    planeAspectRatio() {
      return this.aspectRatios.find(o => o.value === this.$store.state.screen.plane.aspectRatio).label
    },
    planeDiagonal() {
      return this.$store.state.screen.plane.diagonal
    },
    curvedAspectRatio() {
      return this.aspectRatios.find(o => o.value === this.$store.state.screen.curved.aspectRatio).label
    },
    curvedDiagonal() {
      return this.$store.state.screen.curved.diagonal
    },
    curvedRadius() {
      return this.$store.state.screen.curved.radius * this.$store.state.common.unitRatio
    },
    columns() {
      return [
        { name: 'customName', required: true, label: this.$t('customName'), field: 'customName', align: 'left' },
        { name: 'modelName', required: true, label: this.$t('modelName'), field: 'modelName', align: 'left' },
        { name: 'lensName', required: true, label: this.$t('lensName'), field: 'lensName', align: 'left', format: val => `${val || 'fixed'}` },
        {
          name: 'x',
          required: true,
          label: `x(${this.$t('fromLeftWall')})`,
          field: 'x',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel}(${Number(this.roomWidth / 2 - val * this.unitRatio).toFixed(2)}${this.unitLabel})`
        },
        {
          name: 'y',
          required: true,
          label: `y(${this.$t('fromFloor')})`,
          field: 'y',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel}(${Number(this.roomHeight / 2 + val * this.unitRatio).toFixed(2)}${this.unitLabel})`
        },
        {
          name: 'z',
          required: true,
          label: `z(${this.$t('fromFrontWall')})`,
          field: 'z',
          align: 'left',
          format: val =>
            `${Number(val * this.unitRatio).toFixed(2)}${this.unitLabel}(${Number(this.roomDepth - val * this.unitRatio).toFixed(2)}${this.unitLabel})`
        },
        { name: 'rotateX', required: true, label: `${this.$t('rotateX')}(°)`, field: 'rotateX', align: 'left' },
        { name: 'rotateY', required: true, label: `${this.$t('rotateY')}(°)`, field: 'rotateY', align: 'left' },
        { name: 'rotateZ', required: true, label: `${this.$t('rotateZ')}(°)`, field: 'rotateZ', align: 'left' },
        { name: 'throwRatio', required: true, label: this.$t('throwRatio'), field: 'throwRatio', align: 'left' },
        { name: 'lensShiftH', required: true, label: `${this.$t('lensShiftH')}(%)`, field: 'lensShiftH', align: 'left' },
        { name: 'lensShiftV', required: true, label: `${this.$t('lensShiftV')}(%)`, field: 'lensShiftV', align: 'left' },
        { name: 'brightnessOnScreenNit', required: true, label: this.$t('brightnessOnScreenNit'), field: 'brightnessOnScreenNit', align: 'left' },
        { name: 'ambientContrast', required: true, label: this.$t('ambientContrast'), field: 'ambientContrast', align: 'left', format: val => `${val}:1` }
      ]
    },
    projectors() {
      return this.$store.state.projector.projectors
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">

</style>
