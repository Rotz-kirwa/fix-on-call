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
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("driver");
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
    
    setLoading(true);
    try {
      const response = await authAPI.register({
        name,
        email,
        phone,
        password,
        user_type: role,
      });
      
      const { user, token } = response.data;
      
      login(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.user_type as UserRole,
          phone: user.phone,
        },
        token
      );
      
      toast({ title: "Account created!", description: `Welcome to Fix On Call, ${name}` });
      navigate(role === "mechanic" ? "/mechanic" : "/driver");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: "driver", label: "Driver", desc: "Need roadside help" },
    { value: "mechanic", label: "Mechanic", desc: "Offer your services" },
  ];

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
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                  role === r.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className={`text-sm font-semibold ${role === r.value ? "text-primary" : "text-foreground"}`}>{r.label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

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
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
