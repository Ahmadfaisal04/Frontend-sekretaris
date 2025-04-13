import { NextResponse } from 'next/server'

export function middleware(request) {
  // Nonaktifkan sementara untuk testing tampilan
  return NextResponse.next()
}

// Konfigurasi path yang akan diproteksi
export const config = {
  matcher: []
} 