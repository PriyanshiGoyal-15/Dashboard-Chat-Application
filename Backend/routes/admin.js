const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

let io = null; // will be initialized from server

// allow server to set io
function init(realIo) {
  io = realIo;
}

async function computeStats() {
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 29); // last 30 days
  start.setHours(0, 0, 0, 0);

  const messagesAgg = await Message.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const usersAgg = await User.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const labels = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    labels.push(d.toISOString().slice(0, 10));
  }

  const messagesMap = {};
  messagesAgg.forEach(m => messagesMap[m._id] = m.count);
  const usersMap = {};
  usersAgg.forEach(u => usersMap[u._id] = u.count);

  const messagesPerDay = labels.map(lbl => ({ date: lbl, count: messagesMap[lbl] || 0 }));
  const usersJoinedPerDay = labels.map(lbl => ({ date: lbl, count: usersMap[lbl] || 0 }));

  const totalUsers = await User.countDocuments();
  const totalMessages = await Message.countDocuments();

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthJoined = await User.countDocuments({ createdAt: { $gte: monthStart } });

  return { totalUsers, totalMessages, monthJoined, messagesPerDay, usersJoinedPerDay };
}

async function emitStats() {
  const stats = await computeStats();
  if (io) io.emit('admin_stats_update', stats);
  return stats;
}

// admin-only middleware used in server when mounting routes (server will check admin)
const auth = require('../middleware/auth');
const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user || !user.isAdmin) return res.status(403).json({ msg: 'Admin access required' });
  next();
};

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const stats = await computeStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    await user.remove();
    // emit stats
    try { await emitStats(); } catch (e) { console.error(e); }
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = { router, init, emitStats };
