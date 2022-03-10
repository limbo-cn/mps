<template>
  <q-header reveal :style="{background:$q.dark.isActive?'#1e1f26':'white'}" id="app-header">
    <q-toolbar class="shadow-2">
      <img :src="$q.dark.isActive?logo_white:logo" :style="{background:!$q.dark.isActive?'white':''}" class="rounded-borders" style="height: 40px;padding: 2px; max-width: 150px;">

      <q-toolbar-title>
        <div v-show="!$q.platform.is.mobile" style="font-weight:bold" :style="{color:$q.dark.isActive?'white':'#45ba55'}">Multi Projection Simulator</div>
      </q-toolbar-title>

      <q-btn flat round :color="$q.dark.isActive?'white':'green'" icon="language">
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup @click="changeLanguage(`en-us`)">
              <q-item-section>English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`cn-zh`)">
              <q-item-section>简体中文</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`cn-tw`)">
              <q-item-section>繁體中文</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`fr`)">
              <q-item-section>Français</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`es`)">
              <q-item-section>Español</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`de`)">
              <q-item-section>Deutsche</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`it`)">
              <q-item-section>Italiana</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`jp`)">
              <q-item-section>日本語</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`kr`)">
              <q-item-section>한국어</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`vi`)">
              <q-item-section>Tiếng Việt</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn flat round :color="$q.dark.isActive?'white':'green'" icon="brightness_medium" @click="toggleTheme" />
      <q-btn flat round :color="$q.dark.isActive?'white':'green'" v-show="!$q.platform.is.mobile" @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" />

    </q-toolbar>

  </q-header>
</template>

<script>
import { setCssVar } from 'quasar'
import { i18n } from '../boot/i18n'

export default {
  name: 'Header',
  data() {
    return {
      logo: require('../assets/Vivitek Logo.png'),
      logo_white: require('../assets/Vivitek Logo_white.png')
    }
  },
  methods: {
    changeLanguage(lan) {
      console.log(i18n)
      i18n.global.locale = lan
      switch (lan) {
        case 'en-us': import('quasar/lang/en-US').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'cn-zh': import('quasar/lang/zh-CN').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'cn-tw': import('quasar/lang/zh-TW').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'fr': import('quasar/lang/fr').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'es': import('quasar/lang/es').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'de': import('quasar/lang/de').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'it': import('quasar/lang/it').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'jp': import('quasar/lang/ja').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'kr': import('quasar/lang/ko-KR').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'vi': import('quasar/lang/vi').then(lang => { this.$q.lang.set(lang.default) }); break
      }
    },
    toggleTheme() {
      this.$q.dark.toggle()
      if (this.$q.dark.isActive) {
        setCssVar('primary', '#96efa6')
      } else {
        setCssVar('primary', '#3aaa35')
      }
      this.$bus.emit('setTheme')
    }
  }
}
</script>
