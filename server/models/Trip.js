// server/models/Trip.js
const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  date: String,
  activity: String
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  category: String,
  name: String,
  amount: { type: Number, default: 0 },
  description: String,
  date: String
}, { _id: false });

const checklistItemSchema = new mongoose.Schema({
  category: { type: String, enum: ['Packing', 'Documents', 'Tasks'], default: 'Packing' },
  text: String,
  done: { type: Boolean, default: false }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },

  // scheduling & overview
  startDate: { type: String }, // ISO date string or formatted
  endDate: { type: String },
  travelers: { type: Number, default: 1 },
  budget: { type: Number, default: 0 },

  // core arrays
  collaborators: [{ type: String }],
  itinerary: [itineraryItemSchema],
  expenses: [expenseSchema],
  checklist: [checklistItemSchema],

  // brochure-like extended fields (if you later want)
  about: { type: String, default: '' },
  highlights: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  plan: { type: String },
  thingsToCarry: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
