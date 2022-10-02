const LogLevels = {
    SILLY: 'SILLY',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    NONE: 'NONE'
  }
  
type LogLevel = keyof typeof LogLevels
  
  
class Logger {
    level: LogLevel;
    // SILLY, DEBUG, INFO, NONE
    constructor(level: LogLevel) {
        this.level = level
    }
    log(...text: any):void {
        console.log(...text)
    }
    warn(...text: any):void {
        console.log(...text)
    }
    debug(...text: any):void {
        console.log(...text)
    }
    
}

const logger = new Logger('DEBUG')

export default Logger
export {logger}