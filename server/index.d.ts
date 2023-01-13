declare namespace NodeJS {
    interface ProcessEnv {
        SECRET_TOKEN: string
        API_TOKEN: string
        DB_USER: string
        DB_PASSWORD: string
        DB_SERVER: string
        DB_PORT: string
        DB_NAME: string
        MQTT_BASE_TOPIC: string      
    }
  }

  
interface AddWaterSubmit {
    GigaJoule: number;
    Volume: number;
    CustomDate?: string;
}

