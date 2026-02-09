import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  BookOpen, 
  Target, 
  Zap, 
  Activity, 
  Info, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  RotateCcw, 
  Star, 
  Layers, 
  Anchor, 
  Gauge, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Card } from '../components/ui';

interface Section {
  id: string;
  category: string;
  title: string;
  icon: any;
  explanation: string[];
  example: string;
}

const SECTIONS: Section[] = [
  // --- SECȚIUNILE ORIGINALE (1-8) ---
  {
    id: 'ramp-up',
    category: "1. PREGĂTIRE",
    title: "Ramp-up Set – Pregătirea fără oboseală",
    icon: Zap,
    explanation: [
      "Scop: Încălzirea specifică a articulațiilor și activarea sistemului nervos.",
      "Regulă: Greutatea crește progresiv, dar repetările scad pentru a evita acumularea de acid lactic.",
      "Efort: Trebuie să se simtă ușor (RIR 5+). Nu vrei să obosești mușchiul înainte de setul principal.",
      "Execuție: Concentrare maximă pe tehnică și viteza de execuție."
    ],
    example: "Dacă Top Set-ul este 100kg, faci 40kg x 8, 70kg x 4, 90kg x 1."
  },
  {
    id: 'top-set',
    category: "2. INTENSITATE",
    title: "Top Set – Motorul progresului",
    icon: Star,
    explanation: [
      "Definiție: Cel mai greu set al exercițiului, executat când ești cel mai fresh.",
      "Importanță: Este singurul set care dictează dacă ai progresat față de săptămâna trecută.",
      "Țintă: RIR 0-1 (eșec tehnic). Aici se produce stimulul maxim de hipertrofie.",
      "Focus: Toată energia mentală și fizică trebuie canalizată aici."
    ],
    example: "80kg x 8 repetări la RIR 0. Dacă săptămâna viitoare faci 9 repetări, ai progresat."
  },
  {
    id: 'back-off',
    category: "3. VOLUM",
    title: "Back-off Set – Volumul de suport",
    icon: Layers,
    explanation: [
      "Rol: Acumularea de volum suplimentar necesar pentru creștere, fără riscul accidentării.",
      "Metodă: Scazi greutatea cu 10-20% după Top Set pentru a menține un număr mare de repetări.",
      "Intensitate: RIR 1-2. Suficient de greu pentru a fi eficient, dar controlat.",
      "Beneficiu: Permite pomparea și stresul metabolic după stresul mecanic al Top Set-ului."
    ],
    example: "După Top Set de 100kg, faci 2 seturi de 85kg pentru 10-12 repetări."
  },
  {
    id: 'rir-base',
    category: "4. MĂSURĂTOARE",
    title: "Sistemul RIR – Măsurarea efortului",
    icon: ShieldCheck,
    explanation: [
      "RIR (Reps In Reserve): Câte repetări 'mai aveai în rezervă' la finalul setului.",
      "Standard: RIR 0 = Nu mai puteai face nicio repetare corectă. RIR 1 = Mai puteai face una.",
      "Utilitate: Permite ajustarea greutății în funcție de forma zilei (autoreglare).",
      "Acuratețe: Necesită experiență. Începătorii tind să subestimeze efortul."
    ],
    example: "Te oprești la repetarea 10, simțind că repetarea 11 ar fi eșuat sau ar fi fost trișată."
  },
  {
    id: 'no-top-set',
    category: "5. MECANICĂ",
    title: "De ce nu toate au Top Set – Siguranță și Stabilitate",
    icon: Anchor,
    explanation: [
      "Context: Exercițiile de izolare sau cele cu stabilitate redusă nu beneficiază de intensitate extremă.",
      "Riscuri: La flexii biceps sau fluturări, eșecul total (RIR 0) poate duce la pierderea formei și accidentări.",
      "Stabilitate: Exercițiile complexe (squat, press) permit Top Set datorită ancorării mai bune.",
      "Strategie: Folosim volum standard (3x12) pentru a menține tensiunea fără a stresa articulațiile."
    ],
    example: "La fluturări cablu, preferăm 3 seturi constante la RIR 2 pentru a proteja umerii."
  },
  {
    id: 'vol-freq',
    category: "6. LOGICĂ",
    title: "Volum & Frecvență – Logică Prioritară",
    icon: BarChart3,
    explanation: [
      "Prioritate: Grupele musculare deficitare sunt plasate la începutul sesiunii.",
      "Frecvență: 5 zile pe săptămână permite o distribuție optimă a volumului pe grupe.",
      "Sinergie: Push/Pull/Legs combinat cu zile de brațe pentru recuperare sistemică.",
      "Recuperare: Mai mult nu e mai bine dacă nu poți susține performanța la Top Set."
    ],
    example: "Umerii sunt lucrați în 3 din cele 5 zile pentru a maximiza lățimea claviculară."
  },
  {
    id: 'auto-base',
    category: "7. FEEDBACK",
    title: "Autoreglarea – Feedback Biologic",
    icon: Activity,
    explanation: [
      "Concept: Adaptarea antrenamentului în timp real bazat pe semnalele corpului.",
      "Indicatori: Calitatea somnului, nivelul de stres, durerile articulare.",
      "Acțiune: Dacă ești epuizat, reduci volumul de suport (back-off) dar încerci să menții Top Set-ul.",
      "Obiectiv: Consistență pe termen lung, nu recorduri zilnice cu prețul sănătății."
    ],
    example: "Dacă ai dormit 4 ore, fă doar Top Set-ul și elimină restul seturilor de suport."
  },
  {
    id: 'deload-base',
    category: "8. STRATEGIE",
    title: "Deload-ul – Recuperarea Strategică",
    icon: RotateCcw,
    explanation: [
      "Necesitate: Oboseala reziduală se acumulează în tendoane și sistemul nervos central.",
      "Semne: Scăderea chefului de antrenament, stagnarea greutăților, insomnii.",
      "Metodă: Reducerea numărului de seturi cu 50% și menținerea RIR la 2-3.",
      "Rezultat: Permite corpului să 'încaseze' progresul acumulat în săptămânile de Build."
    ],
    example: "În săptămâna de Deload, dacă făceai 4 seturi, faci doar 2, cu greutăți mai ușoare."
  },

  // --- SECȚIUNILE NOI (9-12) ---
  {
    id: 'vol-philosophy',
    category: "9. FILOSOFIE",
    title: "Volum suficient, nu maxim",
    icon: Gauge,
    explanation: [
      "Concept: Volumul NU este un număr fix de seturi, ci un stimul biologic variabil.",
      "Echilibru: Trebuie să faci suficient volum pentru a stimula creșterea, dar destul de puțin pentru a te recupera.",
      "Relație: Volumul funcționează direct legat de intensitate (RIR) și capacitatea de refacere.",
      "Semnal: Dacă performanța Top Set-ului scade constant, volumul tău actual este probabil prea mare."
    ],
    example: "Mai bine 2 seturi perfecte la RIR 0, decât 5 seturi 'de umplutură' fără efort real."
  },
  {
    id: 'individualization',
    category: "10. INDIVIDUALIZARE",
    title: "De ce răspundem diferit la același program",
    icon: Users,
    explanation: [
      "Bio-variabilitate: Fiecare sportiv are o toleranță unică la volum și intensitate.",
      "Istoric: Datele tale sunt unice. Aplicația folosește Top Set-ul tău ca referință, nu medii statistice.",
      "Factori: Vârsta, genetica, stilul de viață și nutriția dictează cât volum poți tolera.",
      "Personalizare: Programul este o hartă, dar viteza cu care mergi depinde de motorul tău unic."
    ],
    example: "Un coleg poate progresa cu 3 seturi de back-off, în timp ce tu ai nevoie de doar unul."
  },
  {
    id: 'rir-advanced',
    category: "11. RIR AVANSAT",
    title: "RIR – ce înseamnă CU ADEVĂRAT",
    icon: HelpCircle,
    explanation: [
      "Eroare comună: Senzația de 'arsură' nu înseamnă eșec muscular (RIR 0).",
      "Definiție: RIR 0 este eșecul tehnic – momentul în care nu mai poți mișca greutatea corect.",
      "Interpretare: RIR 1 înseamnă că ai terminat setul știind sigur că mai puteai face exact una.",
      "Atenție: Mulți sportivi se opresc la RIR 4 crezând că sunt la RIR 1 din cauza disconfortului."
    ],
    example: "Eșecul real este când bară se oprește la jumătatea drumului, nu când mușchiul 'doare'."
  },
  {
    id: 'deload-logic',
    category: "12. RECUPERARE",
    title: "Deload-ul nu este regres",
    icon: Info,
    explanation: [
      "Viziune: Imaginează-ți deload-ul ca pe o oprire la boxe într-o cursă lungă.",
      "Funcție: Protejează integritatea sistemului nervos și a țesuturilor conjunctive (tendoane).",
      "Adaptare: Corpul crește în timpul perioadelor de odihnă, nu în timpul antrenamentului intens.",
      "Inteligență: Sportivii avansați sunt cei care știu când să facă un pas înapoi pentru a sări doi înainte."
    ],
    example: "După un Deload corect, forța la Top Set crește adesea spectaculos datorită refacerii totale."
  }
];

