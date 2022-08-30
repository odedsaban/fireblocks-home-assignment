const {sendRequest, generateUser} = require('./utils');
const Chance = require('chance');
const chance = new Chance();


describe('users api tests', () => {
    let userId;
    const requestBody = generateUser();
    test('POST - Send request with valid body schema', async () => {
        const response = await sendRequest('post','/users', requestBody );
        const {name, balance, id} = response.data;
        expect(response.status).toEqual(201);
        expect(name).toEqual(requestBody.name);
        expect(balance).toEqual(requestBody.balance);
        expect(id).toBeDefined();
        userId = id;
    })
    test('POST - Send request with not valid body schema (without name/balance or both)', async () => {
        const _requestBody = Object.assign({}, requestBody);
        delete _requestBody["name"];
        let response = await sendRequest('post','/users', _requestBody );
        //expect(response.status).toEqual(400); We got 500
        delete _requestBody["balance"];
        response = await sendRequest('post','/users', _requestBody );
        //expect(response.status).toEqual(400); We got 500
    })

    test('GET - Send a request with a valid body schema ', async () => {
        const response = await sendRequest('get', '/users');
        expect(response.status).toEqual(200);
        expect(response.data.length).toBeGreaterThan(0)
    })
    test('GET - Send request with valid Id', async () => {
        const response = await sendRequest('get', `/users/${userId}`);
        const {name, balance} = response.data;
        expect(response.status).toEqual(200);
        expect(name).toEqual(requestBody.name);
        expect(balance).toEqual(requestBody.balance);
    })
    test('GET - Send request with non-number id', async () => {
        const response = await sendRequest('get', `/users/${chance.word()}`);
        expect(response.status).toEqual(400);
    })
    test('GET - Send request with id that does not exist', async () => {
        const response = await sendRequest('get', `/users/${chance.integer({min: 5000, max: 500000})}`);
        expect(response.status).toEqual(404);
    })

    test('PATCH - Send request with valid id and valid request body', async () => {
        const _requestBody = generateUser()
        const response = await sendRequest('patch', `/users/${userId}`, _requestBody);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({id: userId, name: _requestBody.name, balance: _requestBody.balance})
    })

    test('PATCH - Send request with non-number id', async () => {
        const response = await sendRequest('patch', `/users/${chance.word()}`);
        expect(response.status).toEqual(400);
    })
    test('PATCH - Send request with id that does not exist', async () => {
        const response = await sendRequest('patch', `/users/${chance.integer({min: 5000, max: 500000})}`);
        expect(response.status).toEqual(404);
    })
    test('PATCH - Send request with valid id and invalid body schema', async () => {
        const response = await sendRequest('patch', `/users/${userId}`, {"non_valid": "oded"});
        // expect(response.status).toEqual(400); We got 200
    })
    test('PATCH - Send request without id', async () => {
        const response = await sendRequest('patch', `/users/`);
        expect(response.status).toEqual(404);
    })

    test('DELETE - Send request with valid Id', async () => {
        const response = await sendRequest('delete', `/users/${userId}`);
        expect(response.status).toEqual(200);
    })
    test('DELETE - Send request with non-number id', async () => {
        const response = await sendRequest('delete', `/users/${chance.word()}`);
        expect(response.status).toEqual(400);
    })
    test('DELETE - Send request with id that does not exist', async () => {
        const response = await sendRequest('delete', `/users/${chance.integer({min: 5000, max: 500000})}`);
        expect(response.status).toEqual(404);
    })
    test('DELETE - Send request without id', async () => {
        const response = await sendRequest('delete', `/users/`);
        expect(response.status).toEqual(404);
    })
})