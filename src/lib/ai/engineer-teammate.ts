import { openai } from "./openai"

/**
 * This is the brain of your AI teammate - it thinks, reasons, and collaborates
 * exactly like a real experienced engineer would
 */
export class EngineerTeammate {
    private sessionId: string
    private conversationMemory: ConversationMemory
    private diagnosticState: DiagnosticState
    private personality: EngineerPersonality

    constructor(sessionId: string, vehicleInfo: VehicleInfo) {
        this.sessionId = sessionId
        this.conversationMemory = new ConversationMemory()
        this.diagnosticState = new DiagnosticState(vehicleInfo)
        this.personality = new EngineerPersonality("experienced") // experienced, methodical, encouraging
    }

    /**
     * Main communication method - this is where the magic happens
     * The AI responds like a real engineer, not like a chatbot
     */
    async communicate(userMessage: string): Promise<TeammateResponse> {
        // Add to memory
        this.conversationMemory.addUserMessage(userMessage)

        // Analyze what the user said
        const analysis = await this.analyzeUserMessage(userMessage)

        // Update our understanding of the problem
        this.diagnosticState.update(analysis)

        // Think about the situation (like a real engineer would)
        const thought = await this.thinkAboutSituation()

        // Decide what to say/ask next
        const response = await this.formulateResponse(thought, analysis)

        // Add to memory
        this.conversationMemory.addAssistantMessage(response.message)

        return response
    }

