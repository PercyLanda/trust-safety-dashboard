const router = require('express').Router();
const Case = require('../models/Case');

// GET all — supports ?status=&riskLevel=&category= filters
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.riskLevel) filter.riskLevel = req.query.riskLevel;
    if (req.query.category) filter.category = req.query.category;
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: cases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { title, status, priority, riskLevel, category, assignedTo } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'title is required' });
    const newCase = await Case.create({ title, status, priority, riskLevel, category, assignedTo: assignedTo || '', notes: req.body.notes || '' });
    res.status(201).json({ success: true, data: newCase });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT
router.put('/:id', async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Case.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Case not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
