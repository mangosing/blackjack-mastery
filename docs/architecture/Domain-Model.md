# Blackjack Mastery

> Domain Model

---

## Document Information

| Field        | Value             |
| ------------ | ----------------- |
| Status       | Draft             |
| Version      | 0.1               |
| Product      | Blackjack Mastery |
| Owner        | Sean Mangosing    |
| Last Updated | 2026-07-04        |

---

# Purpose

This document defines the core business concepts used throughout Blackjack Mastery.

It is not a database schema, API contract, or implementation plan.

The goal is to establish a shared language for the product, design, engineering, and future AI-assisted development.

---

# Core Concept

Blackjack Mastery is built around one central idea:

> Users do not simply answer blackjack questions.  
> Users develop mastery over specific blackjack skills.

A practice session is not just a collection of random hands.

A practice session is a targeted learning experience designed to improve measurable skills.

---

# Domain Principles

## 1. Skills Are the Atomic Unit of Learning

The smallest measurable learning unit is a Skill.

Examples:

- Hard 16 vs Dealer 10
- Soft 18 vs Dealer 9
- Pair 8s vs Dealer Ace
- Maintain a running count
- Convert running count to true count

---

## 2. Practice Serves Mastery

Practice exists to improve mastery.

Every practice session should be connected to one or more skills.

---

## 3. Feedback Must Teach

Feedback should explain the correct decision and reinforce why the decision is correct.

---

## 4. Progress Must Be Measurable

Users should be able to see their progress by academy, lesson, skill, and practice history.

---

# Domain Objects

## User

A person using Blackjack Mastery.

A User may study lessons, complete practice sessions, build mastery, earn achievements, and receive recommendations.

### Key Responsibilities

- Owns progress
- Owns practice history
- Owns mastery records
- Owns streaks and achievements

### Example Properties

- id
- email
- displayName
- createdAt
- lastActiveAt

---

## Academy

A high-level learning area within Blackjack Mastery.

Examples:

- Basic Strategy Academy
- Card Counting Academy
- True Count Academy
- Playing Deviations Academy
- Blackjack Switch Academy
- Free Bet Academy
- Casino Simulation Academy

### Key Responsibilities

- Groups related courses and lessons
- Provides a structured learning path
- Tracks high-level mastery

---

## Course

A structured sequence of lessons inside an Academy.

Example:

Basic Strategy Academy may contain:

- Hard Totals Course
- Soft Totals Course
- Pairs Course
- Surrender Course
- Mixed Strategy Course

### Key Responsibilities

- Organizes lessons
- Defines progression order
- Groups related skills

---

## Lesson

A guided learning experience that introduces or reinforces a concept.

Examples:

- Hard totals 12–16
- Soft 18 decisions
- Splitting pairs
- Late surrender basics

### Key Responsibilities

- Teaches a concept
- Introduces related skills
- May lead into a practice session
- May include explanations and examples

---

## Skill

The smallest measurable competency in the system.

Skills are the foundation of mastery tracking.

Examples:

- Hard 16 vs Dealer 10
- Hard 12 vs Dealer 3
- Soft 18 vs Dealer 9
- Pair 8s vs Dealer Ace
- Running count card values
- True count conversion with 2 decks remaining

### Key Responsibilities

- Represents one measurable ability
- Can be practiced repeatedly
- Has mastery progress
- Can belong to one or more lessons

### Example Properties

- id
- name
- category
- difficulty
- academy
- ruleset
- correctDecision
- explanation

---

## Rule Set

A specific blackjack rules configuration.

Example:

6-deck, dealer hits soft 17, double after split allowed, late surrender available.

### Key Responsibilities

- Defines the rules used to evaluate decisions
- Affects correct strategy
- Allows future support for multiple blackjack variants

### Example Properties

- id
- name
- deckCount
- dealerSoft17Behavior
- doubleAfterSplitAllowed
- surrenderAllowed
- blackjackPayout
- variant

---

## Hand Scenario

A blackjack situation presented to the user.

Examples:

- Player: Hard 16, Dealer: 10
- Player: A,7, Dealer: 9
- Player: 8,8, Dealer: Ace

### Key Responsibilities

- Represents the situation being practiced
- Connects to one or more skills
- Is evaluated under a specific rule set

### Example Properties

- id
- playerHand
- dealerUpcard
- handType
- ruleset
- relatedSkillIds

---

## Decision

An action chosen by the user or defined as correct strategy.

Possible decisions include:

- Hit
- Stand
- Double
- Split
- Surrender

Future modules may add decisions such as:

- Take Insurance
- Place Bet
- Switch Cards
- Free Double
- Free Split

### Key Responsibilities

- Represents an available action
- Supports evaluation
- Enables feedback and analytics

---

## Practice Session

A focused training session containing one or more hand scenarios or drills.

Examples:

