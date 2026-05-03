const Template = require('../models/Template');
const path = require('path');

// @desc    Get all templates (with category filter)
// @route   GET /api/templates
const getTemplates = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Template.countDocuments(query);
    const templates = await Template.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-createdBy');

    res.json({
      success: true,
      templates,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single template
// @route   GET /api/templates/:id
const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories list
// @route   GET /api/templates/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Template.distinct('category', { isActive: true });
    res.json({ success: true, categories: ['All', ...categories] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create template (admin)
// @route   POST /api/templates
const createTemplate = async (req, res) => {
  try {
    const { title, category, isPremium, tags, profileOverlay, nameOverlay } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Template image is required' });
    }

    const imageUrl = `/uploads/templates/${req.file.filename}`;

    const template = await Template.create({
      title,
      category,
      imageUrl,
      thumbnailUrl: imageUrl,
      isPremium: isPremium === 'true' || isPremium === true,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      profileOverlay: profileOverlay ? JSON.parse(profileOverlay) : undefined,
      nameOverlay: nameOverlay ? JSON.parse(nameOverlay) : undefined,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment download count
// @route   POST /api/templates/:id/download
const incrementDownload = async (req, res) => {
  try {
    await Template.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed sample templates
// @route   POST /api/templates/seed
const seedTemplates = async (req, res) => {
  try {
    const count = await Template.countDocuments();
    if (count >= 28) {
      return res.json({ success: true, message: 'Templates already seeded', count });
    }

    // Clear existing templates to allow re-seeding with the new expanded list
    await Template.deleteMany({});

    const sampleTemplates = [
      { title: 'Happy Birthday', category: 'Birthday', emoji: '🧁', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', wish: 'Wishing you joy & love!', isPremium: false, tags: ['birthday', 'joy', 'love'] },
      { title: 'Party Time!', category: 'Birthday', emoji: '🎁', gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)', wish: 'Let the celebrations begin!', isPremium: false, tags: ['birthday', 'party', 'celebration'] },
      { title: 'Surprise!', category: 'Birthday', emoji: '🪅', gradient: 'linear-gradient(135deg,#06b6d4,#22d3ee)', wish: 'You deserve all the happiness!', isPremium: true, tags: ['birthday', 'surprise', 'premium'] },
      { title: 'Sweet Day', category: 'Birthday', emoji: '🎀', gradient: 'linear-gradient(135deg,#e879f9,#fbbf24)', wish: 'Hope your day is as sweet as you!', isPremium: true, tags: ['birthday', 'sweet', 'premium'] },
      { title: 'Happy Diwali', category: 'Festival', emoji: '🕯️', gradient: 'linear-gradient(135deg,#ea580c,#facc15)', wish: 'May your life be filled with light!', isPremium: false, tags: ['festival', 'diwali', 'lights'] },
      { title: 'Holi Hai!', category: 'Festival', emoji: '🎨', gradient: 'linear-gradient(135deg,#d946ef,#9333ea)', wish: 'May your life be colourful!', isPremium: false, tags: ['festival', 'holi', 'colors'] },
      { title: 'Happy Eid', category: 'Festival', emoji: '🌙', gradient: 'linear-gradient(135deg,#047857,#10b981)', wish: 'Eid Mubarak to you and your family!', isPremium: false, tags: ['festival', 'eid', 'peace'] },
      { title: 'Merry Christmas', category: 'Festival', emoji: '🎄', gradient: 'linear-gradient(135deg,#b91c1c,#dc2626)', wish: 'Wishing you a very Merry Christmas!', isPremium: true, tags: ['festival', 'christmas', 'snow'] },
      { title: 'Happy New Year', category: 'New Year', emoji: '🌟', gradient: 'linear-gradient(135deg,#0f172a,#1e3a5f,#334155)', wish: 'May this year bring you joy!', isPremium: false, tags: ['new year', 'celebration', '2026'] },
      { title: 'Cheers!', category: 'New Year', emoji: '🍾', gradient: 'linear-gradient(135deg,#a16207,#eab308)', wish: 'To new beginnings!', isPremium: true, tags: ['new year', 'cheers', 'premium'] },
      { title: 'Anniversary', category: 'Love', emoji: '💞', gradient: 'linear-gradient(135deg,#db2777,#9333ea)', wish: 'Every day with you is a gift.', isPremium: true, tags: ['love', 'anniversary', 'premium'] },
      { title: 'Be Mine', category: 'Love', emoji: '💌', gradient: 'linear-gradient(135deg,#e11d48,#fb7185)', wish: 'Happy Valentine’s Day!', isPremium: false, tags: ['love', 'valentine', 'heart'] },
      { title: 'Good Luck!', category: 'Exam', emoji: '✏️', gradient: 'linear-gradient(135deg,#059669,#34d399)', wish: 'You have worked hard. Go ace it!', isPremium: false, tags: ['exam', 'good luck', 'study'] },
      { title: 'Congratulations!', category: 'Exam', emoji: '🎖️', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)', wish: 'Proud of you!', isPremium: false, tags: ['exam', 'congratulations', 'success'] },
      { title: 'Just Married', category: 'Wedding', emoji: '💒', gradient: 'linear-gradient(135deg,#b45309,#fde68a)', wish: 'Wishing you a blissful life together!', isPremium: false, tags: ['wedding', 'marriage', 'love'] },
      { title: 'Wedding Wishes', category: 'Wedding', emoji: '🌺', gradient: 'linear-gradient(135deg,#9333ea,#e879f9)', wish: 'May love light your way!', isPremium: true, tags: ['wedding', 'blessings', 'premium'] },
      { title: 'Thank You', category: 'Appreciation', emoji: '🙏', gradient: 'linear-gradient(135deg,#4338ca,#6366f1)', wish: 'Thanks a million for your help!', isPremium: false, tags: ['thanks', 'appreciation', 'grateful'] },
      { title: 'You Are Best', category: 'Appreciation', emoji: '👑', gradient: 'linear-gradient(135deg,#b45309,#f59e0b)', wish: 'No one is quite like you!', isPremium: true, tags: ['appreciation', 'best', 'premium'] },
      { title: 'Best Friends', category: 'Friendship', emoji: '👯‍♀️', gradient: 'linear-gradient(135deg,#1d4ed8,#60a5fa)', wish: 'Friends forever!', isPremium: false, tags: ['friendship', 'friends', 'together'] },
      { title: 'Get Well Soon', category: 'Care', emoji: '🌻', gradient: 'linear-gradient(135deg,#047857,#34d399)', wish: 'Sending you healing energy!', isPremium: false, tags: ['health', 'care', 'healing'] },
      { title: 'Happy Mother’s Day', category: 'Family', emoji: '👩‍👧', gradient: 'linear-gradient(135deg,#be185d,#f472b6)', wish: 'To the best mom in the world!', isPremium: true, tags: ['family', 'mother', 'premium'] },
      { title: 'Happy Father’s Day', category: 'Family', emoji: '👨‍👦', gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', wish: 'Thanks for everything, Dad!', isPremium: false, tags: ['family', 'father', 'dad'] },
      { title: 'New Baby', category: 'Family', emoji: '🍼', gradient: 'linear-gradient(135deg,#0369a1,#7dd3fc)', wish: 'Welcome to the world, little one!', isPremium: true, tags: ['family', 'baby', 'premium'] },
      { title: 'Happy Halloween', category: 'Festival', emoji: '🎃', gradient: 'linear-gradient(135deg,#9a3412,#fb923c)', wish: 'Trick or treat!', isPremium: false, tags: ['festival', 'halloween', 'spooky'] },
      { title: 'Happy Easter', category: 'Festival', emoji: '🐰', gradient: 'linear-gradient(135deg,#86198f,#e879f9)', wish: 'Have a joyful Easter!', isPremium: false, tags: ['festival', 'easter', 'spring'] },
      { title: 'Happy Thanksgiving', category: 'Festival', emoji: '🦃', gradient: 'linear-gradient(135deg,#78350f,#d97706)', wish: 'So much to be thankful for.', isPremium: false, tags: ['festival', 'thanksgiving', 'grateful'] },
      { title: 'Retirement', category: 'Work', emoji: '🌴', gradient: 'linear-gradient(135deg,#065f46,#10b981)', wish: 'Enjoy your permanent weekend!', isPremium: true, tags: ['work', 'retirement', 'premium'] },
      { title: 'Farewell', category: 'Work', emoji: '👋', gradient: 'linear-gradient(135deg,#312e81,#6366f1)', wish: 'We will miss you!', isPremium: false, tags: ['work', 'farewell', 'goodbye'] }
    ];

    await Template.insertMany(sampleTemplates.map(t => ({ ...t, nameOverlay: { x: 50, y: 8, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }, profileOverlay: { x: 5, y: 5, size: 20 } })));

    const newCount = await Template.countDocuments();
    res.json({ success: true, message: 'Templates seeded successfully', count: newCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTemplates, getTemplate, getCategories, createTemplate, incrementDownload, seedTemplates };
