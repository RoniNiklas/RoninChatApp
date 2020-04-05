const hasCamera = async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices()
    const isCamera = (device) => (device.kind === "videoinput" && device.label)
    return availableDevices.some(isCamera)
}

const hasMicrophone = async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices()
    const isMicrophone = (device) => (device.kind === "audioinput" && device.label)
    return availableDevices.some(isMicrophone)
}

export default { hasCamera, hasMicrophone }