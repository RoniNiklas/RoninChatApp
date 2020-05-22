const hasCamera = async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices()
    console.log("cameras", availableDevices)
    const isCamera = (device) => (device.kind === "videoinput" /*&& device.label*/)
    console.log("Is camera?", availableDevices.some(isCamera))
    return availableDevices.some(isCamera)
}

const hasMicrophone = async () => {
    const availableDevices = await navigator.mediaDevices.enumerateDevices()
    console.log("microphones", availableDevices)
    const isMicrophone = (device) => (device.kind === "audioinput" /*&& device.label*/)
    console.log("is microphone?", availableDevices.some(isMicrophone))
    return availableDevices.some(isMicrophone)
}

export default { hasCamera, hasMicrophone }