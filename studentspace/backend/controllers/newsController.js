const News = require('../models/News');

const getAllNews = async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true' && req.user && req.user.role === 'admin';
    const filter = includeDeleted ? {} : { deleted: false };
    
    const news = await News.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      deleted: false
    }).populate('author', 'username');
    
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can post news.' });
    }
    const news = new News({
      title,
      content,
      author: req.user._id,
      deleted: false
    });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete news.' });
    }
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    
    news.deleted = true;
    await news.save();
    
    res.json({ message: 'News deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
};

const restoreNews = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can restore news.' });
    }
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    
    news.deleted = false;
    await news.save();
    
    res.json({ message: 'News restored successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring news', error: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  deleteNews,
  restoreNews
}; 