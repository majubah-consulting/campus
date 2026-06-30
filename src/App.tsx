import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Archive,
  Award,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlay,
  Clock3,
  Code2,
  Compass,
  FileText,
  GraduationCap,
  Laptop,
  Linkedin,
  Menu,
  MessageSquareText,
  Mic,
  MousePointer2,
  Network,
  PenTool,
  Play,
  Palette,
  Plus,
  Presentation,
  RotateCcw,
  Rocket,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { SplineScene } from './components/SplineScene'

const words = ['autonome', 'productif', 'efficace', 'stratégique', 'performant', 'créatif']

const tools = [
  { name: 'ChatGPT', mark: 'GPT', position: 'one', color: '#22a06b' },
  { name: 'Claude', mark: 'C', position: 'two', color: '#d97757' },
  { name: 'Gemini', mark: '✦', position: 'three', color: '#4f7cf3' },
  { name: 'Copilot', mark: '∞', position: 'four', color: '#8b5cf6' },
  { name: 'NotebookLM', mark: 'N', position: 'five', color: '#3973e6' },
  { name: 'Perplexity', mark: 'P', position: 'six', color: '#208887' },
  { name: 'Mistral', mark: 'M', position: 'seven', color: '#f05b31' },
]

const compassJourneys = [
  {
    label: 'Créer du contenu', icon: PenTool, tools: ['ChatGPT', 'Claude', 'Canva', 'HeyGen', 'Gamma'], text: 'Imaginez, rédigez et déclinez une idée sur tous vos canaux.',
    stat: { value: 22, claim: 'des TPE-PME françaises génèrent déjà textes, voix ou images avec l’IA', source: 'France Num · données 2025', url: 'https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Infographie%20VF.pdf' },
  },
  {
    label: 'Automatiser', icon: Zap, tools: ['Make', 'n8n', 'Copilot', 'Zapier'], text: 'Transformez vos tâches répétitives en systèmes fiables.',
    stat: { value: 5, claim: 'des TPE-PME seulement automatisent aujourd’hui des tâches avec l’IA', source: 'France Num · données 2025', url: 'https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Infographie%20VF.pdf' },
  },
  {
    label: 'Vendre', icon: Target, tools: ['ChatGPT', 'Clay', 'HubSpot', 'Perplexity'], text: 'Préparez vos rendez-vous et personnalisez chaque approche.',
    stat: { value: 14, claim: 'des TPE-PME utilisent déjà chatbots, assistants ou recherche augmentée', source: 'France Num · données 2025', url: 'https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Infographie%20VF.pdf' },
  },
  {
    label: 'Former', icon: GraduationCap, tools: ['NotebookLM', 'Gamma', 'HeyGen', 'Claude'], text: 'Créez des parcours pédagogiques clairs et mémorables.',
    stat: { value: 85, claim: 'des étudiants français utilisent déjà l’IA générative', source: 'Insee · usages 2025, publié en 2026', url: 'https://www.insee.fr/fr/statistiques/8739245' },
  },
  {
    label: 'Manager', icon: Users, tools: ['Claude', 'Notion AI', 'Copilot', 'ChatGPT'], text: 'Synthétisez, décidez et alignez vos équipes plus vite.',
    stat: { value: 50, claim: 'des cadres dirigeants interrogés utilisent des agents IA chaque jour', source: 'Stack Overflow Pulse · avril 2026', url: 'https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work/' },
  },
  {
    label: 'Développer', icon: Rocket, tools: ['Lovable', 'Cursor', 'Replit', 'Claude'], text: 'Passez d’une idée à un produit fonctionnel sans friction.',
    stat: { value: 28, claim: 'des répondants utilisent Lovable parmi les outils no-code agentiques étudiés', source: 'Stack Overflow Pulse · avril 2026', url: 'https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work/' },
  },
  {
    label: 'Analyser', icon: Search, tools: ['Perplexity', 'NotebookLM', 'Gemini', 'ChatGPT'], text: 'Interrogez vos données et faites émerger les bons signaux.',
    stat: { value: 6, claim: 'des TPE-PME analysent ou classent déjà leurs documents avec l’IA', source: 'France Num · données 2025', url: 'https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Infographie%20VF.pdf' },
  },
  {
    label: 'Coder', icon: Code2, tools: ['Cursor', 'Claude', 'GitHub Copilot', 'Replit'], text: 'Concevez, testez et déployez avec un copilote exigeant.',
    stat: { value: 84, claim: 'des développeurs utilisent ou prévoient d’utiliser des outils IA', source: 'Stack Overflow Developer Survey · 2025', url: 'https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/' },
  },
  {
    label: 'Présenter', icon: Presentation, tools: ['Gamma', 'Canva', 'Napkin', 'ChatGPT'], text: 'Structurez un message qui se comprend au premier regard.',
    stat: { value: 37, claim: 'des Français de 16 à 74 ans ont utilisé l’IA générative en 2025', source: 'Insee · publié en 2026', url: 'https://www.insee.fr/fr/statistiques/8739245' },
  },
  {
    label: 'Prospecter', icon: BriefcaseBusiness, tools: ['Clay', 'Apollo', 'Perplexity', 'ChatGPT'], text: 'Identifiez, qualifiez et contactez les bonnes personnes.',
    stat: { value: 26, claim: 'des TPE-PME françaises utilisent désormais au moins une solution d’IA', source: 'France Num · données 2025', url: 'https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2025-le' },
  },
  {
    label: 'Sécuriser', icon: ShieldCheck, tools: ['Claude', 'ChatGPT', 'GitHub Copilot', 'Perplexity'], text: 'Contrôlez les réponses, protégez vos données et gardez la décision humaine.',
    stat: { value: 29, claim: 'des développeurs interrogés seulement déclarent faire confiance à l’IA', source: 'Stack Overflow Developer Survey · 2025', url: 'https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/' },
  },
]

const toolPurpose: Record<string, string> = {
  ChatGPT: 'POLYVALENT', Claude: 'ANALYSER', Canva: 'DESIGN', HeyGen: 'VIDÉO', Gamma: 'PRÉSENTER',
  Make: 'AUTOMATISER', n8n: 'ORCHESTRER', Copilot: 'ASSISTER', Zapier: 'CONNECTER', Clay: 'ENRICHIR',
  HubSpot: 'PILOTER', Perplexity: 'RECHERCHER', NotebookLM: 'SYNTHÉTISER', 'Notion AI': 'ORGANISER',
  Lovable: 'PROTOTYPER', Cursor: 'DÉVELOPPER', Replit: 'CODER', Gemini: 'EXPLORER',
  'GitHub Copilot': 'CODER', Napkin: 'VISUALISER', Apollo: 'PROSPECTER',
}

const monthlyWorkshops = [
  { bookingId: 'atelier-septembre', month: 'AOÛT', date: '27', year: '2026', title: 'Automatiser son activité', label: 'WORKFLOWS', icon: Zap, intro: 'Supprimez une tâche répétitive de votre quotidien sans avoir besoin de coder.', steps: ['Repérer la tâche qui vous fait perdre du temps', 'Dessiner un circuit simple entre vos outils', 'Construire votre première automatisation', 'Tester, corriger et sécuriser son fonctionnement'], deliverable: 'Une automatisation fonctionnelle, prête à être réutilisée.' },
  { bookingId: 'atelier-octobre', month: 'SEPTEMBRE', date: '17', year: '2026', title: 'Créer son assistant IA', label: 'PRODUCTIVITÉ', icon: Bot, intro: 'Créez un assistant qui connaît votre métier, vos consignes et votre façon de travailler.', steps: ['Choisir la mission précise de votre assistant', 'Rédiger ses règles et son ton de réponse', 'Ajouter vos documents et vos exemples', 'Tester ses réponses et améliorer ses consignes'], deliverable: 'Votre assistant IA personnalisé et son guide d’utilisation.' },
  { bookingId: 'atelier-novembre', month: 'OCTOBRE', date: '15', year: '2026', title: 'Produire ses vidéos avec l’IA', label: 'CONTENU', icon: Video, intro: 'Transformez une idée en vidéo professionnelle, même sans expérience en montage.', steps: ['Transformer votre idée en script court', 'Créer les visuels, la voix ou l’avatar', 'Assembler les séquences simplement', 'Ajouter les sous-titres et exporter la vidéo'], deliverable: 'Une vidéo prête à être publiée sur vos canaux.' },
  { bookingId: 'atelier-decembre', month: 'NOVEMBRE', date: '19', year: '2026', title: 'Booster sa visibilité LinkedIn', label: 'VISIBILITÉ', icon: Linkedin, intro: 'Construisez une présence LinkedIn régulière sans passer vos journées à rédiger.', steps: ['Clarifier votre expertise et votre audience', 'Trouver des sujets utiles à partager', 'Créer un calendrier éditorial réaliste', 'Rédiger et améliorer vos premiers contenus'], deliverable: 'Un mois de publications LinkedIn prêtes à être adaptées.' },
  { bookingId: 'atelier-janvier', month: 'DÉCEMBRE', date: '17', year: '2026', title: 'Construire son CRM intelligent', label: 'VENTES', icon: Network, intro: 'Organisez vos prospects et vos relances dans un outil clair et facile à maintenir.', steps: ['Définir les étapes de votre parcours commercial', 'Créer les fiches contacts et opportunités', 'Préparer les rappels et relances automatiques', 'Construire une vue simple pour suivre vos ventes'], deliverable: 'Votre premier CRM opérationnel avec un pipeline lisible.' },
]

type BookingStatus = 'disponible' | 'places limitées' | 'liste d’attente' | 'session pilote' | 'adapté CPF' | 'délai CPF court'

