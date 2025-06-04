import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: false },
  password: { type: String, required: true }, // Lưu password đã hash
})

const User = models.User || model('User', UserSchema)
export default User
