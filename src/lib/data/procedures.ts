// Comprehensive Procedures Database for CircuitIQ
// Organized by ATA chapters (Aviation), Systems (Automotive), and Marine Systems

export interface ProcedureStep {
    stepNumber: number
    title: string
    description: string
    caution?: string
    note?: string
    expectedResult?: string
}

export interface Procedure {
    id: string
    title: string
    category: "aircraft" | "automotive" | "marine" | "electric"
    ataChapter?: string // For aircraft only
    system: string
    difficulty: "beginner" | "intermediate" | "advanced"
    duration: string
    description: string
    caution?: string
    prerequisites?: string[]
    tools?: string[]
    steps: ProcedureStep[]
    troubleshooting?: string[]
}

// ============================================
// AVIATION PROCEDURES - BY ATA CHAPTER
// ============================================

export const AVIATION_PROCEDURES: Procedure[] = [
    // ATA 21 - Air Conditioning
    {
        id: "ata21-pack-operation",
        title: "Air Conditioning Pack Operation",
        category: "aircraft",
        ataChapter: "21",
        system: "Air Conditioning",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Procedure for operating aircraft air conditioning packs including startup and shutdown",
        prerequisites: ["APU or Engine bleed air available", "Electrical power on"],
        tools: ["None required"],
        steps: [
            { stepNumber: 1, title: "Verify Bleed Air Source", description: "Confirm APU bleed or engine bleed is available and selected", expectedResult: "Bleed air pressure normal" },
            { stepNumber: 2, title: "Select Pack", description: "Set PACK selector to AUTO or ON position", expectedResult: "Pack valve opens" },
            { stepNumber: 3, title: "Monitor Temperature", description: "Check zone temperature controllers are set to desired values", expectedResult: "Temperature stabilizes" },
            { stepNumber: 4, title: "Verify Flow", description: "Check pack flow indication is normal", expectedResult: "Normal flow indication" },
            { stepNumber: 5, title: "Check for Faults", description: "Verify no PACK FAULT or ZONE TEMP warnings", expectedResult: "No warnings present" },
        ],
        troubleshooting: ["Pack valve stuck - check bleed air pressure", "Over temperature - reduce flow or check sensors"]
    },

    // ATA 22 - Auto Flight
    {
        id: "ata22-autopilot-engage",
        title: "Autopilot Engagement Procedure",
        category: "aircraft",
        ataChapter: "22",
        system: "Auto Flight",
        difficulty: "intermediate",
        duration: "5 min",
        description: "Standard procedure for engaging and verifying autopilot operation",
        prerequisites: ["Aircraft in stable flight", "Minimum altitude requirements met"],
        steps: [
            { stepNumber: 1, title: "Verify Flight Director", description: "Ensure flight director is ON and displaying correct mode", expectedResult: "FD bars visible on PFD" },
            { stepNumber: 2, title: "Set Desired Mode", description: "Select appropriate autopilot mode (HDG, NAV, APP, etc.)", expectedResult: "Mode annunciated on FMA" },
            { stepNumber: 3, title: "Press AP Engage", description: "Press autopilot engage button on MCP/FCU", expectedResult: "AP engaged, annunciator lit" },
            { stepNumber: 4, title: "Verify Engagement", description: "Check autopilot status on FMA and PFD", expectedResult: "AP shows engaged in green" },
            { stepNumber: 5, title: "Monitor Aircraft Response", description: "Verify aircraft follows commanded path", expectedResult: "Smooth tracking of selected mode" },
        ],
        troubleshooting: ["AP won't engage - check servo power", "Oscillations - verify trim status"]
    },

    // ATA 23 - Communications
    {
        id: "ata23-vhf-radio-operation",
        title: "VHF Radio Operation",
        category: "aircraft",
        ataChapter: "23",
        system: "Communications",
        difficulty: "beginner",
        duration: "5 min",
        description: "Operating VHF communication radios for normal operations",
        steps: [
            { stepNumber: 1, title: "Select Radio", description: "Select VHF 1, 2, or 3 on audio control panel", expectedResult: "Radio selected indicator lit" },
            { stepNumber: 2, title: "Set Frequency", description: "Enter frequency on radio management panel", expectedResult: "Frequency displayed" },
            { stepNumber: 3, title: "Adjust Volume", description: "Set volume to audible level", expectedResult: "Can hear radio calls" },
            { stepNumber: 4, title: "Test Transmission", description: "Key mic and verify TX indication", expectedResult: "TX light illuminates" },
            { stepNumber: 5, title: "Verify Reception", description: "Listen for incoming transmissions", expectedResult: "Clear audio reception" },
        ],
        troubleshooting: ["No transmit - check PTT switch and busses", "No receive - check squelch setting"]
    },

    // ATA 24 - Electrical Power
    {
        id: "ata24-external-power-connection",
        title: "External Power Connection",
        category: "aircraft",
        ataChapter: "24",
        system: "Electrical Power",
        difficulty: "beginner",
        duration: "8 min",
        description: "Connecting and verifying external ground power to aircraft",
        prerequisites: ["Aircraft parked", "Ground power unit available"],
        steps: [
            { stepNumber: 1, title: "Verify GPU Ready", description: "Check GPU voltage and frequency are within limits", expectedResult: "Voltage 115V ±5%, 400Hz ±5%" },
            { stepNumber: 2, title: "Connect Power Cable", description: "Connect GPU cable to aircraft receptacle", expectedResult: "Cable securely connected" },
            { stepNumber: 3, title: "Check EXT PWR Available", description: "Verify AVAIL light on external power panel", expectedResult: "AVAIL light illuminated" },
            { stepNumber: 4, title: "Select External Power", description: "Press EXT PWR pushbutton", expectedResult: "ON light illuminates" },
            { stepNumber: 5, title: "Verify Power Transfer", description: "Check electrical buses are powered", expectedResult: "All bus powered indications normal" },
        ],
        troubleshooting: ["AVAIL not lit - check GPU output", "Power not transferring - verify GCB status"]
    },

    {
        id: "ata24-battery-start",
        title: "Battery Power-Up Sequence",
        category: "aircraft",
        ataChapter: "24",
        system: "Electrical Power",
        difficulty: "beginner",
        duration: "5 min",
        description: "Energizing aircraft electrical system from battery only",
        steps: [
            { stepNumber: 1, title: "Battery Switch ON", description: "Position battery master switch to ON", expectedResult: "Hot battery bus powered" },
            { stepNumber: 2, title: "Verify Voltage", description: "Check battery voltage on ELEC page", expectedResult: "Voltage above 24V DC" },
            { stepNumber: 3, title: "Essential Buses", description: "Verify essential buses powered", expectedResult: "Essential equipment operational" },
            { stepNumber: 4, title: "Monitor Load", description: "Check battery discharge rate", expectedResult: "Normal discharge indication" },
        ],
        troubleshooting: ["Low voltage warning - check battery condition", "High discharge - reduce electrical load"]
    },

    // ATA 26 - Fire Protection
    {
        id: "ata26-fire-detection-test",
        title: "Fire Detection System Test",
        category: "aircraft",
        ataChapter: "26",
        system: "Fire Protection",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Testing engine and APU fire detection loops",
        prerequisites: ["Engines shut down", "APU shut down"],
        steps: [
            { stepNumber: 1, title: "Access Test Panel", description: "Locate fire detection test switch", expectedResult: "Panel accessible" },
            { stepNumber: 2, title: "Test Loop A", description: "Select LOOP A test position", expectedResult: "Fire warning activates" },
            { stepNumber: 3, title: "Verify Indications", description: "Check master warning, aural, and visual indications", expectedResult: "All warnings active" },
            { stepNumber: 4, title: "Test Loop B", description: "Select LOOP B test position", expectedResult: "Fire warning activates" },
            { stepNumber: 5, title: "Reset System", description: "Return switch to normal and reset warnings", expectedResult: "All warnings clear" },
        ],
        troubleshooting: ["Loop not testing - check detector continuity", "False alarms - check for contamination"]
    },

    // ATA 27 - Flight Controls
    {
        id: "ata27-flight-control-check",
        title: "Flight Control System Check",
        category: "aircraft",
        ataChapter: "27",
        system: "Flight Controls",
        difficulty: "intermediate",
        duration: "15 min",
        description: "Pre-flight check of flight control surfaces and systems",
        steps: [
            { stepNumber: 1, title: "Hydraulic Power", description: "Verify hydraulic systems pressurized", expectedResult: "Pressure normal on all systems" },
            { stepNumber: 2, title: "Control Column Free", description: "Move control column full travel", expectedResult: "Smooth movement, no binding" },
            { stepNumber: 3, title: "Aileron Check", description: "Verify aileron movement corresponds to wheel input", expectedResult: "Correct response direction" },
            { stepNumber: 4, title: "Elevator Check", description: "Verify elevator responds to column movement", expectedResult: "Correct response direction" },
            { stepNumber: 5, title: "Rudder Pedals", description: "Check rudder pedal travel and response", expectedResult: "Full travel both directions" },
            { stepNumber: 6, title: "Trim Systems", description: "Test pitch, roll, and yaw trim operation", expectedResult: "Trim moves and indicates correctly" },
        ],
        troubleshooting: ["Stiff controls - check PCU pressure", "No response - verify hydraulic power"]
    },

    // ATA 28 - Fuel
    {
        id: "ata28-fuel-transfer",
        title: "Fuel Transfer Procedure",
        category: "aircraft",
        ataChapter: "28",
        system: "Fuel",
        difficulty: "advanced",
        duration: "20 min",
        description: "Manual fuel transfer between tanks for CG management",
        prerequisites: ["Aircraft level", "Fuel quantity known"],
        caution: "Monitor CG limits during transfer",
        steps: [
            { stepNumber: 1, title: "Calculate Required Transfer", description: "Determine quantity and direction of transfer needed", expectedResult: "Transfer quantity calculated" },
            { stepNumber: 2, title: "Open Transfer Valves", description: "Select appropriate transfer valves", expectedResult: "Valve positions confirmed" },
            { stepNumber: 3, title: "Activate Transfer Pumps", description: "Turn on fuel transfer pumps", expectedResult: "Pump running indication" },
            { stepNumber: 4, title: "Monitor Quantity", description: "Watch fuel quantity indicators during transfer", expectedResult: "Fuel levels changing correctly" },
            { stepNumber: 5, title: "Stop Transfer", description: "Deactivate pumps when desired quantity reached", expectedResult: "Transfer complete, CG in limits" },
        ],
        troubleshooting: ["Pump won't start - check circuit breakers", "Slow transfer - check valve positions"]
    },

    // ATA 29 - Hydraulic Power
    {
        id: "ata29-hydraulic-system-check",
        title: "Hydraulic System Ground Check",
        category: "aircraft",
        ataChapter: "29",
        system: "Hydraulic Power",
        difficulty: "intermediate",
        duration: "15 min",
        description: "Verifying hydraulic system operation on ground",
        prerequisites: ["Ground power connected", "Wheel chocks installed"],
        steps: [
            { stepNumber: 1, title: "Check Fluid Level", description: "Verify reservoir quantity on ECAM/indicators", expectedResult: "Quantity in normal range" },
            { stepNumber: 2, title: "Activate Electric Pumps", description: "Turn on electric hydraulic pumps", expectedResult: "Pumps running, pressure building" },
            { stepNumber: 3, title: "Verify System Pressure", description: "Check pressure on HYD page", expectedResult: "3000 psi ± tolerance" },
            { stepNumber: 4, title: "Cycle Consumers", description: "Operate flight controls, gear (if applicable)", expectedResult: "Systems respond normally" },
            { stepNumber: 5, title: "Check for Leaks", description: "Monitor quantity for abnormal decrease", expectedResult: "Quantity stable" },
        ],
        troubleshooting: ["Low pressure - check pump operation", "Quantity decreasing - inspect for leaks"]
    },

    // ATA 30 - Ice and Rain Protection
    {
        id: "ata30-anti-ice-operation",
        title: "Anti-Ice System Operation",
        category: "aircraft",
        ataChapter: "30",
        system: "Ice and Rain Protection",
        difficulty: "intermediate",
        duration: "5 min",
        description: "Activating engine and wing anti-ice systems",
        steps: [
            { stepNumber: 1, title: "Assess Icing Conditions", description: "Check OAT and visible moisture", expectedResult: "Icing conditions identified" },
            { stepNumber: 2, title: "Engine Anti-Ice ON", description: "Select engine anti-ice switches ON", note: "Use before entering icing", expectedResult: "Valve open indications" },
            { stepNumber: 3, title: "Wing Anti-Ice ON", description: "Select wing anti-ice if required", caution: "Monitor bleed air capacity", expectedResult: "Wing anti-ice operating" },
            { stepNumber: 4, title: "Monitor Performance", description: "Check bleed air parameters", expectedResult: "Parameters normal" },
            { stepNumber: 5, title: "Deactivate When Clear", description: "Turn off when exiting icing conditions", expectedResult: "Anti-ice OFF, normal operations" },
        ],
        troubleshooting: ["Valve stuck - check ducting", "Overtemperature - reduce power setting"]
    },

    // ATA 31 - Instruments
    {
        id: "ata31-adiru-alignment",
        title: "ADIRU Alignment Procedure",
        category: "aircraft",
        ataChapter: "31",
        system: "Instruments",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Aligning inertial reference units for navigation",
        steps: [
            { stepNumber: 1, title: "Verify Position Entry", description: "Confirm aircraft position entered in FMS", expectedResult: "Position matches ramp location" },
            { stepNumber: 2, title: "Select NAV Mode", description: "Set ADIRU mode selector to NAV", expectedResult: "Alignment begins" },
            { stepNumber: 3, title: "Wait for Alignment", description: "Allow alignment to complete (7-10 minutes)", note: "Aircraft must remain stationary", expectedResult: "ALIGN light extinguishes" },
            { stepNumber: 4, title: "Verify Alignment", description: "Check IRS position matches entered position", expectedResult: "Position agrees within limits" },
            { stepNumber: 5, title: "Check Attitude", description: "Verify attitude indications are correct", expectedResult: "Wings level, pitch zero on ground" },
        ],
        troubleshooting: ["Alignment fails - check position accuracy", "Excessive drift - verify gyro operation"]
    },

    // ATA 32 - Landing Gear
    {
        id: "ata32-gear-operation",
        title: "Landing Gear Normal Operation",
        category: "aircraft",
        ataChapter: "32",
        system: "Landing Gear",
        difficulty: "beginner",
        duration: "5 min",
        description: "Normal landing gear extension and retraction",
        steps: [
            { stepNumber: 1, title: "Verify Hydraulics", description: "Check hydraulic pressure available", expectedResult: "Normal system pressure" },
            { stepNumber: 2, title: "Gear Lever UP", description: "Move landing gear lever to UP position", expectedResult: "Gear retracting" },
            { stepNumber: 3, title: "Verify Retraction", description: "Confirm three green lights extinguish, gear doors close", expectedResult: "Gear up and locked" },
            { stepNumber: 4, title: "Gear Lever DOWN", description: "For extension, move lever to DOWN", expectedResult: "Gear extending" },
            { stepNumber: 5, title: "Verify Extension", description: "Confirm three green lights illuminate", expectedResult: "Gear down and locked" },
        ],
        troubleshooting: ["Gear unsafe - check alternate extension", "Hydraulic failure - use gravity extension"]
    },

    // ATA 33 - Lights
    {
        id: "ata33-exterior-lighting-check",
        title: "Exterior Lighting Check",
        category: "aircraft",
        ataChapter: "33",
        system: "Lights",
        difficulty: "beginner",
        duration: "10 min",
        description: "Pre-flight verification of all exterior lights",
        steps: [
            { stepNumber: 1, title: "Navigation Lights", description: "Turn on NAV lights, verify red/green/white", expectedResult: "All NAV lights illuminated" },
            { stepNumber: 2, title: "Beacon", description: "Activate anti-collision beacon", expectedResult: "Beacon flashing" },
            { stepNumber: 3, title: "Strobe Lights", description: "Turn on strobe lights", expectedResult: "High-intensity strobes active" },
            { stepNumber: 4, title: "Landing Lights", description: "Extend and test landing lights", expectedResult: "Landing lights bright" },
            { stepNumber: 5, title: "Taxi/Runway Turnoff", description: "Test taxi and turnoff lights", expectedResult: "Lights operational" },
            { stepNumber: 6, title: "Logo Lights", description: "Check logo/tail lights if equipped", expectedResult: "Logo visible" },
        ],
        troubleshooting: ["Light not working - check bulb/LED and circuit breaker"]
    },

    // ATA 34 - Navigation
    {
        id: "ata34-fms-initialization",
        title: "FMS Initialization",
        category: "aircraft",
        ataChapter: "34",
        system: "Navigation",
        difficulty: "intermediate",
        duration: "15 min",
        description: "Initializing Flight Management System for departure",
        steps: [
            { stepNumber: 1, title: "Enter Position", description: "Input current gate/ramp position", expectedResult: "Position accepted" },
            { stepNumber: 2, title: "Select Database", description: "Verify navigation database is current", expectedResult: "Current AIRAC cycle" },
            { stepNumber: 3, title: "Enter Flight Plan", description: "Input or recall flight plan", expectedResult: "Route displayed" },
            { stepNumber: 4, title: "Set Performance Data", description: "Enter weights, fuel, cost index", expectedResult: "Performance calculated" },
            { stepNumber: 5, title: "Verify Route", description: "Check route on ND, verify waypoints", expectedResult: "Route correct and complete" },
        ],
        troubleshooting: ["Route discontinuity - check airways", "Performance error - verify weights"]
    },

    // ATA 35 - Oxygen
    {
        id: "ata35-crew-oxygen-check",
        title: "Crew Oxygen System Check",
        category: "aircraft",
        ataChapter: "35",
        system: "Oxygen",
        difficulty: "beginner",
        duration: "5 min",
        description: "Pre-flight verification of crew oxygen system",
        steps: [
            { stepNumber: 1, title: "Check Pressure", description: "Verify oxygen cylinder pressure", expectedResult: "Pressure above minimum (typically 1800 psi)" },
            { stepNumber: 2, title: "Test Masks", description: "Check quick-donning masks accessible", expectedResult: "Masks properly stowed" },
            { stepNumber: 3, title: "Test Flow", description: "Activate oxygen and check flow", expectedResult: "Flow indicator shows delivery" },
            { stepNumber: 4, title: "Check Diluter", description: "Verify diluter operates", expectedResult: "Normal and 100% positions work" },
            { stepNumber: 5, title: "Mic Check", description: "Test mask microphone", expectedResult: "Clear transmission" },
        ],
        troubleshooting: ["Low pressure - service or replace bottle", "No flow - check regulator"]
    },

    // ATA 36 - Pneumatic
    {
        id: "ata36-bleed-air-operation",
        title: "Engine Bleed Air System Operation",
        category: "aircraft",
        ataChapter: "36",
        system: "Pneumatic",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Operating engine bleed air system for air conditioning and starting",
        steps: [
            { stepNumber: 1, title: "Verify Engine Running", description: "Confirm engine at idle or above", expectedResult: "N2 above minimum for bleed" },
            { stepNumber: 2, title: "Open Bleed Valve", description: "Select engine bleed ON", expectedResult: "Bleed valve open indication" },
            { stepNumber: 3, title: "Check Pressure", description: "Monitor bleed air pressure", expectedResult: "Pressure in normal range" },
            { stepNumber: 4, title: "Check Temperature", description: "Verify bleed temperature acceptable", expectedResult: "Temperature below limits" },
            { stepNumber: 5, title: "Supply Consumers", description: "Verify packs/anti-ice receiving air", expectedResult: "Systems operating normally" },
        ],
        troubleshooting: ["Bleed fault - check precooler", "Low pressure - check HP valve"]
    },

    // ATA 49 - APU
    {
        id: "ata49-apu-start",
        title: "APU Start Procedure",
        category: "aircraft",
        ataChapter: "49",
        system: "Auxiliary Power Unit",
        difficulty: "beginner",
        duration: "5 min",
        description: "Standard procedure for starting the APU on ground",
        prerequisites: ["Battery power available", "Fuel available"],
        steps: [
            { stepNumber: 1, title: "APU Master SW ON", description: "Turn APU master switch to ON position", expectedResult: "APU fuel valve opens, flap opens" },
            { stepNumber: 2, title: "Wait for Flap", description: "Allow inlet flap to fully open", expectedResult: "FLAP OPEN indication" },
            { stepNumber: 3, title: "APU Start", description: "Press APU START pushbutton", expectedResult: "APU starts cranking" },
            { stepNumber: 4, title: "Monitor Start", description: "Watch EGT during start sequence", caution: "Do not exceed EGT limits", expectedResult: "EGT rises then stabilizes" },
            { stepNumber: 5, title: "APU Running", description: "Verify APU reaches normal speed", expectedResult: "100% RPM, AVAIL light on" },
            { stepNumber: 6, title: "APU Bleed/Gen On", description: "Select APU GEN and BLEED as needed", expectedResult: "APU supplying aircraft systems" },
        ],
        troubleshooting: ["No start - check battery voltage", "Hot start - allow cool down, check fuel flow"]
    },

    {
        id: "ata49-apu-shutdown",
        title: "APU Shutdown Procedure",
        category: "aircraft",
        ataChapter: "49",
        system: "Auxiliary Power Unit",
        difficulty: "beginner",
        duration: "3 min",
        description: "Normal shutdown of the APU",
        steps: [
            { stepNumber: 1, title: "Remove Load", description: "Turn off APU bleed and electrical loads", expectedResult: "Loads removed from APU" },
            { stepNumber: 2, title: "APU Master OFF", description: "Turn APU master switch OFF", expectedResult: "APU begins shutdown" },
            { stepNumber: 3, title: "Monitor Cooldown", description: "Allow APU to cool if high load operation", expectedResult: "APU spools down normally" },
            { stepNumber: 4, title: "Verify Shutdown", description: "Confirm APU AVAIL light extinguished", expectedResult: "APU fully shut down" },
        ],
        troubleshooting: ["Won't shut down - use fire switch if emergency"]
    },

    // ATA 52 - Doors
    {
        id: "ata52-door-operation",
        title: "Aircraft Door Operation",
        category: "aircraft",
        ataChapter: "52",
        system: "Doors",
        difficulty: "beginner",
        duration: "5 min",
        description: "Opening and closing main cabin doors with safety checks",
        steps: [
            { stepNumber: 1, title: "Verify Clear Area", description: "Ensure no personnel or equipment in door swing area", expectedResult: "Area clear" },
            { stepNumber: 2, title: "Check Slide Armed", description: "Verify slide is disarmed before opening", caution: "SLIDE ARMED = DO NOT OPEN", expectedResult: "Slide disarmed indication" },
            { stepNumber: 3, title: "Actuate Handle", description: "Rotate door handle to unlock position", expectedResult: "Door unlocked" },
            { stepNumber: 4, title: "Open Door", description: "Push door outward and forward", expectedResult: "Door fully open and secured" },
            { stepNumber: 5, title: "Verify Indication", description: "Check door open indication on cockpit display", expectedResult: "Door shows open on ECAM" },
        ],
        troubleshooting: ["Door stuck - check assist mechanism", "Warning light stays on - check door switches"]
    },

    // ATA 71 - Powerplant
    {
        id: "ata71-engine-start",
        title: "Engine Start Procedure",
        category: "aircraft",
        ataChapter: "71",
        system: "Powerplant",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Starting aircraft engines using normal procedure",
        prerequisites: ["APU running or ground air available", "Fuel on", "Beacon on"],
        steps: [
            { stepNumber: 1, title: "Start Selector", description: "Position engine start selector to GND", expectedResult: "Ignition armed" },
            { stepNumber: 2, title: "Engine Master ON", description: "Turn engine master switch to ON", expectedResult: "Fuel valve opens, N2 starts rotating" },
            { stepNumber: 3, title: "Monitor N2", description: "Watch N2 increase during motoring", expectedResult: "N2 increasing steadily" },
            { stepNumber: 4, title: "Check Light-Off", description: "Observe EGT rise indicating ignition", expectedResult: "EGT begins to rise at 15-20% N2" },
            { stepNumber: 5, title: "Monitor Start", description: "Watch EGT stays within limits", caution: "ABORT if EGT exceeds limits", expectedResult: "Normal start, EGT below limits" },
            { stepNumber: 6, title: "Idle Check", description: "Verify engine stabilizes at idle", expectedResult: "Stable idle, all parameters normal" },
        ],
        troubleshooting: ["Hot start - abort and motoring cool", "Hung start - check starter, bleed pressure"]
    },

    {
        id: "ata71-engine-shutdown",
        title: "Engine Shutdown Procedure",
        category: "aircraft",
        ataChapter: "71",
        system: "Powerplant",
        difficulty: "beginner",
        duration: "5 min",
        description: "Normal engine shutdown after landing",
        steps: [
            { stepNumber: 1, title: "Parking Brake", description: "Set parking brake", expectedResult: "Brake set" },
            { stepNumber: 2, title: "Idle Stabilize", description: "Allow engine to stabilize at idle", expectedResult: "EGT stabilized" },
            { stepNumber: 3, title: "Engine Master OFF", description: "Turn engine master to OFF", expectedResult: "Fuel cutoff, engine spools down" },
            { stepNumber: 4, title: "Monitor Spool Down", description: "Watch N1 and N2 decrease", expectedResult: "Engines spool down normally" },
            { stepNumber: 5, title: "Complete Checklist", description: "Continue with shutdown checklist", expectedResult: "All items complete" },
        ],
        troubleshooting: ["Engine won't shut down - use fire switch to cut fuel"]
    },
]

