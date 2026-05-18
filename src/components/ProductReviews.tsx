import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, Send, Pencil, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const MAX_CHARS = 500;

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Reviews table might not exist yet:", error);
        return [];
      }
      return data as Review[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (comment.length > MAX_CHARS) {
      toast.error(`Comment exceeds maximum length of ${MAX_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const { data, error } = await supabase.from("product_reviews").update({
          rating,
          comment: comment.trim(),
        }).eq("id", editingId).select();
        
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Update failed. Please ensure you have the 'UPDATE' RLS policy enabled in Supabase.");
        }
        
        toast.success("Review updated successfully!");
        setEditingId(null);
      } else {
        const { data, error } = await supabase.from("product_reviews").insert({
          product_id: productId,
          user_id: user.id,
          user_name: profile?.full_name || user.email?.split("@")[0] || "Anonymous",
          rating,
          comment: comment.trim(),
        }).select();
        
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("Insert failed. Please ensure you have the 'INSERT' RLS policy enabled in Supabase.");
        }
        toast.success("Review submitted successfully!");
      }

      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    } catch (err: any) {
      toast.error(`Failed: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteReview = (reviewId: string) => {
    toast("Are you sure you want to delete this review?", {
      action: {
        label: "Delete",
        onClick: () => executeDeleteReview(reviewId),
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const executeDeleteReview = async (reviewId: string) => {
    try {
      const { data, error } = await supabase.from("product_reviews").delete().eq("id", reviewId).select();
      
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Delete failed. Please ensure you have the 'DELETE' RLS policy enabled in Supabase.");
      }
      
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    } catch (err: any) {
      toast.error(`Failed: ${err.message || JSON.stringify(err)}`);
    }
  };

  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <section className="mt-16 border-t border-border/50 pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-2xl text-foreground">Customer Reviews</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {reviews?.length} {reviews?.length === 1 ? "Review" : "Reviews"} 
            {reviews && reviews.length > 0 && ` • Average Rating: ${averageRating} / 5`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Write Review Form */}
        <div id="review-form" className="lg:col-span-1 bg-card border border-border p-6 rounded-2xl h-fit shadow-xl shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-foreground">{editingId ? "Edit Your Review" : "Write a Review"}</h4>
            {editingId && (
              <button onClick={() => { setEditingId(null); setComment(""); setRating(5); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star className={`w-5 h-5 transition-colors ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground flex justify-between mb-2">
                  <span>Your Review</span>
                  <span className={comment.length > MAX_CHARS ? "text-destructive" : ""}>
                    {comment.length} / {MAX_CHARS}
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={MAX_CHARS}
                  placeholder="Share your thoughts about this timepiece..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || comment.length > MAX_CHARS}
                className="w-full flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground rounded-xl py-3 hover:bg-gold-glow transition-all duration-300 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Submitting..." : editingId ? "Update Review" : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 bg-secondary/50 rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Please sign in to leave a review.</p>
              <a href="/auth" className="text-sm text-primary hover:underline font-medium">Sign In / Register</a>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-10">Loading reviews...</p>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                key={review.id}
                className="bg-card border border-border/50 p-5 rounded-2xl group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-foreground">{review.user_name}</h5>
                      {user && user.id === review.user_id && (
                        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { 
                            setEditingId(review.id); 
                            setRating(review.rating); 
                            setComment(review.comment); 
                            document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
                          }} className="text-muted-foreground hover:text-primary transition-colors">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => confirmDeleteReview(review.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-card border border-border border-dashed rounded-2xl">
              <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No reviews yet</p>
              <p className="text-xs text-muted-foreground mt-1">Be the first to review this elegant timepiece.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
