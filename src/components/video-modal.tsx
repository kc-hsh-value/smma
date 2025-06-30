"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Heart, MessageCircle, Share, Eye } from "lucide-react"

export type VideoModalRef = {
  open: (video: any) => void
  close: () => void
}

const VideoModal = forwardRef<VideoModalRef, {}>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  useImperativeHandle(ref, () => ({
    open: (video: any) => {
      setSelectedVideo(video)
      setIsOpen(true)
    },
    close: () => {
      setIsOpen(false)
      setSelectedVideo(null)
    },
  }))

  const handleClose = () => {
    setIsOpen(false)
    setSelectedVideo(null)
  }

  if (!selectedVideo) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-[95vw] w-full max-h-[95vh] h-auto sm:max-w-[90vw] sm:max-h-[90vh] md:max-w-[800px] md:w-[800px] md:max-h-[600px] lg:max-w-[900px] lg:w-[900px] lg:max-h-[700px] xl:max-w-[1100px] xl:w-[1100px] xl:max-h-[800px] 2xl:max-w-[1300px] 2xl:w-[1300px] 2xl:max-h-[900px] rounded-lg overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 xl:p-6 2xl:p-8 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 xl:space-x-4 2xl:space-x-5">
            <Badge
              className={`text-sm xl:text-base 2xl:text-lg ${selectedVideo.platform === "TikTok" ? "bg-pink-500" : selectedVideo.platform === "Instagram" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-red-500"}`}
            >
              {selectedVideo.platform}
            </Badge>
            <span className="text-lg xl:text-xl 2xl:text-2xl font-semibold">{selectedVideo.title}</span>
          </div>
          <button onClick={handleClose} className="p-2 xl:p-3 2xl:p-4 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-gray-400" />
          </button>
        </div>

        {/* Video Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] lg:min-h-0">
            <div className="relative w-full h-full max-w-[400px] max-h-[600px] lg:max-w-none lg:max-h-none xl:max-w-[600px] xl:max-h-[800px] 2xl:max-w-[700px] 2xl:max-h-[900px] bg-gray-800 rounded-lg overflow-hidden mx-4 my-4 lg:m-4 xl:m-6 2xl:m-8">
              <img
                src={selectedVideo.thumbnail || "/placeholder.svg"}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24"
                >
                  <Play className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                </Button>
              </div>

              {/* Video Stats Overlay */}
              <div className="absolute bottom-4 xl:bottom-6 2xl:bottom-8 left-4 xl:left-6 2xl:left-8 right-4 xl:right-6 2xl:right-8">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 xl:p-4 2xl:p-5">
                  <div className="flex items-center justify-between text-white text-sm xl:text-base 2xl:text-lg">
                    <div className="flex items-center space-x-2 sm:space-x-4 xl:space-x-6 2xl:space-x-8 flex-wrap">
                      <div className="flex items-center space-x-1 xl:space-x-2">
                        <Eye className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                        <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg">{selectedVideo.views}</span>
                      </div>
                      <div className="flex items-center space-x-1 xl:space-x-2">
                        <Heart className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                        <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg">{selectedVideo.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1 xl:space-x-2">
                        <MessageCircle className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                        <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg">{selectedVideo.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 xl:space-x-2">
                      <Share className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                      <span className="text-xs sm:text-sm xl:text-base 2xl:text-lg">{selectedVideo.shares}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Details */}
          <div className="w-full lg:w-80 xl:w-96 2xl:w-[28rem] lg:flex-shrink-0 overflow-y-auto">
            <div className="p-4 sm:p-6 xl:p-8 2xl:p-10 bg-gray-900/50">
              <div className="space-y-6 xl:space-y-8 2xl:space-y-10">
                <div>
                  <h3 className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white mb-2 xl:mb-3 2xl:mb-4 break-words">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-gray-400 text-sm xl:text-base 2xl:text-lg break-words">
                    {selectedVideo.description}
                  </p>
                </div>

                <div className="space-y-4 xl:space-y-6 2xl:space-y-8">
                  <div>
                    <h4 className="text-white font-semibold mb-2 xl:mb-3 2xl:mb-4 text-base xl:text-lg 2xl:text-xl">
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3 xl:gap-4 2xl:gap-5">
                      <div className="bg-gray-800 rounded-lg p-3 xl:p-4 2xl:p-5">
                        <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-purple-400 break-words">
                          {selectedVideo.views}
                        </div>
                        <div className="text-xs xl:text-sm 2xl:text-base text-gray-400">Views</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 xl:p-4 2xl:p-5">
                        <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-pink-400 break-words">
                          {selectedVideo.likes}
                        </div>
                        <div className="text-xs xl:text-sm 2xl:text-base text-gray-400">Likes</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 xl:p-4 2xl:p-5">
                        <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-blue-400 break-words">
                          {selectedVideo.comments}
                        </div>
                        <div className="text-xs xl:text-sm 2xl:text-base text-gray-400">Comments</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 xl:p-4 2xl:p-5">
                        <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-green-400">
                          {selectedVideo.engagementRate}
                        </div>
                        <div className="text-xs xl:text-sm 2xl:text-base text-gray-400">Engagement</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 xl:mb-3 2xl:mb-4 text-base xl:text-lg 2xl:text-xl">
                      Category
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-gray-700 text-white text-sm xl:text-base 2xl:text-lg px-3 xl:px-4 2xl:px-5 py-1 xl:py-2"
                    >
                      {selectedVideo.category}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 xl:mb-3 2xl:mb-4 text-base xl:text-lg 2xl:text-xl">
                      Client
                    </h4>
                    <p className="text-gray-300 break-words text-sm xl:text-base 2xl:text-lg">{selectedVideo.client}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2 xl:mb-3 2xl:mb-4 text-base xl:text-lg 2xl:text-xl">
                      Results
                    </h4>
                    <div className="space-y-2 xl:space-y-3 2xl:space-y-4">
                      {selectedVideo.results.map((result: string, index: number) => (
                        <div key={index} className="flex items-start text-sm xl:text-base 2xl:text-lg text-gray-300">
                          <div className="w-2 h-2 xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 bg-purple-500 rounded-full mr-2 xl:mr-3 2xl:mr-4 mt-2 flex-shrink-0"></div>
                          <span className="break-words">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})

VideoModal.displayName = "VideoModal"

export default VideoModal
