module.exports = function(app) {
    const timelogs = require('../controller/timelog.controller.js');

    // Create a new Timelog
    app.post('/api/timelog', timelogs.create);
 
    // Retrieve all Timelog
    app.get('/api/timelogs', timelogs.findAll);
 
    // Retrieve a single Timelog by customerId
    app.get('/api/timelog/:timelogId', timelogs.findByTimelogId);
	
	// Retrieve Timelog customerId
    app.get('/api/timelogs/:customerId', timelogs.findByCustomerId);

	// Retrieve Timelog roomId
    app.get('/api/timelogs/:roomId', timelogs.findByRoomId);
 
    // Update a Timelog with Id
    app.put('/api/timelog/:timelogId', timelogs.update);
    
    // Delete a Timelog with Id
    app.delete('/api/timelog/:timelogId', timelogs.delete); 
}