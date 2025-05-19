const axios = require('axios');

class RequestsHelper {
    
    #response;
    #axios;
    
    constructor({ baseUrl = ""}) {    
        this.#axios = axios.create({
            baseURL: baseUrl
        });
    }
        
    get responseStatus() {
        return this.#response.status;
    }
    
    get responseContent() {
        return this.#response.data;
    }
    
    async send(url, { method = 'get', data, headers }) {
        // https://axios-http.com/docs/req_config
        try {
            this.#response = await this.#axios({
                url : url, 
                method, data, headers
            });
        } catch (error) {
            this.#response = error.response;
        }
        
    }
    
    async sendGet(url) {
        await this.send(url, { method: 'get' });
    }
        
    async sendPost(url, data, options) {
        await this.send(url, { method: 'post', data, ...options });
    }
        
}

module.exports = RequestsHelper;