const agendaEvents: ReadonlyArray<{
  id: string; year: number; month: number; day: number; duration: number; dateLabel: string;
  type: 'onsite' | 'remote' | 'workshop'; category: string; title: string; detail: string;
  modality: 'Présentiel' | 'Classe virtuelle'; capacity: string; statuses: BookingStatus[];
}> = [
  { id: 'formation-juillet', year: 2026, month: 6, day: 20, duration: 3, dateLabel: 'du 20 au 22 juillet 2026', type: 'onsite', category: 'Formation IA — 3 jours', title: 'Session en présentiel', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['session pilote', 'places limitées', 'délai CPF court'] },
  { id: 'formation-remote-juillet', year: 2026, month: 6, day: 27, duration: 3, dateLabel: 'du 27 au 29 juillet 2026', type: 'remote', category: 'Formation IA — 3 jours', title: 'Session en classe virtuelle', detail: 'À distance', modality: 'Classe virtuelle', capacity: '8 à 12 participants recommandés', statuses: ['session pilote', 'disponible', 'délai CPF court'] },
  { id: 'atelier-aout', year: 2026, month: 6, day: 30, duration: 1, dateLabel: '30 juillet 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Créer son site internet avec l’IA', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['places limitées', 'session pilote'] },
  { id: 'formation-aout', year: 2026, month: 7, day: 17, duration: 3, dateLabel: 'du 17 au 19 août 2026', type: 'onsite', category: 'Formation IA — 3 jours', title: 'Session en présentiel', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['places limitées', 'disponible'] },
  { id: 'formation-remote-aout', year: 2026, month: 7, day: 24, duration: 3, dateLabel: 'du 24 au 26 août 2026', type: 'remote', category: 'Formation IA — 3 jours', title: 'Session en classe virtuelle', detail: 'À distance', modality: 'Classe virtuelle', capacity: '8 à 12 participants recommandés', statuses: ['disponible'] },
  { id: 'atelier-septembre', year: 2026, month: 7, day: 27, duration: 1, dateLabel: '27 août 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Automatiser son activité', detail: 'À distance', modality: 'Classe virtuelle', capacity: '10 à 15 participants maximum', statuses: ['disponible'] },
  { id: 'formation-septembre', year: 2026, month: 8, day: 7, duration: 3, dateLabel: 'du 7 au 9 septembre 2026', type: 'remote', category: 'Formation IA — 3 jours', title: 'Session en classe virtuelle', detail: 'À distance', modality: 'Classe virtuelle', capacity: '8 à 12 participants recommandés', statuses: ['adapté CPF', 'disponible'] },
  { id: 'atelier-octobre', year: 2026, month: 8, day: 17, duration: 1, dateLabel: '17 septembre 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Créer son assistant IA', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['places limitées', 'adapté CPF'] },
  { id: 'formation-presentiel-septembre', year: 2026, month: 8, day: 21, duration: 3, dateLabel: 'du 21 au 23 septembre 2026', type: 'onsite', category: 'Formation IA — 3 jours', title: 'Session en présentiel', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['adapté CPF', 'places limitées'] },
  { id: 'atelier-novembre', year: 2026, month: 9, day: 15, duration: 1, dateLabel: '15 octobre 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Produire ses vidéos avec l’IA', detail: 'À distance', modality: 'Classe virtuelle', capacity: '10 à 15 participants maximum', statuses: ['disponible'] },
  { id: 'atelier-decembre', year: 2026, month: 10, day: 19, duration: 1, dateLabel: '19 novembre 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Booster sa visibilité LinkedIn', detail: 'Pont-Audemer', modality: 'Présentiel', capacity: '6 participants maximum', statuses: ['places limitées'] },
  { id: 'atelier-janvier', year: 2026, month: 11, day: 17, duration: 1, dateLabel: '17 décembre 2026', type: 'workshop', category: 'Atelier IA — 1 journée', title: 'Construire son CRM intelligent', detail: 'À distance', modality: 'Classe virtuelle', capacity: '10 à 15 participants maximum', statuses: ['disponible'] },
]

const agendaMonths = [
  { year: 2026, month: 6, label: 'Juillet' }, { year: 2026, month: 7, label: 'Août' }, { year: 2026, month: 8, label: 'Septembre' },
  { year: 2026, month: 9, label: 'Octobre' }, { year: 2026, month: 10, label: 'Novembre' }, { year: 2026, month: 11, label: 'Décembre' },
] as const

function openBookingCalendar(eventId?: string) {
  if (eventId) window.dispatchEvent(new CustomEvent('majubah:select-booking', { detail: { eventId } }))
  window.requestAnimationFrame(() => document.getElementById('reserver')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

const faqItems = [
  { q: 'Cette formation est-elle adaptée aux débutants ?', a: 'Oui. Le parcours part des fondamentaux et vous fait progresser par la pratique. Aucun prérequis technique n’est nécessaire.' },
  { q: 'Quels outils vais-je apprendre à utiliser ?', a: 'Vous travaillez avec ChatGPT, Claude, Gemini, Copilot, NotebookLM, Perplexity, Mistral et une sélection d’outils spécialisés selon votre métier.' },
  { q: 'Que se passe-t-il après les 3 jours ?', a: 'Votre apprentissage continue pendant 12 mois dans le Campus MAJUBAH : replays, prompts, ateliers en direct, exercices et communauté.' },
  { q: 'La formation peut-elle être financée ?', a: 'La formation est certifiante et éligible à plusieurs dispositifs de financement, dont le CPF selon votre situation. Nous vous aidons à vérifier votre éligibilité.' },
  { q: 'Puis-je suivre la formation à distance ?', a: 'Oui. Vous pouvez choisir l’expérience présentielle au campus ou la classe virtuelle en direct, avec le même accompagnement.' },
]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ eyebrow, title, body, align = 'center' }: { eyebrow: string; title: ReactNode; body?: string; align?: 'center' | 'left' }) {
  return (
    <Reveal className={`section-heading section-heading--${align}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </Reveal>
  )
}

function AnimatedMetric({ target, label, duration, prefix = '', suffix = '', decimals = 0, scaleMax = target, journey = false }: { target: number; label: string; duration: number; prefix?: string; suffix?: string; decimals?: number; scaleMax?: number; journey?: boolean }) {
  const metricRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const element = metricRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: .38 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    if (reduce) {
      setValue(target)
      return
    }

    let frame = 0
    let startTime = 0
    const smooth = (progress: number) => progress < .5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
    const hardWonProgress = (progress: number) => {
      if (progress < .17) return smooth(progress / .17) * .12
      if (progress < .24) return .12
      if (progress < .46) return .12 + smooth((progress - .24) / .22) * .25
      if (progress < .53) return .37
      if (progress < .75) return .37 + smooth((progress - .53) / .22) * .3
      if (progress < .82) return .67
      return .67 + smooth((progress - .82) / .18) * .33
    }
    const tick = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const eased = journey ? hardWonProgress(progress) : smooth(progress)
      const nextValue = target * eased
      setValue(decimals ? Number(nextValue.toFixed(decimals)) : Math.floor(nextValue))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
      else setValue(target)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [decimals, duration, journey, reduce, started, target])

  const progress = Math.min((value / scaleMax) * 100, 100)
  const formatted = decimals ? value.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : Math.round(value).toLocaleString('fr-FR')

  return (
    <div className={`trainer-metric ${journey ? 'trainer-metric--journey' : ''}`} ref={metricRef} aria-label={`${target}${suffix} ${label}`}>
      <div className="metric-topline"><small>{journey ? 'CHEMIN PARCOURU' : 'INDICATEUR'}</small><span><i /> EN PROGRESSION</span></div>
      <b><em>{prefix}</em>{formatted}<em>{suffix}</em></b>
      <p>{label}</p>
      <div className="metric-track"><motion.i animate={{ width: `${progress}%` }} transition={{ duration: .15, ease: 'linear' }} /></div>
      {journey && <><strong>Pas un raccourci. Mille rencontres, mille ajustements.</strong><div className="metric-milestones"><span>0<small>PREMIER PAS</small></span><span>250<small>APPRENDRE</small></span><span>500<small>AJUSTER</small></span><span>750<small>TRANSMETTRE</small></span><span>1 000<small>CONTINUER</small></span></div></>}
    </div>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`brand ${light ? 'brand--light' : ''}`} aria-label="MAJUBAH Consulting, accueil">
      <span className="brand-mark"><img src="/assets/sigle-orange.png" alt="" /></span>
      <span className="brand-type"><b>MAJUBAH</b><small>CONSULTING</small></span>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="header-inner">
        <Logo light={!scrolled} />
        <nav className="desktop-nav" aria-label="Navigation principale">
          <a href="#programme">Formation</a>
          <a href="#campus-digital">Campus numérique</a>
          <a href="#boussole-inscription">Boussole IA</a>
          <a href="#ateliers">Ateliers</a>
          <a href="#formateur">À propos</a>
        </nav>
        <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }} className="button button--small button--primary header-cta">Réserver <ArrowRight size={16} /></a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Ouvrir le menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {['programme', 'campus-digital', 'boussole-inscription', 'ateliers', 'formateur', 'reserver'].map((id, i) => (
              <a key={id} href={`#${id}`} onClick={(event) => { setOpen(false); if (id === 'reserver') { event.preventDefault(); openBookingCalendar('formation-juillet') } }}>{['Formation', 'Campus numérique', 'Boussole IA', 'Ateliers', 'À propos', 'Réserver'][i]}</a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero() {
  const [word, setWord] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => setWord((current) => (current + 1) % words.length), 2200)
    return () => window.clearInterval(timer)
  }, [reduce])
  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <motion.img
          className="hero-photo"
          src="/assets/campusfinal.png"
          alt="Entrée ouverte sur la salle de formation du campus MAJUBAH à Pont-Audemer"
          initial={reduce ? {} : { scale: 1.045 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="hero-shade" />
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .15 }}>
          <span className="eyebrow eyebrow--light">FORMATION IA CERTIFIANTE</span>
          <h1>Maîtrisez les bases<br />de l’IA en 3 jours<br /><span className="hero-soft">pour être plus</span></h1>
          <div className="word-stage" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[word]}
                initial={{ x: 35, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -35, opacity: 0 }}
                transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
              >
                {words[word]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p>Une formation intensive et pratique pour comprendre, utiliser et intégrer l’IA dans votre quotidien professionnel.</p>
          <div className="hero-actions">
            <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }} className="button button--primary">Réserver une place <ArrowRight size={18} /></a>
            <a href="#immersion" className="button button--glass"><CirclePlay size={19} /> Voir la présentation</a>
          </div>
          <div className="hero-proof">
            <span><Clock3 /><b>3 jours</b></span>
            <span><Award /><b>Certification</b></span>
            <span><ShieldCheck /><b>CPF</b></span>
            <span><Users /><b>+1000 pros</b></span>
          </div>
          <div className="trust-strip"><small>Ils nous font confiance</small><b>CCI NORMANDIE</b><b>CONSTRUCTYS</b><b>AKTO</b><b>ATLAS</b></div>
        </motion.div>
      </div>
      <div className="hero-right">
        <motion.div className="hero-portal-light" aria-hidden="true" animate={reduce ? {} : { opacity: [.42, .68, .42], scale: [1, 1.04, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="session-card glass-card" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .55 }}>
          <CalendarDays />
          <div><span>Prochaine session</span><strong>13 juillet 2026</strong><small><i /> 6 places restantes</small></div>
        </motion.div>
        <motion.div className="floating-card floating-card--one glass-card" animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Laptop /><div><span>Campus inclus</span><b>12 mois</b></div>
        </motion.div>
        <motion.div className="floating-card floating-card--two glass-card" animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay: .4 }}>
          <Award /><div><span>Parcours</span><b>Certifiant</b></div>
        </motion.div>
        <motion.div className="floating-card floating-card--three glass-card" animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: .7 }}>
          <Video /><div><span>Disponible en</span><b>Classe virtuelle</b></div>
        </motion.div>
        <a className="scroll-cue" href="#programme"><span>Entrer dans le campus</span><ArrowDown /></a>
      </div>
    </section>
  )
}

