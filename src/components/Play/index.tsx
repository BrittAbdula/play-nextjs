'use client'

import { useState, useEffect, useRef } from 'react'
import { Shuffle, ChevronDown, ChevronUp, Download, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence, PanInfo } from 'framer-motion'

export default function Play() {
  const [model, setModel] = useState('sdxl')
  const [prompt, setPrompt] = useState('')
  const [numberOfImages, setNumberOfImages] = useState(1)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [seed, setSeed] = useState('')
  const [outputFormat, setOutputFormat] = useState('webp')
  const [outputQuality, setOutputQuality] = useState(80)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Prompt is required",
        variant: "destructive",
      })
      return
    }
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          num_outputs: numberOfImages,
          aspect_ratio: aspectRatio,
          seed: seed ? parseInt(seed) : undefined,
          output_format: outputFormat,
          output_quality: outputQuality,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate images')
      }
      const data = await response.json()
      console.log('Received data from API:', data);
      setGeneratedImages(prevImages => [...prevImages, ...data])
      toast({
        title: "Images generated successfully",
        description: `Generated ${data.length} images`,
      })
    } catch (error) {
      console.error('Error generating images:', error)
      toast({
        title: "Error",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'generated-image.' + outputFormat
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    } else if (info.offset.x < -100 && currentImageIndex < generatedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < generatedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const handleRandomPrompt = () => {
    setPrompt('A cute dog')
  }

  const resetAllOptions = () => {
    setModel('sdxl')
    setPrompt('')
    setNumberOfImages(1)
    setAspectRatio('1:1')
    setSeed('')
    setOutputFormat('webp')
    setOutputQuality(80)
    setGeneratedImages([])
  }

  return (
    <section
      id="play"
      className="relative z-10 overflow-hidden bg-[#E9F9FF] dark:bg-dark-700 pt-[90px] pb-16 md:pt-[90px] md:pb-[120px] xl:pt-[90px] xl:pb-[90px] 2xl:pt-[90px] 2xl:pb-[200px]"
    >
      <div className="container">
        {/* Output Section */}
        <div className="mb-12 rounded-lg bg-white p-4 shadow-md dark:bg-dark sm:p-6 lg:p-8">
          <div className="relative min-h-[300px] rounded-lg bg-gray-100 p-4 dark:bg-dark-2">
            <div className="h-full overflow-hidden">
              <AnimatePresence initial={false}>
                {generatedImages.length > 0 ? (
                  <>
                    {/* Desktop View */}
                    <motion.div 
                      className="hidden sm:flex flex-wrap justify-start items-start gap-4"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ duration: 0.5 }}
                    >
                      {generatedImages.map((image, index) => (
                        <motion.img 
                          key={index} 
                          src={image} 
                          alt={`Generated image ${index + 1}`} 
                          className="w-[calc(25%-12px)] h-auto rounded-lg cursor-pointer object-cover"
                          onClick={() => setEnlargedImage(image)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        />
                      ))}
                    </motion.div>

                    {/* Mobile View */}
                    <div className="sm:hidden">
                      {/* Thumbnail Preview */}
                      <div className="flex justify-center mb-4 overflow-x-auto">
                        {generatedImages.map((image, index) => (
                          <div 
                            key={index} 
                            className={`relative flex-shrink-0 w-16 h-16 mx-1 rounded-md overflow-hidden ${index === currentImageIndex ? 'border-2 border-primary' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img 
                              src={image} 
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === currentImageIndex && (
                              <div className="absolute inset-0 bg-primary bg-opacity-30"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Main Image */}
                      <motion.div 
                        ref={carouselRef}
                        className="w-full h-[250px] flex items-center justify-center"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                      >
                        <img 
                          src={generatedImages[currentImageIndex]} 
                          alt={`Generated image ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain rounded-lg"
                          onClick={() => setEnlargedImage(generatedImages[currentImageIndex])}
                        />
                        <button 
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                          onClick={handlePrevImage}
                        >
                          <ChevronLeft className="text-primary" />
                        </button>
                        <button 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
                          onClick={handleNextImage}
                        >
                          <ChevronRight className="text-primary" />
                        </button>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-body-color dark:text-dark-6">Generated images will appear here</p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="rounded-lg bg-gray-50 p-6 shadow-md dark:bg-dark-2 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                id="prompt"
                placeholder="Enter your image generation prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-3 px-4 text-base text-body-color placeholder-body-color shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-dark-3 dark:text-dark-6"
                rows={4}
              />
              <button
                type="button"
                onClick={handleRandomPrompt}
                className="absolute right-3 top-3 p-2 text-primary hover:text-primary/80"
              >
                <Shuffle className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Number of Images
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumberOfImages(num)}
                      className={`flex-1 rounded-md py-2 px-3 text-base font-semibold transition ${numberOfImages === num
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-3 dark:text-dark-6 dark:hover:bg-dark-4'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="aspectRatio" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                  Aspect Ratio
                </label>
                <select
                  id="aspectRatio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-base text-body-color shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-dark-3 dark:text-dark-6"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9</option>
                  <option value="21:9">21:9</option>
                  <option value="2:3">2:3</option>
                  <option value="3:2">3:2</option>
                  <option value="4:5">4:5</option>
                  <option value="5:4">5:4</option>
                  <option value="9:16">9:16</option>
                  <option value="9:21">9:21</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
              >
                {showAdvanced ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                Advanced Settings
              </button>
              {showAdvanced && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="seed" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Seed (Optional)
                    </label>
                    <input
                      id="seed"
                      type="number"
                      placeholder="Enter seed"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-base text-body-color placeholder-body-color shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-dark-3 dark:text-dark-6"
                    />
                  </div>
                  <div>
                    <label htmlFor="outputFormat" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Output Format
                    </label>
                    <select
                      id="outputFormat"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-base text-body-color shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-dark-3 dark:text-dark-6"
                    >
                      <option value="webp">WebP</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="outputQuality" className="mb-2 block text-sm font-medium text-dark dark:text-white">
                      Output Quality
                    </label>
                    <input
                      id="outputQuality"
                      type="number"
                      min="0"
                      max="100"
                      value={outputQuality}
                      onChange={(e) => setOutputQuality(parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-base text-body-color shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-dark-3 dark:text-dark-6"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-md bg-primary py-3 px-6 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary/80"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Images'}
              </button>
              <button
                type="button"
                onClick={resetAllOptions}
                className="rounded-md border border-primary py-3 px-6 text-base font-medium text-primary transition duration-300 ease-in-out hover:bg-primary/10"
              >
                Reset All
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img src={enlargedImage} alt="Enlarged image" className="w-full h-auto" />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <button
              onClick={() => handleDownload(enlargedImage)}
              className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80"
            >
              <Download size={20} className="inline-block mr-2" />
              Download
            </button>
          </div>
        </div>
      )}
    </section>
  )
}