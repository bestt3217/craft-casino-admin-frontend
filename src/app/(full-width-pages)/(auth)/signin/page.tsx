import { Metadata } from 'next'

import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = {
  title: 'TuaBet | SignIn Page',
  description: 'This is TuaBet Signin Page',
}

export default function SignIn() {
  return <SignInForm />
}
