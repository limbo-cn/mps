import { boot } from 'quasar/wrappers'
import Mitt from 'mitt'

export default boot(({ app }) => {
    // Set Bus instance on Vue
    app.config.globalProperties.$bus = new Mitt()
})
