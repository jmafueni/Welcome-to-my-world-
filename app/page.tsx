"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Disc3,
  BookOpen,
  Shield,
  ArrowUpRight,
  X,
  Play,
  Pause,
  Volume2,
} from "lucide-react";

// ============================================================================
// 1. GÉNÉRATEURS SVG DE SECOURS (MODE HORS-LIGNE / SECOURS CDN)
// ============================================================================

function createAlbumCoverSvg(
  artist: string,
  title: string,
  accent: string,
  secondary: string,
  motif: "HARP" | "TRAP808" | "RUMBA" | "CROWN" | "NOCTURNE" | "GRID"
): string {
  const motifGraphic =
    motif === "HARP"
      ? `<g stroke="${accent}" stroke-width="1.5" opacity="0.75">
          <path d="M90 40 C 90 180, 210 180, 210 260" fill="none" stroke-width="3"/>
          <line x1="110" y1="65" x2="110" y2="240"/>
          <line x1="130" y1="80" x2="130" y2="240"/>
          <line x1="150" y1="95" x2="150" y2="240"/>
          <line x1="170" y1="115" x2="170" y2="240"/>
          <line x1="190" y1="140" x2="190" y2="240"/>
        </g>`
      : motif === "TRAP808"
      ? `<g stroke="${accent}" fill="none">
          <circle cx="150" cy="150" r="88" stroke-width="2" opacity="0.35"/>
          <circle cx="150" cy="150" r="62" stroke-width="4" opacity="0.65"/>
          <circle cx="150" cy="150" r="28" fill="${accent}" opacity="0.25"/>
          <polygon points="150,45 245,215 55,215" stroke="${secondary}" stroke-width="1.5" opacity="0.5"/>
        </g>`
      : motif === "RUMBA"
      ? `<g stroke="${accent}" fill="none">
          <circle cx="150" cy="155" r="44" stroke-width="3" opacity="0.8"/>
          <circle cx="150" cy="155" r="54" stroke-width="1" opacity="0.4"/>
          <line x1="150" y1="20" x2="150" y2="280" stroke-width="1.5" opacity="0.6"/>
          <line x1="142" y1="20" x2="142" y2="280" stroke-width="1" opacity="0.45"/>
          <line x1="158" y1="20" x2="158" y2="280" stroke-width="1" opacity="0.45"/>
        </g>`
      : motif === "CROWN"
      ? `<g stroke="${accent}" fill="none" stroke-width="2">
          <rect x="55" y="55" width="190" height="190" opacity="0.3"/>
          <path d="M75 195 L95 105 L150 155 L205 105 L225 195 Z" fill="${accent}" fill-opacity="0.18"/>
        </g>`
      : motif === "NOCTURNE"
      ? `<g>
          <circle cx="175" cy="125" r="55" fill="${accent}" opacity="0.25"/>
          <circle cx="195" cy="115" r="48" fill="#0B0B0C"/>
          <line x1="40" y1="215" x2="260" y2="215" stroke="${secondary}" stroke-width="1" opacity="0.4"/>
        </g>`
      : `<g stroke="${accent}" stroke-width="1" opacity="0.4">
          <line x1="0" y1="75" x2="300" y2="75"/>
          <line x1="0" y1="150" x2="300" y2="150"/>
          <line x1="0" y1="225" x2="300" y2="225"/>
          <line x1="75" y1="0" x2="75" y2="300"/>
          <line x1="150" y1="0" x2="150" y2="300"/>
          <line x1="225" y1="0" x2="225" y2="300"/>
        </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <defs>
      <radialGradient id="g" cx="30%" cy="25%" r="80%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.28"/>
        <stop offset="60%" stop-color="#141417" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#0B0B0C" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="300" height="300" fill="#0B0B0C"/>
    <rect width="300" height="300" fill="url(#g)"/>
    ${motifGraphic}
    <rect x="14" y="14" width="272" height="272" fill="none" stroke="#F4F1EA" stroke-opacity="0.14" stroke-width="1"/>
    <text x="26" y="42" fill="#9E9EA9" font-family="monospace" font-size="10" letter-spacing="2">${artist.toUpperCase()}</text>
    <text x="26" y="268" fill="#F4F1EA" font-family="Georgia, serif" font-style="italic" font-size="17">${title.slice(0, 26)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createMangaInkSvg(
  kanji: string,
  title: string,
  author: string,
  style: "KINETIC" | "SUMIE" | "NORSE" | "CHESS"
): string {
  const lines =
    style === "KINETIC"
      ? `<g stroke="#F4F1EA" stroke-opacity="0.18" stroke-width="1.5">
          <line x1="0" y1="0" x2="240" y2="160"/>
          <line x1="400" y1="0" x2="240" y2="160"/>
          <line x1="0" y1="320" x2="240" y2="160"/>
          <line x1="400" y1="320" x2="240" y2="160"/>
          <circle cx="240" cy="160" r="48" fill="none" stroke="#D4AF37" stroke-opacity="0.55" stroke-width="2"/>
        </g>`
      : style === "SUMIE"
      ? `<g>
          <path d="M30 260 Q 180 70, 370 110" fill="none" stroke="#F4F1EA" stroke-opacity="0.35" stroke-width="12" stroke-linecap="round"/>
          <path d="M60 280 Q 210 120, 380 145" fill="none" stroke="#C85A32" stroke-opacity="0.4" stroke-width="3"/>
        </g>`
      : style === "NORSE"
      ? `<g stroke="#F4F1EA" stroke-opacity="0.22" fill="none">
          <path d="M50 240 L200 60 L350 240 Z" stroke-width="2"/>
          <line x1="200" y1="40" x2="200" y2="280" stroke="#D4AF37" stroke-opacity="0.5" stroke-width="2"/>
        </g>`
      : `<g stroke="#F4F1EA" stroke-opacity="0.12" stroke-width="1">
          <rect x="40" y="40" width="320" height="240" fill="none"/>
          <line x1="140" y1="40" x2="140" y2="280"/>
          <line x1="260" y1="40" x2="260" y2="280"/>
          <line x1="40" y1="120" x2="360" y2="120"/>
          <line x1="40" y1="200" x2="360" y2="200"/>
        </g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
    <rect width="400" height="320" fill="#0B0B0C"/>
    ${lines}
    <text x="295" y="195" fill="#F4F1EA" fill-opacity="0.09" font-family="serif" font-size="145" font-weight="bold">${kanji}</text>
    <rect x="16" y="16" width="368" height="288" fill="none" stroke="#F4F1EA" stroke-opacity="0.2" stroke-width="1.5"/>
    <text x="30" y="46" fill="#D4AF37" font-family="monospace" font-size="11" letter-spacing="2">${author.toUpperCase()}</text>
    <text x="30" y="282" fill="#F4F1EA" font-family="Georgia, serif" font-size="22" font-style="italic">${title}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ============================================================================
// 2. COLLECTIONS ÉDITORIALES CURATÉES (100% FRANÇAIS • SANS HIÉRARCHIE)
// ============================================================================

export type PillarFilter = "ALL" | "MUSIC" | "MANGA" | "FOOTBALL";
export type MusicCategoryKey = "LYRICISM" | "TRAP" | "ROOTS" | "SPLEEN";
export type MangaCategoryKey = "BENCHMARK" | "MASTERCLASS" | "PHILOSOPHY" | "STYLE";
export type AudioSynthPreset =
  | "HARP_STRINGS"
  | "WESTCOAST_PULSE"
  | "ASPHALT_BOOM"
  | "SUB_808_DARK"
  | "ICY_SYNTH_TRAP"
  | "FAST_HIHAT_TRAP"
  | "TWILIGHT_PAD"
  | "RUMBA_GUITAR"
  | "THRILLER_FUNK"
  | "AFRO_MELODIC"
  | "NOCTURNE_JAZZ"
  | "HYPER_LOVESTORY"
  | "MIDNIGHT_VAPOR";

export interface AlbumEntry {
  id: string;
  artist: string;
  title: string;
  category: MusicCategoryKey;
  categoryLabel: string;
  origin: string;
  rpm: string;
  accentColor: string;
  coverImage: string;
  fallbackCoverSvg: string;
  audioDescription: string;
  synthPreset: AudioSynthPreset;
  editorial: string;
}

export interface MangaEntry {
  id: string;
  title: string;
  author: string;
  category: MangaCategoryKey;
  categoryLabel: string;
  featuredOnCanvas: boolean;
  kanjiMotif: string;
  kanjiChar: string;
  artworkUrl: string;
  fallbackArtworkSvg: string;
  editorial: string;
}

export interface FootballEntry {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  era: string;
  editorial: string;
  tacticalRole: string;
  pitchZone: string;
}

export const MUSIC_CATEGORIES: {
  key: MusicCategoryKey;
  shortLabel: string;
  fullTitle: string;
}[] = [
  {
    key: "LYRICISM",
    shortLabel: "Plume & Lucidité",
    fullTitle: "Plume Chirurgicale & Profondeur Confessionnelle",
  },
  {
    key: "TRAP",
    shortLabel: "Trap & Impact",
    fullTitle: "Impact Brut & Propulsion Sans Filtre",
  },
  {
    key: "ROOTS",
    shortLabel: "Racines & Grâce",
    fullTitle: "Racines, Élégance & Maîtrise Intemporelle",
  },
  {
    key: "SPLEEN",
    shortLabel: "Spleen & Mélodie",
    fullTitle: "Spleen Moderne & Évolution Mélodique",
  },
];

// PILIER 1 : LA SONOTHÈQUE (Collection sans classement ni numérotation)
export const SOUND_SPECTRUM_DATA: AlbumEntry[] = [
  {
    id: "dave-harp",
    artist: "Dave",
    title: "The Boy Who Played the Harp",
    category: "LYRICISM",
    categoryLabel: "Plume Chirurgicale & Profondeur Confessionnelle",
    origin: "Londres-Sud, Royaume-Uni",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#C85A32",
    coverImage:
      "https://static.fnac-static.com/multimedia/Images/FR/NR/ed/d4/28/19453165/1541-1/tsp20251003084032/The-Boy-Who-Played-The-Harp-Vinyle-Jaune.jpg",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Dave",
      "The Boy Who Played the Harp",
      "#C85A32",
      "#D4AF37",
      "HARP"
    ),
    audioDescription: "Cordes ambiantes & boucle de harpe de concert en ré mineur",
    synthPreset: "HARP_STRINGS",
    editorial:
      "Le sommet de l'orfèvrerie du rap britannique. Des schémas de rimes d'une précision chirurgicale qui s'ouvrent sur une vulnérabilité lucide, prouvant que la sincérité brute frappe plus fort que n'importe quelle posture.",
  },
  {
    id: "dosseh-perestroika",
    artist: "Dosseh",
    title: "Perestroïka & Trop tôt pour mourir",
    category: "LYRICISM",
    categoryLabel: "Plume Chirurgicale & Profondeur Confessionnelle",
    origin: "Orléans, France",
    rpm: "Double Vinyle",
    accentColor: "#9E9EA9",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8v4yVZEe0WY_WR7QrPX1CCbKFQ4q7RKxvVryV30Si0w&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Dosseh",
      "Perestroïka & Trop tôt pour mourir",
      "#9E9EA9",
      "#C85A32",
      "CROWN"
    ),
    audioDescription: "Piano mineur bitume & boucle de caisse claire lourde",
    synthPreset: "ASPHALT_BOOM",
    editorial:
      "Une autorité à la voix rocailleuse, un réalisme de bitume et des punchlines existentielles taillées au scalpel.",
  },
  {
    id: "13block-triples",
    artist: "13 Block",
    title: "Triple S",
    category: "TRAP",
    categoryLabel: "Impact Brut & Propulsion Sans Filtre",
    origin: "Sevran, France",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#C85A32",
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    fallbackCoverSvg: createAlbumCoverSvg(
      "13 Block",
      "Triple S",
      "#C85A32",
      "#9E9EA9",
      "TRAP808"
    ),
    audioDescription: "Arpège synthétique glacial & architecture sub-basse",
    synthPreset: "ICY_SYNTH_TRAP",
    editorial:
      "L'alchimie collective à son apogée. Une architecture trap hypnotique, glaciale et avant-gardiste façonnée par Ikaz Boi.",
  },
  {
    id: "kaaris-ornoir2",
    artist: "Kaaris",
    title: "Or Noir Part 2",
    category: "TRAP",
    categoryLabel: "Impact Brut & Propulsion Sans Filtre",
    origin: "Sevran, France",
    rpm: "Vinyle 45 Tours",
    accentColor: "#D4AF37",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGcxBY_tt8b-E96DkNGC5INsqLfd3u1mQxzAYVske-Wg&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Kaaris",
      "Or Noir Part 2",
      "#D4AF37",
      "#C85A32",
      "TRAP808"
    ),
    audioDescription: "Boucle 808 sub-basse sismique & cuivres de Sevran",
    synthPreset: "SUB_808_DARK",
    editorial:
      "Le pilier fondateur de la trap sombre francophone. Des basses sismiques, une imagerie taillée dans le silex et une déflagration sonore implacable.",
  },
  {
    id: "dehmo-ethologie",
    artist: "Dehmo",
    title: "Ethologie",
    category: "TRAP",
    categoryLabel: "Impact Brut & Propulsion Sans Filtre",
    origin: "Paris, France",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#787885",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHEqRcEwiJ3IzeY0MlsU6VcXH7iCKqucXdO5NNsX9Fjw&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Dehmo",
      "Ethologie",
      "#9E9EA9",
      "#C85A32",
      "NOCTURNE"
    ),
    audioDescription: "Nappe synthétique crépusculaire & pulsation sub profonde",
    synthPreset: "TWILIGHT_PAD",
    editorial:
      "Ambiance crépusculaire, débit clinique et étude d'observation froide de la nature humaine.",
  },
  {
    id: "leto-trapstar2",
    artist: "Leto",
    title: "Trapstar 2",
    category: "TRAP",
    categoryLabel: "Impact Brut & Propulsion Sans Filtre",
    origin: "Paris 17e, France",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#9E9EA9",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-GIWrntdYGax9GZVN8oJ2sn2oQkj3UscQyAAssB43hw&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Leto",
      "Trapstar 2",
      "#9E9EA9",
      "#D4AF37",
      "TRAP808"
    ),
    audioDescription: "Roulements de charlestons parisiens & basse élastique",
    synthPreset: "FAST_HIHAT_TRAP",
    editorial:
      "L'urgence parisienne à l'état pur. Des cadences élastiques, des gimmicks inoubliables et une adrénaline de rue sans filtre.",
  },
  {
    id: "fally-droitchemin",
    artist: "Fally Ipupa",
    title: "Droit Chemin",
    category: "ROOTS",
    categoryLabel: "Racines, Élégance & Maîtrise Intemporelle",
    origin: "Kinshasa, RDC",
    rpm: "Pressage Or",
    accentColor: "#C85A32",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEQqYhRmjQMFFWkkgXSZqpfzugzvYOFzZDDgEDPvOgpw&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Fally Ipupa",
      "Droit Chemin",
      "#C85A32",
      "#D4AF37",
      "RUMBA"
    ),
    audioDescription: "Phrase de guitare rumba congolaise acoustique cristalline",
    synthPreset: "RUMBA_GUITAR",
    editorial:
      "L'ascension solitaire de la royauté congolaise. Des guitares rumba acoustiques virtuoses, une chaleur vocale souveraine et une fierté ancestrale.",
  },
  {
    id: "mj-thriller",
    artist: "Michael Jackson",
    title: "Thriller",
    category: "ROOTS",
    categoryLabel: "Racines, Élégance & Maîtrise Intemporelle",
    origin: "Los Angeles, États-Unis",
    rpm: "Gravure Originale",
    accentColor: "#D4AF37",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT48dpQFrluAdzYIUBsXnRAplJTlEL3Qgl7eHd2rjC1MA&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Michael Jackson",
      "Thriller",
      "#D4AF37",
      "#C85A32",
      "CROWN"
    ),
    audioDescription: "Groove synth-basse analogique de studio & pulsation rythmique",
    synthPreset: "THRILLER_FUNK",
    editorial:
      "L'étalon-or intouchable. La production immaculée de Quincy Jones, une discipline de studio obsessionnelle et un groove éternel.",
  },
  {
    id: "kendrick-gnx",
    artist: "Kendrick Lamar",
    title: "GNX",
    category: "LYRICISM",
    categoryLabel: "Plume Chirurgicale & Profondeur Confessionnelle",
    origin: "Compton, États-Unis",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#D4AF37",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcYLoXvyAtiE5c-6htRmSJqqUYenTXblbeKtKi_a15ig&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Kendrick Lamar",
      "GNX",
      "#D4AF37",
      "#C85A32",
      "GRID"
    ),
    audioDescription: "Pulsation grave côte Ouest & cadence rythmique tendue",
    synthPreset: "WESTCOAST_PULSE",
    editorial:
      "Une leçon magistrale de rigueur conceptuelle, de densité culturelle et de précision rythmique sans le moindre artifice.",
  },
  {
    id: "luidji-saison00",
    artist: "Luidji",
    title: "Saison 00",
    category: "SPLEEN",
    categoryLabel: "Spleen Moderne & Évolution Mélodique",
    origin: "Paris, France",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#C85A32",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Wf2qqtfSNBETgcOXo7DJVvSRUbPYrUYXc6paKhTo5A&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Luidji",
      "Saison 00",
      "#C85A32",
      "#9E9EA9",
      "NOCTURNE"
    ),
    audioDescription: "Accords Rhodes jazz nocturnes & progression néo-soul",
    synthPreset: "NOCTURNE_JAZZ",
    editorial:
      "Un récit nocturne parisien tissant jazz, soul et examen sans fard de ses propres contradictions intimes.",
  },
  {
    id: "prototype-farewell",
    artist: "Prototype",
    title: "Farewell",
    category: "SPLEEN",
    categoryLabel: "Spleen Moderne & Évolution Mélodique",
    origin: "France",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#9E9EA9",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNSyTZlbMdu6RXmPPNgkjmZ-SA4Er1rNwj1I3OpGjsng&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Prototype",
      "Farewell",
      "#9E9EA9",
      "#C85A32",
      "NOCTURNE"
    ),
    audioDescription: "Nappe synthwave vaporeuse d'autoroute à minuit",
    synthPreset: "MIDNIGHT_VAPOR",
    editorial:
      "Une mélancolie vaporeuse et futuriste taillée pour les traversées solitaires sur l'autoroute à minuit.",
  },
  {
    id: "theodora-bbls",
    artist: "Théodora",
    title: "Bad Boy Lovestory",
    category: "SPLEEN",
    categoryLabel: "Spleen Moderne & Évolution Mélodique",
    origin: "France // Diaspora",
    rpm: "Vinyle 45 Tours",
    accentColor: "#C85A32",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmz61B_clLNcAQjyUYRTDE5zl-h_gohDMTU8zwcbwTtA&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Théodora",
      "Bad Boy Lovestory",
      "#C85A32",
      "#D4AF37",
      "HARP"
    ),
    audioDescription: "Synthé mélodique infusé d'hyperpop & pulsation deux-temps",
    synthPreset: "HYPER_LOVESTORY",
    editorial:
      "Une énergie hybride addictive mêlant tranchant hyperpop, rap mélodique et vulnérabilité sentimentale à vif.",
  },
  {
    id: "tiakola-wpointm",
    artist: "Tiakola",
    title: "WpointM",
    category: "SPLEEN",
    categoryLabel: "Spleen Moderne & Évolution Mélodique",
    origin: "La Courneuve // ADN Kinshasa",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#D4AF37",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCtIZFhx1UfgleL0QK0e4-LK9RO3afL3AzU4lHWGi2Yw&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Tiakola",
      "WpointM",
      "#D4AF37",
      "#C85A32",
      "RUMBA"
    ),
    audioDescription: "Accords afro-urbains mélodiques & rebond percussif chaleureux",
    synthPreset: "AFRO_MELODIC",
    editorial:
      "L'affirmation soliste de William Mundala. Un pont souverain entre l'ADN mélodique de Kinshasa et les paysages afro-urbains nouvelle génération.",
  },
  {
    id: "tiakola-melo",
    artist: "Tiakola",
    title: "Mélo",
    category: "SPLEEN",
    categoryLabel: "Spleen Moderne & Évolution Mélodique",
    origin: "La Courneuve // Héritage 4Keus",
    rpm: "Vinyle 33 ⅓ Tours",
    accentColor: "#C85A32",
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXm3YLts4kZ2eX9B-Mp8gzJ9omxY2OcuEe1K0IUkO9iw&s=10",
    fallbackCoverSvg: createAlbumCoverSvg(
      "Tiakola",
      "Mélo",
      "#C85A32",
      "#D4AF37",
      "RUMBA"
    ),
    audioDescription: "Phrasé rumba congolaise solaire & rebond moderne",
    synthPreset: "RUMBA_GUITAR",
    editorial:
      "Le premier album solo certifié diamant : une énergie solaire et une science de la mélodie qui ont donné le la au mouvement afro-français.",
  },
];

