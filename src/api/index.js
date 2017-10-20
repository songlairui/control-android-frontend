import axios from 'axios'

let remoteHost = 'http://localhost:3001'

export async function listDevices() {
  let result = await axios.get(remoteHost + '/api/adb/devices').catch(e => {
    return {
      err: e
    }
  })
  return result
}

export async function checkMinimap() {
  let result = await axios
    .get(remoteHost + '/api/adb/checkRunning')
    .catch(e => {
      return { err: e }
    })
  return result
}

export async function startMinimap() {
  let result = await axios.get(remoteHost + '/api/adb/start')
  return result
}

export async function stopMinimap() {
  let result = await axios.get(remoteHost + '/api/adb/stop')
  return result
}

export async function deploy() {
  let result = await axios.get(remoteHost + '/api/adb/deploy')
  return result
}
