module.exports = function(app) {
    const timelogs = require('../controller/timelog.controller.js');

    // Create a new Timelog
    app.post('/api/timelog', timelogs.create);
 
    // Retrieve all Timelog
    app.get('/api/timelogs', timelogs.findAll);
 
    // Retrieve a single Timelog by Id
    app.get('/api/timelog/:timelogId', timelogs.findById);
	
	// Retrieve Timelog roomId
    app.get('/api/timelogs/roomId/:roomId', timelogs.findByRoomId);
 
    // Update a Timelog with Id
    app.put('/api/timelog/:timelogId', timelogs.update);
    
    // Delete a Timelog with Id
    app.delete('/api/timelog/:timelogId', timelogs.delete); 
}