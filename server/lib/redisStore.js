const config = require('../config/config');
const redis = require('redis');
class RedisSubscribe{
    constructor(){
        this._callback = new Map();
        this._redis = redis.createClient(config.redisOptions);
        this._redis.on('message', (channel, msg)=>{
            let obj = JSON.parse(msg);
            let cb = this._callback.get(channel);
            if(cb) cb(obj);
        });
    }
    
    subscribe(channel, cb){
        this._redis.subscribe(channel);
        this._callback.set(channel, cb);
    }
    unsubscribe(channel){
        this._redis.unsubscribe(channel);
        this._callback.delete(channel);
    }
}
module.exports = {
    pubs: redis.createClient(config.redisOptions),
    subs: new RedisSubscribe()
};