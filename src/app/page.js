import { redirect } from 'next/navigation'

export const metadata = {
  title: 'UI Sekertaris',
  description: 'Aplikasi Manajemen Persuratan',
}

export default function Home() {
  // Di Next.js, kita perlu menggunakan 'use client' untuk mengakses localStorage
  // Karena ini adalah Server Component, kita akan redirect ke halaman yang sesuai
  redirect('/dashboard')
}
