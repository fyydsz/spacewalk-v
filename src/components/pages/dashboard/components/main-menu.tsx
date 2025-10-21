import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Info, Loader2, ChevronDown } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useApi } from "@/hooks/use-api"
import { customToast } from "@/lib/toast-helpers"
import { SimpleSkeleton } from "@/components/layout/dashboard/dashboard-skeleton"

export function UserRegister() {
  const { updateCharacter, mode } = useAuth()
  const api = useApi()
  const [formData, setFormData] = React.useState({
    characterName: "",
    birthday: undefined as Date | undefined,
    gender: "",
    username: ""
  })

  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [submitError, setSubmitError] = React.useState("")
  const [hasCharacter, setHasCharacter] = React.useState<boolean | null>(null)
  const [characterData, setCharacterData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [usernameChecking, setUsernameChecking] = React.useState(false)

  // Check if user already has a character on component mount
  // In production: only check once on mount
  // In development: re-check when user changes (for mock data flexibility)
  React.useEffect(() => {
    const checkCharacter = async () => {
      try {
        const data = await api.checkCharacter()
        
        if (data.hasCharacter && data.character) {
          setHasCharacter(true)
          setCharacterData(data.character)
          console.log(`[${mode} mode] User already has character:`, data.character)
        } else {
          setHasCharacter(false)
          console.log(`[${mode} mode] User has no character yet`)
        }
      } catch (error) {
        console.error("Error checking character:", error)
        setHasCharacter(false)
      }
    }

    checkCharacter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, mode === 'production' ? [] : [mode, api]) // Production: run once, Development: allow re-check

  React.useEffect(() => {
    // Mobile Checker
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error saat user mulai mengetik
    if (submitError) setSubmitError("")
  }

  const handleCharacterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Hanya izinkan huruf alphabet dan spasi
    const validName = value.replace(/[^a-zA-Z\s]/g, '')
    setFormData(prev => ({
      ...prev,
      characterName: validName
    }))
    // Clear error saat user mulai mengetik
    if (submitError) setSubmitError("")
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Hanya izinkan huruf, angka, underscore, dash, dan titik
    const validUsername = value.replace(/[^a-zA-Z0-9._-]/g, '')
    setFormData(prev => ({
      ...prev,
      username: validUsername
    }))
    // Clear error saat user mulai mengetik
    if (submitError) setSubmitError("")
  }

  // Check username availability on blur
  const handleUsernameBlur = async () => {
    if (formData.username.length < 4) return

    setUsernameChecking(true)
    try {
      const data = await api.checkUsername(formData.username)
      
      if (!data.available) {
        setSubmitError("Username sudah digunakan")
      }
    } catch (error) {
      console.error("Error checking username:", error)
    } finally {
      setUsernameChecking(false)
    }
  }

  const isValidCharacterName = (name: string): boolean => {
    // Cek apakah nama memiliki minimal 2 kata (dipisahkan spasi)
    const words = name.trim().split(/\s+/).filter(word => word.length > 0)
    return words.length >= 2
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const submitId = `submit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[${submitId}] handleSubmit called`);
    
    // Reset error message
    setSubmitError("")
    
    // Validasi manual
    if (!formData.username || formData.username.length < 4 || formData.username.length > 30) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    if (!formData.characterName || !isValidCharacterName(formData.characterName)) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    if (formData.characterName.length < 5 || formData.characterName.length > 32) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    // Validate birthday
    if (!formData.birthday) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    // Calculate age from birthday
    const today = new Date()
    const birthDate = new Date(formData.birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    // Validate age (13-100 years old)
    if (age < 13 || age > 100) {
      setSubmitError("Umur karakter harus antara 13-100 tahun")
      return
    }
    
    if (!formData.gender) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    setLoading(true)

    try {
      // Promise untuk API call
      const apiCall = api.createCharacter({
        username: formData.username,
        name: formData.characterName,
        birthday: formData.birthday!.toISOString().split('T')[0], // Format: YYYY-MM-DD
        gender: formData.gender as "Laki-laki" | "Perempuan"
      })

      // Promise untuk minimum delay 1.5 detik
      const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

      // Tunggu kedua promise selesai
      const [data] = await Promise.all([apiCall, minDelay])

      if (data.success && data.data) {
        console.log(`[${mode} mode] Character created:`, data.data)
        
        // Update user context with new character
        updateCharacter(data.data)
        
        // Show success toast
        customToast.success(
          "Registrasi Berhasil!", 
          "Karakter Anda telah berhasil dibuat, welcome to Spacewalk!"
        )
        
        // Set character data and switch to character view
        setCharacterData(data.data)
        setHasCharacter(true)
      } else {
        console.error('[Registration] API returned unsuccessful:', data);
        setSubmitError(data.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("[Registration] Error details:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar"
      setSubmitError(errorMessage)
      
      // Show error toast in production
      if (mode === 'production') {
        customToast.error("Registrasi Gagal", errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  // Jika user sudah punya karakter, tampilkan dashboard
  if (hasCharacter === true) {
    return (
      <div className="w-full h-full max-h-[calc(100vh-4rem)] p-8 md:p-20 overflow-hidden flex flex-col">
        {/* Welcome Header */}
        <div className="mb-8 flex-shrink-0">
          <h1 className="text-5xl font-bold mb-2 ml-2">Welcome Back!</h1>
          <p className="text-2xl text-muted-foreground ml-2">{characterData?.charName || 'Character name'}</p>
        </div>

        {/* Dashboard Grid */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          {/* Left Large Card */}
          <div className="w-full lg:w-1/3">
            <Card className="h-full max-h-[400px] lg:max-h-none border-2 border-border/50">
              <CardContent className="p-8">
                {/* Content placeholder */}
              </CardContent>
            </Card>
          </div>

          {/* Right Cards Container */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Top Right Card */}
            <Card className="flex-1 border-2 border-border/50">
              <CardContent className="p-8">
                {/* Content placeholder */}
              </CardContent>
            </Card>

            {/* Bottom Right Card */}
            <Card className="flex-1 border-2 border-border/50">
              <CardContent className="p-8">
                {/* Content placeholder */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Loading state saat cek karakter
  if (hasCharacter === null) {
    return <SimpleSkeleton />
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-0">
      <Card className="w-full max-w-md mx-auto relative">
        <CardHeader>
          <CardTitle>Registrasi Karakter</CardTitle>
          <CardDescription>
            Buat karakter baru untuk memulai petualangan Anda
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Username Character dengan Tooltip */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="username">Username Character</Label>
              <Tooltip open={isMobile ? tooltipOpen : undefined} onOpenChange={isMobile ? setTooltipOpen : undefined}>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    className="inline-flex cursor-pointer"
                    onClick={(e) => {
                      if (isMobile) {
                        e.preventDefault()
                        setTooltipOpen(!tooltipOpen)
                      }
                    }}
                  >
                    <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Username untuk sosial media spacewalk</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground select-none pointer-events-none">@</span>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username_karakter"
                value={formData.username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                className="pl-7"
                pattern="[a-zA-Z0-9._-]+"
                minLength={4}
                maxLength={30}
                title="Hanya huruf, angka, underscore (_), dash (-), dan titik (.). Minimal 4 karakter, maksimal 30 karakter"
                required
                disabled={usernameChecking}
              />
            </div>
            {usernameChecking && (
              <p className="text-xs text-muted-foreground">
                Mengecek ketersediaan username...
              </p>
            )}
            {formData.username && formData.username.length < 4 && !usernameChecking && (
              <p className="text-xs text-destructive">
                Minimal 4 karakter
              </p>
            )}
            {formData.username && formData.username.length > 30 && !usernameChecking && (
              <p className="text-xs text-destructive">
                Maksimal 30 karakter
              </p>
            )}
          </div>

          {/* Nama Karakter */}
          <div className="space-y-2">
            <Label htmlFor="characterName">Nama Karakter</Label>
            <Input
              id="characterName"
              name="characterName"
              type="text"
              placeholder="Contoh: John Doe"
              value={formData.characterName}
              onChange={handleCharacterNameChange}
              required
              minLength={5}
              maxLength={32}
            />
            {formData.characterName && !isValidCharacterName(formData.characterName) && (
              <p className="text-xs text-destructive">
                Nama karakter harus terdiri dari minimal 2 kata
              </p>
            )}
            {formData.characterName && (formData.characterName.length < 5 || formData.characterName.length > 32) && (
              <p className="text-xs text-destructive">
                Panjang nama karakter harus antara 5-32 karakter
              </p>
            )}
          </div>

          {/* Tanggal Lahir dengan Calendar Picker */}
          <div className="space-y-2">
            <Label htmlFor="birthday">Tanggal Lahir</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="birthday"
                  className="w-full justify-between font-normal"
                >
                  {formData.birthday ? formData.birthday.toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : "Pilih tanggal lahir"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.birthday}
                  captionLayout="dropdown"
                  fromYear={1924}
                  toYear={2012}
                  onSelect={(date) => {
                    setFormData(prev => ({ ...prev, birthday: date }))
                    setCalendarOpen(false)
                    if (submitError) setSubmitError("")
                  }}
                />
              </PopoverContent>
            </Popover>
            {formData.birthday && (() => {
              const today = new Date()
              const birthDate = new Date(formData.birthday)
              let age = today.getFullYear() - birthDate.getFullYear()
              const monthDiff = today.getMonth() - birthDate.getMonth()
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
              }
              if (age < 13 || age > 100) {
                return (
                  <p className="text-xs text-destructive">
                    Umur karakter harus antara 13-100 tahun
                  </p>
                )
              }
              return (
                <p className="text-xs text-muted-foreground">
                  Umur karakter: {age} tahun
                </p>
              )
            })()}
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <Label>Gender</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  checked={formData.gender === "Laki-laki"}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring cursor-pointer"
                />
                <span className="text-sm">Laki-laki</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={formData.gender === "Perempuan"}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring cursor-pointer"
                />
                <span className="text-sm">Perempuan</span>
              </label>
            </div>
          </div>



          {/* Error Message */}
          {submitError && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium">
                {submitError}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full cursor-pointer relative" 
              disabled={loading || usernameChecking}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? "Mendaftar..." : "Daftar Karakter"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
