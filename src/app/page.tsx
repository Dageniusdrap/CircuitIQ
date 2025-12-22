import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Upload, MessageSquare, Layers, LucideIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-600/20 rounded-full px-6 py-2">
            <Zap size={20} className="text-blue-400" />
            <span className="text-blue-400 font-medium">AI-Powered Diagnostics</span>
          </div>

          <h1 className="text-6xl font-bold text-white leading-tight">
            Troubleshoot Wiring Systems
            <span className="text-blue-400"> 10x Faster</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Upload your wiring diagrams and let AI guide you through step-by-step diagnostics.
            Perfect for aircraft, automotive, marine, and electric vehicles.
          </p>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={Upload}
            title="Upload Diagrams"
            description="Bulk upload PDFs, images, or CAD files. AI automatically extracts all components and connections."
          />
          <FeatureCard
            icon={MessageSquare}
            title="AI Diagnostics"
            description="Chat with AI to troubleshoot issues. Get step-by-step procedures with expected values."
          />
          <FeatureCard
            icon={Layers}
            title="System Analysis"
            description="See how components interact, failure impacts, and bypass procedures automatically."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600/50 transition-all">
      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}
