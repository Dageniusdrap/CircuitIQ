import { Metadata } from "next"
import { MarketingHeader } from "@/components/landing/marketing-header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, XCircle, Clock, Server, Database, Brain, Globe } from "lucide-react"

export const metadata: Metadata = {
    title: "System Status | CircuitIQ",
    description: "Check the operational status of all CircuitIQ services",
}

const SERVICES = [
    {
        name: "Web Application",
        description: "Main CircuitIQ web application",
        icon: Globe,
        status: "operational",
        uptime: "99.98%"
    },
    {
        name: "API Services",
        description: "REST API and authentication services",
        icon: Server,
        status: "operational",
        uptime: "99.95%"
    },
    {
        name: "AI Processing",
        description: "Diagram analysis and diagnostic AI",
        icon: Brain,
        status: "operational",
        uptime: "99.90%"
    },
    {
        name: "Database",
        description: "Primary data storage systems",
        icon: Database,
        status: "operational",
        uptime: "99.99%"
    }
]

const INCIDENTS = [
    {
        date: "December 20, 2024",
        title: "Scheduled Maintenance Complete",
        description: "Database optimization and security updates applied successfully. No service disruption occurred.",
        status: "resolved",
        duration: "0 minutes downtime"
    },
    {
        date: "December 15, 2024",
        title: "AI Processing Delays",
        description: "Some users experienced slower than normal AI analysis times due to high demand. Additional capacity was added.",
        status: "resolved",
        duration: "32 minutes affected"
    },
    {
        date: "December 1, 2024",
        title: "Infrastructure Upgrade",
        description: "Migrated to new cloud infrastructure for improved performance and reliability.",
        status: "resolved",
        duration: "15 minutes downtime"
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case "operational":
            return { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: CheckCircle }
        case "degraded":
            return { bg: "bg-amber-500/10", text: "text-amber-400", icon: AlertTriangle }
        case "outage":
            return { bg: "bg-red-500/10", text: "text-red-400", icon: XCircle }
        default:
            return { bg: "bg-slate-500/10", text: "text-slate-400", icon: Clock }
    }
}

export default function StatusPage() {
    const allOperational = SERVICES.every(s => s.status === "operational")

    return (
        <div className="dark bg-slate-950 min-h-screen">
            <MarketingHeader />
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            System Status
                        </h1>
                        <p className="text-slate-300 text-lg">
                            Current operational status of all CircuitIQ services
                        </p>
                    </div>

                    {/* Overall Status */}
                    <Card className={`border-slate-700/50 ${allOperational ? 'bg-emerald-500/10' : 'bg-amber-500/10'} backdrop-blur-sm mb-8`}>
                        <CardContent className="p-8 text-center">
                            {allOperational ? (
                                <>
                                    <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">All Systems Operational</h2>
                                    <p className="text-slate-300">All CircuitIQ services are running normally</p>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Partial Service Disruption</h2>
                                    <p className="text-slate-300">Some services are experiencing issues</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Services */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Service Status</h2>
                            <div className="space-y-4">
                                {SERVICES.map((service) => {
                                    const Icon = service.icon
                                    const statusStyle = getStatusColor(service.status)
                                    const StatusIcon = statusStyle.icon

                                    return (
                                        <div
                                            key={service.name}
                                            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-slate-700/50">
                                                    <Icon className="h-5 w-5 text-slate-300" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{service.name}</h3>
                                                    <p className="text-sm text-slate-400">{service.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-slate-400">{service.uptime} uptime</span>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusStyle.bg}`}>
                                                    <StatusIcon className={`h-4 w-4 ${statusStyle.text}`} />
                                                    <span className={`text-sm font-medium capitalize ${statusStyle.text}`}>
                                                        {service.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Incidents */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-white mb-6">Recent Incidents</h2>
                            <div className="space-y-6">
                                {INCIDENTS.map((incident, index) => (
                                    <div key={index} className="border-l-2 border-slate-700 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-slate-500">{incident.date}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                                                {incident.status}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-white mb-1">{incident.title}</h3>
                                        <p className="text-sm text-slate-400 mb-1">{incident.description}</p>
                                        <p className="text-xs text-slate-500">{incident.duration}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subscribe */}
                    <Card className="border-slate-700/50 bg-slate-900/60 backdrop-blur-sm mt-8">
                        <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                            <h3 className="font-semibold text-white mb-2">Get Status Updates</h3>
                            <p className="text-sm text-slate-400">
                                Subscribe to receive notifications about service incidents and maintenance
                            </p>
                            <p className="text-amber-400 font-medium mt-2">status@circuitiq.com</p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    )
}
