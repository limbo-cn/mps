<template>
    <div class="q-pa-sm q-pl-md row">
        <q-select
            dense
            :options="texturePatterns"
            v-model="screenTexture"
            @update:modelValue="changeScreenTexturePattern"
            map-options
            option-value="value"
            option-label="label"
            style="width:80%"
            behavior="menu"
        >
            <template v-slot:prepend>
                <div class="text-subtitle2">{{ $t('mapPattern') }}:</div>
            </template>
        </q-select>
        <q-btn flat color="primary" icon="add" @click="uploadTexture" />
        <div style="height:0px">
            <input
                id="upload_texture_screen"
                hidden
                type="file"
                accept="image/*, video/mp4, video/ogg"
                @change="changeFileTexture"
            />
        </div>
    </div>
</template>

<script>
import { showAlert } from 'src/helper/util'

export default {
    name: 'LeftSide-ScreenMap',
    data() {
        return {
            screenTexture: 'texture/screen.jfif',
            texturePatterns: [
                { label: 'default', value: 'texture/screen.jfif', isVideo: false },
                { label: 'half dome sky', value: 'texture/sky.jpg', isVideo: false },
                { label: 'dome ', value: 'texture/dome.jpg', isVideo: false },
                { label: 'full 360', value: 'texture/full.jpg', isVideo: false }
            ]
        }
    },
    computed: {

    },
    methods: {
        uploadTexture() {
            document.querySelector('#upload_texture_screen').click()
        },
        changeFileTexture(e) {
            const files = e.target.files
            if (files.length === 0) {
                return
            }
            const file = files[0]
            if (!file.type.includes('image')) {
                showAlert(this.$t('uploadFail'), this.$t('yes'))
                return
            }
            const URL = window.URL || window.webkitURL
            const src = URL.createObjectURL(file)
            this.texturePatterns.push({ label: file.name, value: src, isVideo: false })
            this.screenTexture = src
            this.$bus.emit('setScreenTexture', { patternSrc: src, isVideo: false })
        },
        changeScreenTexturePattern(pattern) {
            this.$bus.emit('setScreenTexture', { patternSrc: pattern.value, isVideo: pattern.isVideo })
        }
    }
}
</script>
<style lang="scss">
</style>
