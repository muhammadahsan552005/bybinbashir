import Layout from "@/components/Layout";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!isLogin && !fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
          navigate("/profile");
        }
      } else {
        const { error } = await signUp(email.trim(), password, fullName.trim());
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to confirm.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-8 py-16 lg:py-24">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-xl font-semibold text-primary">B</span>
          </div>
          <h1 className="font-display text-2xl text-foreground mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-sm text-muted-foreground">{isLogin ? "Sign in to your account" : "Join ByBinBashir today"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                placeholder="Your name"
                maxLength={100}
              />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="your@email.com"
              maxLength={255}
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full text-sm bg-primary text-primary-foreground rounded-full py-3.5 hover:bg-gold-glow transition-all duration-300 disabled:opacity-50"
          >
            {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </Layout>
  );
};

export default Auth;