    /**
     * Analyze what the user said - extract measurements, observations, answers
     */
    private async analyzeUserMessage(message: string): Promise<MessageAnalysis> {
        const prompt = `You are analyzing what a technician just said during troubleshooting.
Extract key information:

Technician said: "${message}"

Current context:
- Vehicle: ${this.diagnosticState.vehicle.make} ${this.diagnosticState.vehicle.model}
- System: ${this.diagnosticState.currentSystem}
- Problem: ${this.diagnosticState.mainSymptom}
- What we've tested: ${this.diagnosticState.testedComponents.map(c => c.name).join(", ")}
- Last thing we asked them: ${this.conversationMemory.getLastAssistantMessage()}

Analyze and extract in JSON:
{
  "measurements": [
    {"type": "voltage", "value": 27.8, "location": "Pin 30", "unit": "V"}
  ],
  "observations": [
    {"type": "sound|visual|behavior", "description": "hearing pump run"}
  ],
  "answers": {
    "answeringPreviousQuestion": true,
    "answer": "yes" | "no" | "description"
  },
  "newSymptoms": ["any new problems mentioned"],
  "questionsFromTech": ["any questions they're asking"],
  "emotionalState": "frustrated|confused|confident|neutral",
  "needsClarification": false,
  "implicitRequests": ["they might be asking for help with something"]
}`

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: message },
                ],
                temperature: 0.3,
            })

            const content = response.choices[0].message.content || "{}"
            return JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "").trim())
        } catch (error) {
            console.error("Error analyzing message:", error)
            return { measurements: [], observations: [], answers: undefined, newSymptoms: [], questionsFromTech: [] }
        }
    }

    /**
     * Think about the current situation - like a real engineer would
     */
    private async thinkAboutSituation(): Promise<EngineerThought> {
        // Get recent conversation
        const recentConversation = this.conversationMemory.getRecent(10)

        const prompt = `You are an experienced avionics/automotive engineer thinking through a problem.
Based on everything you know, think through the situation step by step.

CURRENT SITUATION:
Vehicle: ${this.diagnosticState.vehicle.make} ${this.diagnosticState.vehicle.model}
System: ${this.diagnosticState.currentSystem}
Main Problem: ${this.diagnosticState.mainSymptom}

WHAT WE KNOW:
${this.diagnosticState.knownFacts.map(f => `- ${f}`).join("\n")}

WHAT WE'VE TESTED:
${this.diagnosticState.testedComponents.map(c => `- ${c.name}: ${c.result}`).join("\n")}

MEASUREMENTS TAKEN:
${this.diagnosticState.measurements.map(m => `- ${m.location}: ${m.value}${m.unit} (expected: ${m.expected})`).join("\n")}

RECENT CONVERSATION:
${recentConversation.map(m => `${m.role}: ${m.content}`).join("\n")}

Now think through this like a real engineer would:
{
  "currentHypothesis": "What I think is causing this",
  "confidence": 0-100,
  "reasoning": "Why I think this, connecting the dots",
  "alternativeTheories": ["Other possibilities"],
  "whatWeStillDontKnow": ["Gaps in our knowledge"],
  "nextLogicalStep": "What makes sense to test/check next",
  "safetyConsiderations": ["Any safety concerns"],
  "estimatedTimeToFix": "Quick estimate if we find the problem",
  "myThinkingOutLoud": "How I would explain my thought process to the tech"
}`

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: `You are an experienced engineer with 20+ years troubleshooting complex electrical systems.
Think systematically, consider multiple possibilities, but have opinions based on experience.
Be honest about uncertainty. Think out loud like you would with a teammate.`,
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7, // Higher for more natural thinking
            })

            const content = response.choices[0].message.content || "{}"
            return JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "").trim())
        } catch (error) {
            console.error("Error thinking:", error)
            return {
                currentHypothesis: "Need more information",
                confidence: 50,
                reasoning: "Still gathering data",
                nextLogicalStep: "Continue testing",
            }
        }
    }

    /**
     * Formulate response - this is where we become a real teammate
     */
    private async formulateResponse(
        thought: EngineerThought,
        analysis: MessageAnalysis
    ): Promise<TeammateResponse> {
        const prompt = `You are a real engineer working alongside a technician. You're both troubleshooting together.

YOUR PERSONALITY:
- Friendly, conversational, like talking to a coworker
- You think out loud: "Hmm, interesting..." "That tells me..." "Wait a minute..."
- You ask clarifying questions instead of making assumptions
- You explain your reasoning: "I'm thinking X because of Y"
- You acknowledge good observations: "Good catch!" "Exactly"
- You're collaborative: "Let's try..." "What if we..." "Between you and me..."
- You use industry jargon naturally but explain if needed
- You show genuine interest in solving the problem together

CURRENT THOUGHT PROCESS:
${thought.myThinkingOutLoud}

Current hypothesis: ${thought.currentHypothesis} (${thought.confidence}% confident)
Next logical step: ${thought.nextLogicalStep}

WHAT TECH JUST SAID:
${this.conversationMemory.getLastUserMessage()}

WHAT THEY'RE TELLING US:
Measurements: ${JSON.stringify(analysis.measurements)}
Observations: ${JSON.stringify(analysis.observations)}
Their emotional state: ${analysis.emotionalState}
Questions they have: ${JSON.stringify(analysis.questionsFromTech)}

HOW TO RESPOND (like a real teammate would):

1. Acknowledge what they just told you
   - If measurement: "Okay, so you're seeing [value]..."
   - If observation: "Interesting that you're hearing..."
   - If question: "Good question. Let me think..."

2. Share your thinking
   - "Here's what I'm thinking..."
   - "That tells me..."
   - "Based on that, I'm leaning towards..."

3. Ask follow-up questions OR guide next step
   - If you need more info: Ask specific questions
   - If you know next step: Explain why and guide them through it
   - If they seem stuck: Offer encouragement and alternative approach

4. Be conversational
   - Use contractions: "it's" not "it is"
   - Use casual phrases: "Alright", "Okay", "Got it"
   - Show personality: "Man, that's weird", "Aha!", "Hmm"

Respond in JSON:
{
  "message": "Your conversational response (2-4 sentences, natural)",
  "tone": "encouraging|thoughtful|concerned|excited",
  "actionType": "asking_question|guiding_test|sharing_insight|clarifying",
  "specificQuestion": "If asking, what specifically?",
  "testProcedure": {
    "action": "What to test",
    "tool": "What tool to use",
    "location": "Specific location",
    "expectedResult": "What they should see",
    "safety": "Any precautions"
  },
  "highlightComponents": ["component names to highlight on diagram"],
  "updateProgress": {
    "whatWeJustLearned": "New information from their input",
    "confidenceChange": "+10|-15|0",
    "nextStepPreview": "Brief preview of what comes after this"
  },
  "quickSuggestions": ["Quick response option 1", "Option 2", "Option 3"]
}`

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: `You are an experienced engineer working as a teammate, not a chatbot.
Talk naturally, think out loud, ask questions, show personality.
You're standing next to them, helping them troubleshoot in real-time.`,
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.8, // Even higher for natural conversation
                max_tokens: 500,
            })

            const content = response.choices[0].message.content || "{}"
            const parsed = JSON.parse(content.replace(/```json\n?/g, "").replace(/```/g, "").trim())

            return {
                message: parsed.message,
                tone: parsed.tone,
                diagnosticData: {
                    currentHypothesis: thought.currentHypothesis,
                    confidence: thought.confidence,
                    reasoning: thought.reasoning,
                    alternativeTheories: thought.alternativeTheories,
                },
                testProcedure: parsed.testProcedure,
                highlightComponents: parsed.highlightComponents,
                progressUpdate: parsed.updateProgress,
                quickSuggestions: parsed.quickSuggestions,
                timestamp: new Date().toISOString(),
            }
        } catch (error) {
            console.error("Error formulating response:", error)
            return {
                message: "Let me think about that for a second. Can you tell me more about what you're seeing?",
                tone: "thoughtful",
                timestamp: new Date().toISOString(),
            }
        }
    }

    /**
     * Handle when tech shares a photo
     */
    async lookAtPhoto(imageUrl: string, techComment?: string): Promise<TeammateResponse> {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o", // Updated to latest vision model
                messages: [
                    {
                        role: "system",
                        content: `You're an expert wiring diagram analyst helping troubleshoot electrical systems.
When looking at a wiring diagram, you should:
- Identify all visible components (relays, switches, connectors, fuses, etc.)
- Read wire labels and gauge sizes
- Trace circuit paths and connections
- Identify ground points and power sources
- Point out any visible issues or concerns
- Explain the circuit flow in simple terms
- Relate what you see to potential failures

Be specific and technical but conversational. Reference actual component names and wire numbers you see.`,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `We're troubleshooting: ${this.diagnosticState.mainSymptom || "this electrical system"}
${techComment ? `Tech says: "${techComment}"` : "Please analyze this wiring diagram in detail."}

Look at this diagram and tell me:
1. What major components do you see?
2. What is the main circuit flow?
3. What could cause failures in this system?
4. Any specific areas of concern?`,
                            },
                            {
                                type: "image_url",
                                image_url: { url: imageUrl },
                            },
                        ],
                    },
                ],
                max_tokens: 500,
            })

            const message = response.choices[0].message.content || "I see the photo. Can you zoom in?"

            return {
                message,
                tone: "observant",
                timestamp: new Date().toISOString(),
            }
        } catch (error) {
            console.error("Vision API Error:", error)
            console.error("Image URL attempted:", imageUrl)
            return {
                message: `Having trouble loading that photo. Can you describe what you're seeing?`,
                tone: "helpful",
                timestamp: new Date().toISOString(),
            }
        }
    }

    /**
     * Handle when tech asks "why?" or wants explanation
     */
    async explainWhy(whatToExplain: string): Promise<TeammateResponse> {
        const prompt = `The tech wants to understand WHY something is the case.

Context: ${this.diagnosticState.mainSymptom}
They're asking about: ${whatToExplain}

Explain like you're teaching a teammate - clear, practical, with examples.
Use analogies if helpful. Keep it conversational.`

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: "You're explaining technical concepts to a teammate. Be clear, practical, use analogies.",
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.7,
            })

            return {
                message: response.choices[0].message.content || "Let me explain...",
                tone: "educational",
                timestamp: new Date().toISOString(),
            }
        } catch {
            return {
                message: "Good question. Let me think about how to explain this clearly...",
                tone: "thoughtful",
                timestamp: new Date().toISOString(),
            }
        }
    }

    /**
     * Handle when things aren't working as expected
     */
    async reassessStrategy(): Promise<TeammateResponse> {
        const message = `Hmm, that's not what I expected. Let me reconsider our approach here. 
Based on what we're seeing, maybe we should take a step back and look at this from a different angle. 
What if we...`

        // Reconsider hypothesis
        this.diagnosticState.confidence -= 20

        return {
            message,
            tone: "reconsideering",
            diagnosticData: {
                currentHypothesis: "Reconsidering our approach",
                confidence: this.diagnosticState.confidence,
            },
            timestamp: new Date().toISOString(),
        }
    }
}

