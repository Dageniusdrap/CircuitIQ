import { Metadata } from "next"
import Link from "next/link"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react"

export const metadata: Metadata = {
    title: "Blog | CircuitIQ",
    description: "Latest news, tutorials, and insights from CircuitIQ",
}

const BLOG_POSTS = [
    {
        title: "Introducing CircuitIQ 2.0: AI-Powered Diagnostics Reimagined",
        excerpt: "We're excited to announce the launch of CircuitIQ 2.0, featuring enhanced AI capabilities, faster analysis, and a completely redesigned interface.",
        author: "CircuitIQ Team",
        date: "December 20, 2024",
        readTime: "5 min read",
        category: "Product Updates",
        featured: true
    },
    {
        title: "How AI is Transforming Aircraft Maintenance",
        excerpt: "Explore how artificial intelligence is revolutionizing the way aviation technicians diagnose and repair complex electrical systems.",
        author: "Dr. Sarah Chen",
        date: "December 15, 2024",
        readTime: "8 min read",
        category: "Industry Insights"
    },
    {
        title: "Best Practices for Uploading Wiring Diagrams",
        excerpt: "Learn the optimal formats, resolutions, and techniques for uploading diagrams to get the most accurate AI analysis results.",
        author: "Technical Team",
        date: "December 10, 2024",
        readTime: "4 min read",
        category: "Tutorials"
    },
    {
        title: "Understanding ATA Chapters: A Complete Guide",
        excerpt: "A comprehensive breakdown of ATA chapters and how CircuitIQ helps technicians navigate complex aircraft documentation.",
        author: "James Mitchell",
        date: "December 5, 2024",
        readTime: "10 min read",
        category: "Education"
    },
    {
        title: "Customer Spotlight: SkyMaintain MRO",
        excerpt: "How SkyMaintain reduced diagnostic time by 70% and improved first-time fix rates using CircuitIQ.",
        author: "Marketing Team",
        date: "November 28, 2024",
        readTime: "6 min read",
        category: "Case Studies"
    },
    {
        title: "Security Update: SOC 2 Type II Certification",
        excerpt: "We're proud to announce that CircuitIQ has achieved SOC 2 Type II certification, demonstrating our commitment to data security.",
        author: "Security Team",
        date: "November 20, 2024",
        readTime: "3 min read",
        category: "Company News"
    }
]

const CATEGORIES = ["All", "Product Updates", "Industry Insights", "Tutorials", "Case Studies", "Company News"]

export default function BlogPage() {
    const featuredPost = BLOG_POSTS.find(p => p.featured)
    const regularPosts = BLOG_POSTS.filter(p => !p.featured)

    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2">
                            <BookOpen className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-sm font-medium">Blog</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            News & Insights
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Stay updated with the latest from CircuitIQ
                        </p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={category === "All" ? "default" : "outline"}
                                size="sm"
                                className={category === "All"
                                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                                    : "border-slate-700 text-slate-300 hover:bg-slate-800"
                                }
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    {featuredPost && (
                        <Card className="border-slate-700/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm mb-8 overflow-hidden">
                            <CardContent className="p-8">
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
                                    Featured
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-slate-300 text-lg mb-6">{featuredPost.excerpt}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
                                    <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {featuredPost.author}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {featuredPost.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950">
                                    Read Article
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Blog Posts Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {regularPosts.map((post, index) => (
                            <Card key={index} className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm hover:border-amber-500/30 transition-colors group cursor-pointer">
                                <CardContent className="p-6">
                                    <Badge variant="outline" className="border-slate-600 text-slate-400 mb-4">
                                        {post.category}
                                    </Badge>
                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>{post.author}</span>
                                        <span>•</span>
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Load More Articles
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
