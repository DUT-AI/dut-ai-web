import SectionContainer from '@/components/layout/SectionContainer'
import Footer from '@/components/layout/Footer'
import { ReactNode } from 'react'
import Header from '@/components/layout/Header'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <Header />
        <main className="mb-auto">{children}</main>
        {/* <Footer /> */}
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
