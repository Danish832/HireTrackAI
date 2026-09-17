const mongoose = require('mongoose');

const APPLICATION_STATUSES = [
  'Wishlist',
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // fast lookups by user
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role/position is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Wishlist',
    },
    jobDescription: {
      type: String,
      default: '',
      maxlength: [10000, 'Job description too long'],
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    salaryRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'USD' },
    },
    appliedDate: {
      type: Date,
      default: null,
    },
    resumeUrl: {
      type: String, // link to the resume version used for this specific application
      default: null,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [5000, 'Notes too long'],
    },
    // AI-generated fields — populated in Phase 4
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    matchReasoning: {
      type: String,
      default: null,
    },
    // Timeline of status changes — useful for dashboard analytics
    statusHistory: [
      {
        status: { type: String, enum: APPLICATION_STATUSES },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Track status history automatically
applicationSchema.pre('save', function () {
  if (this.isNew || this.isModified('status')) {
    this.statusHistory.push({ status: this.status, changedAt: new Date() });
  }
});

// Compound index — most queries filter by user + status, or sort by user + createdAt
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;