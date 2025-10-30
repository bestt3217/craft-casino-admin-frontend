import { Metadata } from 'next'

import VerifyForm from '@/components/auth/VerifyForm'

export const metadata: Metadata = {
  title: 'TuaBet | Verify Page',
  description: 'This is TuaBet Verify Page',
}

export default function Verify() {
  return <VerifyForm />
}