- 20 hard total questions
- Weak skill review
- Daily practice
- Timed basic strategy drill
- Running count drill

### Key Responsibilities

- Presents questions or drills
- Captures user answers
- Measures accuracy and response time
- Produces session results
- Updates mastery

### Example Properties

- id
- userId
- mode
- startedAt
- completedAt
- questionCount
- accuracy
- averageResponseTime

---

## Question

A single prompt shown during a practice session.

Examples:

- What do you do with Hard 16 vs Dealer 10?
- What is the running count after these cards?
- What is the true count with +8 running count and 4 decks remaining?

### Key Responsibilities

- Presents a user-facing challenge
- Records the expected answer
- Records the user's answer
- Connects to one or more skills

---

## Answer Attempt

A user's response to a question.

### Key Responsibilities

- Stores what the user selected
- Stores whether the answer was correct
- Stores response time
- Feeds mastery calculations

### Example Properties

- id
- userId
- questionId
- selectedDecision
- correctDecision
- isCorrect
- responseTimeMs
- answeredAt

---

## Explanation

A teaching response shown after a question.

Examples:

- “Hard 16 vs dealer 10 is a hit because standing loses more often over time.”
- “Always split 8s because 16 is a weak total and two 8s give you two chances to improve.”

### Key Responsibilities

- Teaches why an answer is correct
- Reinforces strategy patterns
- Reduces memorization-only learning

---

## Mastery

A measure of how well a user understands a skill.

Mastery is tracked at multiple levels:

- Skill mastery
- Lesson mastery
- Course mastery
- Academy mastery
- Overall mastery

### Key Responsibilities

- Tracks progress over time
- Drives recommendations
- Determines unlocks and achievements
- Identifies weak skills

### Example Factors

- Accuracy
- Recent performance
- Response speed
- Number of attempts
- Recency of practice
- Difficulty of skill

---

## Recommendation

A suggested next action for the user.

Examples:

- Practice Soft 18 decisions
- Review surrender hands
- Start Card Counting Academy
- Repeat weak skill review
- Complete today’s daily practice

### Key Responsibilities

- Guides the user toward improvement
- Uses mastery and practice history
- Makes the app feel personalized

---

## Achievement

A milestone earned by the user.

Examples:

- Complete first practice session
- Reach 90% accuracy in hard totals
- Maintain a 7-day streak
- Master all pair splits
- Complete Basic Strategy Academy

### Key Responsibilities

- Rewards progress
- Encourages continued use
- Reinforces meaningful milestones

---

## Streak

A measure of consistent practice behavior.

### Key Responsibilities

- Encourages habit formation
- Tracks consecutive active days
- Supports daily practice loops

---

## Challenge

A structured goal or test.

Examples:

- Complete 50 hands with 90% accuracy
- Count down a deck in under 30 seconds
- Finish a daily challenge
- Pass a Basic Strategy final exam

### Key Responsibilities

- Creates focused goals
- Measures readiness
- Adds motivation

---

# Domain Relationships

## High-Level Relationship

```text
User
  └── Practice Sessions
        └── Questions
              └── Answer Attempts
                    └── Mastery Updates

Academy
  └── Courses
        └── Lessons
              └── Skills

Skills
  └── Hand Scenarios
        └── Questions
```

---

## Learning Flow

```text
Academy
  → Course
  → Lesson
  → Skill
  → Practice Session
  → Question
  → Answer Attempt
  → Feedback
  → Mastery Update
  → Recommendation
```

---

# Example: Basic Strategy Flow

1. User enters Basic Strategy Academy.
2. User starts Hard Totals Course.
3. User studies a lesson about hard 12–16.
4. User begins a practice session.
5. System presents Hard 16 vs Dealer 10.
6. User selects Stand.
7. System evaluates the answer as incorrect.
8. System shows explanation.
9. System records the attempt.
10. System updates mastery for Hard 16 vs Dealer 10.
11. System recommends more hard 16 practice if needed.

---

# Example: Card Counting Flow

1. User enters Card Counting Academy.
2. User studies Hi-Lo card values.
3. User starts a running count drill.
4. System shows a sequence of cards.
5. User enters the running count.
6. System evaluates accuracy and speed.
7. System updates mastery for running count skills.
8. System recommends true count training after mastery improves.

---

# Open Questions

- Should Academy and Course both exist in MVP, or should Course be introduced later?
- Should Mastery be calculated immediately in MVP or introduced after basic progress tracking?
- Should Hand Scenario and Skill be separate entities or combined initially?
- Should recommendations be rules-based before becoming adaptive?
- Should achievements be included in MVP or added after user accounts?
- Should card counting share the same Practice Session model as basic strategy?

---

# Notes

This document intentionally avoids database-specific details.

Database schema, API contracts, and application architecture should be derived from this domain model after the core language is stable.
