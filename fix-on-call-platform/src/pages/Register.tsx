import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Eye, EyeOff } from "lucide-react";
import { useAuthStore, type UserRole } from "@/store/authStore";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const role: UserRole = "driver";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (role === "driver" && (!vehicleMake || !vehicleModel || !licensePlate)) {
      toast({ title: "Add your car details", description: "Make, model, and plate number are required for drivers.", variant: "destructive" });
      return;
    }
    const normalizedPhone = phone.replace(/[\s-]/g, "");
    if (!/^(?:\+254|0)7\d{8}$/.test(normalizedPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Use Kenyan format: +2547XXXXXXXX or 07XXXXXXXX.",
        variant: "destructive",
      });
      return;
    }
    if (vehicleYear) {
      const year = Number(vehicleYear);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1980 || year > currentYear + 1) {
        toast({
          title: "Invalid vehicle year",
          description: `Enter a valid year between 1980 and ${currentYear + 1}.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        phone: normalizedPhone,
        password,
        user_type: role,
        vehicle_info:
          role === "driver"
            ? {
                make: vehicleMake,
                model: vehicleModel,
                year: vehicleYear ? Number(vehicleYear) : undefined,
                license_plate: licensePlate.toUpperCase(),
              }
            : undefined,
      });
      
      const { user, token } = response.data;
      
      login(
        {
          id: String(user.id ?? user._id ?? ""),
          name: user.name,
          email: user.email,
          role: user.user_type as UserRole,
          phone: user.phone,
          vehicleInfo: user.vehicle_info,
        },
        token
      );
      
      toast({ title: "Account created!", description: `Welcome to Fix On Call, ${name}` });
      navigate("/");
    } catch (error: any) {
      const backendError =
        error?.response?.data?.error ||
        error?.message ||
        "Network error. Check backend URL/CORS and try again.";
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: backendError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="https://i.pinimg.com/736x/9f/11/9c/9f119c5372e0806ce7d8aa14b8de2aff.jpg" 
              alt="Fix On Call Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-xl font-bold text-foreground">Fix On Call</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join Fix On Call today</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input id="name" placeholder="John Kamau" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input id="phone" placeholder="+254 700 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 h-11 rounded-xl" />
            </div>
            {role === "driver" && (
              <>
                <div className="pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Car Details</p>
                </div>
                <div>
                  <Label htmlFor="vehicleMake" className="text-sm font-medium">Make</Label>
                  <Input
                    id="vehicleMake"
                    placeholder="Toyota"
                    value={vehicleMake}
                    onChange={(e) => setVehicleMake(e.target.value)}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel" className="text-sm font-medium">Model</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="Premio"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleYear" className="text-sm font-medium">Year</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    placeholder="2020"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="mt-1.5 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate" className="text-sm font-medium">Plate Number</Label>
                  <Input
                    id="licensePlate"
                    placeholder="KDA 123A"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="mt-1.5 h-11 rounded-xl uppercase"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password (4-digit PIN)</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  maxLength={4}
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
