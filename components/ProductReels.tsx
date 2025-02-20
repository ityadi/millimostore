"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import ProductCard from "./ProductCard"
import { products } from "@/data/products"

export default function ProductReels() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef(null)
  const progressAnimation = useAnimation()

  const updateProgressBar = useCallback(() => {
    const progress = (currentIndex / (products.length - 1)) * 100
    progressAnimation.start({ width: `${progress}%` })
  }, [currentIndex, progressAnimation])

  useEffect(() => {
    updateProgressBar()
  }, [updateProgressBar])

  const handleSwipe = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection
      if (newIndex < 0) newIndex = products.length - 1
      if (newIndex >= products.length) newIndex = 0
      return newIndex
    })

    // Trigger haptic feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(20) // 20ms vibration
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden bg-black relative" ref={constraintsRef}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.7}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = offset.x > 100 ? -1 : offset.x < -100 ? 1 : 0
            if (swipe !== 0) {
              handleSwipe(swipe)
            }
          }}
          className="h-full w-full absolute top-0 left-0"
        >
          <ProductCard product={products[currentIndex]} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-30">
        <motion.div
          className="h-full bg-[#E84C3D]"
          animate={progressAnimation}
          transition={{ type: "tween", ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

