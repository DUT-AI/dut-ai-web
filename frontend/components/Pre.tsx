'use client'

import { useRef } from 'react'
import CopyButton from './CopyButton'

interface PreProps {
    children: React.ReactNode
    [key: string]: any
}

const Pre = ({ children, ...props }: PreProps) => {
    const preRef = useRef<HTMLPreElement>(null)

    const getText = () => {
        return preRef.current?.textContent || ''
    }

    return (
        <div className="relative group/code-block">
            <pre ref={preRef} {...props}>
                {children}
            </pre>
            <div className="opacity-0 transition-opacity duration-300 group-hover/code-block:opacity-100">
                <CopyButton onCopy={getText} />
            </div>
        </div>
    )
}

export default Pre
