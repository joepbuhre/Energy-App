import * as mqtt from 'async-mqtt'

export const publish = async (topic: string|string[], data: string|object): Promise<any> => {
    let top: string = process.env.MQTT_BASE_TOPIC || ''
    const broker: string = process.env.MQTT_BROKER || ''
    const port: number = (process.env.MQTT_PORT) ? parseInt(process.env.MQTT_PORT) : 1883

    let mess;

    let connectObj: mqtt.IClientOptions = {
        protocol: 'ssl',
        host: broker,
        port: port,
    }

    if(process.env.MQTT_PASSWORD && process.env.MQTT_USERNAME) {
        connectObj = {
            ...connectObj,
            password: process.env.MQTT_PASSWORD,
            username: process.env.MQTT_USERNAME,
            
        }
    }

    const client = await mqtt.connectAsync(connectObj)

    if(!client.connected) {
        console.log(connectObj)
        throw Error('MQTT not connected!')
    }


    if(Array.isArray(topic)) {
        top = `${top}/${topic.join('/')}`
    } else {
        top = `${top}/${topic}`
    }

    if(typeof data === 'object') {
        mess = JSON.stringify(data)
    } else {
        mess = data
    }

    await client.publish(top, mess, {
        retain: true
    })
    await client.end();

    return Promise.resolve()
}