// PILIER 2 : LE PANTHÉON MANGA (Oeuvres maîtresses avec visuels Pinterest)
export const MANGA_CRUCIBLE_DATA: MangaEntry[] = [
  {
    id: "dragon-ball",
    title: "Dragon Ball",
    author: "Akira Toriyama",
    category: "BENCHMARK",
    categoryLabel: "L'Étalon Absolu",
    featuredOnCanvas: true,
    kanjiMotif: "亀 // GENÈSE",
    kanjiChar: "亀",
    artworkUrl:
      "https://i.pinimg.com/736x/1d/7d/05/1d7d05d01cd445bc2773df2d711ed549.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "亀",
      "Dragon Ball",
      "Akira Toriyama",
      "KINETIC"
    ),
    editorial:
      "Le bloc de genèse. Une brillance cinétique et un dépassement de soi dépourvus de toute malveillance : Goku ne combat ni pour dominer ni pour détruire, mais pour franchir ses propres limites et partager un banquet avec ses rivaux d'hier.",
  },
  {
    id: "vagabond",
    title: "Vagabond",
    author: "Takehiko Inoue",
    category: "PHILOSOPHY",
    categoryLabel: "Épopées Philosophiques (La Force par la Paix)",
    featuredOnCanvas: true,
    kanjiMotif: "空 // ENCRE SUMI-E",
    kanjiChar: "空",
    artworkUrl:
      "https://i.pinimg.com/1200x/3f/11/c3/3f11c3250846232dced70d55373c5a3e.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "空",
      "Vagabond",
      "Takehiko Inoue",
      "SUMIE"
    ),
    editorial:
      "La maîtrise absolue du lavis sumi-e. La quête spirituelle de Musashi démasque le mythe de l'« invincible » comme une illusion creuse, révélant que la maîtrise suprême conduit à déposer le sabre pour cultiver la terre.",
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    author: "Makoto Yukimura",
    category: "PHILOSOPHY",
    categoryLabel: "Épopées Philosophiques (La Force par la Paix)",
    featuredOnCanvas: true,
    kanjiMotif: "和 // VRAI GUERRIER",
    kanjiChar: "和",
    artworkUrl:
      "https://i.pinimg.com/736x/33/02/2b/33022b3c01a95997b884ea582c6a8caf.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "和",
      "Vinland Saga",
      "Makoto Yukimura",
      "NORSE"
    ),
    editorial:
      "L'arc de rédemption ultime. Traverser des champs de bataille gorgés de sang pour atteindre la plus haute vérité martiale : le véritable courage réside dans le refus de la haine et de la vengeance.",
  },
  {
    id: "kingdom",
    title: "Kingdom",
    author: "Yasuhisa Hara",
    category: "PHILOSOPHY",
    categoryLabel: "Épopées Philosophiques (La Force par la Paix)",
    featuredOnCanvas: false,
    kanjiMotif: "将 // UNIFICATION",
    kanjiChar: "将",
    artworkUrl:
      "https://i.pinimg.com/1200x/38/03/91/3803911d30ba4c60c6e9bd8695dcd0a7.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "将",
      "Kingdom",
      "Yasuhisa Hara",
      "NORSE"
    ),
    editorial:
      "Une fresque stratégique monumentale et un commandement de champ de bataille ancrés dans la fraternité, le sacrifice mutuel et la vision d'une paix unifiée.",
  },
  {
    id: "gintama",
    title: "Gintama",
    author: "Hideaki Sorachi",
    category: "MASTERCLASS",
    categoryLabel: "Les Chefs-d'Œuvre de Haute Volée",
    featuredOnCanvas: false,
    kanjiMotif: "銀 // SABRE DE BOIS",
    kanjiChar: "銀",
    artworkUrl:
      "https://i.pinimg.com/736x/87/44/2b/87442b059d1f706c3a0585e62bf3ae5a.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "銀",
      "Gintama",
      "Hideaki Sorachi",
      "SUMIE"
    ),
    editorial:
      "Un miracle narratif capable de basculer de la satire absurde au deuil déchirant en trois cases. Le portrait poignant de vétérans protégeant leur famille choisie avec un simple sabre de bois émoussé.",
  },
  {
    id: "hunter-x-hunter",
    title: "Hunter x Hunter",
    author: "Yoshihiro Togashi",
    category: "MASTERCLASS",
    categoryLabel: "Les Chefs-d'Œuvre de Haute Volée",
    featuredOnCanvas: false,
    kanjiMotif: "念 // ÉCHECS DU NEN",
    kanjiChar: "念",
    artworkUrl:
      "https://i.pinimg.com/736x/cf/4c/16/cf4c16da47740bc95ce133e3f2d93663.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "念",
      "Hunter x Hunter",
      "Yoshihiro Togashi",
      "CHESS"
    ),
    editorial:
      "La tension stratégique à son paroxysme. Le Nen demeure le système de pouvoir le plus rigoureux de la fiction, élevant chaque affrontement au rang de partie d'échecs psychologique sans morale manichéenne.",
  },
  {
    id: "fmab",
    title: "Fullmetal Alchemist",
    author: "Hiromu Arakawa",
    category: "MASTERCLASS",
    categoryLabel: "Les Chefs-d'Œuvre de Haute Volée",
    featuredOnCanvas: false,
    kanjiMotif: "錬 // ÉQUIVALENCE",
    kanjiChar: "錬",
    artworkUrl:
      "https://i.pinimg.com/736x/52/6c/1c/526c1cd2f2bb39cd2acca5b9a1fa4926.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "錬",
      "Fullmetal Alchemist",
      "Hiromu Arakawa",
      "CHESS"
    ),
    editorial:
      "La perfection structurelle. Une logique interne hermétique, aucune case superflue et une critique lucide du militarisme comme de l'orgueil humain.",
  },
  {
    id: "jojo",
    title: "JoJo's Bizarre Adventure",
    author: "Hirohiko Araki",
    category: "STYLE",
    categoryLabel: "Style, Stratégie & Duels",
    featuredOnCanvas: false,
    kanjiMotif: "覚 // POSTURE STAND",
    kanjiChar: "覚",
    artworkUrl:
      "https://i.pinimg.com/originals/f1/3d/6c/f13d6ce6c9ca2b4380d3586959a0d34e.png",
    fallbackArtworkSvg: createMangaInkSvg(
      "覚",
      "JoJo's Bizarre Adventure",
      "Hirohiko Araki",
      "KINETIC"
    ),
    editorial:
      "Des postures haute couture, une audace plastique permanente et des affrontements de Stands d'une inventivité vertigineuse.",
  },
  {
    id: "reborn",
    title: "Katekyo Hitman Reborn!",
    author: "Akira Amano",
    category: "STYLE",
    categoryLabel: "Style, Stratégie & Duels",
    featuredOnCanvas: false,
    kanjiMotif: "炎 // VOLONTÉ VONGOLA",
    kanjiChar: "炎",
    artworkUrl:
      "https://i.pinimg.com/1200x/6b/67/54/6b67549d60a65934baded68bdc0dcf2e.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "炎",
      "Katekyo Hitman Reborn!",
      "Akira Amano",
      "KINETIC"
    ),
    editorial:
      "Une montée en puissance singulière, la flamme de la dernière volonté et une loyauté collective indéfectible.",
  },
  {
    id: "yugioh",
    title: "Yu-Gi-Oh!",
    author: "Kazuki Takahashi",
    category: "STYLE",
    categoryLabel: "Style, Stratégie & Duels",
    featuredOnCanvas: false,
    kanjiMotif: "絆 // DUEL DES OMBRES",
    kanjiChar: "絆",
    artworkUrl:
      "https://i.pinimg.com/736x/c3/6a/d1/c36ad177e03cb693332753a3ef5d3c96.jpg",
    fallbackArtworkSvg: createMangaInkSvg(
      "絆",
      "Yu-Gi-Oh!",
      "Kazuki Takahashi",
      "CHESS"
    ),
    editorial:
      "Mythologie occulte égyptienne, duels psychologiques des ombres et triomphe de la fraternité jurée.",
  },
];

