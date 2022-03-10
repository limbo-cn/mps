import { createStore } from 'vuex'

import common from './common'
import projector from './projector'
import room from './room'
import screen from './screen'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = createStore({
  modules: {
    common,
    projector,
    room,
    screen
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING
})

export default Store
