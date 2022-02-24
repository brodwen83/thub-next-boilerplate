import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { slugify } from '../lib/helpers';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  slug: { type: String, index: true },
  password: { type: String, required: true, select: false },
  hash: { type: String },
  salt: { type: String },
  email: { type: String, unique: true, required: true },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  tokenVersion: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  role: { type: String, default: 'basic' },
  isAdmin: { type: Boolean, default: false },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'User',
  },
  ancestors: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
      },
      fullName: String,
      slug: String,
      email: String,
      joinDate: Date,
      tokenVersion: Number,
      verified: Boolean,
      approved: Boolean,
      role: String,
      rank: String,
    },
  ],
});

UserSchema.pre('save', async function generateSlug(next) {
  this.slug = slugify(this.fullName);
  next();
});

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();

  try {
    const newSalt = await bcrypt.genSalt(
      parseInt(process.env.SALT_WORK_FACTOR),
    );

    const newHash = await bcrypt.hash(this.password, newSalt);

    this.salt = newSalt;
    this.password = newHash;
    this.hash = newHash;

    return next();
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
