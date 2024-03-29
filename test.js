const assert = require('assert');
const business = require('./business.js');

describe('Business Functions', () => {
    it('should insert a user', async () => {
        // Write your test logic here
        // Example:
        await business.insertUser({ username: 'testuser', password: 'testpassword' });
        let userDetails = await business.getUserDetails('testuser');
        assert.strictEqual(userDetails.username, 'testuser');
        assert.strictEqual(userDetails.password, 'testpassword');
    });

    // Add more test cases for other functions as needed
});
