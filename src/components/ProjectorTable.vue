<template>
  <div class="absolute absolute-bottom-left detail-wrapper" v-show="showProjectorDetail" style="z-index:10">
    <q-card class="fit">
      <q-table @row-click="clickRow" v-model:selected="selectedRows" :rows="projectors" :columns="columns" row-key="uId" :class="$q.dark.isActive?`my-sticky-header-table-dark`:`my-sticky-header-table`" selection="multiple" :pagination="{rowsPerPage :100}" hide-bottom dense flat bordered square>
        <template v-slot:body-cell="props">
          <q-td :props="props" :class="props.row.uId === selectedProjector.uId?$q.dark.isActive?'bg-grey-8':'bg-grey-4':''">
            <span v-if="props.row.uId === selectedProjector.uId" class="text-primary">{{props.value}}</span>
            <span v-else>{{props.value}}</span>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
import { uid } from 'quasar'
import { Projector } from 'src/helper/object'
import { mapMutations } from 'vuex'

export default ({
  name: 'Projector-Table',
  data() {
    return {

    }
  },
  computed: {
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    selectedRows: {
      get() {
        return this.$store.state.projector.selectedProjectors
      },
      set(val) {
        this.SET_SELECTED_PROJECTORS(val)
      }
    },
    columns() {
      return [
        { name: 'customName', required: true, label: this.$t('customName'), field: 'customName', align: 'left' },
        { name: 'modelName', required: true, label: this.$t('modelName'), field: 'modelName', align: 'left' },
        { name: 'lensName', required: true, label: this.$t('lensName'), field: 'lensName', align: 'left', format: val => `${val || 'fixed'}` },
        { name: 'x', required: true, label: 'x', field: 'x', align: 'left', format: val => `${Number(val).toFixed(2)}m` },
        { name: 'y', required: true, label: 'y', field: 'y', align: 'left', format: val => `${Number(val).toFixed(2)}m` },
        { name: 'z', required: true, label: 'z', field: 'z', align: 'left', format: val => `${Number(val).toFixed(2)}m` },
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
    },
    showProjectorDetail() {
      return this.$store.state.common.showProjectorDetail
    },
    selectedProjector() {
      return this.$store.getters['projector/selectedProjector']
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_SELECTED_PROJECTOR_UID', 'ADD_PROJECTOR', 'SET_SELECTED_PROJECTORS']),
    copyProjector() {
      const projector = new Projector()
      Object.keys(this.selectedProjector).forEach(key => {
        projector[key] = this.selectedProjector[key]
      })
      projector.uId = uid()
      projector.customName = `${projector.customName}(copy-${projector.uId.slice(0, 4)})`

      this.ADD_PROJECTOR(projector)

      this.$bus.emit('addProjector', projector.uId)
    },
    clickRow(evt, row, index) {
      this.SET_SELECTED_PROJECTOR_UID(row.uId)
      this.$bus.emit('setProjector', row)
    }
  }
})
</script>
<style lang="scss" scoped>
.detail-wrapper{
    width: 100%;
    height: 200px;
    opacity: 0.8;
}
</style>
<style lang="scss" scoped>
.list-wrapper{
    width: 100%;
    height: 200px;
    opacity: 0.8;
}
</style>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

.my-sticky-header-table-dark
  /* height or max-height is important */
  height: 200px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $secondary

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
