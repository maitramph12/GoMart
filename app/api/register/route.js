import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req) {
  await dbConnect()

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email và mật khẩu là bắt buộc' }, { status: 400 })
  }

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ error: 'Email đã được đăng ký' }, { status: 409 })
  }

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10)

  // Tạo user mới
  const newUser = await User.create({
    email,
    password: hashedPassword,
  })

  return NextResponse.json({ message: 'Đăng ký thành công', user: { email: newUser.email, id: newUser._id } }, { status: 201 })
}
