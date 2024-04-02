const business = require('./business.js');

describe('Business Functions', () => {
  // Test case for insertUser
  it('Inserting User to database', async () => {
    const userData = { username: 'testuser', password: 'testpassword' };
    await expect(business.insertUser(userData)).resolves.not.toThrow();
  });

  // Test case for insertCustomer
  it('Inserting customer records to database', async () => {
    const customerData = { qid: '12345678901', totalPoints: 0, dateRecord: [] };
    await expect(business.insertCustomer(customerData)).resolves.not.toThrow();
  });

  // Test case for getCustomerDetails
  it('Getting Customer details from database', async () => {
    const retrievedCustomer = await business.getCustomerDetails('12345678901');
    expect(retrievedCustomer).toBeDefined();
    expect(retrievedCustomer.qid).toBe('12345678901');
  });

  // Test case for addRecord
  it('addRecord should add a record to the customer data in the database', async () => {
    const currentDate = new Date();
    const qid = '12345678901';
    const wasteType = 'Plastic';
    const category = 'Recyclable';
    const weight = 10;
    const pointsReceived = 20;
    await expect(business.addRecord(currentDate, qid, wasteType, category, weight, pointsReceived)).resolves.not.toThrow();
  });

   // Test case for getPoints
  it('getPoints should retrieve points for a given category', async () => {
    expect(await business.getPoints('Paper')).toBe(1);
    expect(await business.getPoints('Plastic')).toBe(2);
    expect(await business.getPoints('Metal')).toBe(3);
  });

  // Test case for updatePoints
  it('updatePoints should update the total points for a customer', async () => {
    const qid = '12345678901';
    const newPoints = 50;
    await expect(business.updatePoints(qid, newPoints)).resolves.not.toThrow();
  });

  // Test case for startSession
  it('startSession should initiate a new session for the user', async () => {
    const sessionData = { username: 'testuser' };
    await expect(business.startSession(sessionData)).resolves.not.toThrow();
  });

