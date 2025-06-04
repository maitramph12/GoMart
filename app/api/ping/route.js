import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
    }

    return NextResponse.json({ message: '✅ Đã kết nối MongoDB thành công' })
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error)
    return NextResponse.json(
      { error: 'Không thể kết nối MongoDB'},
      { status: 500 }
    )
  }
}
