import { addListener, removeListener, launch, stop } from 'devtools-detector'

const envs = ['prod']

export function mount() {
  if (envs.includes(process.env.VUE_APP_SERVER_ENV)) {
    addListener(detechConsoleState)
    launch()
  }
}

export function unmount() {
  if (envs.includes(process.env.VUE_APP_SERVER_ENV)) {
    removeListener(detechConsoleState)
    stop()
  }
}

function detechConsoleState (isOpen) {
  if (isOpen) {
    console.log('user openned console!')
  }
}
