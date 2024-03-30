const request = require('supertest');
const app = require('./presentation'); // Assuming your main file is named 'presentation.js'

describe('Test Express routes', () => {
    it('GET / responds with 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    // Add more test cases for other routes as needed
});
