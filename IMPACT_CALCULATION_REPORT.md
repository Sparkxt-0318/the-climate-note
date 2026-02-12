# The Climate Note — Environmental Impact Calculation System
### Technical Report & Methodology Documentation
**Version 1.0 | February 2026**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Step 1 — AI Action Extraction](#3-step-1--ai-action-extraction)
4. [Step 2 — Formula Matching & Impact Calculation](#4-step-2--formula-matching--impact-calculation)
5. [Research Sources & Formula Database](#5-research-sources--formula-database)
6. [Hallucination Prevention & Confidence Scoring](#6-hallucination-prevention--confidence-scoring)
7. [Admin Review Queue](#7-admin-review-queue)
8. [Metrics Calculated](#8-metrics-calculated)
9. [Category Breakdown](#9-category-breakdown)
10. [Limitations & Conservative Approach](#10-limitations--conservative-approach)
11. [Future Improvements](#11-future-improvements)

---

## 1. Executive Summary

When a user on The Climate Note writes a note — e.g. *"I biked to school instead of taking the car today, about 4 miles"* — the platform automatically:

1. Sends that note to an AI model (GPT-4o-mini) which extracts structured data from the free-text
2. Matches the extracted action to a **pre-approved, research-backed environmental formula**
3. Calculates the estimated CO₂ saved, plastic prevented, water saved, and/or energy saved
4. Stores the result and displays it on the platform's **public Impact Dashboard**

The system is designed to be **conservative**, **transparent**, and **resistant to AI hallucination** — the AI never invents numbers. It only classifies actions; the numbers always come from peer-reviewed research.

---

## 2. System Architecture Overview

```
User writes note
       │
       ▼
 ArticleView.tsx
 (note saved to DB)
       │
       │ fire-and-forget (non-blocking)
       ▼
 Supabase Edge Function
 classify-note-impact
       │
       ├──► STEP 1: OpenAI GPT-4o-mini
       │    Extracts: category, action_type,
       │    quantity, unit, confidence
       │
       └──► STEP 2: Formula Lookup Table
            Applies: research-backed formula
            Calculates: CO₂, plastic, water, energy
                   │
       ┌───────────┴────────────┐
       ▼                        ▼
confidence ≥ 0.70         confidence < 0.70
       │                        │
  Store result             Store result
  in note_impacts          in note_impacts
       │                   + flag needs_review
       │                   + add to
       │                   impact_review_queue
       ▼                        ▼
  ImpactDashboard          Admin Review Panel
  (contributes to           (admin verifies
   collective totals)        or corrects)
```

**Key design principle:** The AI is a *classifier only*. It extracts *what kind of action* the user described. The actual impact numbers are sourced entirely from published scientific literature.

---

## 3. Step 1 — AI Action Extraction

### Model
- **Model**: `gpt-4o-mini` (OpenAI)
- **Temperature**: `0.1` (near-deterministic — minimises variation and creativity)
- **Max tokens**: `200` (constrained output — no room for rambling)

### What the AI is asked to do

The AI receives a strict system prompt that instructs it to:

1. Identify the **category** of the environmental action (one of 7 fixed options)
2. Identify the **action type** (one of ~25 pre-defined action types)
3. Extract any **quantity** mentioned (e.g. `4`, `2`, `0.5`)
4. Identify the **unit** (miles, km, kg, liters, items, meals, minutes)
5. Assign a **confidence score** between 0.0 and 1.0

### Output Format (strictly enforced)

The AI must respond in valid JSON only:

```json
{
  "category": "transportation",
  "action_type": "car_to_bike",
  "quantity": 4,
  "unit": "miles",
  "confidence": 0.95,
  "reasoning": "User clearly states biking 4 miles instead of driving"
}
```

No free-form text is accepted. If the output cannot be parsed as JSON, the system falls back to a safe `other` classification with zero impact.

### The 7 Categories

| # | Category | Description |
|---|----------|-------------|
| 1 | `transportation` | How people travel (car, bike, transit, flight) |
| 2 | `food` | Dietary choices and food waste |
| 3 | `waste` | Single-use plastics, recycling, composting |
| 4 | `energy` | Electricity and heating at home |
| 5 | `water` | Water usage and conservation |
| 6 | `shopping` | Fast fashion, secondhand, local produce |
| 7 | `other` | Anything that doesn't clearly fit the above |

### The 25 Action Types

| Category | Action Types |
|----------|-------------|
| transportation | `car_to_bike`, `car_to_walk`, `car_to_transit`, `car_to_carpool`, `flight_avoided`, `car_trip_avoided` |
| food | `beef_to_veg`, `meat_to_veg`, `dairy_skipped`, `food_waste_prevented`, `local_produce` |
| waste | `plastic_bottle_avoided`, `plastic_bag_avoided`, `straw_avoided`, `recycling`, `composting` |
| energy | `led_switch`, `lights_off`, `unplug_device`, `thermostat_adjust`, `solar` |
| water | `shorter_shower`, `tap_off_brushing`, `rainwater_collect` |
| shopping | `fast_fashion_avoided`, `secondhand_bought` |
| other | `general_action` |

---

## 4. Step 2 — Formula Matching & Impact Calculation

Once the AI returns a structured classification, the system:

1. **Looks up the matching formula** in a hard-coded, research-backed table
2. **Applies the quantity multiplier** (e.g. 4 miles × 0.404 kg CO₂/mile = 1.616 kg)
3. **Falls back to conservative category defaults** if no specific quantity was given
4. **Falls back to zero impact** for `other` category with no known formula

### Example Calculations

#### Example 1 — Cycling instead of driving
```
User note: "Biked 5 miles to work instead of driving"

AI extracts:
  category:    transportation
  action_type: car_to_bike
  quantity:    5
  unit:        miles
  confidence:  0.96

Formula applied:
  car_to_bike_per_mile → 0.404 kg CO₂/mile (EPA 2024)

Calculation:
  5 miles × 0.404 kg = 2.020 kg CO₂ saved

Result stored:
  co2_saved_kg: 2.0200
```

#### Example 2 — Skipping a beef meal
```
User note: "Had a veggie burger instead of beef today"

AI extracts:
  category:    food
  action_type: beef_to_veg
  quantity:    1
  unit:        meals
  confidence:  0.91

Formula applied:
  beef_meal_to_veg → 3.5 kg CO₂/meal (Poore & Nemecek 2018)

Calculation:
  1 meal × 3.5 kg = 3.500 kg CO₂ saved

Result stored:
  co2_saved_kg: 3.5000
```

#### Example 3 — Reusable water bottle
```
User note: "Used my reusable bottle instead of buying 2 plastic bottles"

AI extracts:
  category:    waste
  action_type: plastic_bottle_avoided
  quantity:    2
  unit:        items
  confidence:  0.93

Formula applied:
  plastic_bottle_avoided → 0.082 kg CO₂ + 25g plastic per bottle

Calculation:
  2 × 0.082 kg = 0.164 kg CO₂ saved
  2 × 25g     = 50g plastic prevented

Result stored:
  co2_saved_kg:    0.1640
  plastic_saved_g: 50.0000
```

#### Example 4 — Vague note (fallback)
```
User note: "I tried to be more eco-friendly today"

AI extracts:
  category:    other
  action_type: general_action
  quantity:    null
  unit:        null
  confidence:  0.21

Result:
  Flagged for admin review (confidence < 0.70)
  co2_saved_kg: null (no calculable impact)
  needs_review: true
```

---

## 5. Research Sources & Formula Database

All formulas are sourced from peer-reviewed research or recognised government agencies. The full database:

### Transportation

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `car_to_bike_per_mile` | CO₂ saved | 0.404 kg/mile | U.S. EPA 2024 Emission Factors |
| `car_to_walk_per_mile` | CO₂ saved | 0.404 kg/mile | U.S. EPA 2024 |
| `car_to_transit_per_mile` | CO₂ saved | 0.228 kg/mile | U.S. EPA 2024 |
| `car_to_carpool_per_mile` | CO₂ saved | 0.202 kg/mile | U.S. EPA 2024 (50% savings vs solo) |
| `flight_avoided_per_mile` | CO₂ saved | 0.255 kg/mile | ICAO Carbon Calculator 2023 |
| `car_trip_avoided_default` | CO₂ saved | 1.200 kg/trip | EPA average 3-mile trip |

> **Note on 0.404 kg/mile**: This is the EPA's average figure for a passenger car in the U.S. fleet. It accounts for fuel consumption across petrol, diesel, and hybrid vehicles. For Chinese users, regional grid intensity differs slightly; this will be updated in a future version to use China's grid factor where relevant.

### Food

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `beef_meal_to_veg` | CO₂ saved | 3.5 kg/meal | Poore & Nemecek, *Science* 2018 |
| `meat_meal_to_veg` | CO₂ saved | 2.5 kg/meal | University of Oxford Food Study 2023 |
| `dairy_meal_skipped` | CO₂ saved | 0.9 kg/meal | Poore & Nemecek 2018 |
| `food_waste_prevented_kg` | CO₂ saved | 2.5 kg/kg | FAO Food Waste Report 2023 |

> **Poore & Nemecek (2018)** is the most comprehensive meta-analysis of food system environmental impacts, covering 38,700 farms and 1,600 processors across 119 countries. It is widely cited in environmental science and policy.

### Waste

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `plastic_bottle_avoided` | CO₂ saved | 0.082 kg/bottle | Plastic Pollution Coalition |
| `plastic_bottle_avoided` | Plastic prevented | 25 g/bottle | Average PET bottle weight |
| `plastic_bag_avoided` | CO₂ saved | 0.033 kg/bag | U.S. EPA |
| `plastic_bag_avoided` | Plastic prevented | 10 g/bag | Average HDPE bag weight |
| `straw_avoided` | CO₂ saved | 0.003 kg/straw | U.S. EPA |
| `straw_avoided` | Plastic prevented | 0.5 g/straw | Average polypropylene straw |
| `recycling_kg` | CO₂ saved | 0.5 kg/kg | EPA WasteWise Programme |
| `composting_kg` | CO₂ saved | 0.3 kg/kg | U.S. EPA |

### Energy

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `led_bulb_switch` | CO₂ saved | 0.15 kg/day | U.S. DOE 2024 |
| `led_bulb_switch` | Energy saved | 0.5 kWh/day | U.S. DOE (75% reduction vs incandescent) |
| `lights_off_per_hour` | CO₂ saved | 0.046 kg/hour | IEA global average grid intensity |
| `lights_off_per_hour` | Energy saved | 0.06 kWh/hour | Average 60W bulb |
| `unplug_device_per_day` | CO₂ saved | 0.03 kg/day | U.S. DOE standby power study |
| `thermostat_1deg_per_day` | CO₂ saved | 0.3 kg/day | U.S. DOE heating/cooling estimates |
| `solar_kwh` | CO₂ saved | 0.92 kg/kWh | IEA 2024 (vs coal grid baseline) |

### Water

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `shower_minute_saved` | Water saved | 9 L/minute | EPA WaterSense 2024 |
| `shower_minute_saved` | CO₂ saved | 0.0027 kg/minute | Water heating emissions (EPA) |
| `tap_off_brushing` | Water saved | 8 L/session | EPA WaterSense |
| `shorter_shower_5min` | Water saved | 45 L | EPA WaterSense (5 min × 9 L) |

### Shopping

| Formula ID | Impact | Value | Source |
|-----------|--------|-------|--------|
| `fast_fashion_item_avoided` | CO₂ saved | 10.0 kg/item | UNEP Fashion Report 2023 |
| `fast_fashion_item_avoided` | Water saved | 2,700 L/item | UNEP (avg cotton t-shirt) |
| `secondhand_item_bought` | CO₂ saved | 5.0 kg/item | ThredUp Resale Report 2023 |
| `local_produce_meal` | CO₂ saved | 0.5 kg/meal | Worldwatch Institute |

---

## 6. Hallucination Prevention & Confidence Scoring

This is the most critical part of the system design.

### The Core Problem
Large language models can "hallucinate" — generate plausible-sounding but incorrect information. In an impact calculation context, this could mean inventing CO₂ values or inflating impact metrics.

### Our Solution: AI Never Generates Numbers

The AI is **completely forbidden from generating impact numbers**. Its only job is to answer:

> *"What category and action type does this note belong to, and what quantity did the user mention?"*

The actual environmental numbers always come from the hard-coded formula table, which is written by humans and sourced from literature.

```
                 AI                        Our formula table
                  │                               │
    "car_to_bike, 5 miles, conf 0.96"    "0.404 kg CO₂ per mile (EPA)"
                  │                               │
                  └──────── multiply ─────────────┘
                                 │
                           2.020 kg CO₂
```

### Confidence Scoring Rules

The AI assigns confidence based on how explicit the note is:

| Score Range | Meaning | Action |
|-------------|---------|--------|
| **0.90 – 1.00** | Very clear action, specific quantity | Stored automatically |
| **0.70 – 0.89** | Clear action, quantity estimated | Stored automatically |
| **0.50 – 0.69** | Plausible action, vague details | Flagged for admin review |
| **0.00 – 0.49** | Unclear or general statement | Flagged, zero impact assigned |

**Threshold: 0.70** — only notes with confidence ≥ 0.70 automatically contribute to impact totals.

### Additional Safeguards

**1. Temperature = 0.1**
The model is set to near-zero temperature, meaning it produces the most likely (not most creative) output every time. This greatly reduces unexpected classifications.

**2. Output validation**
If the AI output cannot be parsed as valid JSON, or is missing required fields (`category`, `confidence`), the system catches the error and defaults to `other` / zero impact. The classification never crashes the app.

**3. Quantity sanity checks** *(planned for v1.1)*
Values like "biked 500 miles" or "avoided 1000 plastic bottles" will be flagged as outliers requiring review.

**4. Admin override**
Admins can correct any AI classification at any time through the review queue. Corrected classifications retroactively update the impact totals.

---

## 7. Admin Review Queue

Any note with AI confidence below **0.70** is automatically placed in the admin review queue.

### What Admins See

```
┌─────────────────────────────────────────────────────┐
│ Impact Review Queue                    3 pending     │
├─────────────────────────────────────────────────────┤
│ Note: "I tried to be more sustainable today"         │
│ AI category:    other                                │
│ AI confidence:  0.21                                 │
│ AI reasoning:   "Too vague to classify"              │
│                                                      │
│ [Approve as 'other']  [Correct to: ___________]     │
│ [Dismiss]                                            │
└─────────────────────────────────────────────────────┘
```

### Admin Actions

| Action | Effect |
|--------|--------|
| **Approve** | Confirms AI classification, removes from queue |
| **Correct** | Admin picks the right category; impact recalculated |
| **Dismiss** | Note stays as `other` with zero impact; removed from queue |

### Why This Matters
Over time, admin corrections can be used to improve the AI's classification prompts. Common misclassifications can be added as examples in the prompt, progressively reducing review queue size.

---

## 8. Metrics Calculated

The system tracks four environmental metrics:

### CO₂ Saved (kg)
The primary metric. Represents kilograms of CO₂-equivalent greenhouse gas emissions avoided compared to the baseline behaviour.

**Real-world equivalent shown to users:**
- 1 tree absorbs ~21 kg CO₂/year
- Display: *"≈ X trees planted"*

### Plastic Prevented (g → displayed as kg)
Grams of single-use plastic that didn't enter the waste stream. Applies to: plastic bottles, bags, straws, and packaging avoidance actions.

**Real-world equivalent:**
- Average plastic bag = 10g
- Display: *"≈ X plastic bags"*

### Water Saved (liters)
Litres of fresh water conserved. Applies to: shorter showers, turning off taps, and fashion/food choices with high water footprints.

**Real-world equivalent:**
- Average shower = ~150 litres
- Display: *"≈ X showers saved"*

### Energy Saved (kWh)
Kilowatt-hours of electricity saved. Applies to: LED switches, turning off lights, unplugging devices, thermostat changes.

**Real-world equivalent:**
- Average phone charge ≈ 0.012 kWh (we use 1.2 kWh as a more relatable "phone + accessories day")
- Display: *"≈ X phone charges"*

---

## 9. Category Breakdown

The Impact Dashboard shows the community's category distribution as a horizontal bar chart, sorted by volume.

```
🚴 Transportation  ████████████████░░░░░░  42%  (840 actions)
🥗 Food            ██████████░░░░░░░░░░░░  28%  (560 actions)
♻️ Waste           ███████░░░░░░░░░░░░░░░  18%  (360 actions)
💡 Energy          ███░░░░░░░░░░░░░░░░░░░   8%  (160 actions)
💧 Water           █░░░░░░░░░░░░░░░░░░░░░   3%  (60 actions)
🛍️ Shopping        ░░░░░░░░░░░░░░░░░░░░░░   1%  (20 actions)
```

This helps the editorial team see what actions their readership is focused on and inform future article topics.

---

## 10. Limitations & Conservative Approach

We deliberately chose conservative values throughout. Where a range existed in the literature, we used the lower bound.

### Known Limitations

**Geographic variation**
- CO₂ per kWh varies by country (China's grid is ~0.61 kg/kWh vs U.S. at 0.92 kg/kWh)
- Transport emission factors differ by vehicle type and fuel
- **Current approach**: Use U.S. EPA figures as a widely accepted baseline
- **Planned**: Add region-specific factors for China in v1.1

**One-time vs repeated actions**
- A note saying "I biked today" is calculated as one trip
- A note saying "I'll bike every day this month" is still calculated as one trip (conservative)
- We do not multiply for stated intentions

**Impact attribution**
- We calculate *potential* impact based on the action described
- We cannot verify the action was actually completed
- This is an inherent limitation of any self-reported system

**Unclassifiable actions**
- Creative or complex notes (e.g. "I convinced my school to switch to solar") cannot be easily quantified
- These fall into `other` with zero calculated impact
- They are no less valuable — the platform just can't assign a number

### What We Do Not Do
- We do not **inflate** numbers to make the platform look more impactful
- We do not **count** low-confidence classifications without admin review
- We do not **generate** numbers with AI — all numbers come from literature
- We do not **double-count** the same note (unique constraint on `note_id`)

---

## 11. Future Improvements

### v1.1 — Regional Formula Adjustment
- Add region field to user profile (optional)
- Apply China/Asia-specific grid emission factor (0.61 kg CO₂/kWh) for energy calculations
- Adjust transport emissions for average Chinese vehicle fleet

### v1.2 — Environmental Org Collaboration
- Partner with organisations (WWF China, Greenpeace Asia) to validate formulas
- Add peer-review certification badge to dashboard
- Create a public formula registry that organisations can contribute to

### v1.3 — Quantity Sanity Checks
- Flag notes with quantities that exceed realistic thresholds
- e.g. "biked 200 miles today" → auto-flagged for review

### v1.4 — User Feedback Loop
- Show users their calculated impact after submitting a note
- Allow users to flag: "This doesn't look right"
- Use feedback to improve classification accuracy

### v1.5 — Aggregated Impact Reports
- Monthly PDF reports for users showing personal impact over time
- Year-in-review feature showing growth
- Shareable impact certificates

### v2.0 — Verified Impact with Org Partners
- Environmental organisations provide certified formulas
- Verified actions marked with a trust badge
- Potential for carbon credit integration

---

## Appendix A — Formula Source Summary

| Organisation | Website | Used for |
|-------------|---------|----------|
| U.S. Environmental Protection Agency (EPA) | epa.gov | Transportation, waste, water, energy |
| International Energy Agency (IEA) | iea.org | Energy grid intensity |
| IPCC (Intergovernmental Panel on Climate Change) | ipcc.ch | General GHG factors |
| Poore & Nemecek (2018) in *Science* | science.org | Food system emissions |
| University of Oxford Food & Climate Research | ox.ac.uk | Dietary shift impacts |
| Food and Agriculture Organization (FAO) | fao.org | Food waste emissions |
| UN Environment Programme (UNEP) | unep.org | Fashion industry impacts |
| Water Footprint Network (WFN) | waterfootprint.org | Water usage factors |
| ICAO (International Civil Aviation Organization) | icao.int | Aviation emissions |
| ThredUp Resale Report | thredup.com | Secondhand fashion |
| U.S. Department of Energy (DOE) | energy.gov | Home energy usage |
| Worldwatch Institute | worldwatch.org | Food miles / local produce |

---

## Appendix B — Database Schema

```sql
note_impacts
├── id                    (uuid, primary key)
├── note_id               (uuid → user_notes.id, unique)
├── user_id               (uuid → user_profiles.id)
├── action_category       (text: transportation/food/waste/energy/water/shopping/other)
├── action_type           (text: car_to_bike, beef_to_veg, etc.)
├── confidence            (numeric 0.000–1.000)
├── co2_saved_kg          (numeric, nullable)
├── plastic_saved_g       (numeric, nullable)
├── water_saved_liters    (numeric, nullable)
├── energy_saved_kwh      (numeric, nullable)
├── formula_id            (text: references formula table key)
├── formula_source        (text: citation)
├── ai_reasoning          (text: AI's explanation)
├── needs_review          (boolean: true if confidence < 0.70)
├── reviewed_by           (uuid → user_profiles.id, nullable)
└── reviewed_at           (timestamptz, nullable)

impact_review_queue
├── id                    (uuid, primary key)
├── note_id               (uuid → user_notes.id, unique)
├── user_id               (uuid → user_profiles.id)
├── note_content          (text: original note for admin to read)
├── ai_category           (text: what AI thought)
├── ai_confidence         (numeric)
├── ai_reasoning          (text)
├── status                (pending / approved / corrected / dismissed)
├── corrected_category    (text, nullable: admin's correction)
└── reviewed_at           (timestamptz, nullable)
```

---

*This document was prepared for internal review. All formula values are subject to revision as new research becomes available. The Climate Note is committed to accuracy and transparency in all environmental impact claims.*

---
**End of Report**
