"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { signupUser } from "@/lib/redux/features/authSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  User,
  Mail,
  Lock,
  Shield,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "Residential Employee",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (formData.password && formData.passwordConfirm) {
      setPasswordMatch(formData.password === formData.passwordConfirm);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.passwordConfirm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setPasswordMatch(false);
      toast.error("Passwords do not match!");
      return;
    }

    // Toast promise use karo - ye automatically handle karega sab kuch
    const signupPromise = dispatch(signupUser(formData)).unwrap();

    toast.promise(signupPromise, {
      loading: "Creating your account...",
      success: "🎉 Account created successfully!",
      error: (err) => `${err || "Failed to create account"}`,
    });

    // Success ke baad redirect
    signupPromise
      .then(() => {
        setTimeout(() => {
          toast.success("Redirecting to login page...", {
            icon: "🚀",
          });
        }, 1500);

        setTimeout(() => {
          router.push("/login");
        }, 2500);
      })
      .catch((err) => {
        console.error("Signup error:", err);
      });
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 py-12">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join EstateHub to start managing properties.
          </p>
        </div>

        <Card className="border-2 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Sign Up
              </CardTitle>
              <CardDescription className="text-center">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="pl-10 h-11"
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10 h-11"
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Sign up as</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData("role", value)}
                    disabled={status === "loading"}
                  >
                    <SelectTrigger className="pl-10 h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Residential Employee">
                        Residential Employee
                      </SelectItem>
                      <SelectItem value="Commercial Employee">
                        Commercial Employee
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="pl-10 h-11"
                    required
                    minLength={8}
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      updateFormData("passwordConfirm", e.target.value)
                    }
                    className={`pl-10 h-11 ${!passwordMatch && formData.passwordConfirm ? "border-red-500" : ""}`}
                    required
                    minLength={8}
                    disabled={status === "loading"}
                  />
                  {passwordMatch && formData.passwordConfirm && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
                </div>
                {!passwordMatch && formData.passwordConfirm && (
                  <p className="text-xs text-red-600">Passwords do not match</p>
                )}
              </div>

              {status === "failed" && error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={status === "loading" || !passwordMatch}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
