"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Play,
  Upload,
  Wand2,
  TrendingUp,
  Star,
  Check,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import React from "react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms")
  
  // Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  // Modal functions
  const openBookingModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsBookingModalOpen(true)
  }
  const closeBookingModal = () => setIsBookingModalOpen(false)
  
  const openVideoModal = (video: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setSelectedVideo(video)
    setIsVideoModalOpen(true)
  }
  const closeVideoModal = () => {
    setIsVideoModalOpen(false)
    setSelectedVideo(null)
  }

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (isBookingModalOpen || isVideoModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isBookingModalOpen, isVideoModalOpen])

  // Booking Modal Component
  const BookingModal = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
      email: '',
      businessType: '',
      instagram: '',
      tiktok: '',
      selectedDate: null as any,
      selectedTime: null as string | null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Reset form when modal closes - but don't trigger scroll
    useEffect(() => {
      if (!isBookingModalOpen) {
        // Use setTimeout to avoid immediate re-render during close animation
        const timer = setTimeout(() => {
          setStep(1)
          setFormData({
            email: '',
            businessType: '',
            instagram: '',
            tiktok: '',
            selectedDate: null,
            selectedTime: null
          })
          setErrors({})
        }, 300) // Wait for modal close animation
        
        return () => clearTimeout(timer)
      }
    }, [isBookingModalOpen])

    const businessTypes = [
      "Podcaster", "Streamer", "Content Creator", "Business Owner", "Influencer",
      "Coach/Consultant", "Agency", "E-commerce Brand", "SaaS Company", "Other"
    ]

    const availableSlots = [
      "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", 
      "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
    ]

    // Generate calendar days - memoize to prevent unnecessary re-renders
    const calendarDays = React.useMemo(() => {
      const today = new Date()
      const days = []
      for (let i = 1; i <= 21; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          days.push({
            date: date,
            day: date.getDate(),
            month: date.toLocaleDateString("en-US", { month: "short" }),
            weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
            fullDate: date.toISOString().split("T")[0],
          })
        }
      }
      return days.slice(0, 12)
    }, [])

    const validateStep1 = () => {
      const newErrors: Record<string, string> = {}
      if (!formData.email) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.businessType) newErrors.businessType = "Please select your business type"
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
      const newErrors: Record<string, string> = {}
      if (!formData.selectedDate) newErrors.date = "Please select a date"
      if (!formData.selectedTime) newErrors.time = "Please select a time"
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
      if (step === 1 && validateStep1()) {
        setStep(2)
      } else if (step === 2 && validateStep2()) {
        console.log("Booking submitted:", formData)
        alert("Your call has been booked! We'll send you a confirmation email shortly.")
        closeBookingModal()
      }
    }

    // Handle modal close with scroll position preservation
    const handleModalClose = (open: boolean) => {
      if (!open) {
        setIsBookingModalOpen(false)
      }
    }

    return (
      <Dialog open={isBookingModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Book Your Free Strategy Call
          </DialogTitle>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white text-lg font-medium">Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className={`bg-gray-800 border-gray-600 text-white mt-2 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label className="text-white text-lg font-medium">What best describes you? *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({...prev, businessType: value}))}>
                    <SelectTrigger className={`bg-gray-800 border-gray-600 text-white mt-2 ${errors.businessType ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="text-red-400 text-sm mt-1">{errors.businessType}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">📷 Instagram</Label>
                    <Input
                      placeholder="@username"
                      value={formData.instagram}
                      onChange={(e) => setFormData(prev => ({...prev, instagram: e.target.value}))}
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">🎵 TikTok</Label>
                    <Input
                      placeholder="@username"
                      value={formData.tiktok}
                      onChange={(e) => setFormData(prev => ({...prev, tiktok: e.target.value}))}
                      className="bg-gray-800 border-gray-600 text-white mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white text-lg font-medium">Select Date *</Label>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {calendarDays.map((day) => (
                      <button
                        key={day.fullDate}
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, selectedDate: day, selectedTime: null}))}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          formData.selectedDate?.fullDate === day.fullDate
                            ? "bg-purple-500 border-purple-500 text-white"
                            : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="text-xs text-gray-400">{day.weekday}</div>
                        <div className="font-semibold">{day.day}</div>
                        <div className="text-xs">{day.month}</div>
                      </button>
                    ))}
                  </div>
                  {errors.date && <p className="text-red-400 text-sm mt-2">{errors.date}</p>}
                </div>

                <div>
                  <Label className="text-white text-lg font-medium">Select Time (EST) *</Label>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, selectedTime: time}))}
                        disabled={!formData.selectedDate}
                        className={`p-3 rounded-lg border text-center transition-all disabled:opacity-50 ${
                          formData.selectedTime === time
                            ? "bg-purple-500 border-purple-500 text-white"
                            : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-red-400 text-sm mt-2">{errors.time}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-gray-600 text-gray-300"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
            >
              {step === 1 ? (
                <>
                  Next: Choose Time
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Book My Call
                  <Calendar className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Video Modal Component  
  const VideoModal = () => {
    if (!selectedVideo) return null

    // Handle modal close with scroll position preservation
    const handleVideoModalClose = (open: boolean) => {
      if (!open) {
        setIsVideoModalOpen(false)
        // Don't reset selectedVideo immediately to prevent flicker
        setTimeout(() => setSelectedVideo(null), 200)
      }
    }

    return (
      <Dialog open={isVideoModalOpen} onOpenChange={handleVideoModalClose}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="flex items-center space-x-3">
            <Badge className={`${
              selectedVideo.platform === "TikTok" ? "bg-pink-500" : 
              selectedVideo.platform === "Instagram" ? "bg-gradient-to-r from-purple-500 to-pink-500" : 
              "bg-red-500"
            }`}>
              {selectedVideo.platform}
            </Badge>
            <span className="text-xl font-semibold">{selectedVideo.title}</span>
          </DialogTitle>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-black flex items-center justify-center p-6 rounded-lg">
              <div className="relative max-w-md">
                <Image
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  width={400}
                  height={600}
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-400">{selectedVideo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">{selectedVideo.views}</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-pink-400">{selectedVideo.likes}</div>
                  <div className="text-xs text-gray-400">Likes</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{selectedVideo.comments}</div>
                  <div className="text-xs text-gray-400">Comments</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{selectedVideo.engagementRate}</div>
                  <div className="text-xs text-gray-400">Engagement</div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Results</h4>
                <div className="space-y-2">
                  {selectedVideo.results.map((result: string, index: number) => (
                    <div key={index} className="flex items-start text-sm text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Sample video data with YouTube Shorts placeholders
  const allVideos = [
    {
      id: 1,
      title: "10 Fitness Mistakes That Kill Your Progress",
      platform: "YouTube",
      category: "Fitness",
      client: "FitLife Coaching",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      views: "2.1M",
      likes: "156K",
      comments: "12K",
      shares: "8.5K",
      engagementRate: "12.4%",
      description:
        "A powerful transformation story that went viral, showcasing before and after results with actionable fitness tips.",
      results: [
        "2.1M views in 48 hours",
        "50K new followers gained",
        "300% increase in client inquiries",
        "Featured on trending for 3 days",
      ],
    },
    {
      id: 2,
      title: "How I Made $100K in 90 Days (Full Strategy)",
      platform: "YouTube",
      category: "Business",
      client: "StartupSuccess",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
      views: "890K",
      likes: "67K",
      comments: "4.2K",
      shares: "3.1K",
      engagementRate: "8.9%",
      description: "Simple business strategy that helped a startup scale from $0 to $100K in 90 days.",
      results: [
        "890K views in first week",
        "25K new followers",
        "150% increase in course sales",
        "Shared by major business accounts",
      ],
    },
    {
      id: 3,
      title: "5-Minute Meal Prep That Changed My Life",
      platform: "YouTube",
      category: "Lifestyle",
      client: "QuickChef",
      thumbnail: "https://img.youtube.com/vi/LDU_Txk06tM/maxresdefault.jpg",
      views: "1.5M",
      likes: "89K",
      comments: "6.7K",
      shares: "12K",
      engagementRate: "7.2%",
      description: "Revolutionary cooking technique that saves 50% prep time, perfect for busy professionals.",
      results: [
        "1.5M views in 72 hours",
        "40K new subscribers",
        "200% increase in cookbook sales",
        "Trending #1 in cooking category",
      ],
    },
    {
      id: 4,
      title: "iPhone vs Android: The Truth Nobody Tells You",
      platform: "YouTube",
      category: "Technology",
      client: "TechReviewer Pro",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
      views: "3.2M",
      likes: "245K",
      comments: "18K",
      shares: "15K",
      engagementRate: "15.1%",
      description:
        "Honest review of the latest smartphone that exposed hidden features manufacturers don't want you to know.",
      results: [
        "3.2M views in 24 hours",
        "100K new followers",
        "500% increase in affiliate sales",
        "Picked up by major tech blogs",
      ],
    },
    {
      id: 5,
      title: "Style on a Budget: Look Expensive for Under $50",
      platform: "TikTok",
      category: "Fashion",
      client: "StyleInfluencer",
      thumbnail: "https://img.youtube.com/vi/PSH0eRKq1lE/maxresdefault.jpg",
      views: "1.8M",
      likes: "134K",
      comments: "9.8K",
      shares: "7.2K",
      engagementRate: "9.8%",
      description: "Budget-friendly styling tips that make expensive clothes look affordable and vice versa.",
      results: [
        "1.8M views in 3 days",
        "60K new followers",
        "300% increase in brand partnerships",
        "Featured in fashion magazines",
      ],
    },
    {
      id: 6,
      title: "The 5AM Morning Routine That Doubled My Income",
      platform: "Instagram",
      category: "Productivity",
      client: "ProductivityGuru",
      thumbnail: "https://img.youtube.com/vi/hFDcoX7s6rE/maxresdefault.jpg",
      views: "2.7M",
      likes: "198K",
      comments: "15K",
      shares: "22K",
      engagementRate: "11.3%",
      description: "The 5-minute morning routine that doubled productivity for thousands of entrepreneurs.",
      results: [
        "2.7M views in first week",
        "80K new subscribers",
        "400% increase in course enrollment",
        "Viral across multiple platforms",
      ],
    },
    {
      id: 7,
      title: "Why Your Trading Strategy Is Wrong",
      platform: "TikTok",
      category: "Finance",
      client: "CryptoTrader",
      thumbnail: "https://img.youtube.com/vi/KdwsGXjNhHE/maxresdefault.jpg",
      views: "4.1M",
      likes: "312K",
      comments: "25K",
      shares: "18K",
      engagementRate: "16.2%",
      description: "Eye-opening trading insights that helped thousands avoid common mistakes.",
      results: [
        "4.1M views in 36 hours",
        "150K new followers",
        "600% increase in course sales",
        "Featured on finance news",
      ],
    },
    {
      id: 8,
      title: "Photography Hacks Using Only Your Phone",
      platform: "Instagram",
      category: "Photography",
      client: "PhotoPro",
      thumbnail: "https://img.youtube.com/vi/6JYIGclVQdw/maxresdefault.jpg",
      views: "1.2M",
      likes: "95K",
      comments: "7.8K",
      shares: "5.4K",
      engagementRate: "9.1%",
      description: "Professional photography techniques using just your smartphone camera.",
      results: [
        "1.2M views in 5 days",
        "35K new followers",
        "250% increase in workshop sales",
        "Shared by photography influencers",
      ],
    },
  ]

  // Filter videos based on selected platform
  const filteredVideos =
    selectedPlatform === "All Platforms" ? allVideos : allVideos.filter((video) => video.platform === selectedPlatform)

  // Animated counter hook
  const useCounter = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, [end, duration])

    return count
  }

  // Handle annual/monthly switch without scrolling
  const handlePricingToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnnual(!isAnnual)
  }

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false) // Close mobile menu if open
  }

  const Header = () => (
    <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-purple-500/20 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ViralClips</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('services')} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('work')} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            Our Work
          </button>
          <Button 
            onClick={(e) => openBookingModal(e)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Book Free Call
          </Button>
        </nav>

        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-purple-500/20 md:hidden">
            <nav className="flex flex-col items-center space-y-4 py-6">
              <button 
                onClick={() => scrollToSection('services')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('work')} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Our Work
              </button>
              <Button 
                onClick={(e) => openBookingModal(e)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Book Free Call
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )

  const HeroSection = () => {
    const viewsCount = useCounter(100)
    const revenueCount = useCounter(2)
    const retentionCount = useCounter(95)

    return (
      <section id="hero" className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
              We Grow Brands on{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                TikTok, Reels & Shorts
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {viewsCount}M+ views. Zero Ad Spend. We'll take your long videos, turn them into viral shorts while you
              focus on your business
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto">
              <Button
                size="lg"
                onClick={(e) => openBookingModal(e)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                Book a Free Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('work')}
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              >
                View Our Work
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{viewsCount}M+</div>
                <div className="text-sm sm:text-base text-gray-400">Total Views Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">${revenueCount}M+</div>
                <div className="text-sm sm:text-base text-gray-400">Revenue Attributed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{retentionCount}%</div>
                <div className="text-sm sm:text-base text-gray-400">Client Retention Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const SocialProofSection = () => (
    <section className="py-12 sm:py-16 bg-black/50">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Trusted by 500+ Brands</p>
        <div className="flex justify-center items-center space-x-8 sm:space-x-12 opacity-60 flex-wrap gap-4">
          {["Brand1", "Brand2", "Brand3", "Brand4", "Brand5"].map((brand, index) => (
            <div key={index} className="text-xl sm:text-2xl font-bold text-gray-500">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const BeforeAfterSection = () => (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">See the Transformation</h2>
          <p className="text-lg sm:text-xl text-gray-300">From raw footage to viral content</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:scale-105 transition-transform">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Before - Raw Video"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-red-500">Before</Badge>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm opacity-75">Views: 1,234</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:scale-105 transition-transform">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="After - Viral Clip"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-500">After</Badge>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm opacity-75">Views: 2.1M</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">156K</span>
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">12K</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )

  const VideoShowcaseSection = () => (
    <section id="work" className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Best Performing Clips</h2>
          <div className="flex justify-center space-x-4 mb-8 flex-wrap gap-2">
            {["All Platforms", "TikTok", "Instagram", "YouTube"].map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "outline" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={`${
                  selectedPlatform === platform
                    ? "border-purple-500 text-purple-400 bg-purple-500/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                } transition-all duration-200`}
              >
                {platform}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
              onClick={(e) => openVideoModal(video, e)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-purple-500">{video.views} views</Badge>
                  <Badge
                    className={`absolute top-4 left-4 ${
                      video.platform === "TikTok"
                        ? "bg-pink-500"
                        : video.platform === "Instagram"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "bg-red-500"
                    }`}
                  >
                    {video.platform}
                  </Badge>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {video.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center space-x-2 text-white text-sm">
                      <Heart className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos found for {selectedPlatform}</p>
          </div>
        )}
      </div>
    </section>
  )

  const ServicesSection = () => (
    <section id="services" className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300">Three simple steps to viral success</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gray-900/50 border-gray-700 text-center p-8 hover:bg-gray-900/70 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Send Us Your Content</h3>
            <p className="text-gray-300">
              Upload your long-form videos, podcasts, or live streams. We accept all formats
            </p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 text-center p-8 hover:bg-gray-900/70 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">We Create Magic</h3>
            <p className="text-gray-300">
              Our team extracts the best moments, adds viral hooks, captions, and optimizes for each platform.
            </p>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 text-center p-8 hover:bg-gray-900/70 transition-colors">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Watch Your Growth</h3>
            <p className="text-gray-300">
              Receive your viral-ready clips and watch your engagement, followers, and revenue soar.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )

  const PricingSection = () => (
    <section id="pricing" className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Growth Plan</h2>
          <p className="text-xl text-gray-300 mb-8">Transparent pricing, maximum results</p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${!isAnnual ? "text-white" : "text-gray-400"}`}>Monthly</span>
            <button
              onClick={handlePricingToggle}
              className={`relative w-14 h-8 rounded-full transition-colors ${isAnnual ? "bg-purple-500" : "bg-gray-600"}`}
              type="button"
            >
              <div
                className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-lg ${isAnnual ? "text-white" : "text-gray-400"}`}>Annual</span>
            <Badge className="bg-green-500">Save 20%</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <Card className="bg-gray-900/50 border-gray-700 p-8 relative">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "800" : "1,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">Perfect for getting started</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  30 Posts ($33 per clip)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Bi-Monthly Strategy Calls
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Social Media Management
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Custom Branding
                </li>
              </ul>

              <Button 
                onClick={(e) => openBookingModal(e)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Start Growing
              </Button>
            </CardContent>
          </Card>

          {/* Growth Plan */}
          <Card className="bg-gray-900/50 border-purple-500 p-8 relative scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500">
              Most Popular
            </Badge>
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "1,600" : "2,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">For serious growth</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  70 Shorts ($28 per clip)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Weekly Strategy Calls
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Everything in Starter
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Advanced Analytics
                </li>
              </ul>

              <Button 
                onClick={(e) => openBookingModal(e)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Scale Your Reach
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gray-900/50 border-gray-700 p-8 relative">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "3,200" : "4,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">Maximum viral potential</p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  150 Clips ($26.6 per clip)
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Viral Content Team
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Trend Matching
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  YouTube + TikTok Management
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  Weekly Growth Reports
                </li>
              </ul>

              <Button 
                onClick={(e) => openBookingModal(e)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Dominate Your Niche
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            onClick={(e) => openBookingModal(e)}
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            Book Free Consultation
          </Button>
        </div>
      </div>
    </section>
  )

  const FeaturesSection = () => (
    <section id="features" className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300">Everything you need to dominate short-form content</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Captions with Emojis",
              desc: "Automatically generated captions that boost engagement",
            },
            { icon: Target, title: "Strategic Hook Creation", desc: "Compelling openings that stop the scroll" },
            { icon: Zap, title: "Zoom & Jump Cut Editing", desc: "Dynamic editing that keeps viewers engaged" },
            { icon: Eye, title: "Custom Brand Watermarks", desc: "Consistent branding across all content" },
            { icon: BarChart3, title: "Trend Analysis & Strategy", desc: "Data-driven content optimization" },
            { icon: Star, title: "Thumbnail & Title Optimization", desc: "Maximize click-through rates" },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-700 p-6 hover:bg-gray-900/70 transition-colors group"
            >
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )

  const TestimonialsSection = () => (
    <section id="testimonials" className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join 500+ Happy Clients</h2>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Sarah Johnson", company: "Fitness Coach", result: "2.1M views in 30 days" },
            { name: "Mike Chen", company: "Tech Reviewer", result: "500K new followers" },
            { name: "Emma Davis", company: "Business Coach", result: "$50K in new revenue" },
          ].map((testimonial, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700 p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Image
                    src={`/placeholder.svg?height=50&width=50&query=professional headshot ${index + 1}`}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  "ViralClips transformed our content strategy. The results speak for themselves."
                </p>
                <Badge className="bg-green-500">{testimonial.result}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )

  const FAQSection = () => {
    const faqs = [
      {
        q: "How quickly do you deliver clips?",
        a: "We deliver your first batch of clips within 48-72 hours, with ongoing deliveries throughout the month.",
      },
      {
        q: "What platforms do you optimize for?",
        a: "We optimize for TikTok, Instagram Reels, YouTube Shorts, and can customize for other platforms upon request.",
      },
      {
        q: "Do you provide analytics?",
        a: "Yes, we provide detailed analytics and performance reports to track your growth and ROI.",
      },
      {
        q: "Can I request revisions?",
        a: "We offer unlimited revisions until you're completely satisfied with your content.",
      },
      {
        q: "What file formats do you need?",
        a: "We accept all major video formats including MP4, MOV, AVI, and can work with raw footage or edited content.",
      },
    ]

    return (
      <section id="faq" className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-900/70 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="text-white font-semibold">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300">{faq.a}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const CTASection = () => (
    <section id="cta" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Go Viral?</h2>
        <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
          The short-form video market is projected to reach $289.52 billion by 2032. Don't get left behind.
        </p>
        <Button
          size="lg"
          onClick={(e) => openBookingModal(e)}
          className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 mb-4"
        >
          Book Your Free Strategy Call
          <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
        <p className="text-purple-100 text-sm">No commitment required</p>
      </div>
    </section>
  )

  const Footer = () => (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ViralClips</span>
            </div>
            <p className="text-gray-400">Transforming long-form content into viral short-form clips.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">
                  Content Clipping
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Social Media Management
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Analytics & Reporting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <button onClick={() => scrollToSection('work')} className="hover:text-white transition-colors">
                  Case Studies
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Get viral content tips weekly</p>
            <div className="flex">
              <Input placeholder="Enter email" className="bg-gray-900 border-gray-700 text-white" />
              <Button className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ViralClips. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <SocialProofSection />
      <BeforeAfterSection />
      <VideoShowcaseSection />
      <ServicesSection />
      <PricingSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      
      {/* Modals */}
      <BookingModal />
      <VideoModal />
    </div>
  )
}