export const Tactics: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Deep linking logic for section jumps if needed (future proofing)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const idx = SECTIONS.findIndex(s => s.id === hash);
      if (idx !== -1) setOpenIndex(idx);
    }
  }, []);

  return (
    <div className="pb-24 pt-4 px-1">
      <div className="flex items-center gap-2 mb-6 px-2">
        <BookOpen className="text-white" size={24} />
        <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tehnică <span className="text-primary">& Raționament</span></h1>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section, idx) => {
          const isOpen = openIndex === idx;
          const Icon = section.icon;
          return (
            <Card 
              id={section.id}
              key={section.id} 
              className={`transition-all duration-300 border-l-2 ${
                isOpen 
                  ? 'ring-1 ring-primary/30 bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                  : 'opacity-90 border-white/5'
              }`}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-primary text-black' : 'bg-surfaceHighlight text-zinc-500'}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none block">{section.category}</span>
                    <h3 className={`font-bold text-sm sm:text-base mt-1 tracking-tight ${isOpen ? 'text-white' : 'text-zinc-300'}`}>{section.title}</h3>
                  </div>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-zinc-700'}`} />
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                  <ul className="space-y-3 mb-6">
                    {section.explanation.map((item, i) => (
                      <li key={i} className="flex gap-3 text-zinc-300 text-xs sm:text-sm italic leading-relaxed">
                        <span className="text-primary font-black mt-1 shrink-0 text-xs">•</span> 
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white/5 rounded-xl p-4 italic text-xs text-zinc-400 border border-white/5 shadow-inner">
                    <span className="text-primary font-bold uppercase text-[9px] block mb-1.5 tracking-widest">Aplicație Practică:</span>
                    "{section.example}"
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-10 p-6 bg-zinc-900/40 rounded-3xl border border-white/5 text-center">
        <ShieldAlert className="text-zinc-700 mx-auto mb-3" size={24} />
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed px-4 italic">
          Aceste principii formează fundația Rdz Training. <br/>
          Consistența în execuție depășește orice variație în programare.
        </p>
      </div>
    </div>
  );
};