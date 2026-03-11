import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="px-8 lg:px-16 py-12 lg:py-20 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand text-[10px] text-primary mb-2">ABOUT</p>
          <h2 className="text-display text-4xl text-foreground mb-8">The Story</h2>

          <div className="space-y-6 font-body text-sm text-foreground/80 leading-relaxed">
            <p>
              ByBinBashir started as a passion project — a student-run venture born from a genuine love for watches and the belief that exceptional style shouldn't require an exceptional budget.
            </p>
            <p>
              We curate premium timepieces from houses like Rolex, Hublot, Tissot, Cartier, Timas, and Aura, making the aesthetics of luxury accessible to students and young professionals across Pakistan.
            </p>
            <p>
              Every piece in our collection is hand-selected for its design integrity, build quality, and the statement it makes on your wrist. We believe a great watch is more than an accessory — it's a declaration of intent.
            </p>
            <p>
              From our Instagram roots to this digital showcase, our mission remains the same: deliver premium watches with nationwide shipping, transparent pricing, and a personal touch that only a WhatsApp conversation can provide.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-display text-xl text-foreground mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/923167530204"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary hover:text-gold-glow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-body text-sm">03167530204</span>
              </a>
              <a
                href="https://www.instagram.com/by_binbashir"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                @by_binbashir on Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;
