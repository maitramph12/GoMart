import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret' // Đảm bảo đặt biến môi trường JWT_SECRET

export async function POST(req) {
  await dbConnect()

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
  }

  const user = await User.findOne({ email })

  if (!user) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
  }

  // Tạo JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  return NextResponse.json({
    message: 'Đăng nhập thành công',
    user: { email: user.email, id: user._id },
    token
  })
}
