// server/routes/trips.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware'); // your JWT middleware
const tripController = require('../controllers/tripController');

router.get('/', protect, tripController.getTrips);
router.post('/', protect, tripController.createTrip);
router.get('/:id', protect, tripController.getTrip);
router.put('/:id', protect, tripController.updateTrip);
router.delete('/:id', protect, tripController.deleteTrip);

module.exports = router;
