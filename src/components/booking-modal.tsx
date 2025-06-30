"use client"

import { useState, useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, ChevronLeft, ChevronRight, Clock, Calendar, X } from "lucide-react"

// Define the ref type for external control
export type BookingModalRef = {
  open: () => void
  close: () => void
}

const BookingModal = forwardRef<BookingModalRef, {}>((_, ref) => {
  // Modal state
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)

  // Form refs for uncontrolled inputs
  const emailRef = useRef<HTMLInputElement>(null)
  const businessTypeRef = useRef<string>("")
  const instagramRef = useRef<HTMLInputElement>(null)
  const tiktokRef = useRef<HTMLInputElement>(null)
  const youtubeRef = useRef<HTMLInputElement>(null)
  const twitterRef = useRef<HTMLInputElement>(null)

  // Form state that needs to be controlled
  const [selectedDate, setSelectedDate] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true)
      setStep(1)
      setErrors({})
    },
    close: () => {
      setIsOpen(false)
      resetForm()
    },
  }))

  // Reset form state
  const resetForm = useCallback(() => {
    if (emailRef.current) emailRef.current.value = ""
    businessTypeRef.current = ""
    if (instagramRef.current) instagramRef.current.value = ""
    if (tiktokRef.current) tiktokRef.current.value = ""
    if (youtubeRef.current) youtubeRef.current.value = ""
    if (twitterRef.current) twitterRef.current.value = ""
    setSelectedDate(null)
    setSelectedTime(null)
    setErrors({})
  }, [])

  // Handle modal close
  const handleClose = useCallback(() => {
    setIsOpen(false)
    resetForm()
  }, [resetForm])

  // Handle business type selection
  const handleBusinessTypeChange = useCallback((value: string) => {
    businessTypeRef.current = value
    setErrors((prev) => {
      const { businessType, ...rest } = prev
      return rest
    })
  }, [])

  // Validate step 1
  const validateStep1 = useCallback(() => {
    const newErrors: Record<string, string> = {}

    const email = emailRef.current?.value || ""
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!businessTypeRef.current) {
      newErrors.businessType = "Please select your business type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  // Validate step 2
  const validateStep2 = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!selectedDate) {
      newErrors.date = "Please select a date"
    }

    if (!selectedTime) {
      newErrors.time = "Please select a time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [selectedDate, selectedTime])

  // Handle next button
  const handleNext = useCallback(() => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      // Form submission
      const formData = {
        email: emailRef.current?.value,
        businessType: businessTypeRef.current,
        socialLinks: {
          instagram: instagramRef.current?.value,
          tiktok: tiktokRef.current?.value,
          youtube: youtubeRef.current?.value,
          twitter: twitterRef.current?.value,
        },
        selectedDate,
        selectedTime,
      }

      console.log("Booking submitted:", formData)
      alert("Your call has been booked! We'll send you a confirmation email shortly.")

      // Reset and close
      handleClose()
    }
  }, [step, validateStep1, validateStep2, selectedDate, selectedTime, handleClose])

  // Handle back button
  const handleBack = useCallback(() => {
    if (step === 2) {
      setStep(1)
      setErrors({})
    }
  }, [step])

  // Handle date selection
  const handleDateSelect = useCallback((day: any) => {
    setSelectedDate(day)
    setSelectedTime(null) // Reset time when date changes
    setErrors((prev) => {
      const { date, ...rest } = prev
      return rest
    })
  }, [])

  // Handle time selection
  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time)
    setErrors((prev) => {
      const { time, ...rest } = prev
      return rest
    })
  }, [])

  // Memoized business types
  const businessTypes = useMemo(
    () => [
      "Podcaster",
      "Streamer",
      "Content Creator",
      "Business Owner",
      "Influencer",
      "Coach/Consultant",
      "Agency",
      "E-commerce Brand",
      "SaaS Company",
      "Other",
    ],
    [],
  )

  // Memoized available slots
  const availableSlots = useMemo(
    () => ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
    [],
  )

  // Memoized calendar days
  const calendarDays = useMemo(() => {
    const today = new Date()
    const days = []

    for (let i = 1; i <= 21; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
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
    return days.slice(0, 12) // Show next 12 business days
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] sm:max-w-[90vw] sm:w-[90vw] sm:max-h-[90vh] sm:h-[90vh] md:max-w-[600px] md:w-[600px] md:max-h-[700px] md:h-[700px] lg:max-w-[700px] lg:w-[700px] lg:max-h-[750px] lg:h-[750px] xl:max-w-[800px] xl:w-[800px] xl:max-h-[800px] xl:h-[800px] rounded-lg overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Book Your Free Strategy Call
          </DialogTitle>
          <button onClick={handleClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center py-4 sm:py-6 px-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= 1
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {step > 1 ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : "1"}
            </div>
            <div
              className={`w-16 sm:w-20 h-1 rounded transition-all duration-300 ${
                step >= 2 ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-700"
              }`}
            />
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= 2
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              2
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-6 lg:p-8">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Tell us about yourself</h3>
                  <p className="text-base sm:text-lg text-gray-400">
                    We'll use this information to prepare for your call
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white text-base sm:text-lg font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    ref={emailRef}
                    onChange={() => errors.email && setErrors((prev) => {
                      const { email, ...rest } = prev
                      return rest
                    })}
                    className={`bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 sm:h-14 text-base sm:text-lg ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-red-400 text-sm sm:text-base">{errors.email}</p>}
                </div>

                {/* Business Type */}
                <div className="space-y-3">
                  <Label className="text-white text-base sm:text-lg font-medium">What best describes you? *</Label>
                  <Select onValueChange={handleBusinessTypeChange}>
                    <SelectTrigger
                      className={`bg-gray-800 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500 h-12 sm:h-14 text-base sm:text-lg ${
                        errors.businessType ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600 max-h-[40vh]">
                      {businessTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700 text-base py-3"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.businessType && <p className="text-red-400 text-sm sm:text-base">{errors.businessType}</p>}
                </div>

                {/* Social Media Links */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-base sm:text-lg font-medium">Social Media Links (Optional)</Label>
                    <p className="text-gray-400 text-sm sm:text-base mt-1">Help us understand your current presence</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm sm:text-base flex items-center">
                        <span className="text-lg mr-2">📷</span>
                        Instagram
                      </Label>
                      <Input
                        placeholder="@username or full URL"
                        ref={instagramRef}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm sm:text-base flex items-center">
                        <span className="text-lg mr-2">🎵</span>
                        TikTok
                      </Label>
                      <Input
                        placeholder="@username or full URL"
                        ref={tiktokRef}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm sm:text-base flex items-center">
                        <span className="text-lg mr-2">📺</span>
                        YouTube
                      </Label>
                      <Input
                        placeholder="Channel name or URL"
                        ref={youtubeRef}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm sm:text-base flex items-center">
                        <span className="text-lg mr-2">🐦</span>
                        Twitter/X
                      </Label>
                      <Input
                        placeholder="@username or full URL"
                        ref={twitterRef}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Calendar Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">Choose your preferred time</h3>
                  <p className="text-base sm:text-lg text-gray-400">Select a date and time that works best for you</p>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <Label className="text-white text-base sm:text-lg font-medium">Select Date *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[200px] overflow-y-auto p-2 rounded-lg bg-gray-800/30">
                    {calendarDays.map((day) => (
                      <button
                        key={day.fullDate}
                        onClick={() => handleDateSelect(day)}
                        className={`p-3 rounded-lg border text-center transition-all duration-200 hover:scale-105 min-h-[80px] ${
                          selectedDate?.fullDate === day.fullDate
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white shadow-lg"
                            : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                        }`}
                        type="button"
                      >
                        <div className="text-xs text-gray-400">{day.weekday}</div>
                        <div className="font-semibold text-lg">{day.day}</div>
                        <div className="text-xs">{day.month}</div>
                      </button>
                    ))}
                  </div>
                  {errors.date && <p className="text-red-400 text-sm sm:text-base">{errors.date}</p>}
                </div>

                {/* Time Selection */}
                <div className="space-y-4">
                  <Label className="text-white text-base sm:text-lg font-medium">Select Time (EST) *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[150px] overflow-y-auto p-2 rounded-lg bg-gray-800/30">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        disabled={!selectedDate}
                        className={`p-3 rounded-lg border text-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-h-[70px] ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 border-purple-500 text-white shadow-lg"
                            : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                        }`}
                        type="button"
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <div className="text-sm font-medium">{time}</div>
                      </button>
                    ))}
                  </div>
                  {errors.time && <p className="text-red-400 text-sm sm:text-base">{errors.time}</p>}
                  {!selectedDate && <p className="text-gray-400 text-sm sm:text-base">Please select a date first</p>}
                </div>

                {/* Selected Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600 shadow-inner">
                    <h4 className="text-white font-semibold mb-3 flex items-center text-base sm:text-lg">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-400" />
                      Your Selected Time:
                    </h4>
                    <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                        <span className="font-medium">
                          {selectedDate.weekday}, {selectedDate.month} {selectedDate.day}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                        <span className="font-medium">{selectedTime} EST</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="border-t border-gray-700 p-4 sm:p-6 flex-shrink-0 bg-gray-900">
          {step === 1 ? (
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 h-12 sm:h-14 text-base sm:text-lg font-semibold"
            >
              Next: Choose Time
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 h-12 sm:h-14 text-base sm:text-lg"
                type="button"
              >
                <ChevronLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="flex-[2] bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 h-12 sm:h-14 text-base sm:text-lg font-semibold"
                type="button"
              >
                Book My Call
                <Calendar className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})

BookingModal.displayName = "BookingModal"

export default BookingModal
