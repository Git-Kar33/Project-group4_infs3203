const business = require('./business.js');


  // Test case for insertUser
  it('Inserting User to database', async () => {
    //let hashed =
    const userData = { username: 'testuser', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' }; //password='testpassword'
    const invalidUser = await business.checkLogin('testuser', '1234');
    if(!invalidUser){
      await business.insertUser(userData);//.resolves.not.toThrow();
    }
  });


  it('checkLogin should validate user credentials', async () => {
    const validUser = await business.checkLogin('testuser', '1234');
    expect(validUser).toBe(true);
  
    const invalidUser = await business.checkLogin('testuser', 'wrongpassword');
    expect(invalidUser).toBe(false);
  
    
    });
  
  // Test case for insertCustomer
  it('Inserting customer records to database', async () => {
    const customerData = { qid: '12345678901', totalPoints: 0, dateRecord: [] };
    const getCustomer = await business.checkLogin('testuser', '1234');
    if(!getCustomer){
      await business.insertCustomer(customerData);//.resolves.not.toThrow();
    }
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
    await business.addRecord(currentDate, qid, wasteType, category, weight, pointsReceived);
  });


  it('validID should validate Qatari IDs', async () => {
    expect(await business.validID('22335678901')).toBe(true);
    expect(await business.validID('1234567890')).toBe(false); // Invalid length
    expect(await business.validID('12345678902')).toBe(false); // Invalid first digit
    expect(await business.validID('A2345678901')).toBe(false); // Non-numeric
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
    await business.updatePoints(qid, newPoints);
  });

  // Test case for startSession
  it('startSession should initiate a new session for the user', async () => {
    const sessionData = { username: 'testuser' };
    business.startSession(sessionData);
  });

  // Test case for deleteSession
  it('deleteSession should delete a session from the database', async () => {
    const key = 'abc123';
    await business.deleteSession(key);
  });

  // Test case for insertPointData
  it('insertPointData should insert point data into the database', async () => {
    const pointData = { qid: '12345678901', date: new Date(), balance: 100, type: 'Addition', point: 10 };
    await business.insertPointData(pointData);
  });

  // Test case for getPointHistory
  it('getPointHistory should retrieve point history for a customer', async () => {
    const qid = '12345678901';
    await business.getPointHistory(qid);
  });
//action
//action
//action
