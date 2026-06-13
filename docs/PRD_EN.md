# HistWarship

Version 1 Product Requirements Document (PRD)

## Project Vision

Historic Warships Atlas is a global platform dedicated to preserved historic naval vessels and museum ships.

The platform combines:

* Interactive world map
* Museum ship database
* Visitor information
* Community discussions
* User-generated knowledge

The goal is not only to serve military history enthusiasts, but also to help general visitors discover historic warships around the world, learn their stories, and plan future visits.

---

# Core Philosophy

Most existing resources solve only one part of the problem:

* Wikipedia provides historical information.
* Google Maps provides location information.
* Reddit provides discussions.

Historic Warships Atlas combines these elements into a single experience centered around preserved naval vessels.

## Discovery First

Historic Warships Atlas is designed around discovery rather than popularity.

The goal is to help users discover museum ships they may not already know about, rather than promoting only the most famous vessels.

Version 1 should emphasize exploration and geographic discovery over ranking systems.

## No Ratings Policy

Version 1 intentionally excludes ship rating systems and popularity rankings.

The purpose is to encourage discovery rather than popularity competition.

The platform should allow users to:

1. Discover museum ships they did not know existed.
2. Learn about their history and significance.
3. Plan visits.
4. Share experiences and knowledge.
5. Connect with other enthusiasts.

---

# Target Users

## Casual Visitors

Examples:

* Families with children
* Travelers
* Museum visitors
* History enthusiasts

Typical questions:

* What museum ships are near me?
* Is this worth visiting?
* How long should I spend there?
* What else is nearby?

---

## Naval Enthusiasts

Examples:

* Military history enthusiasts
* Museum ship volunteers
* Researchers
* Preservation supporters

Typical questions:

* What makes this ship unique?
* How complete is the preservation?
* What systems remain intact?
* What restoration work is ongoing?

---

# Scope of Collection

## Included

Preserved naval vessels, including:

* Battleships
* Cruisers
* Destroyers
* Frigates
* Corvettes
* Aircraft carriers
* Submarines
* Amphibious ships
* Minesweepers
* Training ships
* Historic sailing warships
* Missile boats (larger vessels)

Examples:

* USS Salem
* USS Constitution
* USS Midway
* HMS Belfast
* HMS Victory
* Mikasa
* Aurora
* HSwMS Småland

---

## Excluded

* Fishing vessels
* Civilian ships
* Tugboats
* Merchant vessels
* Small patrol boats
* Small torpedo boats
* Pure historical sites with no surviving vessel remains

---

# Platform Structure

## Content Hierarchy

Ships are the primary content entity of the platform.

Museum sites primarily serve as geographic containers and discovery points.

The map is organized around museum sites because multiple ships may exist at a single location.

However, users should be able to discover, search, and discuss individual ships directly.

Examples:

- Map Marker → Battleship Cove
- Museum Site Page → Battleship Cove
- Ship Pages → USS Massachusetts, USS Lionfish, USS Joseph P. Kennedy Jr.

Searching for a ship should always lead directly to the ship page rather than requiring navigation through the museum site page.

---

## Museum Sites

Map markers represent museum sites or locations.

Examples:

* Battleship Cove
* Pearl Harbor
* USS Constitution Museum
* HMS Belfast Site

A site may contain multiple ships.

---

## Ships

Ships are the primary content entities.

Each ship has:

* Dedicated page
* Historical information
* Visitor information
* Community discussions

Users may access ships directly through search.

Example:

Searching "USS Lionfish" should open the USS Lionfish page, even though the map marker belongs to Battleship Cove.

---

# Homepage

Homepage follows a map-first discovery design.

The world map is the primary visual element and should occupy most of the initial viewport.

Users should be able to begin exploring ships immediately without scrolling.

Community content supports discovery and long-term engagement but should not dominate the first-screen experience.

Recommended homepage structure:

1. Navigation Bar
2. Hero Map Section

   * Large interactive map
   * Floating search box
   * Short tagline
3. Recent Discussions
4. Recent Trip Reports
5. Random Discovery

A rotating selection of ships intended to encourage exploration rather than popularity-based recommendations.

---

# Map System

Interactive world map.

Markers represent museum sites.

Users can:

* Zoom
* Search
* Filter
* Explore nearby ships

Filters:

* Country
* Ship Type
* Open Status