// PILIER 3 : LE TERRAIN (Âge d'Or du Football 1990–2010, sans numérotation)
export const FOOTBALL_LEGACY_DATA: FootballEntry[] = [
  {
    id: "dual-allegiance",
    tag: "DOUBLE ALLÉGEANCE",
    title: "Paris Saint-Germain & Manchester United",
    subtitle: "Parc des Princes × Old Trafford (Ère Sir Alex Ferguson)",
    era: "PILIERS CULTURELS & TACTIQUES",
    tacticalRole: "IDENTITÉ INSTITUTIONNELLE",
    pitchZone: "LES CATHÉDRALES",
    editorial:
      "Paris Saint-Germain et Manchester United sous la houlette de Sir Alex Ferguson : la ferveur incandescente du Parc alliée à la rigueur impériale du Théâtre des Rêves.",
  },
  {
    id: "cr7-benchmark",
    tag: "L'ÉTALON DE LA VOLONTÉ",
    title: "Cristiano Ronaldo (CR7)",
    subtitle: "Sporting CP • Manchester United • Real Madrid • Portugal",
    era: "DISCIPLINE ABSOLUE",
    tacticalRole: "MAÎTRISE DE SOI IMPLACABLE",
    pitchZone: "AILE GAUCHE & FINITION",
    editorial:
      "Cristiano Ronaldo (CR7) — Une éthique de travail incorruptible, une discipline quotidienne obsessionnelle et la quête incessante du dépassement de soi.",
  },
  {
    id: "r9-rooney",
    tag: "LA GRÂCE & LA HARGNE",
    title: "Ronaldo Nazário (R9) & Wayne Rooney",
    subtitle: "La Joie d'O Fenômeno × Le Moteur Total de Rooney",
    era: "GÉNÉRATION 1990–2010",
    tacticalRole: "GÉNIE EXPLOSIF & SACRIFICE",
    pitchZone: "FRONT OFFENSIF",
    editorial:
      "Ronaldo Nazário (R9) pour la pure joie brésilienne et l'accélération foudroyante, associé au moteur féroce de Wayne Rooney et à son sens total du sacrifice collectif.",
  },
  {
    id: "silent-guardians",
    tag: "LES GARDIENS SILENCIEUX",
    title: "Sentinelles défensives & Milieux récupérateurs",
    subtitle: "Génération 1990–2010 (Écoles Française & Brésilienne)",
    era: "ÂGE D'OR 1990–2010",
    tacticalRole: "SENTINELLES & CHARNIÈRES",
    pitchZone: "DOUBLE PIVOT & DÉFENSE CENTRALE",
    editorial:
      "Un hommage aux grandes sentinelles défensives et aux généraux de l'entrejeu du football français et brésilien. Une autorité naturelle et un engagement physique total sans la moindre malveillance gratuite.",
  },
];

