<template>
    <div class="row q-pa-sm q-pl-md">
        <q-field dense borderless style="width: 100%;">
            <q-btn flat round dense :color="$q.dark.isActive ? 'white' : 'primary'" icon="help_outline"
                class="float-right" size="sm" style="margin:auto 5px;">
                <q-popup-proxy>
                    <div class="q-pa-md">
                        <q-img src="../../../assets/xyz_reference.jpg" style="width: 300px;" />
                    </div>
                </q-popup-proxy>
            </q-btn>
            <q-checkbox v-model="isShowRefrence" @update:modelValue="updateShowRefrence" left-label
                :label="$t('showReference')" />
        </q-field>
        <q-field dense borderless style="width: 100%;">
            <q-btn flat round dense :color="$q.dark.isActive ? 'white' : 'primary'" icon="help_outline"
                class="float-right" size="sm" style="margin:auto 5px;">
                <q-popup-proxy>
                    <div class="q-pa-md">
                        <q-img src="../../../assets/interfere1.jpg" style="width: 300px;" />
                        <br />
                        <q-img src="../../../assets/interfere2.jpg" style="width: 300px;" />
                    </div>
                </q-popup-proxy>
            </q-btn>
            <q-checkbox v-model="isShowProjectorInterfere" @update:modelValue="updateShowProjectorInterfere" left-label
                :label="$t('showProjectorInterfere')" />
        </q-field>
        <q-field dense borderless style="width: 100%;">
            <q-btn flat round dense :color="$q.dark.isActive ? 'white' : 'primary'" icon="help_outline"
                class="float-right" size="sm" style="margin:auto 5px;">
                <q-popup-proxy>
                    <div class="q-pa-md">
                        <q-img src="../../../assets/distance_reference1.jpg" style="width: 300px;" />
                        <br />
                        <q-img src="../../../assets/distance_reference2.jpg" style="width: 300px;" />
                    </div>
                </q-popup-proxy>
            </q-btn>
            <q-checkbox v-model="isShowProjectionDistanceRefrence"
                @update:modelValue="updateShowProjectionDistanceRefrence" left-label
                :label="$t('showProjectionDistanceRefrence')" />
        </q-field>
        <q-field dense borderless style="width: 100%;">
            <q-btn flat round dense :color="$q.dark.isActive ? 'white' : 'primary'" icon="help_outline"
                class="float-right" size="sm" style="margin:auto 5px;">
                <q-popup-proxy>
                    <div class="q-pa-md">
                        <div class="q-pa-md">
                            <q-img src="../../../assets/lightbound1.jpg" style="width: 300px;" />
                            <br />
                            <q-img src="../../../assets/lightbound2.jpg" style="width: 300px;" />
                        </div>
                    </div>
                </q-popup-proxy>
            </q-btn>
            <q-checkbox v-model="isShowLightBound" @update:modelValue="updateShowLightBound" left-label
                :label="$t('showProjectorLightBound')" />
        </q-field>
        <q-field dense borderless style="width: 100%;">
            <q-btn flat round dense :color="$q.dark.isActive ? 'white' : 'primary'" icon="help_outline"
                class="float-right" size="sm" style="margin:auto 5px;">
                <q-popup-proxy>
                    <div class="q-pa-md">
                        <div class="q-pa-md row">
                            <div class="col flex">
                                <q-badge style="margin:auto 5px;" color="primary"
                                    :text-color="$q.dark.isActive ? 'black' : 'white'" label="1" />
                                <q-img src="../../../assets/distance_helper1.jpg" style="width: 300px;" />
                            </div>
                            <div class="col flex">
                                <q-badge style="margin:auto 5px;" color="primary"
                                    :text-color="$q.dark.isActive ? 'black' : 'white'" label="2" />
                                <q-img src="../../../assets/distance_helper2.jpg" style="width: 300px;" />
                            </div>
                            <div class="col flex">
                                <q-badge style="margin:auto 5px;" color="primary"
                                    :text-color="$q.dark.isActive ? 'black' : 'white'" label="3" />
                                <q-img src="../../../assets/distance_helper3.jpg" style="width: 300px;" />
                            </div>
                        </div>
                    </div>
                </q-popup-proxy>
            </q-btn>
            <q-checkbox v-model="isShowDistanceHelper" @update:modelValue="updateShowDistanceHelper" left-label
                :label="$t('showDistanceHelper')" />
        </q-field>
    </div>
</template>

<script>
export default {
    name: 'LeftSide-RoomAssistance',
    data() {
        return {
            isShowRefrence: true,
            isShowProjectorInterfere: false,
            isShowProjectionDistanceRefrence: false,
            isShowLightBound: true,
            isShowDistanceHelper: false
        }
    },
    methods: {
        updateShowRefrence(val) {
            this.$bus.emit('updateShowRefrence', val)
        },
        updateShowProjectorInterfere(val) {
            this.$bus.emit('updateShowProjectorInterfere', val)
        },
        updateShowProjectionDistanceRefrence(val) {
            this.$bus.emit('updateShowProjectionDistanceRefrence', val)
        },
        updateShowLightBound(val) {
            this.$bus.emit('updateShowLightBound', val)
        },
        updateShowDistanceHelper(val) {
            this.$bus.emit('updateShowDistanceHelper', val)
        }
    }
}
</script>
<style lang="scss">
</style>