// ============================================
// AUTOMOTIVE PROCEDURES
// ============================================

export const AUTOMOTIVE_PROCEDURES: Procedure[] = [
    // Engine Management
    {
        id: "auto-ecu-reset",
        title: "ECU Reset Procedure",
        category: "automotive",
        system: "Engine Management",
        difficulty: "beginner",
        duration: "15 min",
        description: "Resetting the Engine Control Unit to clear adaptive memory",
        tools: ["OBD-II scanner (optional)"],
        steps: [
            { stepNumber: 1, title: "Turn Off Engine", description: "Ensure engine is completely off and cooled", expectedResult: "Engine off" },
            { stepNumber: 2, title: "Disconnect Battery", description: "Remove negative battery terminal", caution: "Note radio codes before disconnecting", expectedResult: "Battery disconnected" },
            { stepNumber: 3, title: "Wait Period", description: "Wait 15-30 minutes for capacitors to discharge", expectedResult: "ECU memory cleared" },
            { stepNumber: 4, title: "Reconnect Battery", description: "Reconnect negative terminal, secure connection", expectedResult: "Power restored" },
            { stepNumber: 5, title: "Idle Relearn", description: "Start engine and let idle for 10 minutes without accessories", expectedResult: "Idle stabilizes" },
            { stepNumber: 6, title: "Drive Cycle", description: "Drive vehicle in various conditions to relearn", expectedResult: "ECU relearns parameters" },
        ],
        troubleshooting: ["Check engine light returns - scan for codes", "Rough idle persists - check vacuum leaks"]
    },

    // Charging System
    {
        id: "auto-charging-test",
        title: "Charging System Test",
        category: "automotive",
        system: "Charging System",
        difficulty: "intermediate",
        duration: "20 min",
        description: "Complete electrical test of alternator and charging circuit",
        tools: ["Digital multimeter", "Battery load tester"],
        steps: [
            { stepNumber: 1, title: "Check Battery Voltage", description: "Test battery voltage with engine off", expectedResult: "12.4-12.7V indicates good charge" },
            { stepNumber: 2, title: "Start Engine", description: "Start vehicle and let idle", expectedResult: "Engine running smoothly" },
            { stepNumber: 3, title: "Test Charging Voltage", description: "Measure voltage at battery terminals, engine running", expectedResult: "13.5-14.5V indicates proper charging" },
            { stepNumber: 4, title: "Load Test", description: "Turn on headlights, A/C, and verify voltage", expectedResult: "Voltage should stay above 13.0V" },
            { stepNumber: 5, title: "Rev Test", description: "Increase RPM to 2000 and check voltage", expectedResult: "Voltage increases slightly but stays under 15V" },
            { stepNumber: 6, title: "Check Belt", description: "Inspect alternator belt for wear and tension", expectedResult: "Belt tight, no cracks" },
        ],
        troubleshooting: ["Low voltage - check belt, wiring, or alternator", "Overcharging - test voltage regulator"]
    },

    // Starting System
    {
        id: "auto-starter-test",
        title: "Starter Motor Circuit Test",
        category: "automotive",
        system: "Starting System",
        difficulty: "intermediate",
        duration: "25 min",
        description: "Diagnosing no-start conditions related to starter circuit",
        tools: ["Digital multimeter", "Test light", "Jumper wires"],
        steps: [
            { stepNumber: 1, title: "Battery Check", description: "Verify battery is charged and terminals clean", expectedResult: "12.6V minimum, clean connections" },
            { stepNumber: 2, title: "Starter Power Wire", description: "Test for voltage at large starter wire", expectedResult: "Battery voltage present" },
            { stepNumber: 3, title: "Control Circuit", description: "Check voltage at starter solenoid trigger wire during cranking", expectedResult: "Voltage present when key in START" },
            { stepNumber: 4, title: "Ground Test", description: "Verify starter ground connection", expectedResult: "Less than 0.5V drop" },
            { stepNumber: 5, title: "Voltage Drop Test", description: "Test voltage drop across cables during crank", expectedResult: "Less than 0.5V positive side, 0.3V ground" },
            { stepNumber: 6, title: "Starter Current Draw", description: "Measure starter current draw if possible", expectedResult: "Typically 100-200A depending on engine" },
        ],
        troubleshooting: ["Clicks no crank - check battery or solenoid", "No click - check ignition switch, neutral safety"]
    },

    // Lighting Systems
    {
        id: "auto-lighting-diagnosis",
        title: "Lighting Circuit Diagnosis",
        category: "automotive",
        system: "Lighting",
        difficulty: "beginner",
        duration: "15 min",
        description: "Troubleshooting inoperative vehicle lights",
        tools: ["Digital multimeter", "Test light"],
        steps: [
            { stepNumber: 1, title: "Visual Check", description: "Inspect bulb for blown filament", expectedResult: "Bulb condition determined" },
            { stepNumber: 2, title: "Check Fuse", description: "Locate and test associated fuse", expectedResult: "Fuse continuity confirmed or blown" },
            { stepNumber: 3, title: "Power At Socket", description: "Test for power at bulb socket", expectedResult: "12V present when switch ON" },
            { stepNumber: 4, title: "Ground Test", description: "Verify socket has good ground", expectedResult: "Ground continuity confirmed" },
            { stepNumber: 5, title: "Wire Trace", description: "If no power, trace wiring back to switch/relay", expectedResult: "Break in circuit found" },
        ],
        troubleshooting: ["Intermittent - check for corrosion", "Multiple lights out - check common ground"]
    },

    // Ignition System
    {
        id: "auto-ignition-test",
        title: "Ignition System Test",
        category: "automotive",
        system: "Ignition",
        difficulty: "intermediate",
        duration: "30 min",
        description: "Testing ignition system components for proper spark delivery",
        tools: ["Spark tester", "Multimeter", "Scan tool"],
        steps: [
            { stepNumber: 1, title: "Check for Codes", description: "Scan for ignition-related fault codes", expectedResult: "Codes noted for analysis" },
            { stepNumber: 2, title: "Spark Test", description: "Connect spark tester, crank engine", expectedResult: "Strong blue/white spark" },
            { stepNumber: 3, title: "Coil Test", description: "Test coil primary and secondary resistance", expectedResult: "Within manufacturer specs" },
            { stepNumber: 4, title: "Sensor Check", description: "Verify crankshaft/camshaft sensor signals", expectedResult: "Sensors sending signals" },
            { stepNumber: 5, title: "Spark Plug Inspection", description: "Remove and inspect spark plugs", expectedResult: "Proper gap, no fouling" },
        ],
        troubleshooting: ["No spark all cylinders - check CKP sensor, PCM", "No spark one cylinder - check coil pack"]
    },
]

