
import { Metadata } from 'next'
import Play from '@/components/Play'
import ScrollUp from "@/components/Common/ScrollUp"

export const metadata: Metadata = {
  title: 'Generate Playground',
  description: 'Generate content using AI models',
}

export default function GeneratePage() {
  return (
    <>
      <ScrollUp />
      <Play />
    </>
  )
}