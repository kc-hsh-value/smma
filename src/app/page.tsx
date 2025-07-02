"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Shadcn UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Lucide Icons
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
  Users,
  MessageSquare,
  Calendar,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Image from "next/image"



type Video = {
  id: number
  category: string
  views: string
  url: string
  platform: "tiktok" | "instagram" | "youtube"
}

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

// --- FIX ---: All components are moved outside the main LandingPage component
// This prevents them from being re-created on every render, which fixes the scroll-to-top issue.

const bookingFormSchema = z.object({
  businessType: z.string().min(1, "Please select your business type"),
  email: z.string().email("Please enter a valid email address"),
  socials: z.string().optional(),
  name: z.string().min(2, "Please enter your name"),
  revenue: z.string().optional(),
  goals: z.string().min(10, "Please tell us a bit more about your goals (at least 10 characters)"),
})

const BookingCallModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      socials: "",
      businessType: "",
      revenue: "",
      goals: "",
    },
  })

  async function onSubmit(data: z.infer<typeof bookingFormSchema>) {
    setIsSubmitting(true)
    
    try {
      // Submit to your API endpoint
      const response = await fetch('/api/save-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'booking_modal'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSuccess(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        form.reset()
      }, 2000)

    } catch (error) {
      console.error('Error submitting form:', error)
      // You might want to show an error message here
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setIsSuccess(false)
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
            <DialogDescription className="text-gray-300">
              We've received your information and will be in touch within 24 hours to schedule your free strategy call.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Book Your Free Strategy Call
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Get a personalized content strategy to 10x your engagement and grow your audience.
              </DialogDescription>
            </DialogHeader>

            {/* Benefits section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-sm">Audience Growth Strategy</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Content Optimization</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-400" />
                <span className="text-sm">30-Min Free Session</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Personalized Action Plan</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="bg-gray-800 border-gray-600 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@company.com"
                            {...field}
                            className="bg-gray-800 border-gray-600 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-600 focus:border-purple-500">
                            <SelectValue placeholder="Select your business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-600 text-white">
                          <SelectItem value="Podcast">Podcast Host</SelectItem>
                          <SelectItem value="Business Owner">Business Owner</SelectItem>
                          <SelectItem value="Content Creator">Content Creator</SelectItem>
                          <SelectItem value="E-commerce">E-commerce Brand</SelectItem>
                          <SelectItem value="Coach">Coach/Consultant</SelectItem>
                          <SelectItem value="Agency">Marketing Agency</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="socials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Social Media Handle <span className="text-gray-400">(Optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@yourbrand"
                            {...field}
                            className="bg-gray-800 border-gray-600 focus:border-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="revenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Monthly Revenue Range <span className="text-gray-400">(Optional)</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600 focus:border-purple-500">
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600 text-white">
                            <SelectItem value="0-1k">$0 - $1,000</SelectItem>
                            <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k+">$50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your main content goals?</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Tell us about your current challenges and what you'd like to achieve with your content..."
                          {...field}
                          className="w-full min-h-[100px] p-3 bg-gray-800 border border-gray-600 rounded-md focus:border-purple-500 focus:outline-none resize-none text-white placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Book My Free Strategy Call"
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting this form, you agree to receive follow-up communications about your strategy call.
                </p>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

const VideoShowcaseModal = ({
  video,
  onClose,
}: {
  video: Video | null
  onClose: () => void
}) => {
  if (!video) return null

  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="bg-black border-none shadow-none max-w-lg p-0">
        <iframe
          width="315" 
          height="560"
          src={video.url}
          className="w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </DialogContent>
    </Dialog>
  )
}

const Header = ({
  isMenuOpen,
  onMenuToggle,
  onBookCallClick,
}: {
  isMenuOpen: boolean
  onMenuToggle: () => void
  onBookCallClick: () => void
}) => (
  <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-purple-500/20 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">ViralClips</span>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <a href="#services" className="text-gray-300 hover:text-white transition-colors">
          Services
        </a>
        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
          Pricing
        </a>
        <a href="#work" className="text-gray-300 hover:text-white transition-colors">
          Our Work
        </a>
        <Button
          onClick={onBookCallClick}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Book Free Call
        </Button>
      </nav>

      <button className="md:hidden text-white" onClick={onMenuToggle}>
        {isMenuOpen ? <X /> : <Menu />}
      </button>
    </div>
  </header>
)

const HeroSection = ({ onBookCallClick }: { onBookCallClick: () => void }) => {
  const viewsCount = useCounter(100)
  const revenueCount = useCounter(2)
  const retentionCount = useCounter(95)

  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            We Grow Brands on{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TikTok, Reels & Shorts
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {viewsCount}M+ views. Zero Ad Spend. We'll take your long videos, turn them into viral shorts while you
            focus on your business
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={onBookCallClick}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-4"
            >
              Book a Free Strategy Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-4"
            >
              View Our Work
              <Play className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{viewsCount}M+</div>
              <div className="text-gray-400">Total Views Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">${revenueCount}M+</div>
              <div className="text-gray-400">Revenue Attributed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{retentionCount}%</div>
              <div className="text-gray-400">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SocialProofSection = () => (
    <section className="py-16 bg-black/50">
        <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 mb-8">Trusted by 500+ Brands</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
                {["Brand1", "Brand2", "Brand3", "Brand4", "Brand5"].map((brand, index) => (
                    <div key={index} className="text-2xl font-bold text-gray-500">
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const BeforeAfterSection = () => (
    <section className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">See the Transformation</h2>
                <p className="text-xl text-gray-300">From raw footage to viral content</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <Card className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:scale-105 transition-transform">
                    <CardContent className="p-0">
                        <div className="relative">
                            {/* --- MODIFIED ---: Using a video tag for the placeholder */}
                            <video
                                src="https://www.youtube.com/embed/FV5NY7f3rCo?si=hbtNNs33Id8Zln25"
                                className="w-full h-64 object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            ></video>
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
                            {/* --- MODIFIED ---: Using a video tag for the placeholder */}
                            <video
                                src="https://www.youtube.com/embed/FV5NY7f3rCo?si=hbtNNs33Id8Zln25"
                                className="w-full h-64 object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            ></video>
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


const VideoShowcaseSection = ({ onVideoSelect }: { onVideoSelect: (video: Video) => void }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const videos: Video[] = [
    { id: 1, category: "History", views: "28M", url:"https://www.youtube.com/embed/EVwW0h6tzJM", platform: "youtube" },
    { id: 2, category: "Politics", views: "27M", url:"https://www.youtube.com/embed/TeMxrvBo2Wo", platform: "youtube" },
    { id: 3, category: "Politics", views: "7M", url:"https://www.youtube.com/embed/0s_GzmOdqMM", platform: "youtube" },
    { id: 4, category: "Lifestyle", views: "3.2M", url:"https://www.youtube.com/embed/pK2I9yZszCw", platform: "youtube" },
    { id: 5, category: "Business", views: "2.6M", url:"https://www.youtube.com/embed/4pHdboqCmXY", platform: "youtube" },
    { id: 6, category: "Society", views: "2.3M", url:"https://www.youtube.com/embed/mEuQ0jFTOjo", platform: "youtube" },
  ]

  // Filter videos based on selected platform
  const filteredVideos = selectedPlatform === 'all' 
    ? videos 
    : videos.filter(video => video.platform === selectedPlatform);

  // Helper function to extract YouTube video ID from embed URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/\/embed\/([^?]+)/);
    return match ? match[1] : null;
  }

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  }

  // Platform filter options
  const platforms = [
    { key: 'all', label: 'All Platforms' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'youtube', label: 'YouTube' },
  ];

  return (
    <section id="work" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Best Performing Clips</h2>
          <div className="flex justify-center space-x-4 mb-8">
            {platforms.map((platform) => (
              <Button
                key={platform.key}
                variant={selectedPlatform === platform.key ? "outline" : "ghost"}
                size="sm"
                className={
                  selectedPlatform === platform.key
                    ? "border-purple-500 text-purple-400"
                    : "text-gray-400 hover:text-white"
                }
                onClick={() => setSelectedPlatform(platform.key)}
              >
                {platform.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
            >
              <CardContent className="p-0">
                <div className="relative">
                  {/* Show YouTube thumbnail instead of video */}
                  <img
                    src={getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'}
                    alt={`${video.category} video thumbnail`}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-purple-500">{video.views} views</Badge>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {video.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show message when no videos match the filter */}
        {filteredVideos.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400 text-lg">
              No videos found for {platforms.find(p => p.key === selectedPlatform)?.label}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

const ServicesSection = () => (
    <section id="services" className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-xl text-gray-300">Three simple steps to viral success</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { icon: Upload, title: "Send Us Your Content", desc: "Upload your long-form videos, podcasts, or live streams. We accept all formats and handle the rest." },
                    { icon: Wand2, title: "We Create Magic", desc: "Our team extracts the best moments, adds viral hooks, captions, and optimizes for each platform." },
                    { icon: TrendingUp, title: "Watch Your Growth", desc: "Receive your viral-ready clips and watch your engagement, followers, and revenue soar." },
                ].map((item, index) => (
                    <Card key={index} className="bg-gray-900/50 border-gray-700 text-center p-8 hover:bg-gray-900/70 transition-colors">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                        <p className="text-gray-300">{item.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    </section>
)

const PricingSection = ({
  isAnnual,
  onToggleAnnual,
  onBookCallClick,
}: {
  isAnnual: boolean
  onToggleAnnual: () => void
  onBookCallClick: () => void
}) => (
  <section id="pricing" className="py-20 bg-black">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Growth Plan</h2>
        <p className="text-xl text-gray-300 mb-8">Transparent pricing, maximum results</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`text-lg ${!isAnnual ? "text-white" : "text-gray-400"}`}>Monthly</span>
          <button
            onClick={onToggleAnnual}
            className={`relative w-14 h-8 rounded-full transition-colors ${isAnnual ? "bg-purple-500" : "bg-gray-600"}`}
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
        {/* Starter, Growth, Premium cards omitted for brevity, but they should each have `onClick={onBookCallClick}` on their buttons */}
          <Card className="bg-gray-900/50 border-gray-700 p-8 relative">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "800" : "1,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />30 Posts ($33 per clip)</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Bi-Monthly Strategy Calls</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Social Media Management</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Custom Branding</li>
              </ul>
              <Button onClick={onBookCallClick} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">Start Growing</Button>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-purple-500 p-8 relative scale-105">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500">Most Popular</Badge>
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "1,600" : "2,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">For serious growth</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />70 Shorts ($28 per clip)</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Weekly Strategy Calls</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Everything in Starter</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Advanced Analytics</li>
              </ul>
              <Button onClick={onBookCallClick} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">Scale Your Reach</Button>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700 p-8 relative">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-4xl font-bold text-white mb-4">
                ${isAnnual ? "3,200" : "4,000"}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">Maximum viral potential</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />150 Clips ($26.6 per clip)</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Viral Content Team</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Trend Matching</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />YouTube + TikTok Management</li>
                <li className="flex items-center text-gray-300"><Check className="w-5 h-5 text-green-500 mr-3" />Weekly Growth Reports</li>
              </ul>
              <Button onClick={onBookCallClick} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">Dominate Your Niche</Button>
            </CardContent>
          </Card>
      </div>

      <div className="text-center mt-12">
        <Button size="lg" variant="outline" onClick={onBookCallClick} className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
          Book Free Consultation
        </Button>
      </div>
    </div>
  </section>
)

const FeaturesSection = () => (
    <section className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
                <p className="text-xl text-gray-300">Everything you need to dominate short-form content</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                    { icon: Sparkles, title: "AI-Powered Captions", desc: "Automatically generated captions that boost engagement" },
                    { icon: Target, title: "Strategic Hook Creation", desc: "Compelling openings that stop the scroll" },
                    { icon: Zap, title: "Zoom & Jump Cut Editing", desc: "Dynamic editing that keeps viewers engaged" },
                    { icon: Eye, title: "Custom Brand Watermarks", desc: "Consistent branding across all content" },
                    { icon: BarChart3, title: "Trend Analysis & Strategy", desc: "Data-driven content optimization" },
                    { icon: Star, title: "Thumbnail Optimization", desc: "Maximize click-through rates" },
                ].map((feature, index) => (
                    <Card key={index} className="bg-gray-900/50 border-gray-700 p-6 hover:bg-gray-900/70 transition-colors group">
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
    <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join 500+ Happy Clients</h2>
                <div className="flex justify-center mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}</div>
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
                                <Image src={`/placeholder.svg?height=50&width=50&query=headshot ${index}`} alt={testimonial.name} width={50} height={50} className="rounded-full mr-4" />
                                <div>
                                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-4">"ViralClips transformed our content strategy. The results speak for themselves."</p>
                            <Badge className="bg-green-500">{testimonial.result}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
)

const FAQSection = ({
  openFaq,
  onFaqToggle,
}: {
  openFaq: number | null
  onFaqToggle: (index: number) => void
}) => {
  const faqs = [
    { q: "How quickly do you deliver clips?", a: "We deliver your first batch of clips within 48-72 hours, with ongoing deliveries throughout the month." },
    { q: "What platforms do you optimize for?", a: "We optimize for TikTok, Instagram Reels, YouTube Shorts, and can customize for other platforms upon request." },
    { q: "Do you provide analytics?", a: "Yes, we provide detailed analytics and performance reports to track your growth and ROI." },
    { q: "Can I request revisions?", a: "We offer unlimited revisions until you're completely satisfied with your content." },
    { q: "What file formats do you need?", a: "We accept all major video formats including MP4, MOV, AVI, and can work with raw footage or edited content." },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-0">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-900/70 transition-colors"
                  onClick={() => onFaqToggle(index)}
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

const CTASection = ({ onBookCallClick }: { onBookCallClick: () => void }) => (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Go Viral?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                The short-form video market is projected to reach $289.52 billion by 2032. Don't get left behind.
            </p>
            <Button size="lg" onClick={onBookCallClick} className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 mb-4">
                Book Your Free Strategy Call
                <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <p className="text-purple-100 text-sm">No commitment required</p>
        </div>
    </section>
)

const Footer = () => (
    <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
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
                        <li><a href="#" className="hover:text-white transition-colors">Content Clipping</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Social Media Management</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Analytics & Reporting</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
                <p>© 2024 ViralClips. All rights reserved.</p>
            </div>
        </div>
    </footer>
)


export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BookingCallModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <VideoShowcaseModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
      
      <Header
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        onBookCallClick={() => setIsBookingModalOpen(true)}
      />
      <main>
        <HeroSection onBookCallClick={() => setIsBookingModalOpen(true)} />
        <SocialProofSection />
        <BeforeAfterSection />
        <VideoShowcaseSection onVideoSelect={setSelectedVideo} />
        <ServicesSection />
        <PricingSection
          isAnnual={isAnnual}
          onToggleAnnual={() => setIsAnnual(!isAnnual)}
          onBookCallClick={() => setIsBookingModalOpen(true)}
        />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection openFaq={openFaq} onFaqToggle={handleFaqToggle} />
        <CTASection onBookCallClick={() => setIsBookingModalOpen(true)} />
      </main>
      <Footer />
    </div>
  )
}