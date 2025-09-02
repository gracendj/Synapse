"use client";

import { useLocale } from "next-intl";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import {
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";

const translations = {
  en: {
    hero: {
      title: "About SYNAPSE",
      subtitle: "Pioneering the future of network analysis through innovative technology and human-centered design."
    },
    mission: {
      title: "Our Mission",
      description: "To democratize network analysis by providing powerful, intuitive tools that transform complex data into actionable insights for organizations worldwide."
    },
    vision: {
      title: "Our Vision",
      description: "A world where every organization can harness the power of their communication networks to drive innovation, efficiency, and meaningful connections."
    },
    values: {
      title: "Our Values",
      items: [
        {
          icon: "Lightbulb",
          title: "Innovation",
          description: "We constantly push the boundaries of what's possible in network analysis."
        },
        {
          icon: "Shield",
          title: "Security",
          description: "Your data security and privacy are our top priorities."
        },
        {
          icon: "Users",
          title: "Collaboration",
          description: "We believe in the power of teamwork and open communication."
        },
        {
          icon: "Heart",
          title: "Empathy",
          description: "We design with our users' needs and challenges at the center."
        },
        {
          icon: "TrendingUp",
          title: "Excellence",
          description: "We strive for excellence in everything we create and deliver."
        },
        {
          icon: "Globe",
          title: "Global Impact",
          description: "We aim to make a positive impact on organizations worldwide."
        }
      ]
    },
    team: {
      title: "Meet Our Team",
      description: "A diverse group of experts passionate about transforming how organizations understand their networks.",
      members: [
        {
          name: "Sarah Chen",
          role: "CEO & Co-founder",
          bio: "Former network architect with 15+ years experience in enterprise systems.",
          image: "👩‍💼"
        },
        {
          name: "Marcus Rodriguez",
          role: "CTO & Co-founder",
          bio: "Machine learning expert specializing in graph neural networks and visualization.",
          image: "👨‍💻"
        },
        {
          name: "Dr. Elena Kovač",
          role: "Head of Research",
          bio: "PhD in Network Science, published researcher in complex systems analysis.",
          image: "👩‍🔬"
        },
        {
          name: "James Wright",
          role: "Head of Design",
          bio: "Award-winning UX designer focused on making complex data accessible.",
          image: "👨‍🎨"
        }
      ]
    },
    stats: {
      title: "SYNAPSE by the Numbers",
      items: [
        { number: "2019", label: "Founded" },
        { number: "50K+", label: "Networks Analyzed" },
        { number: "500+", label: "Enterprise Clients" },
        { number: "50+", label: "Countries Served" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" }
      ]
    },
    timeline: {
      title: "Our Journey",
      events: [
        { year: "2019", title: "Company Founded", description: "Started with a vision to simplify network analysis" },
        { year: "2020", title: "First Enterprise Client", description: "Launched our beta with Fortune 500 company" },
        { year: "2021", title: "Series A Funding", description: "Raised $10M to accelerate product development" },
        { year: "2022", title: "AI Integration", description: "Introduced machine learning-powered insights" },
        { year: "2023", title: "Global Expansion", description: "Opened offices in Europe and Asia" },
        { year: "2024", title: "Next Generation Platform", description: "Launched SYNAPSE 3.0 with real-time analysis" }
      ]
    }
  },
  fr: {
    hero: {
      title: "À Propos de SYNAPSE",
      subtitle: "Pionnier de l'avenir de l'analyse des réseaux grâce à une technologie innovante et un design centré sur l'humain."
    },
    mission: {
      title: "Notre Mission",
      description: "Démocratiser l'analyse des réseaux en fournissant des outils puissants et intuitifs qui transforment des données complexes en insights exploitables pour les organisations du monde entier."
    },
    vision: {
      title: "Notre Vision",
      description: "Un monde où chaque organisation peut exploiter la puissance de ses réseaux de communication pour favoriser l'innovation, l'efficacité et des connexions significatives."
    },
    values: {
      title: "Nos Valeurs",
      items: [
        {
          icon: "Lightbulb",
          title: "Innovation",
          description: "Nous repoussons constamment les limites du possible dans l'analyse des réseaux."
        },
        {
          icon: "Shield",
          title: "Sécurité",
          description: "La sécurité et la confidentialité de vos données sont nos priorités absolues."
        },
        {
          icon: "Users",
          title: "Collaboration",
          description: "Nous croyons au pouvoir du travail d'équipe et de la communication ouverte."
        },
        {
          icon: "Heart",
          title: "Empathie",
          description: "Nous concevons en plaçant les besoins et défis de nos utilisateurs au centre."
        },
        {
          icon: "TrendingUp",
          title: "Excellence",
          description: "Nous visons l'excellence dans tout ce que nous créons et livrons."
        },
        {
          icon: "Globe",
          title: "Impact Global",
          description: "Nous visons à avoir un impact positif sur les organisations du monde entier."
        }
      ]
    },
    team: {
      title: "Rencontrez Notre Équipe",
      description: "Un groupe diversifié d'experts passionnés par la transformation de la façon dont les organisations comprennent leurs réseaux.",
      members: [
        {
          name: "Sarah Chen",
          role: "PDG & Co-fondatrice",
          bio: "Ancienne architecte réseau avec plus de 15 ans d'expérience dans les systèmes d'entreprise.",
          image: "👩‍💼"
        },
        {
          name: "Marcus Rodriguez",
          role: "CTO & Co-fondateur",
          bio: "Expert en apprentissage automatique spécialisé dans les réseaux de neurones graphiques et la visualisation.",
          image: "👨‍💻"
        },
        {
          name: "Dr. Elena Kovač",
          role: "Directrice de Recherche",
          bio: "PhD en Science des Réseaux, chercheuse publiée en analyse de systèmes complexes.",
          image: "👩‍🔬"
        },
        {
          name: "James Wright",
          role: "Directeur du Design",
          bio: "Designer UX primé axé sur l'accessibilité des données complexes.",
          image: "👨‍🎨"
        }
      ]
    },
    stats: {
      title: "SYNAPSE en Chiffres",
      items: [
        { number: "2019", label: "Fondée" },
        { number: "50K+", label: "Réseaux Analysés" },
        { number: "500+", label: "Clients Entreprise" },
        { number: "50+", label: "Pays Servis" },
        { number: "99.9%", label: "Disponibilité" },
        { number: "24/7", label: "Support" }
      ]
    },
    timeline: {
      title: "Notre Parcours",
      events: [
        { year: "2019", title: "Fondation de l'Entreprise", description: "Commencé avec une vision de simplifier l'analyse des réseaux" },
        { year: "2020", title: "Premier Client Entreprise", description: "Lancé notre bêta avec une entreprise Fortune 500" },
        { year: "2021", title: "Financement Série A", description: "Levé 10M$ pour accélérer le développement produit" },
        { year: "2022", title: "Intégration IA", description: "Introduit des insights alimentés par l'apprentissage automatique" },
        { year: "2023", title: "Expansion Mondiale", description: "Ouvert des bureaux en Europe et en Asie" },
        { year: "2024", title: "Plateforme Nouvelle Génération", description: "Lancé SYNAPSE 3.0 avec analyse en temps réel" }
      ]
    }
  }
} as const;


const iconMap = {
  Lightbulb,
  Shield,
  Users,
  Heart,
  TrendingUp,
  Globe,
  Target,
  Award,
  Zap,
  Clock
};

export default function AboutPage() {
  const locale = useLocale();
  const t = translations[locale as keyof typeof translations] || translations.en;

  // --- Light Theme Colors ---
  const light = {
    bg: "bg-white",
    sectionBg: "bg-slate-50",
    gradientHero: "bg-gradient-to-br from-white to-blue-50",
    cardBg: "bg-white",
    cardBorder: "border-slate-200",
    cardHoverBorder: "hover:border-purple-300",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-600",
    timelineDotBorder: "border-white"
  };

  // --- Dark Theme Colors ---
  const dark = {
    bg: "dark:bg-[#121212]",
    sectionBg: "dark:bg-gray-900/50",
    gradientHero: "dark:from-[#121212] dark:via-gray-900/50 dark:to-purple-900/20",
    cardBg: "dark:bg-gray-900/50",
    cardBorder: "dark:border-gray-800",
    cardHoverBorder: "dark:hover:border-gray-600",
    textPrimary: "dark:text-gray-100",
    textSecondary: "dark:text-gray-300",
    timelineDotBorder: "dark:border-gray-900"
  };

  return (
    <div className={`min-h-screen ${light.bg} ${dark.bg}`}>
      {/* Hero Section */}
      <section className={`pt-20 pb-32 px-4 ${light.gradientHero} ${dark.gradientHero}`}>
        <div className="container mx-auto text-center">
          <div className="fade-in">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${light.textPrimary} ${dark.textPrimary}`}>
              {t.hero.title}
            </h1>
            <p className={`text-xl md:text-2xl ${light.textSecondary} ${dark.textSecondary} max-w-4xl mx-auto leading-relaxed`}>
              {t.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`py-20 px-4 ${light.bg} ${dark.bg}`}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <Card className={`p-8 ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl ${light.cardHoverBorder} ${dark.cardHoverBorder} transition-all duration-300`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${light.textPrimary} ${dark.textPrimary}`}>
                {t.mission.title}
              </h2>
              <p className={`${light.textSecondary} ${dark.textSecondary} leading-relaxed text-lg`}>
                {t.mission.description}
              </p>
            </Card>

            <Card className={`p-8 ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl ${light.cardHoverBorder} ${dark.cardHoverBorder} transition-all duration-300`}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${light.textPrimary} ${dark.textPrimary}`}>
                {t.vision.title}
              </h2>
              <p className={`${light.textSecondary} ${dark.textSecondary} leading-relaxed text-lg`}>
                {t.vision.description}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-20 px-4 ${light.sectionBg} ${dark.bg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${light.textPrimary} ${dark.textPrimary}`}>
              {t.values.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.values.items.map((value, index) => {
              const IconComponent = iconMap[value.icon as keyof typeof iconMap];
              const gradientColors = [
                'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-violet-500',
                'from-pink-500 to-rose-500', 'from-orange-500 to-yellow-500', 'from-teal-500 to-blue-500'
              ];
              
              return (
                <Card 
                  key={index} 
                  className={`p-8 text-center ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl hover:scale-105 ${light.cardHoverBorder} ${dark.cardHoverBorder} transition-all duration-300`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${gradientColors[index % gradientColors.length]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${light.textPrimary} ${dark.textPrimary}`}>
                    {value.title}
                  </h3>
                  <p className={`${light.textSecondary} ${dark.textSecondary} leading-relaxed`}>
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 px-4 ${light.bg} ${dark.bg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${light.textPrimary} ${dark.textPrimary}`}>
              {t.stats.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {t.stats.items.map((stat, index) => (
              <Card 
                key={index} 
                className={`p-6 text-center ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl hover:scale-105 ${light.cardHoverBorder} ${dark.cardHoverBorder} transition-all duration-300`}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className={`${light.textSecondary} dark:text-gray-400 font-medium text-sm`}>
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 px-4 ${light.sectionBg} ${dark.sectionBg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${light.textPrimary} ${dark.textPrimary}`}>
              {t.team.title}
            </h2>
            <p className={`text-xl ${light.textSecondary} ${dark.textSecondary} max-w-3xl mx-auto`}>
              {t.team.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.team.members.map((member, index) => (
              <Card 
                key={index} 
                className={`p-8 text-center ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl hover:scale-105 ${light.cardHoverBorder} ${dark.cardHoverBorder} transition-all duration-300`}
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className={`text-xl font-bold mb-2 ${light.textPrimary} ${dark.textPrimary}`}>
                  {member.name}
                </h3>
                <Badge variant="primary" className="mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none">
                  {member.role}
                </Badge>
                <p className={`${light.textSecondary} ${dark.textSecondary} text-sm leading-relaxed`}>
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`py-20 px-4 ${light.bg} ${dark.bg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${light.textPrimary} ${dark.textPrimary}`}>
              {t.timeline.title}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-300 to-blue-300" />
            
            <div className="space-y-12">
              {t.timeline.events.map((event, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <Card 
                    className={`w-full max-w-md p-6 ${light.cardBg} ${dark.cardBg} border ${light.cardBorder} ${dark.cardBorder} shadow-lg hover:shadow-xl ${light.cardHoverBorder} ${dark.cardHoverBorder} ${
                      index % 2 === 0 ? 'mr-8' : 'ml-8'
                    } hover:scale-105 transition-all duration-300`}
                  >
                    <div className="flex items-center mb-4">
                      <Badge variant="primary" size="lg" className="mr-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none">
                        {event.year}
                      </Badge>
                      <h3 className={`text-xl font-bold ${light.textPrimary} ${dark.textPrimary}`}>
                        {event.title}
                      </h3>
                    </div>
                    <p className={`${light.textSecondary} ${dark.textSecondary} leading-relaxed`}>
                      {event.description}
                    </p>
                  </Card>
                  
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 ${light.timelineDotBorder} ${dark.timelineDotBorder} shadow-lg`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}