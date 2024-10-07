const express = require('express');
const router = express.Router();
const SIMCard = require('../api/models/simCard');
const { check, validationResult } = require('express-validator');  // Add express-validator

const validateSimNumber = [
  check('simNumber')
    .notEmpty().withMessage('SIM number dal bhai')
    .isLength({ min: 10, max: 15 }).withMessage('bro validate the number will ya'), 
];

router.post('/activate', validateSimNumber, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  }

  const { simNumber } = req.body;

  try {
    const sim = await SIMCard.findOne({ simNumber });

    if (!sim) {
      return res.status(404).json({ message: 'SIM not found' });
    }

    if (sim.status === 'active') {
      return res.status(400).json({ message: 'SIM is already active' });
    }

    sim.status = 'active';
    sim.activationDate = new Date();
    await sim.save();

    return res.status(200).json({
      message: 'SIM activated successfully',
      sim,
    });
  } catch (error) {
    console.error('Error activating SIM:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Deactivate SIM Card
router.post('/deactivate', validateSimNumber, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  }

  const { simNumber } = req.body;

  try {
    const sim = await SIMCard.findOne({ simNumber });

    if (!sim) {
      return res.status(404).json({ message: 'SIM not found' });
    }

    if (sim.status === 'inactive') {
      return res.status(400).json({ message: 'SIM is already inactive' });
    }

    sim.status = 'inactive';
    await sim.save();

    return res.status(200).json({
      message: 'SIM deactivated successfully',
      sim,
    });
  } catch (error) {
    console.error('Error deactivating SIM:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get SIM Details
router.get('/sim-details/:simNumber', async (req, res) => {
  const { simNumber } = req.params;

  try {
    const sim = await SIMCard.findOne({ simNumber });

    if (!sim) {
      return res.status(404).json({ message: 'SIM not found' });
    }

    return res.status(200).json(sim);
  } catch (error) {
    console.error('Error retrieving SIM details:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
