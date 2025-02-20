"use client"
import type { Product } from "@/types/product"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Volume2, VolumeX, Bookmark, BookmarkCheck } from "lucide-react"

interface ProductCardProps {
  product: Product
  isActive: boolean
}

export default function ProductCard({ product, isActive }: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("savedProducts") || "[]")
    setIsSaved(savedProducts.some((p: Product) => p.id === product.id))
  }, [product.id])

  const handleSave = useCallback(() => {
    const savedProducts = JSON.parse(localStorage.getItem("savedProducts") || "[]")
    if (isSaved) {
      const updatedProducts = savedProducts.filter((p: Product) => p.id !== product.id)
      localStorage.setItem("savedProducts", JSON.stringify(updatedProducts))
      setIsSaved(false)
    } else {
      savedProducts.push(product)
      localStorage.setItem("savedProducts", JSON.stringify(savedProducts))
      setIsSaved(true)
    }
  }, [isSaved, product])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoading(false)
      if (isActive) {
        video.play().catch(() => {})
      }
    }

    video.addEventListener("canplay", handleCanPlay)
    video.load()

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
      video.pause()
    }
  }, [isActive])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }

    video.muted = isMuted
  }, [isActive, isMuted])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSendMessage = () => {
    const message = `Hello, I'm interested in *${product.name}* (NPR ${product.price}). Can you provide more information?`
    const phoneNumber = "YOUR_WHATSAPP_NUMBER" // Replace with your actual WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="relative w-full h-full bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-20 pt-14 px-5 pb-20 bg-gradient-to-b from-black/90 to-transparent">
        <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
        <p className="text-lg text-gray-300 mb-3">{product.description}</p>
        <p className="text-2xl font-medium text-[#E84C3D]">NPR {product.price}</p>
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#E84C3D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : null}

      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        playsInline
        loop
        muted={isMuted}
        controls={false}
        preload="auto"
      >
        <source src={product.videoUrl} type="video/mp4" />
      </video>

      <motion.button
        className="absolute bottom-44 right-6 z-20 w-14 h-14 bg-[#E84C3D] rounded-full flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleSave}
      >
        {isSaved ? <BookmarkCheck className="w-6 h-6 text-white" /> : <Bookmark className="w-6 h-6 text-white" />}
      </motion.button>

      <motion.button
        className="absolute bottom-24 right-6 z-20 w-14 h-14 bg-[#E84C3D] rounded-full flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
      </motion.button>

      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center space-x-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-14 bg-white/10 backdrop-blur-sm rounded-full px-6 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E84C3D]"
          />
        </div>
        <motion.button
          className="flex-shrink-0 w-14 h-14 bg-[#E84C3D] rounded-full flex items-center justify-center shadow-lg"
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSendMessage}
        >
          <ShoppingCart className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  )
}

