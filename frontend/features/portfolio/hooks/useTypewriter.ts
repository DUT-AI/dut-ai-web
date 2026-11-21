'use client'

import { useState, useEffect } from 'react'

export interface UseTypewriterOptions {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  loop?: boolean
}

export function useTypewriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1800,
  loop = true,
}: UseTypewriterOptions) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!words || words.length === 0) return

    const currentWord = words[wordIndex % words.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (text.length < currentWord.length) {
            setText(currentWord.slice(0, text.length + 1))
          } else {
            // Reached full word, pause before deleting
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          // Deleting
          if (text.length > 0) {
            setText(currentWord.slice(0, text.length - 1))
          } else {
            // Reached empty, advance to next word
            setIsDeleting(false)
            if (loop || wordIndex < words.length - 1) {
              setWordIndex((prev) => (prev + 1) % words.length)
            }
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, loop])

  return { text, isDeleting }
}