Future filters may include:

* Era
* Nation
* Preservation Status

Additional Discovery Features:

* Explore nearby ships
* Explore nearby museum sites

The map should encourage geographic exploration and travel planning.

---

# Search System

Search is a primary navigation mechanism equal in importance to the map.

Users may begin their journey through:

* Map exploration
* Ship search
* Museum search

Search must support:

* Ship names
* Museum names
* Hull numbers
* Classes
* Locations

Examples:

Searching:

* USS Salem
* HMS Belfast
* USS Lionfish
* Balao-class
* Boston

Should all return meaningful results.

---

# Ship Pages

Each ship page includes:

## Hero Section

* Name
* Image
* Location
* Status

---

## Overview

Short introduction.

---

## Why Visit

Highlights explaining why the ship is worth visiting.

Why Visit is one of the platform's key differentiators.

Historical information already exists on Wikipedia and other sources.

Why Visit should answer:

"Why should someone visit this ship in person?"

Why Visit should prioritize practical and experiential value over technical specifications.

The goal is to explain why a visitor may want to experience the ship in person.

Examples:

* Rare surviving vessel
* Unique preservation
* Accessible engineering spaces
* Historical significance

---

## Visitor Information

* Address
* Official Website
* Museum Site
* Accessibility Notes
* Visit Duration Estimate

---

## Visit Notes

User-generated practical information.

Visitor experience information should be considered as important as historical information.

Examples:

* Parking
* Public transportation
* Food nearby
* Accessibility
* Family friendliness

---

## History

Historical overview.

Not intended to be an academic naval history database.

---

## Technical Information

Basic specifications.

---

## Discussions

Ship-specific discussions.

---

# Museum Site Pages

Each site page includes:

* Overview
* Location
* Official Website
* Visitor Information
* Ships Present
* Discussions

Example:

Battleship Cove

Ships:

* USS Massachusetts
* USS Lionfish
* USS Joseph P. Kennedy Jr.

---

# Community System

Two levels of discussion.

## Ship-Centered Community

Community discussions should remain ship-centered.

The platform is not intended to become a general social network.

Community exists to deepen exploration rather than replace it.

The map and discovery experience remain the primary entry point of the platform.

Discussion topics should remain connected to:

* Ships
* Museums
* Naval history
* Preservation projects
* Visiting experiences

## Global Discussions

Topics:

* Naval History
* Museum Visits
* Restoration News
* Photography

---

## Ship Discussions

Attached to specific ships.

Example:

USS Salem Discussions

---

# Content Types

## Discussion

Questions and conversations.

---

## Article

Long-form content.

Examples:

* History articles
* Technical analyses
* Comparisons

---

## Trip Report

Visit experiences.

Examples:

* Photos
* Recommendations
* Travel tips

Trip Reports will be implemented as a tag/category rather than a separate content system.

---

# User Accounts

Guests:

* Browse
* Search
* Read

Registered Users:

* Post
* Comment
* Submit edits

---

# Editing System

Users may suggest:

* Information corrections
* New references
* New ships

Changes require review before publication.

Direct editing is not allowed.

---

# Images

Version 1:

* Official images
* Curated images

Version 2:

* User uploads

---

# Multilingual Support

Interface:

* English
* Chinese

Content:

* Written in any language

Future:

* AI-powered translation

---

# Data Sources

Preferred sources:

1. Official museum websites
2. Official naval organizations
3. Wikipedia
4. Verified community contributions

Each information item should retain source attribution when possible.

---

# Version 1 Technical Stack

Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Leaflet

Backend

* Next.js API Routes

Database

* PostgreSQL
* Prisma ORM

Authentication

* Supabase Auth

Storage

* Supabase Storage

Map Data

* OpenStreetMap

Deployment

* Vercel

---

# Future Versions

## Version 2

* User image uploads
* AI translation
* Edit proposal system
* Expanded moderation tools

## Version 3

* Visited ships tracking
* Collections
* Personal profiles
* Advanced recommendations
* Community contributor reputation

---

# Success Criteria for Version 1

A user should be able to:

1. Discover museum ships on a world map.
2. Search for a specific ship.
3. Learn why a ship is worth visiting.
4. Find practical visitor information.
5. Participate in discussions.
6. Explore related ships and locations.

If these goals are achieved, Version 1 is considered successful.