// ============================================================================
// 3. SYNTHÉTISEUR AUDIO WEB (MOTEUR DE BOUCLES DE STUDIO)
// ============================================================================

class StudioLoopSynthesizer {
  private ctx: AudioContext | null = null;
  private timerId: number | null = null;
  private isPlaying = false;
  private step = 0;

  public start(preset: AudioSynthPreset) {
    this.stop();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.isPlaying = true;
    this.step = 0;

    const tempoMs =
      preset === "SUB_808_DARK" ||
      preset === "FAST_HIHAT_TRAP" ||
      preset === "ICY_SYNTH_TRAP"
        ? 180
        : preset === "RUMBA_GUITAR" || preset === "AFRO_MELODIC"
        ? 210
        : 250;

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      this.triggerStep(this.ctx, preset, this.step);
      this.step = (this.step + 1) % 16;
    };

    tick();
    this.timerId = window.setInterval(tick, tempoMs);
  }

  private triggerStep(
    ctx: AudioContext,
    preset: AudioSynthPreset,
    step: number
  ) {
    const now = ctx.currentTime;

    if (preset === "HARP_STRINGS") {
      const harpNotes = [
        293.66, 349.23, 440.0, 523.25, 587.33, 440.0, 349.23, 293.66,
      ];
      const freq = harpNotes[step % harpNotes.length];
      this.playPluck(ctx, freq, now, 0.55, "triangle", 0.14);
      if (step % 8 === 0) {
        this.playPad(ctx, 146.83, now, 1.8, 0.08);
      }
    } else if (
      preset === "SUB_808_DARK" ||
      preset === "ICY_SYNTH_TRAP" ||
      preset === "FAST_HIHAT_TRAP"
    ) {
      if (step === 0 || step === 3 || step === 6 || step === 10 || step === 12) {
        const subFreq = step === 10 ? 58.27 : 51.91;
        this.play808(ctx, subFreq, now);
      }
      if (step % 2 === 0) {
        const bellNotes = [311.13, 293.66, 261.63, 246.94];
        this.playPluck(
          ctx,
          bellNotes[(step / 2) % bellNotes.length],
          now,
          0.25,
          "sine",
          0.07
        );
      }
    } else if (preset === "RUMBA_GUITAR" || preset === "AFRO_MELODIC") {
      const rumbaNotes = [
        329.63, 392.0, 493.88, 587.33, 659.25, 493.88, 392.0, 440.0,
      ];
      const freq = rumbaNotes[step % rumbaNotes.length];
      this.playPluck(ctx, freq, now, 0.42, "triangle", 0.15);
      if (step % 4 === 0) {
        this.playPluck(ctx, 164.81, now, 0.5, "sine", 0.12);
      }
    } else if (preset === "THRILLER_FUNK" || preset === "WESTCOAST_PULSE") {
      const bassLine = [
        138.59, 138.59, 164.81, 185.0, 207.65, 185.0, 164.81, 146.83,
      ];
      this.playPluck(
        ctx,
        bassLine[step % bassLine.length],
        now,
        0.28,
        "sawtooth",
        0.11
      );
    } else {
      const scale = [
        261.63, 311.13, 392.0, 466.16, 523.25, 392.0, 311.13, 293.66,
      ];
      this.playPluck(ctx, scale[step % scale.length], now, 0.48, "sine", 0.12);
    }
  }

  private playPluck(
    ctx: AudioContext,
    freq: number,
    time: number,
    duration: number,
    type: OscillatorType,
    gainPeak: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(gainPeak, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private playPad(
    ctx: AudioContext,
    freq: number,
    time: number,
    duration: number,
    gainPeak: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(gainPeak, time + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0008, time + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  private play808(ctx: AudioContext, freq: number, time: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 2.1, time);
    osc.frequency.exponentialRampToValueAtTime(freq, time + 0.07);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.28, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.48);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.5);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

// ============================================================================
// 4. CONFIGURATION DES COURBES RESSORT ("FORCE TRANQUILLE")
// ============================================================================

const QUIET_SPRING = {
  type: "spring" as const,
  stiffness: 180,
  damping: 26,
};

// ============================================================================
// 5. COMPOSANT PRINCIPAL DE LA MONOGRAPHIE
// ============================================================================

export default function KineticSilenceMonograph() {
  const [activeFilter, setActiveFilter] = useState<PillarFilter>("ALL");
  const [activeMusicCat, setActiveMusicCat] =
    useState<MusicCategoryKey>("LYRICISM");
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumEntry>(
    SOUND_SPECTRUM_DATA[0]
  );
  const [playingAlbumId, setPlayingAlbumId] = useState<string | null>(null);
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);

  const [drawerMode, setDrawerMode] = useState<
    | { type: "MUSIC"; initialAlbum?: AlbumEntry }
    | { type: "MANGA"; initialManga?: MangaEntry }
    | { type: "FOOTBALL"; initialCard?: FootballEntry }
    | null
  >(null);

  const synthRef = useRef<StudioLoopSynthesizer | null>(null);

  useEffect(() => {
    synthRef.current = new StudioLoopSynthesizer();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  const togglePlayAlbum = useCallback(
    (album: AlbumEntry) => {
      if (playingAlbumId === album.id) {
        synthRef.current?.stop();
        setPlayingAlbumId(null);
      } else {
        setSelectedAlbum(album);
        synthRef.current?.start(album.synthPreset);
        setPlayingAlbumId(album.id);
      }
    },
    [playingAlbumId]
  );

  const filteredAlbums = useMemo(
    () =>
      SOUND_SPECTRUM_DATA.filter((item) => item.category === activeMusicCat),
    [activeMusicCat]
  );

  const handleMusicCategorySwitch = (cat: MusicCategoryKey) => {
    setActiveMusicCat(cat);
    const firstInCat = SOUND_SPECTRUM_DATA.find((a) => a.category === cat);
    if (firstInCat) setSelectedAlbum(firstInCat);
  };

  const featuredManga = useMemo(
    () => MANGA_CRUCIBLE_DATA.filter((m) => m.featuredOnCanvas),
    []
  );
  const archiveManga = useMemo(
    () => MANGA_CRUCIBLE_DATA.filter((m) => !m.featuredOnCanvas),
    []
  );

  const getTileFocusClass = (tileId: string) => {
    if (!hoveredTileId || hoveredTileId === tileId) {
      return "opacity-100 scale-100";
    }
    return "opacity-75 scale-[0.995]";
  };

  const isSelectedPlaying = playingAlbumId === selectedAlbum.id;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F1EA] selection:bg-[#C85A32] selection:text-[#F4F1EA] relative overflow-x-hidden font-sans antialiased">
      {/* Grain de pellicule / vinyle */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Halo radial ambiant */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[960px] h-[360px] rounded-full blur-[150px] opacity-15 z-0"
        style={{
          background:
            "radial-gradient(circle, #C85A32 0%, #D4AF37 45%, transparent 75%)",
        }}
      />

      {/* ====================================================================
          EN-TÊTE & BARRE DE NAVIGATION
      ==================================================================== */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#0B0B0C]/85 border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C85A32] ring-4 ring-[#C85A32]/20" />
              <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-[#F4F1EA]">
                KINETIC SILENCE
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141417] border border-white/[0.08] font-mono text-[11px] tracking-[0.12em] text-[#9E9EA9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E6F40] animate-pulse" />
              <span>PARIS // KINSHASA // EN PAIX</span>
            </div>

            {playingAlbumId && (
              <button
                onClick={() => {
                  synthRef.current?.stop();
                  setPlayingAlbumId(null);
                }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C85A32]/20 border border-[#C85A32] font-mono text-[11px] text-[#F4F1EA]"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>PLATINE EN COURS : {selectedAlbum.artist} (ARRÊTER)</span>
              </button>
            )}
          </div>

          {/* Filtres de section */}
          <nav
            aria-label="Filtres de la monographie"
            className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#141417] border border-white/[0.08] self-start md:self-auto"
          >
            {(
              [
                { key: "ALL", label: "Tout voir" },
                { key: "MUSIC", label: "La Sonothèque" },
                { key: "MANGA", label: "Le Panthéon Manga" },
                { key: "FOOTBALL", label: "Le Terrain" },
              ] as { key: PillarFilter; label: string }[]
            ).map((pill) => {
              const active = activeFilter === pill.key;
              return (
                <button
                  key={pill.key}
                  onClick={() => setActiveFilter(pill.key)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
                    active
                      ? "text-[#F4F1EA]"
                      : "text-[#9E9EA9] hover:text-[#F4F1EA]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeFilterPill"
                      transition={QUIET_SPRING}
                      className="absolute inset-0 rounded-full bg-[#C85A32] -z-10"
                    />
                  )}
                  <span className="relative z-10">{pill.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ====================================================================
          CONTENEUR ÉDITORIAL & GRILLE BENTO ASYMÉTRIQUE
      ==================================================================== */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 pb-20">
        <section className="mb-8 pb-6 border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C85A32] mb-2">
              MONOGRAPHIE NUMÉRIQUE CURATÉE // AUCUNE HIÉRARCHIE • ESSENTIELS PURS
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl leading-[1.08] tracking-tight text-[#F4F1EA]">
              Puissance brute, précision d&apos;orfèvre et choix délibéré de la paix.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 font-mono text-xs text-[#9E9EA9]">
            <span>ARCHITECTURE : GRILLE BENTO ÉDITORIALE</span>
            <span className="text-[#D4AF37]">
              PILIERS : SONOTHÈQUE • PANTHÉON MANGA • LE TERRAIN
            </span>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-6">
          {/* ================================================================
              PILIER 1 : LA SONOTHÈQUE
          ================================================================ */}
          {(activeFilter === "ALL" || activeFilter === "MUSIC") && (
            <motion.section
              layout
              transition={QUIET_SPRING}
              onMouseEnter={() => setHoveredTileId("TILE_SOUND")}
              onMouseLeave={() => setHoveredTileId(null)}
              whileHover={{ y: -4 }}
              className={`${
                activeFilter === "MUSIC"
                  ? "col-span-12"
                  : "col-span-12 lg:col-span-6"
              } rounded-2xl bg-[#141417] border border-white/[0.08] hover:border-[#C85A32]/50 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group ${getTileFocusClass(
                "TILE_SOUND"
              )}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#C85A32]">
                    <Disc3
                      className={`w-4 h-4 ${
                        playingAlbumId ? "animate-spin" : ""
                      }`}
                      style={{ animationDuration: "4s" }}
                    />
                    <span>[LA SONOTHÈQUE // COLLECTION SANS CLASSEMENT]</span>
                  </div>
                  <button
                    onClick={() =>
                      setDrawerMode({
                        type: "MUSIC",
                        initialAlbum: selectedAlbum,
                      })
                    }
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#9E9EA9] hover:text-[#F4F1EA] bg-[#1E1E24] px-3 py-1.5 rounded-full border border-white/[0.08] transition-colors"
                  >
                    <span>Ouvrir le Bac à Vinyles</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C85A32]" />
                  </button>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] tracking-tight mb-3">
                  La Sonothèque
                </h3>
                <blockquote className="text-sm sm:text-base text-[#9E9EA9] italic border-l-2 border-[#C85A32] pl-4 mb-6 leading-relaxed">
                  « Des basses granitiques de Sevran aux guitares de velours de
                  Kinshasa jusqu&apos;aux confessions du sud de Londres — aucune
                  frontière lorsque l&apos;exigence artistique est absolue. »
                </blockquote>

                {/* Onglets de catégories */}
                <div
                  role="tablist"
                  aria-label="Catégories de la Sonothèque"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 rounded-xl bg-[#0B0B0C] border border-white/[0.06]"
                >
                  {MUSIC_CATEGORIES.map((cat) => {
                    const isActive = activeMusicCat === cat.key;
                    return (
                      <button
                        key={cat.key}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleMusicCategorySwitch(cat.key)}
                        className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all text-center ${
                          isActive
                            ? "bg-[#1E1E24] text-[#F4F1EA] border border-[#C85A32]/50 shadow-sm"
                            : "text-[#9E9EA9] hover:text-[#F4F1EA]"
                        }`}
                      >
                        {cat.shortLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Platine Vinyle Interactive */}
                <div className="bg-[#0B0B0C] border border-white/[0.08] rounded-xl p-5 mb-6 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <motion.div
                      key={selectedAlbum.id}
                      initial={{ opacity: 0.7, scale: 0.96 }}
                      animate={{
                        opacity: 1,
                        scale: isSelectedPlaying ? 1.04 : 1,
                        rotateZ: isSelectedPlaying ? -4 : 0,
                        rotateY: isSelectedPlaying ? -8 : 0,
                      }}
                      whileHover={{ rotateZ: 2.5, scale: 1.04 }}
                      transition={QUIET_SPRING}
                      onClick={() => togglePlayAlbum(selectedAlbum)}
                      className="cursor-pointer relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 group/vinyl"
                    >
                      <div
                        className={`absolute inset-y-1 -right-7 w-30 h-30 sm:w-34 sm:h-34 rounded-full bg-gradient-to-tr from-[#0B0B0C] via-[#24242C] to-[#0B0B0C] border border-white/15 flex items-center justify-center transition-transform duration-500 ${
                          isSelectedPlaying
                            ? "translate-x-3 animate-spin"
                            : "group-hover/vinyl:translate-x-2"
                        }`}
                        style={{ animationDuration: "2.8s" }}
                      >
                        <div
                          className="w-10 h-10 rounded-full border-2 border-[#0B0B0C] flex items-center justify-center"
                          style={{ backgroundColor: selectedAlbum.accentColor }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0B0B0C]" />
                        </div>
                      </div>

                      <img
                        src={selectedAlbum.coverImage}
                        onError={(e) => {
                          e.currentTarget.src = selectedAlbum.fallbackCoverSvg;
                        }}
                        alt={`${selectedAlbum.artist} - ${selectedAlbum.title}`}
                        className="relative z-10 w-full h-full object-cover rounded-lg border border-white/15 shadow-xl"
                      />
                    </motion.div>

                    <div className="flex-1 min-w-0 sm:pl-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#1E1E24] text-[#D4AF37]">
                          ESSENTIEL HORS CLASSEMENT // {selectedAlbum.rpm}
                        </span>
                        <span className="font-mono text-[11px] text-[#9E9EA9]">
                          • {selectedAlbum.origin}
                        </span>
                      </div>

                      <h4 className="font-serif text-2xl text-[#F4F1EA] leading-snug">
                        {selectedAlbum.artist} —{" "}
                        <span className="italic text-[#D4AF37]">
                          {selectedAlbum.title}
                        </span>
                      </h4>

                      <p className="text-sm text-[#F4F1EA]/90 mt-2 leading-relaxed">
                        {selectedAlbum.editorial}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => togglePlayAlbum(selectedAlbum)}
                          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                            isSelectedPlaying
                              ? "bg-[#C85A32] text-[#F4F1EA]"
                              : "bg-[#1E1E24] text-[#F4F1EA] hover:bg-[#C85A32]"
                          }`}
                        >
                          {isSelectedPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Arrêter la Platine</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Écouter l&apos;Extrait</span>
                            </>
                          )}
                        </button>

                        <span className="font-mono text-[11px] text-[#9E9EA9] truncate">
                          {selectedAlbum.audioDescription}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des disques de la catégorie active */}
                <div className="space-y-2.5">
                  {filteredAlbums.map((album) => {
                    const isSelected = selectedAlbum.id === album.id;
                    const isPlaying = playingAlbumId === album.id;
                    return (
                      <motion.div
                        key={album.id}
                        whileHover={{ x: 4 }}
                        transition={QUIET_SPRING}
                        onClick={() => setSelectedAlbum(album)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? "bg-[#1E1E24] border-[#C85A32]/60"
                            : "bg-[#0B0B0C]/60 border-white/[0.06] hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={album.coverImage}
                            onError={(e) => {
                              e.currentTarget.src = album.fallbackCoverSvg;
                            }}
                            alt={album.title}
                            className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-[#F4F1EA] truncate">
                              <span
                                aria-hidden="true"
                                className="font-mono text-xs text-[#C85A32] mr-2"
                              >
                                ✦
                              </span>
                              {album.artist} –{" "}
                              <span className="italic font-serif text-base text-[#D4AF37]">
                                {album.title}
                              </span>
                            </div>
                            <p className="text-xs text-[#9E9EA9] mt-0.5 line-clamp-2">
                              {album.editorial}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayAlbum(album);
                            }}
                            className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border ${
                              isPlaying
                                ? "bg-[#C85A32] border-[#C85A32] text-[#F4F1EA]"
                                : "bg-[#141417] border-white/10 text-[#9E9EA9] hover:text-[#F4F1EA]"
                            }`}
                          >
                            {isPlaying ? "En rotation" : "Tourner"}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================================
              PILIER 2 : LE PANTHÉON MANGA
          ================================================================ */}
          {(activeFilter === "ALL" || activeFilter === "MANGA") && (
            <motion.section
              layout
              transition={QUIET_SPRING}
              onMouseEnter={() => setHoveredTileId("TILE_MANGA")}
              onMouseLeave={() => setHoveredTileId(null)}
              whileHover={{ y: -4 }}
              className={`${
                activeFilter === "MANGA"
                  ? "col-span-12"
                  : "col-span-12 lg:col-span-6"
              } rounded-2xl bg-[#141417] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group ${getTileFocusClass(
                "TILE_MANGA"
              )}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#D4AF37]">
                    <BookOpen className="w-4 h-4" />
                    <span>[LE PANTHÉON MANGA // FRESQUES D&apos;ENCRE & PHILOSOPHIE]</span>
                  </div>
                  <button
                    onClick={() =>
                      setDrawerMode({
                        type: "MANGA",
                        initialManga: MANGA_CRUCIBLE_DATA[0],
                      })
                    }
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#9E9EA9] hover:text-[#F4F1EA] bg-[#1E1E24] px-3 py-1.5 rounded-full border border-white/[0.08] transition-colors"
                  >
                    <span>Explorer le Panthéon Complet</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </button>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] tracking-tight mb-3">
                  Le Panthéon Manga
                </h3>
                <blockquote className="text-sm sm:text-base text-[#9E9EA9] italic border-l-2 border-[#D4AF37] pl-4 mb-6 leading-relaxed">
                  « Du premier Kaméhaméha de l&apos;enfance au serment de
                  Thorfinn : &quot;Je n&apos;ai aucun ennemi.&quot; Le véritable
                  combat ne se livre jamais contre autrui, mais face à
                  soi-même. »
                </blockquote>

                {/* Triptyque d'ouverture */}
                <div className="grid grid-cols-1 gap-3.5 mb-6">
                  {featuredManga.map((manga) => (
                    <motion.article
                      key={manga.id}
                      whileHover={{ x: 4 }}
                      transition={QUIET_SPRING}
                      onClick={() =>
                        setDrawerMode({ type: "MANGA", initialManga: manga })
                      }
                      className="cursor-pointer relative rounded-xl bg-[#0B0B0C] border border-white/[0.1] hover:border-[#F4F1EA]/40 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-hidden group/panel"
                    >
                      <img
                        src={manga.artworkUrl}
                        onError={(e) => {
                          e.currentTarget.src = manga.fallbackArtworkSvg;
                        }}
                        alt={manga.title}
                        className="w-full sm:w-28 h-24 object-cover rounded-lg border border-white/10 shrink-0 grayscale contrast-125 group-hover/panel:grayscale-0 transition-all duration-500"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-[#F4F1EA] text-[#0B0B0C] font-mono text-[10px] font-bold tracking-wider uppercase">
                            {manga.kanjiMotif}
                          </span>
                          <span className="font-mono text-xs text-[#D4AF37]">
                            {manga.author}
                          </span>
                        </div>

                        <h4 className="font-serif text-2xl text-[#F4F1EA] mb-1 group-hover/panel:text-[#D4AF37] transition-colors">
                          {manga.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#F4F1EA]/85 leading-relaxed">
                          {manga.editorial}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Galerie étendue */}
                <div className="rounded-xl bg-[#0B0B0C]/80 border border-white/[0.08] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#9E9EA9]">
                      PILIERS NARRATIFS & DUELS STRATÉGIQUES (CLIQUER POUR LIRE)
                    </span>
                    <span className="font-mono text-[11px] text-[#C85A32]">
                      GALERIE D&apos;ENCRE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {archiveManga.map((work) => (
                      <button
                        key={work.id}
                        onClick={() =>
                          setDrawerMode({ type: "MANGA", initialManga: work })
                        }
                        className="p-2.5 rounded-lg bg-[#141417] hover:bg-[#1E1E24] border border-white/[0.08] hover:border-[#D4AF37]/50 text-left flex items-center gap-3 transition-all group/chip"
                      >
                        <img
                          src={work.artworkUrl}
                          onError={(e) => {
                            e.currentTarget.src = work.fallbackArtworkSvg;
                          }}
                          alt={work.title}
                          className="w-12 h-12 rounded object-cover border border-white/10 shrink-0 grayscale contrast-125 group-hover/chip:grayscale-0 transition-all"
                        />
                        <div className="min-w-0">
                          <div className="font-serif text-sm text-[#F4F1EA] group-hover/chip:text-[#D4AF37] truncate">
                            {work.title}
                          </div>
                          <div className="font-mono text-[10px] text-[#9E9EA9] truncate">
                            {work.author} • {work.kanjiMotif}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================================
              PILIER 3 : LE TERRAIN (ÂGE D'OR DU FOOTBALL 1990–2010)
          ================================================================ */}
          {(activeFilter === "ALL" || activeFilter === "FOOTBALL") && (
            <motion.section
              layout
              transition={QUIET_SPRING}
              onMouseEnter={() => setHoveredTileId("TILE_FOOTBALL")}
              onMouseLeave={() => setHoveredTileId(null)}
              whileHover={{ y: -3 }}
              className={`col-span-12 rounded-2xl bg-[#141417] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all duration-300 p-6 sm:p-8 relative overflow-hidden ${getTileFocusClass(
                "TILE_FOOTBALL"
              )}`}
            >
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#D4AF37] mb-3">
                    <Shield className="w-4 h-4" />
                    <span>[LE TERRAIN • ARCHIVE DE L&apos;ÂGE D&apos;OR 1990–2010]</span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] tracking-tight mb-3">
                    Le Terrain
                  </h3>
                  <blockquote className="text-sm sm:text-base text-[#9E9EA9] italic border-l-2 border-[#D4AF37] pl-4 max-w-3xl">
                    « Les résumés célèbrent les buteurs ; mais ce sont la
                    rigueur tactique, les sentinelles infatigables et les
                    charnières impériales qui bâtissent les dynasties. »
                  </blockquote>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-[#0B0B0C] border border-white/[0.08] font-mono text-xs text-[#F4F1EA]">
                    <span className="text-[#9E9EA9] block text-[10px]">
                      DOUBLE ALLÉGEANCE
                    </span>
                    PARIS SAINT-GERMAIN × MANCHESTER UNITED
                  </div>
                  <button
                    onClick={() =>
                      setDrawerMode({
                        type: "FOOTBALL",
                        initialCard: FOOTBALL_LEGACY_DATA[0],
                      })
                    }
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#F4F1EA] bg-[#1E1E24] hover:bg-[#C85A32] px-4 py-3 rounded-xl border border-white/[0.08] transition-colors"
                  >
                    <span>Ouvrir le Dossier Tactique</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {FOOTBALL_LEGACY_DATA.map((card) => (
                  <motion.article
                    key={card.id}
                    whileHover={{ y: -5 }}
                    transition={QUIET_SPRING}
                    onClick={() =>
                      setDrawerMode({ type: "FOOTBALL", initialCard: card })
                    }
                    className="cursor-pointer rounded-xl bg-[#0B0B0C] border border-[#D4AF37]/25 hover:border-[#D4AF37] p-5 flex flex-col justify-between relative group/pitch shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#D4AF37]">
                          {card.tag}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#141417] text-[#9E9EA9]">
                          {card.era}
                        </span>
                      </div>

                      <h4 className="font-serif text-2xl text-[#F4F1EA] group-hover/pitch:text-[#D4AF37] transition-colors leading-snug mb-1">
                        {card.title}
                      </h4>
                      <p className="font-mono text-[11px] text-[#C85A32] mb-4">
                        {card.subtitle}
                      </p>

                      <p className="text-sm text-[#F4F1EA]/90 leading-relaxed">
                        {card.editorial}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-[#9E9EA9]">
                      <span>ZONE : {card.pitchZone}</span>
                      <span className="text-[#D4AF37]">DOSSIER →</span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {/* ====================================================================
          TIROIR ÉDITORIAL LATÉRAL (SLIDE-OVER)
      ==================================================================== */}
      <AnimatePresence>
        {drawerMode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerMode(null)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={QUIET_SPRING}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl bg-[#141417] border-l border-white/[0.12] shadow-2xl overflow-y-auto p-6 sm:p-10"
            >
              <div className="sticky top-0 z-20 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 py-5 bg-[#141417]/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between mb-8">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#C85A32] block">
                    {drawerMode.type === "MUSIC" &&
                      "LA SONOTHÈQUE // ARCHIVE SANS CLASSEMENT NI HIÉRARCHIE"}
                    {drawerMode.type === "MANGA" &&
                      "LE PANTHÉON MANGA // FRESQUES D'ENCRE & PHILOSOPHIE"}
                    {drawerMode.type === "FOOTBALL" &&
                      "LE TERRAIN // ÂGE D'OR (1990–2010)"}
                  </span>
                  <h3 className="font-serif text-2xl text-[#F4F1EA]">
                    {drawerMode.type === "MUSIC" &&
                      "Bac à Vinyles & Écoute Synthétisée"}
                    {drawerMode.type === "MANGA" &&
                      "Panthéon Narratif & Philosophie Martiale"}
                    {drawerMode.type === "FOOTBALL" &&
                      "Héritage Tactique & Génération Dorée"}
                  </h3>
                </div>

                <button
                  onClick={() => setDrawerMode(null)}
                  aria-label="Fermer le tiroir éditorial"
                  className="p-2.5 rounded-full bg-[#1E1E24] text-[#9E9EA9] hover:text-[#F4F1EA] border border-white/[0.1]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {drawerMode.type === "MUSIC" && (
                <div className="space-y-8">
                  {MUSIC_CATEGORIES.map((category) => (
                    <div key={category.key} className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-[0.15em] text-[#D4AF37] border-b border-white/[0.08] pb-2">
                        {category.fullTitle}
                      </h4>
                      {SOUND_SPECTRUM_DATA.filter(
                        (r) => r.category === category.key
                      ).map((rec) => {
                        const isPlaying = playingAlbumId === rec.id;
                        return (
                          <div
                            key={rec.id}
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 ${
                              drawerMode.initialAlbum?.id === rec.id
                                ? "bg-[#1E1E24] border-[#C85A32]"
                                : "bg-[#0B0B0C] border-white/[0.08]"
                            }`}
                          >
                            <img
                              src={rec.coverImage}
                              onError={(e) => {
                                e.currentTarget.src = rec.fallbackCoverSvg;
                              }}
                              alt={rec.title}
                              className="w-20 h-20 rounded-lg object-cover border border-white/10 shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-serif text-xl text-[#F4F1EA]">
                                  {rec.artist} –{" "}
                                  <em className="text-[#D4AF37]">{rec.title}</em>
                                </span>
                                <span className="font-mono text-[10px] text-[#9E9EA9]">
                                  {rec.origin} // {rec.rpm}
                                </span>
                              </div>
                              <p className="text-sm text-[#F4F1EA]/85 leading-relaxed mb-3">
                                {rec.editorial}
                              </p>
                              <button
                                onClick={() => togglePlayAlbum(rec)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141417] border border-white/15 font-mono text-[11px] text-[#D4AF37] hover:bg-[#C85A32] hover:text-[#F4F1EA]"
                              >
                                {isPlaying ? (
                                  <>
                                    <Pause className="w-3 h-3" />
                                    <span>Arrêter la Boucle</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3" />
                                    <span>
                                      Écouter ({rec.audioDescription})
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {drawerMode.type === "MANGA" && (
                <div className="space-y-4">
                  {MANGA_CRUCIBLE_DATA.map((work) => (
                    <div
                      key={work.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 ${
                        drawerMode.initialManga?.id === work.id
                          ? "bg-[#1E1E24] border-[#D4AF37]"
                          : "bg-[#0B0B0C] border-white/[0.08]"
                      }`}
                    >
                      <img
                        src={work.artworkUrl}
                        onError={(e) => {
                          e.currentTarget.src = work.fallbackArtworkSvg;
                        }}
                        alt={work.title}
                        className="w-full sm:w-28 h-24 rounded-lg object-cover border border-white/10 shrink-0 grayscale contrast-125"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-serif text-xl text-[#F4F1EA]">
                            <em>{work.title}</em>{" "}
                            <span className="text-sm font-sans text-[#9E9EA9]">
                              ({work.author})
                            </span>
                          </span>
                          <span className="font-mono text-[10px] text-[#D4AF37]">
                            {work.kanjiMotif}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-[#9E9EA9] mb-1">
                          {work.categoryLabel}
                        </div>
                        <p className="text-sm text-[#F4F1EA]/85 leading-relaxed">
                          {work.editorial}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerMode.type === "FOOTBALL" && (
                <div className="space-y-4">
                  {FOOTBALL_LEGACY_DATA.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-xl border ${
                        drawerMode.initialCard?.id === item.id
                          ? "bg-[#1E1E24] border-[#D4AF37]"
                          : "bg-[#0B0B0C] border-white/[0.08]"
                      }`}
                    >
                      <div className="font-mono text-[11px] text-[#D4AF37] mb-1">
                        {item.tag} // {item.era}
                      </div>
                      <h4 className="font-serif text-2xl text-[#F4F1EA] mb-1">
                        {item.title}
                      </h4>
                      <p className="font-mono text-xs text-[#C85A32] mb-3">
                        {item.subtitle}
                      </p>
                      <p className="text-sm text-[#F4F1EA]/90 leading-relaxed">
                        {item.editorial}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
