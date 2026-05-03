const express = require('express');
const router = express.Router();
const { getTemplates, getTemplate, getCategories, createTemplate, incrementDownload, seedTemplates } = require('../controllers/templateController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadTemplate } = require('../middleware/upload');

router.get('/', optionalAuth, getTemplates);
router.get('/categories', getCategories);
router.post('/seed', seedTemplates);
router.get('/:id', optionalAuth, getTemplate);
router.post('/:id/download', protect, incrementDownload);
router.post('/', protect, uploadTemplate.single('image'), createTemplate);

module.exports = router;
