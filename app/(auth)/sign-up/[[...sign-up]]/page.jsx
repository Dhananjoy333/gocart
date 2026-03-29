'use client'

import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="relative flex justify-center items-center overflow-hidden"
        style={{ height: 'calc(100vh - 80px)' }}>

        {/* Content */}
        <SignUp 
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
        />
    </div>
  )
}