// ============================================
// Supporting Classes
// ============================================

class ConversationMemory {
    private messages: Array<{ role: string; content: string; timestamp: string }> = []

    addUserMessage(content: string) {
        this.messages.push({
            role: "user",
            content,
            timestamp: new Date().toISOString(),
        })
    }

    addAssistantMessage(content: string) {
        this.messages.push({
            role: "assistant",
            content,
            timestamp: new Date().toISOString(),
        })
    }

    getRecent(count: number) {
        return this.messages.slice(-count)
    }

    getLastUserMessage(): string {
        const userMessages = this.messages.filter(m => m.role === "user")
        return userMessages[userMessages.length - 1]?.content || ""
    }

    getLastAssistantMessage(): string {
        const assistantMessages = this.messages.filter(m => m.role === "assistant")
        return assistantMessages[assistantMessages.length - 1]?.content || ""
    }
}

class DiagnosticState {
    vehicle: VehicleInfo
    currentSystem: string = ""
    mainSymptom: string = ""
    knownFacts: string[] = []
    testedComponents: Array<{ name: string; result: string }> = []
    measurements: Array<{ location: string; value: number; unit: string; expected: string }> = []
    confidence: number = 50

    constructor(vehicle: VehicleInfo) {
        this.vehicle = vehicle
    }