// ============================================
// MARINE PROCEDURES
// ============================================

export const MARINE_PROCEDURES: Procedure[] = [
    // Bilge System
    {
        id: "marine-bilge-pump-test",
        title: "Bilge Pump Circuit Test",
        category: "marine",
        system: "Bilge System",
        difficulty: "beginner",
        duration: "10 min",
        description: "Testing automatic and manual bilge pump operation",
        tools: ["Multimeter"],
        steps: [
            { stepNumber: 1, title: "Manual Test", description: "Activate manual bilge pump switch", expectedResult: "Pump runs, water discharges" },
            { stepNumber: 2, title: "Check Voltage", description: "Measure voltage at pump motor", expectedResult: "12V DC (or specified voltage)" },
            { stepNumber: 3, title: "Float Switch Test", description: "Manually raise float switch", expectedResult: "Pump activates automatically" },
            { stepNumber: 4, title: "Discharge Check", description: "Verify water exits through-hull", expectedResult: "Strong discharge flow" },
            { stepNumber: 5, title: "Cycle Counter", description: "Note pump cycling frequency if equipped", expectedResult: "Normal cycling pattern" },
        ],
        troubleshooting: ["Pump won't run - check fuse and connections", "Runs constantly - check float switch position"]
    },

    // Navigation Electronics
    {
        id: "marine-nav-light-test",
        title: "Navigation Light Test",
        category: "marine",
        system: "Navigation",
        difficulty: "beginner",
        duration: "15 min",
        description: "Verifying all navigation lights meet COLREG requirements",
        steps: [
            { stepNumber: 1, title: "Port Light", description: "Verify red port light illuminates", expectedResult: "Red light visible 112.5° from bow" },
            { stepNumber: 2, title: "Starboard Light", description: "Verify green starboard light illuminates", expectedResult: "Green light visible 112.5° from bow" },
            { stepNumber: 3, title: "Stern Light", description: "Check white stern light", expectedResult: "White light visible 135° from stern" },
            { stepNumber: 4, title: "Masthead Light", description: "Verify masthead/steaming light", expectedResult: "White light visible 225° ahead" },
            { stepNumber: 5, title: "All-Round Light", description: "Test anchor light if equipped", expectedResult: "360° visibility" },
            { stepNumber: 6, title: "Verify Sectors", description: "Walk around vessel to verify light sectors", expectedResult: "Proper coverage per COLREG" },
        ],
        troubleshooting: ["Dim lights - check corrosion, wire gauge", "LED flicker - check for PWM compatibility"]
    },

    // Shore Power
    {
        id: "marine-shore-power-connection",
        title: "Shore Power Connection",
        category: "marine",
        system: "Shore Power",
        difficulty: "intermediate",
        duration: "10 min",
        description: "Safely connecting to shore power and verifying polarity",
        tools: ["Polarity tester"],
        caution: "Improper shore power can cause electrocution hazard in water",
        steps: [
            { stepNumber: 1, title: "Inspect Cord", description: "Check shore power cord for damage", expectedResult: "No cracks, proper connections" },
            { stepNumber: 2, title: "Turn Off Main", description: "Ensure shore power main breaker is OFF", expectedResult: "Main breaker open" },
            { stepNumber: 3, title: "Connect At Boat", description: "Connect cord to boat's inlet first", expectedResult: "Secure connection" },
            { stepNumber: 4, title: "Connect At Pedestal", description: "Connect to dock power pedestal", expectedResult: "Cord fully seated" },
            { stepNumber: 5, title: "Check Polarity", description: "Verify correct polarity with tester", caution: "DO NOT turn on if reversed", expectedResult: "Correct polarity indicated" },
            { stepNumber: 6, title: "Main Breaker ON", description: "Turn on shore power main breaker", expectedResult: "Shore power indicator lit" },
        ],
        troubleshooting: ["No power - check pedestal breaker", "Reversed polarity - DO NOT USE, report to marina"]
    },

    // Engine Electrical
    {
        id: "marine-engine-electrical-check",
        title: "Marine Engine Electrical Check",
        category: "marine",
        system: "Engine Electrical",
        difficulty: "intermediate",
        duration: "25 min",
        description: "Pre-departure check of marine engine electrical systems",
        tools: ["Multimeter", "Hydrometer (for wet cell batteries)"],
        steps: [
            { stepNumber: 1, title: "Battery Check", description: "Test battery voltage and electrolyte level", expectedResult: "12.6V+, proper electrolyte level" },
            { stepNumber: 2, title: "Terminal Inspection", description: "Check for corrosion on terminals", expectedResult: "Clean, tight connections" },
            { stepNumber: 3, title: "Battery Switch", description: "Verify battery selector switch operation", expectedResult: "Switch works, positions marked" },
            { stepNumber: 4, title: "Start Circuit", description: "Turn key, verify gauges come alive", expectedResult: "All gauges indicate" },
            { stepNumber: 5, title: "Engine Start", description: "Start engine, check charging", expectedResult: "Alternator charging 13.5-14.5V" },
            { stepNumber: 6, title: "Warning Systems", description: "Verify oil pressure and temperature warnings test", expectedResult: "Warning lights test OK" },
        ],
        troubleshooting: ["Low battery - check for parasitic draw", "No charge - inspect raw water pump impeller (affects alternator cooling)"]
    },
]

