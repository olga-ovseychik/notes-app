import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true
      },
      roles: {
        type: [String],
        default: ['User']
      },
}, { timestamps: true });

userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model('User', userSchema);
