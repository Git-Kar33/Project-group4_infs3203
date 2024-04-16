const business = require('./business.js')
const persistence = require("./persistence.js")

  // Test case for insertUser
    it('Inserting User to database', async () => {
        const userData = { username: 'testuser', password: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' }; //password='testpassword'
        await business.insertUser(userData);
        let checkUserData = await persistence.getUserDetails(userData.username);
        expect(checkUserData.username).toBe(userData.username);
        expect(checkUserData.password).toBe(userData.password);
    });

    // Test case for checkLogin
    it('checkLogin should validate user credentials', async () => {
        const validUser = await business.checkLogin('testuser', '1234');
        expect(validUser).toBe(true);
      
        const invalidUser = await business.checkLogin('testuser', 'wrongpassword');
        expect(invalidUser).toBe(false);

        await business.deleteUser("testuser");
    });

    // Test case for insertCustomer
    it('Inserting customer records to database', async () => {
            const customerData = { qid: '20235604099', totalPoints: 0, dateRecord: [] };
            await business.insertCustomer(customerData);
            let checkCustomerData = await business.getCustomerDetails(customerData.qid);
            expect(checkCustomerData.qid).toBe('20235604099');
            expect(checkCustomerData.totalPoints).toBe(0);
            expect(checkCustomerData.dateRecord).toEqual([]);
        });

    // Test case for addRecord
    it('addRecord should add a record to the customer data in the database', async () => {
        const currentDate = new Date();
        const qid = '20235604099';
        const wasteType = 'Plastic Water bottle';
        const category = 'Plastic';
        const weight = 1000;
        const point = await business.getPoints(category);
        expect(point).toBe(2);
        await business.addRecord(currentDate.toLocaleDateString(), qid, wasteType, category, weight, point*weight);
    });

    // Test case for valid qid
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
        const qid = '20235604099';
        const newPoints = 50;
        await business.updatePoints(qid, newPoints);
        let cData = await business.getCustomerDetails(qid)
        expect(cData.totalPoints).toBe(newPoints);
        await business.deleteCustomer(qid);
      });

    // Test case for insert and get points
    it('insertPointData should insert point data into the database', async () => {
        let currentDate = new Date()
        const pointData = { qid: '20235604099', date: currentDate, balance: 50, type: 'add', point: 10 };
        await business.insertPointData(pointData.qid, pointData.date, pointData.balance, pointData.type, pointData.point);
        let pointHistory = await business.getPointHistory(pointData.qid);
        expect(pointData.qid).toBe(pointHistory[0].qid);
        expect(pointData.date).toEqual(new Date(pointHistory[0].date));
        expect(pointData.balance).toBe(pointHistory[0].balance);
        expect(pointData.type).toBe(pointHistory[0].type);
        expect(pointData.point).toBe(pointHistory[0].point);
        await business.deletePointData(pointData.qid);
    });
//test
//test again
//test test
//Check
//check
//check
//check
//boom boom
//boom
