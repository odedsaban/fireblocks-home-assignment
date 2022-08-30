const axios = require('axios');
const Chance = require('chance');
const chance = new Chance();
const config = {
    headers: { Authorization: `Bearer odedsaban2@gmail.com` }
};
const baseUrl = 'https://fb-sandbox-dot-shell-dev-env.uc.r.appspot.com';



const sendRequest = async (method, url, body = undefined) => {
    try {
        if (method === 'get' || method === 'delete') {
            return await axios[method](`${baseUrl}${url}`, config);
        } else {
            return await axios[method](`${baseUrl}${url}`, body, config);
        }
    } catch (e) {
        return e.response;
    }
}

const generateUser = () => {
    return {
        "name": chance.name(),
        "balance": chance.integer({min: 0, max: 99999999})
    };
}

module.exports = { sendRequest, generateUser}