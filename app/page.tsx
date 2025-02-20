import ProductReels from "@/components/ProductReels"

export default function Home() {
  return (
    <main className="fixed inset-0 bg-black">
      <div className="h-full w-full max-w-[430px] mx-auto relative">
        <ProductReels />
      </div>
    </main>
  )
}