function AIOrchestra() {
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([])
  const [chatThinking, setChatThinking] = useState(false)
  const [activeChatTool, setActiveChatTool] = useState('Nouveau chat')
  const [chatNotice, setChatNotice] = useState('')
  const [chatMode, setChatMode] = useState<'Clair' | 'Expert'>('Clair')
  const reduce = useReducedMotion()
  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rotateX = useSpring(rawRotateX, { stiffness: 110, damping: 24, mass: .7 })
  const rotateY = useSpring(rawRotateY, { stiffness: 110, damping: 24, mass: .7 })

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    rawRotateX.set(y * -3.2)
    rawRotateY.set(x * 4.2)
  }

  const resetTilt = () => {
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  const makeDemoResponse = (prompt: string, step: number) => {
    const value = prompt.toLowerCase()
    const subject = value.includes('automat') ? 'votre automatisation' : value.includes('document') || value.includes('analys') ? 'votre analyse' : value.includes('formation') || value.includes('apprendre') ? 'votre apprentissage' : value.includes('email') || value.includes('mail') ? 'vos communications' : 'votre objectif'
    const progressiveResponses = [
      `Étape 1 — Cadrons le besoin. Pour avancer sur ${subject}, précisez le résultat que vous aimeriez obtenir et la difficulté qui vous fait perdre le plus de temps aujourd’hui. Nous partirons de cette situation réelle.`,
      `Étape 2 — Choisissons un premier cas d’usage. À partir de votre réponse, je vous recommande une action simple, fréquente et mesurable. L’objectif n’est pas de tout transformer, mais d’obtenir rapidement un premier résultat utile.`,
      `Étape 3 — Construisons votre méthode. Nous allons organiser le travail en trois temps : donner le bon contexte à l’IA, vérifier sa proposition, puis conserver ce qui fonctionne dans un modèle réutilisable.`,
      `Étape 4 — Passons à l’autonomie. Votre méthode est maintenant assez claire pour être répétée, améliorée puis automatisée avec une validation humaine. Vous repartez avec un processus concret, pas seulement avec une réponse ponctuelle.`,
    ]
    return progressiveResponses[step % progressiveResponses.length]
  }

  const submitChat = (event: FormEvent) => {
    event.preventDefault()
    const prompt = chatInput.trim()
    if (!prompt || chatThinking) return
    const responseStep = chatMessages.filter((message) => message.role === 'assistant').length
    setChatMessages((messages) => [...messages, { role: 'user', text: prompt }])
    setChatInput('')
    setChatThinking(true)
    window.setTimeout(() => {
      setChatMessages((messages) => [...messages, { role: 'assistant', text: makeDemoResponse(prompt, responseStep) }])
      setChatThinking(false)
    }, reduce ? 0 : 720)
  }

  const activateChatTool = (label: string) => {
    setActiveChatTool(label)
    if (label === 'Nouveau chat') {
      setChatMessages([])
      setChatInput('')
      setChatNotice('Nouvelle conversation prête')
    } else setChatNotice(`${label} sélectionné — démonstration`)
  }

  return (
    <section className="section orchestra" id="programme">
      <div className="container">
        <SectionHeading eyebrow="UNE FORMATION, TOUT L’ÉCOSYSTÈME" title={<>Vous n’apprenez pas ChatGPT.<br /><em>Vous apprenez à travailler avec les meilleures IA.</em></>} />
        <Reveal className="orchestra-perspective">
          <motion.div
            className="orchestra-stage"
            onMouseMove={handlePointerMove}
            onMouseLeave={resetTilt}
            style={reduce ? {} : { rotateX, rotateY, transformPerspective: 1300 }}
            initial={reduce ? false : { opacity: 0, scale: .96, clipPath: 'inset(9% 7% round 38px)' }}
            whileInView={reduce ? {} : { opacity: 1, scale: 1, clipPath: 'inset(0% 0% round 28px)' }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div className="orchestra-flipper" animate={{ rotateY: showChat ? 180 : 0 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 78, damping: 17, mass: .9 }}>
              <div className="orchestra-face orchestra-face--front" aria-hidden={showChat}>
                <motion.img
                  className="orchestra-photo"
                  src="/assets/ai-command-center.jpg"
                  alt="Professionnel orchestrant ChatGPT, Claude, Gemini, Copilot, NotebookLM, Perplexity et Mistral depuis un poste de commandement"
                  loading="lazy"
                  initial={reduce ? false : { scale: 1.09 }}
                  whileInView={reduce ? {} : { scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="orchestra-vignette" />
                <div className="orchestra-scan" />

                <div className="orchestra-system-bar">
                  <span><i /> SYSTÈME MULTI-IA</span>
                  <b>7 modèles connectés</b>
                  <small>MAJUBAH / CONTROL ROOM</small>
                </div>

                {tools.map((tool, index) => (
                  <motion.span
                    className={`ai-hotspot ai-hotspot--${tool.position}`}
                    key={tool.name}
                    title={tool.name}
                    initial={reduce ? false : { opacity: 0, scale: 0 }}
                    whileInView={reduce ? {} : { opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: .55 + index * .08, duration: .4 }}
                  ><i /></motion.span>
                ))}

                <motion.div className="orchestra-command-card" initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={reduce ? {} : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .75, duration: .7 }}>
                  <span><Sparkles /> Vous orchestrez</span>
                  <div><i /> <p>Analysez. Créez. Automatisez.</p></div>
                </motion.div>

                <div className="orchestra-stage-caption"><span>01</span><p>Un seul poste de pilotage.<br /><b>Tout votre écosystème IA.</b></p></div>
                <button className="orchestra-flip-trigger" onClick={() => setShowChat(true)} aria-expanded={showChat}>
                  <MessageSquareText /><span><small>APERÇU INTERACTIF</small><b>Voir une interface IA</b></span><ArrowRight />
                </button>
              </div>

              <div className="orchestra-face orchestra-face--back" aria-hidden={!showChat}>
                <div className="majubah-chat">
                  <aside className="majubah-chat-rail" aria-label="Outils de démonstration MAJUBAH">
                    <button className={activeChatTool === 'Menu' ? 'active' : ''} onClick={() => activateChatTool('Menu')} aria-label="Afficher le menu"><Menu /></button>
                    <span />
                    <button className={activeChatTool === 'Nouveau chat' ? 'active' : ''} onClick={() => activateChatTool('Nouveau chat')} aria-label="Créer une nouvelle conversation"><Plus /></button>
                    <button className={activeChatTool === 'Conversations' ? 'active' : ''} onClick={() => activateChatTool('Conversations')} aria-label="Afficher les conversations"><MessageSquareText /></button>
                    <button className={activeChatTool === 'Documents' ? 'active' : ''} onClick={() => activateChatTool('Documents')} aria-label="Afficher les documents"><Archive /></button>
                    <button className={activeChatTool === 'Projets' ? 'active' : ''} onClick={() => activateChatTool('Projets')} aria-label="Afficher les projets"><Network /></button>
                    <button className={activeChatTool === 'Méthodes' ? 'active' : ''} onClick={() => activateChatTool('Méthodes')} aria-label="Afficher les méthodes"><BriefcaseBusiness /></button>
                    <i />
                    <button className={activeChatTool === 'Code' ? 'active' : ''} onClick={() => activateChatTool('Code')} aria-label="Ouvrir l’espace code"><Code2 /></button>
                    <button className={activeChatTool === 'Tâches' ? 'active' : ''} onClick={() => activateChatTool('Tâches')} aria-label="Ouvrir les tâches"><Check /></button>
                    <button className={activeChatTool === 'Style' ? 'active' : ''} onClick={() => activateChatTool('Style')} aria-label="Personnaliser le style"><Palette /></button>
                    <b />
                    <div className="chat-rail-profile">BB</div>
                  </aside>

                  <div className="majubah-chat-main">
                    <button className="chat-back-button" onClick={() => setShowChat(false)} aria-label="Retourner à la carte des intelligences artificielles"><RotateCcw /><span>Retourner la carte</span></button>
                    <div className={`chat-workspace ${chatMessages.length ? 'has-messages' : ''}`}>
                      {!chatMessages.length ? (
                        <motion.div className="chat-greeting" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                          <span><img src="/assets/sigle-orange.png" alt="Sigle MAJUBAH Consulting" /></span>
                          <h3>Bonsoir, Baudry.</h3>
                        </motion.div>
                      ) : (
                        <div className="chat-thread" aria-live="polite">
                          {chatMessages.map((message, index) => (
                            <motion.div className={`chat-bubble chat-bubble--${message.role}`} key={`${message.role}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                              {message.role === 'assistant' && <span><img src="/assets/sigle-orange.png" alt="" /></span>}
                              <p>{message.text}</p>
                            </motion.div>
                          ))}
                          {chatThinking && <div className="chat-thinking"><i /><i /><i /></div>}
                        </div>
                      )}

                      <form className="chat-composer" onSubmit={submitChat}>
                        <textarea
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                              event.preventDefault()
                              event.currentTarget.form?.requestSubmit()
                            }
                          }}
                          placeholder="Comment puis-je vous aider ?"
                          aria-label="Écrire un message à l’assistant MAJUBAH"
                        />
                        <div className="chat-composer-tools">
                          <button type="button" onClick={() => setChatNotice('Ajout de document simulé')} aria-label="Ajouter un document"><Plus /></button>
                          <span />
                          <button type="button" onClick={() => setChatMode((mode) => mode === 'Clair' ? 'Expert' : 'Clair')} className="chat-model">MAJUBAH Pro <small>{chatMode}</small></button>
                          <button type="button" onClick={() => setChatNotice('Mode vocal simulé')} aria-label="Activer le microphone"><Mic /></button>
                          <button type="submit" className="chat-send" disabled={!chatInput.trim() || chatThinking} aria-label="Envoyer le message"><SendHorizontal /></button>
                        </div>
                      </form>

                      {!chatMessages.length && <div className="chat-quick-actions">
                        <button onClick={() => setChatInput('Aide-moi à écrire un message professionnel')}><PenTool />Écrire</button>
                        <button onClick={() => setChatInput('Construis-moi un plan pour apprendre à utiliser l’IA')}><GraduationCap />Apprendre</button>
                        <button onClick={() => setChatInput('Analyse le contenu de mon Drive')}><FileText />Depuis Drive</button>
                        <button onClick={() => setChatInput('Prépare ma prochaine réunion')}><CalendarDays />Depuis Calendar</button>
                        <button onClick={() => setChatInput('Aide-moi à répondre à mes e-mails')}><MessageSquareText />Depuis Gmail</button>
                      </div>}

                      <div className={`chat-feedback ${chatNotice ? 'visible' : ''}`} role="status">{chatNotice || 'Interface MAJUBAH de démonstration — aucune donnée envoyée'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="orchestra-flow" aria-label="La méthode d'orchestration MAJUBAH">
            {['Comprendre', 'Choisir', 'Combiner', 'Automatiser'].map((step, index) => <div key={step}><span>0{index + 1}</span><b>{step}</b>{index < 3 && <ArrowRight />}</div>)}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Method() {
  const cards = [
    { n: '01', title: 'Formation', text: '3 jours intensifs, guidés par la pratique.', icon: GraduationCap, href: '#programme' },
    { n: '02', title: 'Campus', text: '12 mois pour revoir, approfondir et progresser.', icon: Laptop, href: '#campus-digital' },
    { n: '03', title: 'Ateliers', text: 'Des rendez-vous en direct pour créer vraiment.', icon: WandSparkles, href: '#ateliers' },
    { n: '04', title: 'Autonomie', text: 'Des systèmes concrets pour votre quotidien.', icon: Rocket, href: '#reserver' },
  ]
  return (
    <section className="section method-section" id="methode">
      <div className="container">
        <SectionHeading eyebrow="LA MÉTHODE MAJUBAH" title={<>Pas seulement apprendre.<br /><em>Savoir faire, pour de vrai.</em></>} body="Un parcours continu qui transforme la découverte en réflexes métier." />
        <div className="method-grid">
          <motion.div className="method-path" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: 1.4, delay: .25, ease: [0.22,1,0.36,1] }}><i /></motion.div>
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i*.08}>
              <motion.article className="method-card" whileHover={{ y: -9, scale: 1.015 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}>
                <span className="method-glow" />
                <div className="method-topline"><span>{card.n}</span><small><i /> ÉTAPE ACTIVE</small></div>
                <div className="method-icon"><span /><i /><card.icon /></div>
                <div className="method-copy"><h3>{card.title}</h3><p>{card.text}</p></div>
                <a href={card.href}><span>Explorer</span><i><ArrowRight /></i></a>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Immersion() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const tabletRotateX = useTransform(scrollYProgress, [0, .64], [17, 0])
  const tabletScale = useTransform(scrollYProgress, [0, .64], [.88, 1])
  const tabletY = useTransform(scrollYProgress, [0, .64], [85, 0])

  return (
    <section ref={sectionRef} className="section immersion-section" id="immersion">
      <div className="immersion-orb immersion-orb--one" />
      <div className="immersion-orb immersion-orb--two" />
      <div className="container">
        <Reveal className="immersion-heading">
          <span className="eyebrow eyebrow--light">DÉCOUVRIR MAJUBAH</span>
          <h2>Votre travail ne sera plus<br /><em>jamais le même.</em></h2>
          <p>Découvrez en quelques minutes comment la formation transforme votre façon de travailler avec l’IA.</p>
        </Reveal>

        <motion.div
          className="ipad-scene"
          style={reduce ? {} : { rotateX: tabletRotateX, scale: tabletScale, y: tabletY, transformPerspective: 1400 }}
        >
          <div className="ipad-device">
            <div className="ipad-side-button" />
            <div className="ipad-camera"><i /></div>
            <div className="ipad-screen">
              <AnimatePresence mode="wait" initial={false}>
                {!isPlaying ? (
                  <motion.button
                    key="cover"
                    className="presentation-cover"
                    onClick={() => setIsPlaying(true)}
                    aria-label="Lancer la vidéo de présentation MAJUBAH"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.025 }}
                    transition={{ duration: .45 }}
                  >
                    <img src="/assets/ai-workspace.jpg" alt="Aperçu de la présentation MAJUBAH" loading="lazy" />
                    <span className="presentation-shade" />
                    <span className="presentation-play"><i /><Play fill="currentColor" /></span>
                    <span className="presentation-label"><small>PRÉSENTATION</small><b>Lancer la vidéo</b></span>
                  </motion.button>
                ) : (
                  <motion.div key="video" className="heygen-player" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .5 }}>
                    <video
                      ref={videoRef}
                      src="https://resource2.heygen.ai/video/transcode/c5f83ad7c97a473798d347434347f218/v3598782ec18e460d950181004cf21d62/1280x720_nocap.mp4"
                      poster="https://dynamic.heygen.ai/aws_pacific/avatar_tmp/bfdd401ce108490f93754938d2303582/v3598782ec18e460d950181004cf21d62/c5f83ad7c97a473798d347434347f218.jpeg"
                      aria-label="Vidéo de présentation MAJUBAH"
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                    />
                    <button className="video-close" onClick={() => setIsPlaying(false)} aria-label="Revenir à l’image de présentation"><X /></button>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="ipad-reflection" />
            </div>
          </div>
          <div className="ipad-floor-shadow" />
        </motion.div>

        <Reveal className="immersion-trust">
          <strong>Formation IA certifiante — 3 jours</strong>
          <div><span><Check /> Qualiopi</span><span><Check /> Éligible CPF</span><span><Check /> Campus inclus 12 mois</span></div>
          <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }}>Choisir une session <CalendarDays /></a>
        </Reveal>
      </div>
    </section>
  )
}

function Skills() {
  const items: [LucideIcon, string, string, string][] = [
    [BrainCircuit, 'Dialoguer avec l’IA', 'Formuler les bons contextes et obtenir des réponses fiables.', 'PROMPTING'],
    [FileText, 'Créer plus vite', 'Documents, présentations et contenus prêts à être utilisés.', 'PRODUCTION'],
    [Network, 'Automatiser vos tâches', 'Relier vos outils et supprimer le travail répétitif.', 'WORKFLOWS'],
    [Search, 'Analyser & décider', 'Synthétiser des sources et faire émerger l’essentiel.', 'ANALYSE'],
    [Bot, 'Construire vos assistants', 'Créer des copilotes adaptés à votre façon de travailler.', 'COPILOTES'],
    [ShieldCheck, 'Utiliser l’IA avec méthode', 'Choisir les bons outils et maîtriser les risques.', 'MÉTHODE'],
  ]
  return (
    <section className="section skills-section" id="competences">
      <div className="container split-heading">
        <SectionHeading eyebrow="COMPÉTENCES OBTENUES" title={<>Des capacités qui restent<br /><em>bien après la formation.</em></>} align="left" />
        <Reveal className="skill-intro"><p>Vous repartez avec des méthodes, des modèles et des automatisations directement applicables.</p><span><Check /> Attestation incluse</span></Reveal>
      </div>
      <div className="container skills-grid">
        {items.map(([Icon, title, text, tag], i) => (
          <Reveal key={title} delay={i*.06}>
            <motion.article className="skill-card" whileHover={{ y: -7 }} transition={{ type: 'spring', stiffness: 250, damping: 20 }}>
              <span className="skill-card-glow" />
              <div className="skill-card-top">
                <div className="skill-icon"><span /><i /><Icon /></div>
                <span className="skill-index">0{i+1}</span>
              </div>
              <div className="skill-status"><i /> COMPÉTENCE ACTIVÉE</div>
              <h3>{title}</h3><p>{text}</p>
              <div className="skill-card-footer"><span>{tag}</span><div><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: .18 + i * .08, ease: [0.22,1,0.36,1] }} /></div><ArrowRight /></div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function CampusProgressCounter() {
  const counterRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = counterRef.current
    if (!element) return
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (reduce) {
        setProgress(64)
        return
      }
      let start = 0
      const tick = (time: number) => {
        if (!start) start = time
        const elapsed = Math.min((time - start) / 2800, 1)
        const eased = 1 - Math.pow(1 - elapsed, 4)
        setProgress(Math.round(eased * 64))
        if (elapsed < 1) frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }, { threshold: .5 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [reduce])

  return <div className="progress-pill" ref={counterRef}><span>Progression</span><b>{progress}%</b><i><em style={{ width: `${progress}%` }} /></i><small>PARCOURS IA PRO</small></div>
}

function CampusLaunchCountdown() {
  const launchAt = useMemo(() => new Date('2026-07-30T09:00:00+02:00').getTime(), [])
  const [remaining, setRemaining] = useState(() => Math.max(launchAt - Date.now(), 0))

  useEffect(() => {
    const update = () => setRemaining(Math.max(launchAt - Date.now(), 0))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [launchAt])

  const totalSeconds = Math.floor(remaining / 1000)
  const values = [
    { label: 'JOURS', value: Math.floor(totalSeconds / 86400) },
    { label: 'HEURES', value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: 'MIN', value: Math.floor((totalSeconds % 3600) / 60) },
    { label: 'SEC', value: totalSeconds % 60 },
  ]

  return (
    <motion.div className="campus-countdown" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: .7 }} aria-live="polite">
      <div className="campus-countdown-heading"><span><Clock3 /> OUVERTURE DU CAMPUS</span><b>30 juillet 2026 · 9h00</b><small>Après la session en classe virtuelle des 27, 28 et 29 juillet.</small></div>
      {remaining > 0 ? <div className="campus-countdown-grid">{values.map((item) => <span key={item.label}><b>{String(item.value).padStart(2, '0')}</b><small>{item.label}</small></span>)}</div> : <div className="campus-countdown-ready"><Check /> Le Campus MAJUBAH entre dans sa phase d’ouverture.</div>}
    </motion.div>
  )
}

function DigitalCampus() {
  return (
    <section className="section digital-campus" id="campus-digital">
      <div className="campus-orb campus-orb--one" /><div className="campus-orb campus-orb--two" />
      <div className="container campus-layout">
        <div className="digital-copy">
          <motion.span className="eyebrow eyebrow--light" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .55 }}>LE CAMPUS NUMÉRIQUE</motion.span>
          <h2><motion.span initial={{ opacity: 0, y: 42, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: .75, ease: [0.22,1,0.36,1] }}>La formation se termine.</motion.span><motion.em initial={{ opacity: 0, y: 42, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: .8, delay: .15, ease: [0.22,1,0.36,1] }}>Votre progression continue.</motion.em></h2>
          <motion.i className="digital-title-line" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: .35, ease: [0.22,1,0.36,1] }} />
          <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .65, delay: .25 }}>Cours, ateliers, bibliothèque de prompts et communauté : tout votre apprentissage réuni au même endroit pendant 12 mois.</motion.p>
          <motion.div className="digital-access-pill" initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: .45 }}><i /><span>12 MOIS D’ACCÈS</span><small>OUVERTURE LE 30.07</small></motion.div>
        </div>
        <Reveal className="laptop-scene">
          <div className="laptop-orbit laptop-orbit--one"><i /></div><div className="laptop-orbit laptop-orbit--two"><i /></div>
          <motion.div aria-label="Aperçu du Campus IA MAJUBAH, ouverture le 30 juillet 2026" className="laptop-shell laptop-shell--preview" whileInView={{ rotateX: 0, y: 0, opacity: 1 }} initial={{ rotateX: 10, y: 50, opacity: 0 }} whileHover={{ rotateY: -2.5, rotateX: 1.5, y: -8 }} transition={{ duration: .8, ease: [0.22,1,0.36,1] }} viewport={{ once: true }}>
            <div className="laptop-camera" /><div className="laptop-screen"><img src="/assets/campus-dashboard.jpg" alt="Aperçu du Campus numérique MAJUBAH" loading="lazy" /><span className="laptop-screen-shade" /><span className="laptop-screen-scan" /><div className="laptop-online"><i /> CAMPUS EN PRÉPARATION</div><div className="campus-screen-cta"><span>OUVERTURE LE 30 JUILLET</span><i><Clock3 /></i></div></div><div className="laptop-base"><span /></div>
          </motion.div>
          <CampusProgressCounter />
          <div className="live-pill"><span><i /> LIVE</span><b>Atelier à 14h</b><small>Automatiser vos workflows</small></div>
          <div className="campus-sync-pill"><Network /><span>LANCEMENT PROGRAMMÉ</span><i /></div>
        </Reveal>

        <div className="campus-detail-grid">
          <Reveal className="campus-features-panel">
            <span className="campus-detail-label">DANS VOTRE CAMPUS</span>
            <div className="campus-features">
              {['Parcours guidés et replays', 'Ateliers en direct chaque mois', 'Prompts et cas d’usage métier', 'Communauté de professionnels'].map((item, index) => <motion.span key={item} initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .1 + index * .08 }}><i>{String(index + 1).padStart(2, '0')}</i><Check /><b>{item}</b></motion.span>)}
            </div>
          </Reveal>
          <motion.div className="campus-value-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .12 }}>
            <div><span>INCLUS AVEC LA FORMATION 3 JOURS</span><b>Campus MAJUBAH inclus 12 mois avec la formation IA 3 jours.</b><small>Valeur indicative : 249 € / an</small></div>
            <p>Le Campus sera progressivement enrichi après les premières sessions avec des tutoriels, prompts, ressources, replays et contenus complémentaires.</p>
            <div className="campus-future-price"><span>Ouverture en accès autonome prévue après les premières sessions.</span><b>Tarif fondateur envisagé : 149 € / an</b><small>Prix public prévu : 249 € / an</small></div>
          </motion.div>
          <CampusLaunchCountdown />
        </div>
      </div>
    </section>
  )
}

function Workshops() {
  const [featuredFlipped, setFeaturedFlipped] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const featuredWorkshop = {
    bookingId: 'atelier-aout', month: 'JUILLET', date: '30', year: '2026', title: 'Créer son site internet avec l’IA', label: 'NO-CODE & IA', icon: MousePointer2,
    intro: 'Créez une première version de votre site, même si vous n’avez jamais écrit une ligne de code.',
    steps: ['Choisir l’objectif et les pages indispensables', 'Créer la structure et rédiger les contenus avec l’IA', 'Personnaliser les couleurs, les images et la mise en page', 'Tester le site puis publier une première version en ligne'],
    deliverable: 'Votre site fonctionnel, publié et prêt à être amélioré.',
  }

  const renderWorkshopDetails = (workshop: typeof featuredWorkshop, onBack: () => void, dark = false) => {
    const DetailIcon = workshop.icon
    return (
      <div className={`workshop-detail-card ${dark ? 'workshop-detail-card--dark' : ''}`}>
        <div className="workshop-detail-topline"><span>PROGRAMME DE L’ATELIER</span><small>{workshop.date} {workshop.month} {workshop.year}</small></div>
        <div className="workshop-detail-heading"><span><DetailIcon /></span><div><small>{workshop.label}</small><h3>{workshop.title}</h3></div></div>
        <p>{workshop.intro}</p>
        <div className="workshop-detail-steps">
          {workshop.steps.map((step, index) => <div key={step}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{['COMPRENDRE','CONSTRUIRE','PERSONNALISER','REPARTIR AVEC'][index]}</small><b>{step}</b></span></div>)}
        </div>
        <div className="workshop-deliverable"><Check /><span><small>VOTRE LIVRABLE</small><b>{workshop.deliverable}</b></span></div>
        <div className="workshop-detail-footer">
          <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar(workshop.bookingId) }}>Choisir cette date <CalendarDays /></a>
          <button onClick={onBack}><RotateCcw /> Retour</button>
        </div>
      </div>
    )
  }

  return (
    <section className="section workshops-section" id="ateliers">
      <div className="container">
        <SectionHeading eyebrow="UN ATELIER CHAQUE MOIS" title={<>Un projet concret aujourd’hui.<br /><em>Une nouvelle capacité chaque mois.</em></>} body="Un rendez-vous en direct, un livrable terminé et une trajectoire continue pour progresser toute l’année." />
        <div className="workshop-calendar">
          <Reveal className="workshop-featured">
            <motion.article className="workshop-flip-shell" whileHover={featuredFlipped ? {} : { y: -7 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
              <motion.div className="workshop-card-flipper" animate={{ rotateY: featuredFlipped ? 180 : 0 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 82, damping: 18 }}>
                <div className="workshop-featured-face workshop-featured-face--front" aria-hidden={featuredFlipped}>
                  <div className="featured-orbit featured-orbit--outer"><i /><b /></div>
                  <div className="featured-orbit featured-orbit--inner"><i /></div>
                  <div className="featured-workshop-topline"><span><i /> ATELIER DU MOIS</span><small>01 / 06</small></div>
                  <div className="featured-workshop-date"><strong>30</strong><span>JUILLET<br /><small>2026 · 14H–17H</small></span></div>
                  <div className="featured-workshop-core"><span /><MousePointer2 /></div>
                  <div className="featured-workshop-copy">
                    <small>NO-CODE & INTELLIGENCE ARTIFICIELLE</small>
                    <h3>Créer son site internet<br />avec l’IA.</h3>
                    <p>De l’idée à une première version en ligne : structure, contenus, design et publication guidés pas à pas.</p>
                    <div><span><Clock3 /> 3h en direct</span><span><FileText /> 1 site livré</span><span><Users /> 12 places</span></div>
                    <button onClick={() => setFeaturedFlipped(true)}>Découvrir le programme <ArrowRight /></button>
                  </div>
                </div>
                <div className="workshop-featured-face workshop-featured-face--back" aria-hidden={!featuredFlipped}>{renderWorkshopDetails(featuredWorkshop, () => setFeaturedFlipped(false), true)}</div>
              </motion.div>
            </motion.article>
          </Reveal>

          <Reveal className="workshop-monthly-rail" delay={.08}>
            <motion.div className="monthly-card-flipper" animate={{ rotateY: selectedWorkshop === null ? 0 : 180 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 82, damping: 18 }}>
              <div className="workshop-monthly-face workshop-monthly-face--front" aria-hidden={selectedWorkshop !== null}>
                <div className="monthly-rail-heading"><div><span>PROCHAINES ORBITES</span><h3>Votre programmation</h3></div><small>2026</small></div>
                <div className="monthly-orbit-line"><motion.i initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.3, ease: [0.22,1,0.36,1] }} /></div>
                <div className="monthly-workshop-list">
                  {monthlyWorkshops.map((item, index) => (
                    <motion.button onClick={() => setSelectedWorkshop(index)} className="monthly-workshop" key={item.month} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: .14 + index * .09 }} whileHover={{ x: 7 }}>
                      <div className="monthly-date"><strong>{item.date}</strong><span>{item.month}<small>{item.year}</small></span></div>
                      <span className="monthly-node"><i /><item.icon /></span>
                      <div className="monthly-copy"><small>{item.label}</small><b>{item.title}</b></div>
                      <span className="monthly-arrow"><ArrowRight /></span>
                    </motion.button>
                  ))}
                </div>
                <div className="monthly-rail-footer"><span><i /> 6 rendez-vous · 6 livrables</span><small>Cliquez sur un atelier pour voir son programme</small></div>
              </div>
              <div className="workshop-monthly-face workshop-monthly-face--back" aria-hidden={selectedWorkshop === null}>
                {selectedWorkshop !== null && renderWorkshopDetails(monthlyWorkshops[selectedWorkshop], () => setSelectedWorkshop(null))}
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Trainer() {
  return (
    <section className="section trainer-section" id="formateur">
      <div className="container trainer-layout">
        <Reveal className="trainer-photo-wrap">
          <div className="trainer-orbit trainer-orbit--one" /><div className="trainer-orbit trainer-orbit--two" />
          <div className="trainer-shape" />
          <motion.div className="trainer-photo-frame" whileHover={{ y: -8, rotateY: -2, rotateX: 1.5 }} transition={{ type: 'spring', stiffness: 180, damping: 18 }}>
            <img src="/assets/baudry.jpg" alt="Baudry Bahuna, fondateur et formateur MAJUBAH Consulting" loading="lazy" />
            <span className="trainer-photo-scan" /><span className="trainer-photo-index">MAJUBAH / 01</span>
          </motion.div>
          <motion.div className="trainer-quote" initial={{ opacity: 0, x: 35, rotate: 2 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: .55, duration: .7 }}>“Comprendre l’IA, c’est surtout apprendre à mieux décider.”<small>— BAUDRY BAHUNA</small></motion.div>
          <div className="trainer-field-note"><i /><span>TRANSMISSION<br />EN MOUVEMENT</span></div>
        </Reveal>
        <div className="trainer-copy">
          <div className="trainer-heading">
            <motion.span className="eyebrow" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .55 }}>VOTRE FORMATEUR</motion.span>
            <h2><motion.span initial={{ opacity: 0, y: 45, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: .75, ease: [0.22,1,0.36,1] }}>Baudry Bahuna.</motion.span><motion.em initial={{ opacity: 0, y: 45, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: .8, delay: .15, ease: [0.22,1,0.36,1] }}>La technologie, en langage humain.</motion.em></h2>
            <motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: .35, ease: [0.22,1,0.36,1] }} />
          </div>
          <Reveal className="trainer-intro"><p>Consultant et formateur, Baudry accompagne les professionnels dans l’adoption concrète de l’intelligence artificielle.</p><strong>Moins de théorie abstraite. Plus d’autonomie dès le lendemain.</strong></Reveal>
          <Reveal className="trainer-stats">
            <AnimatedMetric target={1000} prefix="+" label="professionnels formés" duration={8200} journey />
            <AnimatedMetric target={4.9} suffix="/5" decimals={1} scaleMax={5} label="satisfaction moyenne" duration={3600} />
            <AnimatedMetric target={100} suffix="%" label="orienté pratique" duration={4300} />
          </Reveal>
          <Reveal><a className="linkedin-link" href="https://www.linkedin.com/in/baudry-bahuna/" target="_blank" rel="noreferrer"><Linkedin /> Suivre le parcours sur LinkedIn <ArrowRight /></a></Reveal>
        </div>
      </div>
    </section>
  )
}

function CampusJourney() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isCompact, setIsCompact] = useState(false)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const mediaWidth = useTransform(scrollYProgress, [0, .72], [isCompact ? '78vw' : '34vw', '100vw'])
  const mediaHeight = useTransform(scrollYProgress, [0, .72], [isCompact ? '48vh' : '54vh', '100vh'])
  const mediaRadius = useTransform(scrollYProgress, [0, .68], [isCompact ? 22 : 30, 0])
  const exteriorScale = useTransform(scrollYProgress, [0, .72], [1, 1.1])
  const firstTitleX = useTransform(scrollYProgress, [0, .5], ['0vw', '-105vw'])
  const secondTitleX = useTransform(scrollYProgress, [0, .5], ['0vw', '105vw'])
  const revealX = useTransform(scrollYProgress, [0, .58, .76], ['-120vw', '-120vw', '0vw'])
  const kickerX = useTransform(scrollYProgress, [0, .48], ['0vw', '-45vw'])
  const cueX = useTransform(scrollYProgress, [0, .3], ['0vw', '65vw'])

  return (
    <section id="campus-physique" ref={sectionRef} className="campus-expand" aria-label="Découverte immersive du campus MAJUBAH">
      <div className="campus-expand-sticky">
        <motion.div className="campus-expand-bg" style={reduce ? {} : { scale: exteriorScale }}>
          <img src="/assets/campusfinal.png" alt="Entrée ouverte du campus MAJUBAH à Pont-Audemer" loading="lazy" />
          <div />
        </motion.div>

        <motion.div className="campus-expand-kicker" style={reduce ? { display: 'none' } : { x: kickerX }}><span>01</span><div><small>PONT-AUDEMER</small><b>Le campus physique</b></div></motion.div>

        <motion.div className="campus-expand-title" style={reduce ? { display: 'none' } : undefined} aria-hidden="true">
          <motion.h2 style={reduce ? {} : { x: firstTitleX }}>Passez la porte.</motion.h2>
          <motion.h2 style={reduce ? {} : { x: secondTitleX }}>Entrez dans l’IA.</motion.h2>
        </motion.div>

        <motion.div
          className="campus-media-frame"
          style={reduce ? { width: '100vw', height: '100vh', borderRadius: 0 } : { width: mediaWidth, height: mediaHeight, borderRadius: mediaRadius }}
        >
          <img src="/assets/campus-interior.jpg" alt="Salle de formation du campus MAJUBAH" loading="lazy" />
          <div className="campus-media-shade" />
          <div className="campus-frame-label"><span>MAJUBAH</span><i /> <small>FORMATION ROOM</small></div>
        </motion.div>

        <motion.div className="campus-expanded-copy" style={reduce ? { x: '0vw' } : { x: revealX }}>
          <span>02 — VOUS ÊTES ARRIVÉ</span>
          <h2>Tout est prêt<br />pour apprendre.</h2>
          <p>Un espace conçu pour pratiquer, échanger<br />et repartir avec de vrais réflexes.</p>
          <div><small><Users /> 12 participants max.</small><small><Laptop /> Équipement premium</small></div>
        </motion.div>

        <motion.div className="campus-scroll-cue" style={reduce ? { display: 'none' } : { x: cueX }}>
          <MousePointer2 /><span>Faites défiler pour entrer</span><i />
        </motion.div>
        <div className="campus-progress"><motion.i style={{ scaleY: scrollYProgress }} /></div>
      </div>
    </section>
  )
}

function Modes() {
  return (
    <section className="section modes-section" id="formats">
      <div className="container">
        <SectionHeading eyebrow="DEUX FAÇONS DE NOUS REJOINDRE" title={<>Même intensité.<br /><em>À vous de choisir le lieu.</em></>} />
        <div className="modes-grid">
          <Reveal><motion.article className="mode-card mode-card--physical" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}><span className="mode-glow" /><div className="mode-orbit mode-orbit--outer"><i /><b /></div><div className="mode-orbit mode-orbit--inner"><i /></div><div className="mode-topline"><div className="mode-icon"><span /><Users /></div><small><i /> 12 PLACES</small></div><span>AU CAMPUS</span><h3>Présentiel</h3><p>Une immersion complète, des échanges spontanés et l’énergie du groupe.</p><ul><li><Check /> Pont-Audemer</li><li><Check /> Déjeuner inclus</li><li><Check /> 12 participants max.</li></ul><a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }}><span>Choisir le présentiel</span><i><ArrowRight /></i></a></motion.article></Reveal>
          <Reveal delay={.08}><motion.article className="mode-card mode-card--virtual" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}><span className="mode-glow" /><div className="mode-orbit mode-orbit--outer"><i /><b /></div><div className="mode-orbit mode-orbit--inner"><i /></div><div className="mode-topline"><div className="mode-icon"><span /><Video /></div><small><i /> LIVE</small></div><span>EN DIRECT</span><h3>Classe virtuelle</h3><p>La même pédagogie, depuis votre bureau, avec un accompagnement en temps réel.</p><ul><li><Check /> Partout en France</li><li><Check /> Sessions interactives</li><li><Check /> Replays disponibles</li></ul><a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-remote-juillet') }}><span>Choisir la classe virtuelle</span><i><ArrowRight /></i></a></motion.article></Reveal>
        </div>
      </div>
    </section>
  )
}

function AICompass() {
  const [active, setActive] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [hovered, setHovered] = useState(false)
  const reduce = useReducedMotion()
  const journey = compassJourneys[active]
  const orbitPaused = reduce || !autoRotate || hovered

  const selectJourney = (index: number) => {
    setActive(index)
    setAutoRotate(false)
  }

  const moveJourney = (direction: number) => {
    const next = (active + direction + compassJourneys.length) % compassJourneys.length
    selectJourney(next)
  }

  return (
    <section className="section compass-section" id="boussole">
      <div className="container">
        <SectionHeading eyebrow="LA BOUSSOLE IA" title={<>Quel est votre objectif ?<br /><em>La boussole trace votre parcours.</em></>} body="11 objectifs, 11 usages et 11 chiffres sourcés pour comprendre où l’IA est déjà vraiment adoptée." />
        <div className="compass-layout">
          <motion.div
            className="compass-orbit-stage"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') moveJourney(1)
              if (event.key === 'ArrowLeft') moveJourney(-1)
            }}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, scale: .92, rotate: -4 }}
            whileInView={reduce ? {} : { opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: .25 }}
            transition={{ duration: .9, ease: [0.22,1,0.36,1] }}
          >
            <div className="orbit-grid" />
            <div className="orbit-rings"><span /><span /><span /></div>
            <div className="orbit-particle orbit-particle--one" /><div className="orbit-particle orbit-particle--two" /><div className="orbit-particle orbit-particle--three" />

            <div className={`orbit-track ${orbitPaused ? 'paused' : ''}`}>
            {compassJourneys.map((item, i) => {
                const angle = (i * 360) / compassJourneys.length - 90
                const related = i !== active && journey.tools.some((tool) => item.tools.includes(tool))
                return (
                  <button
                    key={item.label}
                    className={`orbit-node ${active === i ? 'active' : ''} ${related ? 'related' : ''}`}
                    onClick={() => selectJourney(i)}
                    style={{ '--node-angle': `${angle}deg` } as React.CSSProperties}
                    aria-label={`Explorer le parcours ${item.label}`}
                    aria-pressed={active === i}
                  >
                    <span className="orbit-node-content"><span className="orbit-node-core"><item.icon /><b>{item.label}</b><i /></span></span>
                  </button>
                )
            })}
            </div>

            <button className="orbit-center" onClick={() => setAutoRotate((value) => !value)} aria-label={autoRotate ? 'Mettre la boussole en pause' : 'Relancer la rotation de la boussole'}>
              <span><img src="/assets/sigle-orange.png" alt="" /></span>
              <small>VOTRE CAP</small><b>{journey.label}</b>
              <i className={autoRotate ? 'running' : ''} />
            </button>
            <div className="orbit-status"><span className={orbitPaused ? '' : 'live'} /><b>{orbitPaused ? 'ORBIT PAUSED' : 'ORBIT LIVE'}</b><small>Utilisez ← → pour explorer</small></div>
          </motion.div>

          <Reveal className="compass-result-stack" delay={.1}>
            <span className="result-ghost result-ghost--one" /><span className="result-ghost result-ghost--two" />
            <AnimatePresence mode="wait">
              <motion.article className="compass-result" key={journey.label} initial={{ opacity: 0, x: 42, rotateY: 8, scale: .96 }} animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }} exit={{ opacity: 0, x: -28, rotateY: -6, scale: .97 }} transition={{ duration: .42, ease: [0.22,1,0.36,1] }}>
                <div className="result-topline"><span className="result-index">PARCOURS {String(active + 1).padStart(2, '0')}</span><button onClick={() => setAutoRotate(true)}><Zap /> Relancer l’orbite</button></div>
                <journey.icon className="result-icon" /><h3>{journey.label}</h3><p>{journey.text}</p>
                <a className="result-adoption" href={journey.stat.url} target="_blank" rel="noreferrer" aria-label={`Consulter la source du chiffre ${journey.stat.value} %`}>
                  <span className="adoption-ring" style={{ '--stat-value': journey.stat.value } as React.CSSProperties}><strong>{journey.stat.value}%</strong></span>
                  <span><b>{journey.stat.claim}</b><small>{journey.stat.source} · Voir la source</small></span>
                  <ArrowRight />
                </a>
                <div className="tool-list">{journey.tools.map((tool, i) => <motion.span key={tool} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .08 + i * .06 }}><i>{i+1}</i>{tool}<small>{toolPurpose[tool] ?? 'À EXPLORER'}</small></motion.span>)}</div>
                <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }} className="button button--primary">Choisir une session <CalendarDays /></a>
                <div className="result-nav">
                  <button onClick={() => moveJourney(-1)} aria-label="Parcours précédent"><ArrowLeft /><span>Précédent</span></button>
                  <div><span>{String(active + 1).padStart(2, '0')} / {compassJourneys.length}</span><i><motion.b animate={{ width: `${((active + 1) / compassJourneys.length) * 100}%` }} transition={{ duration: .45, ease: [0.22,1,0.36,1] }} /></i></div>
                  <button onClick={() => moveJourney(1)} aria-label="Parcours suivant"><span>Suivant</span><ArrowRight /></button>
                </div>
              </motion.article>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

type CompassSignupSource = 'section-boussole' | 'footer-boussole'

function CompassSignup({ source, compact = false }: { source: CompassSignupSource; compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submitSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setStatus('error')
      setMessage('Veuillez saisir une adresse email valide.')
      return
    }
    if (!consent) {
      setStatus('error')
      setMessage('Votre consentement est nécessaire pour recevoir La Boussole IA.')
      return
    }

    const subscription = {
      email: normalizedEmail,
      consent: true,
      subscribedAt: new Date().toISOString(),
      source,
    }
    window.dispatchEvent(new CustomEvent('majubah:boussole-signup', { detail: subscription }))
    setStatus('success')
    setMessage('Merci, votre inscription à La Boussole IA est bien prise en compte.')
  }

  return (
    <section id={source === 'section-boussole' ? 'boussole-inscription' : undefined} className={`compass-signup compass-signup--${compact ? 'closing' : 'editorial'}`}>
      <div className="container">
        <Reveal className="compass-signup-card">
          <div className="compass-signup-copy">
            <span className="compass-signup-mark"><Compass /><i /></span>
            <div>
              <small>{compact ? 'LE RENDEZ-VOUS HEBDOMADAIRE' : 'LA LETTRE ÉDITORIALE MAJUBAH'}</small>
              <h2>{compact ? 'Pas encore prêt à vous former ?' : 'La Boussole IA'}</h2>
              <p>{compact ? 'Recevez chaque semaine La Boussole IA : une méthode, un outil ou un cas d’usage concret pour mieux utiliser l’intelligence artificielle dans votre activité professionnelle.' : 'Une fois par semaine, recevez une méthode, un outil ou un cas d’usage concret pour mieux travailler avec l’intelligence artificielle.'}</p>
            </div>
          </div>
          <form className="compass-signup-form" onSubmit={submitSignup} noValidate>
            {status === 'success' ? (
              <div className="compass-signup-success" role="status"><span><Check /></span><p>{message}</p></div>
            ) : (
              <>
                <div className="compass-signup-field">
                  <label htmlFor={`boussole-email-${source}`}>Votre adresse email</label>
                  <input id={`boussole-email-${source}`} type="email" inputMode="email" autoComplete="email" placeholder="vous@entreprise.fr" value={email} onChange={(event) => { setEmail(event.target.value); if (status === 'error') setStatus('idle') }} aria-describedby={`boussole-message-${source}`} />
                  <button type="submit">Recevoir la Boussole IA <ArrowRight /></button>
                </div>
                <label className="compass-signup-consent"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); if (status === 'error') setStatus('idle') }} /><span><i><Check /></i>J’accepte de recevoir les conseils IA et les informations de MAJUBAH Consulting.</span></label>
                <div className="compass-signup-meta"><small>Un email par semaine. Pas de spam. Désinscription possible à tout moment.</small><span id={`boussole-message-${source}`} className={status === 'error' ? 'error' : ''} role="status">{status === 'error' ? message : ''}</span></div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = useMemo(() => [
    {
      quote: 'Je recommande vivement Baudry BAHUNA pour son approche ludique et ses supports variés, rendant les cours concrets et captivants. Son accompagnement efficace nous aide à mieux comprendre et mémoriser, facilitant ainsi notre réussite aux examens. Un enseignant investi et motivant !',
      name: 'Andréa Q.',
      role: 'Chargé de relation clientèle',
      image: '/assets/testimonials/andrea.jpg',
    },
    {
      quote: 'Baudry est un formateur passionné, qui a à cœur de partager son expérience et ses connaissances, toujours avec enthousiasme ! Ses cours sont rythmés par des cas pratiques qui rendent l’apprentissage beaucoup plus concret et intéressant. C’est toujours un plaisir d’assister à ses cours, merci à lui 🙏🏻',
      name: 'Chloé P.',
      role: 'Agent immobilier',
      image: '/assets/testimonials/chloe.jpg',
    },
    {
      quote: 'Baudry est animé par la volonté d’apporter une véritable valeur ajoutée dans le cadre de l’animation de formations. Il déploie des solutions innovantes rendant ses interventions attractives tout en permettant aux étudiants de rester au cœur du processus d’apprentissage.',
      name: 'Valentin C.',
      role: 'Responsable pédagogique',
      image: '/assets/testimonials/valentin.jpg',
    },
    {
      quote: 'J’ai eu la chance d’être formé par Baudry Bahuna en gestion de projet durant ma première année de Master MDO Groupe A à l’E2SE. Formateur passionné et pédagogue, il sait rendre ses cours extrêmement vivants et captivants. Baudry intègre également les nouveaux outils, dont l’IA, ce qui nous permet de rester performants et en phase avec les exigences actuelles du métier. Professionnel, clair et engagé dans la réussite de ses étudiants, Baudry est un intervenant que je recommande vivement. Encore un grand merci au nom du groupe A MDO 2025/2026, en espérant vous avoir à nouveau sur d’autres modules durant ce Master. 😉',
      name: 'Hugo L.',
      role: 'Étudiant en Master Manager des Opérations',
      image: '/assets/testimonials/hugo.jpg',
    },
    {
      quote: 'J’ai commencé à travailler avec Baudry récemment, et je comprends mieux cette phrase de Sénèque : « Ce n’est pas parce que les choses sont difficiles que nous n’osons pas, c’est parce que nous n’osons pas qu’elles sont difficiles. » Baudry a ce talent rare d’identifier les blocages tout en donnant l’assurance nécessaire pour les dépasser. Professionnel, analytique, mais surtout profondément humain. Pas de discours rigide, juste des échanges clairs et naturels qui font réellement avancer.',
      name: 'Jocelyn L.',
      role: 'Expert en financements et marchand de biens',
      image: '/assets/testimonials/jocelyn.jpg',
    },
  ], [])
  const reduceMotion = useReducedMotion()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialPaused, setTestimonialPaused] = useState(false)
  const totalTestimonials = testimonials.length

  const showTestimonial = (index: number) => setActiveTestimonial((index + totalTestimonials) % totalTestimonials)

  useEffect(() => {
    if (reduceMotion || testimonialPaused) return
    const timer = window.setInterval(() => showTestimonial(activeTestimonial + 1), 7000)
    return () => window.clearInterval(timer)
  }, [activeTestimonial, reduceMotion, testimonialPaused, totalTestimonials])

  const currentTestimonial = testimonials[activeTestimonial]
  const previousTestimonial = (activeTestimonial - 1 + totalTestimonials) % totalTestimonials
  const nextTestimonial = (activeTestimonial + 1) % totalTestimonials

  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="testimonials-heading-row">
          <SectionHeading eyebrow="ILS ONT FRANCHI LE PAS" title={<>Ils ne parlent plus de l’IA.<br /><em>Ils travaillent avec.</em></>} align="left" />
          <Reveal>
            <a className="linkedin-reviews-link" href="https://www.linkedin.com/in/baudry-bahuna/details/recommendations/?detailScreenTabIndex=0" target="_blank" rel="noreferrer" aria-label="Voir les 50 recommandations de Baudry Bahuna sur LinkedIn">
              <span className="linkedin-reviews-icon"><Linkedin /></span>
              <span><small>RECOMMANDATIONS LINKEDIN</small><strong>Voir les 50 recommandations</strong></span>
              <ArrowRight />
            </a>
          </Reveal>
        </div>
        <motion.div
          className="circular-testimonials"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .15 }}
          transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setTestimonialPaused(true)}
          onMouseLeave={() => setTestimonialPaused(false)}
          onFocusCapture={() => setTestimonialPaused(true)}
          onBlurCapture={() => setTestimonialPaused(false)}
        >
          <div className="testimonial-portraits" aria-label="Choisir un témoignage">
            <span className="portrait-orbit portrait-orbit--one" />
            <span className="portrait-orbit portrait-orbit--two" />
            {testimonials.map((testimonial, index) => {
              const position = index === activeTestimonial ? 'active' : index === previousTestimonial ? 'previous' : index === nextTestimonial ? 'next' : 'hidden'
              return (
                <button className={`testimonial-portrait testimonial-portrait--${position}`} key={testimonial.name} onClick={() => showTestimonial(index)} aria-label={`Afficher le témoignage de ${testimonial.name}`} aria-current={index === activeTestimonial ? 'true' : undefined} tabIndex={position === 'hidden' ? -1 : 0}>
                  <img src={testimonial.image} alt={`Portrait de ${testimonial.name}`} />
                  <span className="portrait-shine" />
                  {index === activeTestimonial && <span className="portrait-linkedin"><Linkedin /></span>}
                </button>
              )
            })}
            <div className="portrait-caption"><span>VOIX {String(activeTestimonial + 1).padStart(2, '0')}</span><i /><small>{String(totalTestimonials).padStart(2, '0')}</small></div>
          </div>

          <div className="testimonial-story">
            <AnimatePresence mode="wait">
              <motion.article key={currentTestimonial.name} initial={{ opacity: 0, x: 35, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -25, filter: 'blur(6px)' }} transition={{ duration: .48, ease: [0.22, 1, 0.36, 1] }}>
                <div className="testimonial-source"><span><Linkedin /> Recommandation LinkedIn</span><b>★★★★★</b></div>
                <p className="testimonial-quote-mark">“</p>
                <blockquote aria-label={currentTestimonial.quote}>
                  {currentTestimonial.quote.split(' ').map((word, index) => (
                    <motion.span key={`${word}-${index}`} initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: Math.min(index * .012, .65), duration: .3 }}>{word}&nbsp;</motion.span>
                  ))}
                </blockquote>
                <footer><strong>{currentTestimonial.name}</strong><span>{currentTestimonial.role}</span></footer>
              </motion.article>
            </AnimatePresence>

            <div className="testimonial-controls">
              <div className="testimonial-arrows">
                <button onClick={() => showTestimonial(activeTestimonial - 1)} aria-label="Témoignage précédent"><ArrowLeft /></button>
                <button onClick={() => showTestimonial(activeTestimonial + 1)} aria-label="Témoignage suivant"><ArrowRight /></button>
              </div>
              <div className="testimonial-dots" aria-label="Navigation des témoignages">
                {testimonials.map((testimonial, index) => <button key={testimonial.name} className={index === activeTestimonial ? 'active' : ''} onClick={() => showTestimonial(index)} aria-label={`Témoignage ${index + 1}`}><span /></button>)}
              </div>
              <span className="testimonial-count"><b>{String(activeTestimonial + 1).padStart(2, '0')}</b> / {String(totalTestimonials).padStart(2, '0')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="section pricing-section" id="tarifs">
      <div className="container">
        <SectionHeading eyebrow="PREMIÈRES SESSIONS" title={<>Des tarifs lisibles.<br /><em>Une valeur qui dure.</em></>} body="Tarif lancement valable pour les premières sessions." />
        <div className="pricing-grid">
          <Reveal className="pricing-card pricing-card--training">
            <div className="pricing-card-top"><span><GraduationCap /></span><div><small>FORMATION IA CERTIFIANTE</small><h3>3 jours pour devenir autonome</h3></div></div>
            <div className="pricing-amount"><span><small>Tarif lancement</small><b>1 190 €</b><em>/ participant</em></span><div><small>Prix public prévu</small><strong>1 650 €</strong></div></div>
            <ul>
              <li><Check /> Paiement personnel possible en 3 fois</li>
              <li><Check /> CPF / OPCO possible selon dossier, éligibilité et délais administratifs</li>
              <li><Check /> Préinscription non définitive</li>
              <li><Check /> Confirmation après échange avec MAJUBAH</li>
            </ul>
            <div className="pricing-campus-bonus"><Laptop /><span><small>BONUS INCLUS</small><b>Campus MAJUBAH pendant 12 mois</b><em>Valeur indicative : 249 € / an</em></span></div>
            <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('formation-juillet') }} className="button button--primary">Demander ma place <ArrowRight /></a>
          </Reveal>

          <Reveal className="pricing-card pricing-card--workshop" delay={.08}>
            <div className="pricing-card-top"><span><WandSparkles /></span><div><small>ATELIERS IA</small><h3>Une journée, un livrable</h3></div></div>
            <div className="pricing-amount"><span><small>Tarif lancement</small><b>390 €</b><em>/ participant</em></span><div><small>Prix public prévu</small><strong>590 €</strong></div></div>
            <p>Une journée pour repartir avec un livrable concret : site, CRM, contenu LinkedIn, assistant IA, vidéo ou automatisation.</p>
            <div className="pricing-workshop-proof"><Check /><span><b>Format intensif et pratique</b><small>Demande de place sans paiement immédiat</small></span></div>
            <a href="#reserver" onClick={(event) => { event.preventDefault(); openBookingCalendar('atelier-aout') }} className="button pricing-secondary-button">Choisir un atelier <ArrowRight /></a>
          </Reveal>
        </div>
        <p className="pricing-footnote">Tarifs de lancement proposés pour accompagner les premières sessions MAJUBAH.</p>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq-section">
      <div className="container faq-layout">
        <div><SectionHeading eyebrow="QUESTIONS FRÉQUENTES" title={<>Tout ce qu’il faut savoir<br /><em>avant d’entrer.</em></>} align="left" /><Reveal><a className="faq-contact" href="mailto:baudry@majubahconsulting.com?subject=Question%20sur%20les%20formations%20MAJUBAH&body=Bonjour%20Baudry%2C%0A%0AJ%27aimerais%20obtenir%20une%20pr%C3%A9cision%20concernant%20les%20formations%20ou%20ateliers%20MAJUBAH.%0A%0AMa%20question%20%3A%20%0A%0AMerci%20par%20avance."><MessageSquareText /> Une autre question ?<b>Parlons-en</b></a></Reveal></div>
        <div className="faq-list">
          {faqItems.map((item, i) => <Reveal key={item.q} delay={i*.04}><article className={open === i ? 'open' : ''}><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{item.q}</span><ChevronDown /></button><AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{item.a}</p></motion.div>}</AnimatePresence></article></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function Booking() {
  const [visibleMonth, setVisibleMonth] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState(0)
  const [justSelected, setJustSelected] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formData, setFormData] = useState({ lastName: '', firstName: '', email: '', phone: '', company: '', funding: 'Direct' })

  useEffect(() => {
    let highlightTimer = 0
    const handleBookingSelection = (event: Event) => {
      const eventId = (event as CustomEvent<{ eventId?: string }>).detail?.eventId
      const eventIndex = agendaEvents.findIndex((agendaEvent) => agendaEvent.id === eventId)
      if (eventIndex < 0) return
      const agendaEvent = agendaEvents[eventIndex]
      const monthIndex = agendaMonths.findIndex((agendaMonth) => agendaMonth.year === agendaEvent.year && agendaMonth.month === agendaEvent.month)
      setSelectedEvent(eventIndex)
      if (monthIndex >= 0) setVisibleMonth(monthIndex)
      setFormOpen(false)
      setFormStatus('idle')
      setJustSelected(false)
      window.requestAnimationFrame(() => setJustSelected(true))
      window.clearTimeout(highlightTimer)
      highlightTimer = window.setTimeout(() => setJustSelected(false), 1800)
    }
    window.addEventListener('majubah:select-booking', handleBookingSelection)
    return () => {
      window.removeEventListener('majubah:select-booking', handleBookingSelection)
      window.clearTimeout(highlightTimer)
    }
  }, [])
  const month = agendaMonths[visibleMonth]
  const selected = agendaEvents[selectedEvent]
  const selectedPricing = selected.type === 'workshop' ? { launch: '390 €', public: '590 €' } : { launch: '1 190 €', public: '1 650 €' }
  const monthOffset = (new Date(month.year, month.month, 1).getDay() + 6) % 7
  const monthLength = new Date(month.year, month.month + 1, 0).getDate()
  const calendarCells = [...Array(monthOffset).fill(null), ...Array.from({ length: monthLength }, (_, index) => index + 1)]
  const selectAgendaEvent = (eventIndex: number) => { setSelectedEvent(eventIndex); setFormOpen(false); setFormStatus('idle') }
  const moveAgendaMonth = (direction: number) => setVisibleMonth((current) => Math.min(Math.max(current + direction, 0), agendaMonths.length - 1))
  const updateField = (field: keyof typeof formData, value: string) => setFormData((current) => ({ ...current, [field]: value }))
  const handlePreRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const subject = `[Préinscription MAJUBAH] Session IA — ${formData.lastName} ${formData.firstName} — ${selected.dateLabel}`
    const body = [
      'FICHE DE PRÉINSCRIPTION MAJUBAH',
      '================================',
      '',
      'CONTACT',
      `Nom : ${formData.lastName}`,
      `Prénom : ${formData.firstName}`,
      `Email : ${formData.email}`,
      `Téléphone : ${formData.phone}`,
      `Entreprise : ${formData.company || 'Non renseignée'}`,
      '',
      'SESSION DEMANDÉE',
      `Parcours : ${selected.category}`,
      `Session : ${selected.title}`,
      `Date : ${selected.dateLabel}`,
      `Modalité : ${selected.modality}`,
      `Lieu : ${selected.detail}`,
      `Capacité : ${selected.capacity}`,
      `Tarif lancement : ${selectedPricing.launch} / participant`,
      `Financement envisagé : ${formData.funding}`,
      '',
      'SUIVI CRM',
      'Statut : Demande de préinscription',
      `Repères : ${selected.statuses.join(' · ')}`,
      '',
      'La place reste à confirmer après échange avec MAJUBAH.',
    ].join('\n')
    const payload = { ...formData, subject, body, sessionId: selected.id, session: selected.title, date: selected.dateLabel, modality: selected.modality, capacity: selected.capacity, statuses: selected.statuses }
    const syncEndpoint = import.meta.env.VITE_PREINSCRIPTION_ENDPOINT

    if (syncEndpoint) {
      setFormStatus('sending')
      try {
        const response = await fetch(syncEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (!response.ok) throw new Error('Synchronisation indisponible')
        setFormStatus('sent')
        return
      } catch {
        setFormStatus('idle')
      }
    }

    window.location.href = `mailto:baudry@majubahconsulting.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  return (
    <section className="booking-section" id="reserver">
      <div className="booking-glow" />
      <div className="container">
        <div className="booking-copy booking-copy--top"><span className="eyebrow eyebrow--light">PROCHAINE ÉTAPE</span><h2>Prêt à travailler<br /><em>autrement avec l’IA ?</em></h2><p>Choisissez votre session. Notre équipe vous rappelle pour confirmer le format et votre financement.</p><div className="booking-badges"><span><ShieldCheck /> Éligible CPF</span><span><Award /> Formation certifiante</span><span><Clock3 /> Réponse sous 24h</span></div></div>
        <div className="booking-layout">
          <motion.div className="booking-robot-stage" initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, ease: [0.22,1,0.36,1] }}>
            <div className="robot-stage-grid" />
            <div className="robot-stage-glow" />
            <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="majubah-robot-scene" />
            <div className="robot-stage-status"><i /><span>GUIDE MAJUBAH</span><small>EN LIGNE</small></div>
            <div className="robot-stage-hint"><MousePointer2 /><span>Interagissez<br />avec le robot</span></div>
            <div className="spline-brand-cover" aria-hidden="true"><img src="/assets/majubah-horizontal.png" alt="" /></div>
          </motion.div>
          <div className={`booking-card-shell ${formOpen ? 'booking-card-shell--form' : ''} ${justSelected ? 'booking-card--targeted' : ''}`}>
            <motion.div className="booking-card-flipper" animate={{ rotateY: formOpen ? 180 : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 19 }}>
              <div className="booking-card booking-card-face booking-card-face--front" aria-hidden={formOpen}>
                <div className="booking-card-head"><div><small>DEMANDE DE PRÉINSCRIPTION</small><h3>Choisissez votre rendez-vous</h3></div><CalendarDays /></div>
                <div className="booking-assurance"><Check /><span><b>Votre demande est préparée</b><small>Votre place sera confirmée après échange avec MAJUBAH</small></span></div>
                <div className="booking-agenda">
                  <div className="agenda-month-nav">
                    <button onClick={() => moveAgendaMonth(-1)} disabled={visibleMonth === 0} aria-label="Mois précédent"><ArrowLeft /></button>
                    <div><strong>{month.label}</strong><span>{month.year}</span></div>
                    <button onClick={() => moveAgendaMonth(1)} disabled={visibleMonth === agendaMonths.length - 1} aria-label="Mois suivant"><ArrowRight /></button>
                  </div>
                  <div className="agenda-weekdays">{['L','M','M','J','V','S','D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
                  <div className="agenda-grid">
                    {calendarCells.map((day, index) => {
                      const eventIndex = day ? agendaEvents.findIndex((agendaEvent) => agendaEvent.year === month.year && agendaEvent.month === month.month && day >= agendaEvent.day && day < agendaEvent.day + agendaEvent.duration) : -1
                      const agendaEvent = eventIndex >= 0 ? agendaEvents[eventIndex] : null
                      const rangePosition = agendaEvent ? agendaEvent.duration === 1 ? 'range-single' : day === agendaEvent.day ? 'range-start' : day === agendaEvent.day + agendaEvent.duration - 1 ? 'range-end' : 'range-middle' : ''
                      return day ? <button key={`${month.label}-${day}`} className={`${agendaEvent ? `has-event event-${agendaEvent.type} ${rangePosition}` : ''} ${eventIndex === selectedEvent ? 'selected' : ''}`} onClick={() => agendaEvent && selectAgendaEvent(eventIndex)} disabled={!agendaEvent} aria-label={agendaEvent ? `${agendaEvent.title}, ${agendaEvent.dateLabel}, ${agendaEvent.duration === 3 ? 'trois jours consécutifs' : 'une journée'}` : `${day} ${month.label}`}><span>{day}</span>{agendaEvent && <i />}{agendaEvent?.duration === 3 && day === agendaEvent.day && <small>3J</small>}</button> : <span key={`empty-${index}`} />
                    })}
                  </div>
                  <div className={`agenda-selection agenda-selection--${selected.type}`}>
                    <span><i /></span><div><small>{selected.category} · {selected.dateLabel}</small><b>{selected.title}</b><p><em>{selected.duration === 3 ? '3 jours consécutifs' : '1 journée'}</em> · {selected.modality} · {selected.capacity}</p></div><Check />
                  </div>
                  <div className="booking-statuses">{selected.statuses.map((status) => <span key={status}>{status}</span>)}</div>
                  <div className="booking-price-inline"><span><small>Tarif lancement</small><b>{selectedPricing.launch}</b><em>/ participant</em></span><div><small>Prix public prévu</small><strong>{selectedPricing.public}</strong></div></div>
                  <div className="agenda-legend"><span><i className="onsite" /> Présentiel · 3 jours</span><span><i className="remote" /> Distanciel · 3 jours</span><span><i className="workshop" /> Atelier · 1 jour</span></div>
                </div>
                <button type="button" onClick={() => setFormOpen(true)} className="button button--primary booking-button">Demander ma place <ArrowRight /></button>
                <p className="booking-note">CPF possible selon délai administratif · Aucun paiement en ligne</p>
              </div>

              <div className="booking-card booking-card-face booking-card-face--back" aria-hidden={!formOpen}>
                {formStatus === 'sent' ? (
                  <div className="booking-success"><span><Check /></span><small>DEMANDE ENREGISTRÉE</small><h3>Merci {formData.firstName}.</h3><p>Votre demande de préinscription a bien été transmise. Votre place sera confirmée après échange avec MAJUBAH.</p><button type="button" onClick={() => { setFormOpen(false); setFormStatus('idle') }}><RotateCcw /> Revenir au calendrier</button></div>
                ) : (
                  <form className="prebooking-form" onSubmit={handlePreRegistration}>
                    <div className="booking-card-head"><div><small>DEMANDE DE PRÉINSCRIPTION</small><h3>Vos coordonnées</h3></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Revenir au calendrier"><RotateCcw /></button></div>
                    <div className="prebooking-session"><CalendarDays /><span><small>SESSION SÉLECTIONNÉE</small><b>{selected.dateLabel}</b><em>{selected.title} · {selected.modality}</em></span></div>
                    <div className="prebooking-fields">
                      <label><span>Nom</span><input required autoComplete="family-name" value={formData.lastName} onChange={(event) => updateField('lastName', event.target.value)} /></label>
                      <label><span>Prénom</span><input required autoComplete="given-name" value={formData.firstName} onChange={(event) => updateField('firstName', event.target.value)} /></label>
                      <label><span>Email</span><input required type="email" autoComplete="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} /></label>
                      <label><span>Téléphone</span><input required type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} /></label>
                      <label className="prebooking-field--wide"><span>Entreprise <small>Facultatif</small></span><input autoComplete="organization" value={formData.company} onChange={(event) => updateField('company', event.target.value)} /></label>
                      <label className="prebooking-field--wide"><span>Financement envisagé</span><select value={formData.funding} onChange={(event) => updateField('funding', event.target.value)}><option>Direct</option><option>CPF</option><option>OPCO</option></select></label>
                    </div>
                    <div className="prebooking-reminder"><ShieldCheck /><span><b>{selected.modality === 'Présentiel' ? 'Présentiel limité à 6 participants' : 'Classe virtuelle disponible'}</b><small>{formData.funding === 'CPF' ? 'CPF possible selon délai administratif' : 'Votre place sera confirmée après échange avec MAJUBAH'}</small></span></div>
                    <button type="submit" disabled={formStatus === 'sending'} className="button button--primary booking-button">{formStatus === 'sending' ? 'Transmission…' : 'Envoyer ma demande'} <ArrowRight /></button>
                    <p className="booking-note">Demande sans engagement · Aucun paiement en ligne</p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return <footer className="footer"><div className="container footer-top"><Logo light /><p>Le campus où les professionnels apprennent à travailler avec l’intelligence artificielle.</p><div><a href="#programme">Formation</a><a href="#campus-digital">Campus</a><a href="#ateliers">Ateliers</a></div><div><a href="mailto:baudry@majubahconsulting.com?subject=Prise%20de%20contact%20depuis%20le%20site%20MAJUBAH&body=Bonjour%20Baudry%2C%0A%0AJe%20vous%20contacte%20depuis%20le%20site%20MAJUBAH%20au%20sujet%20de%20vos%20formations%20et%20ateliers.%0A%0AMerci%20de%20me%20recontacter.%0A%0ABien%20cordialement.">Contact</a><a href="#top">Mentions légales</a><a href="#top">Confidentialité</a></div></div><div className="container footer-bottom"><span>© 2026 MAJUBAH Consulting</span><span>Pont-Audemer · Normandie</span><a href="#top">Retour en haut ↑</a></div></footer>
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AIOrchestra />
        <Method />
        <Immersion />
        <Skills />
        <DigitalCampus />
        <Workshops />
        <Trainer />
        <CampusJourney />
        <Modes />
        <AICompass />
        <CompassSignup source="section-boussole" />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Booking />
        <CompassSignup source="footer-boussole" compact />
      </main>
      <Footer />
    </>
  )
}
