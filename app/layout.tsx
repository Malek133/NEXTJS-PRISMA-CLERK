import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "The Secret",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className='flex justify-end items-center mx-5 my-3'>
           <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn> 
          </div>
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
