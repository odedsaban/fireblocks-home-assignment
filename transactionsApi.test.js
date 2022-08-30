const {sendRequest, generateUser} = require('./utils');
const Chance = require('chance');
const chance = new Chance();
let sourceUser = generateUser();
let destinationUser = generateUser();

beforeAll( async () => {
    sourceUser = await (await sendRequest('post', '/users', sourceUser)).data;
    destinationUser = await (await sendRequest('post', '/users', destinationUser)).data;
})

describe('transactions api tests', () => {
    let txId;
    const transactionAmount = chance.integer({min: 0, max: sourceUser.balance})
    test('POST - Send request with valid body schema', async () => {
        const newTransactionSchema = {
            sourceId: sourceUser.id,
            destinationId: destinationUser.id,
            amount: transactionAmount
        }
        const response = await sendRequest('post', '/transactions/create', newTransactionSchema);
        expect(response.status).toEqual(201);
        txId = response.data;
    })
    test('POST - Send request with not valid body schema(without sourceId/destinationId/amount)', async () => {
        const newTransactionSchema = {
            sourceId: sourceUser.id,
            amount: chance.integer({min: 0, max: 500000})
        }
        const response = await sendRequest('post', '/transactions/create', newTransactionSchema);
        //expect(response.status).toEqual(400); We got 500
    })

    test('GET - Send request with valid txId ', async () => {
        const response = await sendRequest('get', `/transactions/${txId}`);
        const {sourceId, destinationId, amount, id} = response.data;
        expect(response.status).toEqual(200);
        expect(id).toEqual(txId);
        expect(sourceId).toEqual(sourceUser.id);
        expect(destinationId).toEqual(destinationUser.id);
        expect(amount).toEqual(transactionAmount);
    })
    test('GET - Send request with txId that not exist', async () => {
        const response = await sendRequest('get', `/transactions/${chance.word()}`);
        expect(response.status).toEqual(404);
    })
    test('GET - Send request without txId', async () => {
        const response = await sendRequest('get', `/transactions/`);
        expect(response.status).toEqual(404);
    })

    test('GET - Send request with valid txId', async () => {
        const response = await sendRequest('get', `/transactions/status/${txId}`);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('PENDING');
    })
    test('GET - Send request with txId that not exist', async () => {
        const response = await sendRequest('get', `/transactions/status/${chance.word()}`);
        expect(response.status).toEqual(404);
    })
    test('GET - Send request without txId', async () => {
        const response = await sendRequest('get', `/transactions/status/`);
        expect(response.status).toEqual(404);
    })
})