    update(analysis: MessageAnalysis) {
        // Add new measurements
        if (analysis.measurements) {
            this.measurements.push(...analysis.measurements.map(m => ({
                location: m.location,
                value: m.value,
                unit: m.unit,
                expected: "TBD" // Would be looked up from specs
            })))
        }

        // Add new observations as facts
        if (analysis.observations) {
            this.knownFacts.push(...analysis.observations.map(o => o.description))
        }

        // Add new symptoms
        if (analysis.newSymptoms) {
            this.knownFacts.push(...analysis.newSymptoms)
        }
    }
}

class EngineerPersonality {
    style: "experienced" | "methodical" | "encouraging"

    constructor(style: "experienced" | "methodical" | "encouraging") {
        this.style = style
    }

    getPhrases(): string[] {
        const phrases = {
            experienced: [
                "In my experience...",
                "I've seen this before...",
                "Nine times out of ten...",
                "Here's a trick I learned...",
            ],
            methodical: [
                "Let's be systematic about this...",
                "First things first...",
                "We need to eliminate possibilities...",
                "Let's document what we know...",
            ],
            encouraging: [
                "You're doing great!",
                "Good thinking!",
                "We're making progress!",
                "Don't worry, we'll figure this out...",
            ],
        }
        return phrases[this.style]
    }
}

// ============================================
// Type Definitions
// ============================================

interface VehicleInfo {
    make: string
    model: string
    year?: number
    type: "aircraft" | "automotive" | "marine"
}

interface MessageAnalysis {
    measurements?: Array<{
        type: string
        value: number
        location: string
        unit: string
    }>
    observations?: Array<{
        type: string
        description: string
    }>
    answers?: {
        answeringPreviousQuestion: boolean
        answer: string
    }
    newSymptoms?: string[]
    questionsFromTech?: string[]
    emotionalState?: string
    needsClarification?: boolean
    implicitRequests?: string[]
}

interface EngineerThought {
    currentHypothesis: string
    confidence: number
    reasoning: string
    alternativeTheories?: string[]
    whatWeStillDontKnow?: string[]
    nextLogicalStep: string
    safetyConsiderations?: string[]
    estimatedTimeToFix?: string
    myThinkingOutLoud?: string
}

interface TeammateResponse {
    message: string
    tone: "encouraging" | "thoughtful" | "concerned" | "excited" | "observant" | "educational" | "reconsideering" | "helpful" | "friendly" | "apologetic"
    actionType?: "asking_question" | "guiding_test" | "sharing_insight" | "clarifying"
    diagnosticData?: {
        currentHypothesis: string
        confidence: number
        reasoning?: string
        alternativeTheories?: string[]
    }
    testProcedure?: {
        action: string
        tool: string
        location: string
        expectedResult: string
        safety: string
    }
    highlightComponents?: string[]
    progressUpdate?: {
        whatWeJustLearned: string
        confidenceChange: string
        nextStepPreview: string
    }
    quickSuggestions?: string[]
    timestamp: string
}
