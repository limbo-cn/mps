<template>
  <q-layout view="HHH LpR LFF">
    <Header />
    <LeftSide />
    <MainPage />
    <Footer />
  </q-layout>
</template>

<script>
import Header from './Header'
import Footer from './Footer'
import LeftSide from './LeftSide/LeftSide'
import MainPage from './MainPage'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    Header,
    Footer,
    LeftSide,
    MainPage
  }
})
</script>
