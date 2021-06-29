module.exports = function(app) {
    const timelogs = require('../controller/timelog.controller.js');

    // Create a new Timelog
    app.post('/api/timelogs', timelogs.create);
 
    // Retrieve all Timelog
    app.get('/api/timelogs/all', timelogs.findAll);
 
    // Retrieve a single Timelog by timelogId
    // app.get('/api/timelogs/:timelogId', timelogs.findByTimelogId);
	
	// Retrieve Timelog customerId
    app.post('/api/timelogs/search/customer', timelogs.findByCustomerId);

	// Retrieve Timelog roomId
    app.post('/api/timelogs/search/room', timelogs.findByRoomId);
 
    // Update a Timelog with Id
    app.post('/api/timelogs/update', timelogs.update);
    
    // Delete a Timelog with Id
    app.delete('/api/timelogs/:timelogId', timelogs.delete); 
}