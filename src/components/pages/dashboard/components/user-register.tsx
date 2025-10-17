import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function UserRegister() {
  const [formData, setFormData] = React.useState({
    characterName: "",
    age: "",
    gender: "",
    username: ""
  })

  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [submitError, setSubmitError] = React.useState("")
  const [hasCharacter, setHasCharacter] = React.useState<boolean | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [usernameChecking, setUsernameChecking] = React.useState(false)

  // Check if user already has a character on component mount
  React.useEffect(() => {
    const checkCharacter = async () => {
      try {
        const response = await fetch('https://api.spacewalk.my.id/user/check-character', {
          credentials: 'include'
        })
        const data = await response.json()
        
        if (data.success && data.hasCharacter) {
          setHasCharacter(true)
          console.log("User already has character:", data.character)
        } else {
          setHasCharacter(false)
        }
      } catch (error) {
        console.error("Error checking character:", error)
        setHasCharacter(false)
      }
    }

    checkCharacter()
  }, [])

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
      const response = await fetch(
        `https://api.spacewalk.my.id/user/check-username?username=${encodeURIComponent(formData.username)}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      
      if (data.success && !data.available) {
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
    
    // Reset error message
    setSubmitError("")
    
    // Validasi manual
    if (!formData.username || formData.username.length < 4) {
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
    
    if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 100) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    if (!formData.gender) {
      setSubmitError("Mohon lengkapi semua field dengan benar")
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('https://api.spacewalk.my.id/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          characterName: formData.characterName,
          age: parseInt(formData.age),
          gender: formData.gender
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log("Character created:", data.character)
        // Redirect ke dashboard atau halaman lain
        window.location.href = '/dashboard'
      } else {
        setSubmitError(data.error?.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error registering character:", error)
      setSubmitError("Terjadi kesalahan saat mendaftar")
    } finally {
      setLoading(false)
    }
  }

  // Jika user sudah punya karakter, jangan tampilkan form
  if (hasCharacter === true) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-0">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Kamu sudah memiliki karakter!</h2>
            <p className="text-muted-foreground">Silakan lanjutkan ke dashboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state saat cek karakter
  if (hasCharacter === null) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-0">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">Memuat...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-0">
      <Card className="w-full max-w-md mx-auto">
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
                title="Hanya huruf, angka, underscore (_), dash (-), dan titik (.). Minimal 4 karakter"
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

          {/* Umur */}
          <div className="space-y-2">
            <Label htmlFor="age">Umur karakter</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Masukkan umur"
              value={formData.age}
              onChange={handleInputChange}
              min="13"
              max="100"
              required
            />
            {formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 100) && (
              <p className="text-xs text-destructive">
                Umur harus antara 13-100 tahun
              </p>
            )}

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
            <Button type="submit" className="w-full cursor-pointer" disabled={loading || usernameChecking}>
              {loading ? "Mendaftar..." : "Daftar Karakter"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