// ============================================
// ELECTRIC VEHICLE PROCEDURES
// ============================================

export const ELECTRIC_VEHICLE_PROCEDURES: Procedure[] = [
    // High Voltage System
    {
        id: "ev-safety-disconnect",
        title: "High Voltage Safety Disconnect",
        category: "electric",
        system: "High Voltage System",
        difficulty: "advanced",
        duration: "15 min",
        description: "Safely de-energizing HV system before service work",
        tools: ["Insulated gloves Class 0", "HV multimeter", "Safety barriers"],
        caution: "HIGH VOLTAGE - LETHAL! Follow manufacturer's exact procedures",
        prerequisites: ["Proper HV training", "PPE available"],
        steps: [
            { stepNumber: 1, title: "Power Off", description: "Turn vehicle completely off, remove key/card", expectedResult: "Vehicle powered down, READY light off" },
            { stepNumber: 2, title: "Wait Period", description: "Wait minimum 5 minutes before proceeding", note: "Allows capacitors to discharge", expectedResult: "Wait time complete" },
            { stepNumber: 3, title: "Don PPE", description: "Put on insulated gloves and safety glasses", expectedResult: "PPE properly worn" },
            { stepNumber: 4, title: "Manual Disconnect", description: "Remove HV service disconnect plug", caution: "Refer to service manual for location", expectedResult: "Disconnect removed" },
            { stepNumber: 5, title: "Verify Zero Energy", description: "Test HV components with rated meter", expectedResult: "No voltage present" },
            { stepNumber: 6, title: "Install LOTO", description: "Apply lock-out tag-out on disconnect", expectedResult: "LOTO applied, vehicle tagged" },
        ],
        troubleshooting: ["Voltage still present - wait longer, check all contactors"]
    },

    // Charging System
    {
        id: "ev-charging-diagnosis",
        title: "EV Charging System Diagnosis",
        category: "electric",
        system: "Charging System",
        difficulty: "intermediate",
        duration: "30 min",
        description: "Diagnosing electric vehicle charging faults",
        tools: ["OBD-II scan tool (EV compatible)", "Multimeter"],
        steps: [
            { stepNumber: 1, title: "Check Connector", description: "Inspect charging port and connector for damage", expectedResult: "Clean, undamaged connectors" },
            { stepNumber: 2, title: "Inlet Voltage", description: "Verify voltage at wall outlet/EVSE", expectedResult: "Proper voltage for charger type" },
            { stepNumber: 3, title: "EVSE Indicator", description: "Check charger status lights", expectedResult: "Normal status indication" },
            { stepNumber: 4, title: "Vehicle State", description: "Check vehicle display for charging status", expectedResult: "Vehicle shows plug connected" },
            { stepNumber: 5, title: "Scan Codes", description: "Read charging-related fault codes", expectedResult: "Codes guide diagnosis" },
            { stepNumber: 6, title: "Pilot Signal", description: "Test pilot signal circuit if equipped", expectedResult: "Proper PWM signal present" },
        ],
        troubleshooting: ["Won't charge - check interlock, 12V battery", "Slow charge - check amperage, temperature"]
    },

    // 12V System
    {
        id: "ev-12v-system",
        title: "EV 12V Auxiliary System Check",
        category: "electric",
        system: "12V Auxiliary",
        difficulty: "beginner",
        duration: "15 min",
        description: "Testing the 12V accessory battery and DC-DC converter",
        tools: ["Multimeter", "Battery tester"],
        steps: [
            { stepNumber: 1, title: "12V Battery Test", description: "Check 12V battery voltage and condition", expectedResult: "12.4V+ when off, battery passes load test" },
            { stepNumber: 2, title: "DC-DC Converter Check", description: "Measure 12V output with vehicle READY", expectedResult: "13.5-14.5V from DC-DC converter" },
            { stepNumber: 3, title: "Parasitic Draw", description: "Check current draw when vehicle off", expectedResult: "Below 50mA after sleep" },
            { stepNumber: 4, title: "Connections", description: "Inspect 12V battery terminals and grounds", expectedResult: "Clean, tight connections" },
        ],
        troubleshooting: ["Dead 12V battery - check DC-DC converter", "Frequent discharge - measure parasitic draw"]
    },

    // Thermal Management
    {
        id: "ev-thermal-management",
        title: "Battery Thermal Management Check",
        category: "electric",
        system: "Thermal Management",
        difficulty: "intermediate",
        duration: "20 min",
        description: "Verifying battery heating and cooling system operation",
        tools: ["Scan tool", "Infrared thermometer"],
        steps: [
            { stepNumber: 1, title: "Check Coolant Level", description: "Verify HV battery coolant reservoir level", note: "Use ONLY specified coolant type", expectedResult: "Level between min-max marks" },
            { stepNumber: 2, title: "Temperature Reading", description: "Check battery temperature on vehicle display", expectedResult: "Temperature reading available" },
            { stepNumber: 3, title: "Cooling System", description: "With vehicle on, verify cooling pump activates if warm", expectedResult: "Pump runs when temperature elevated" },
            { stepNumber: 4, title: "Heating System", description: "In cold conditions, verify battery heater works", expectedResult: "Battery temperature rises if cold" },
            { stepNumber: 5, title: "Scan for Faults", description: "Check for thermal management DTCs", expectedResult: "No thermal faults present" },
        ],
        troubleshooting: ["Reduced range in cold - check battery heater", "Reduced power when hot - verify cooling loop"]
    },
]

// ============================================
// EXPORT ALL PROCEDURES
// ============================================

export const ALL_PROCEDURES: Procedure[] = [
    ...AVIATION_PROCEDURES,
    ...AUTOMOTIVE_PROCEDURES,
    ...MARINE_PROCEDURES,
    ...ELECTRIC_VEHICLE_PROCEDURES,
]

// Helper function to get procedures by category
export function getProceduresByCategory(category: string): Procedure[] {
    if (category === "all") return ALL_PROCEDURES
    return ALL_PROCEDURES.filter(p => p.category === category)
}

// Helper function to get procedures by ATA chapter
export function getProceduresByATA(ataChapter: string): Procedure[] {
    return AVIATION_PROCEDURES.filter(p => p.ataChapter === ataChapter)
}

// Helper function to search procedures
export function searchProcedures(query: string): Procedure[] {
    const lowerQuery = query.toLowerCase()
    return ALL_PROCEDURES.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.system.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    )
}
