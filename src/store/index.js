import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import common from './common'
import projector from './projector'
import room from './room'
import screen from './screen'
import history from './history'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const historyState = createPersistedState({
  paths: ['history']
})

const Store = createStore({
  modules: {
    common,
    projector,
    room,
    screen,
    history
  },

  plugins: [historyState],

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING
})

export default Store
