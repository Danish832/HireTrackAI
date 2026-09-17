const Application = require('../models/Application');

// @desc    Create a new application
// @route   POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for logged-in user (filter + sort + paginate)
// @route   GET /api/applications
// Query params: status, search, sortBy, order, page, limit
const getApplications = async (req, res, next) => {
  try {
    const {
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 50); // cap at 50
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['createdAt', 'appliedDate', 'company', 'status', 'matchScore'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Application.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single application by ID
// @route   GET /api/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Prevent overwriting protected fields directly
    delete req.body.user;
    delete req.body.statusHistory;

    Object.assign(application, req.body);
    await application.save(); // triggers status history hook if status changed

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (count by status)
// @route   GET /api/applications/stats
const getApplicationStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const formatted = stats.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats,
};