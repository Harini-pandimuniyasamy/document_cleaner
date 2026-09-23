import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  fullName: string;
  email: string;
  password?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Hash password before saving and populate passwordHash
userSchema.pre('save', async function (this: any) {
  // Sync name and fullName
  if (this.name && !this.fullName) {
    this.fullName = this.name;
  } else if (this.fullName && !this.name) {
    this.name = this.fullName;
  }

  // Handle password hashing
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.password, salt);
    this.password = undefined; // Do not store plaintext
  } else if (this.isModified('passwordHash') && this.passwordHash) {
    if (!this.passwordHash.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  const hash = this.passwordHash || this.password;
  if (!hash) return false;
  return bcrypt.compare(enteredPassword, hash);
};

// Clean sensitive fields on serialization
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordHash;
  obj.id = obj._id;
  if (!obj.name && obj.fullName) {
    obj.name = obj.fullName;
  }
  return obj;
};

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);
export default User;
