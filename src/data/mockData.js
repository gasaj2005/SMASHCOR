export const currentUser = {
  id: 'u1',
  name: 'Juan Pérez',
  username: 'juanpe_padel',
  bio: 'Amante del pádel, juego cruzado agresivo y buena víbora.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juanpe_padel&backgroundColor=93C572',
  gender: 'M',
  age: 28,
  racketModel: 'Babolat Technical Viper 2023',
  racketPhoto: 'https://www.babolat.com/on/demandware.static/-/Sites-babolat-master-catalog/default/dw1d96b92f/images/large/150117_100_1.png',
  division: 4,
  subdivision: 'Media',
  points: 1250,
};

export const leaderboardData = [
  { id: 'u1', name: 'Juan Pérez', username: 'juanpe_padel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juanpe_padel&backgroundColor=93C572', division: 4, subdivision: 'Media', points: 1250 },
  { id: 'u2', name: 'Carlos López', username: 'charly77', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charly77&backgroundColor=93C572', division: 4, subdivision: 'Alta', points: 1400 },
  { id: 'u3', name: 'Miguel Rosco', username: 'miguelon', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miguelon&backgroundColor=93C572', division: 4, subdivision: 'Media', points: 1100 },
  { id: 'u4', name: 'Ana García', username: 'anag', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anag&backgroundColor=93C572', division: 4, subdivision: 'Alta', points: 1450 },
  { id: 'u5', name: 'Laura Sánchez', username: 'lauri_padel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lauri_padel&backgroundColor=93C572', division: 4, subdivision: 'Media', points: 1200 }
].sort((a,b) => b.points - a.points);

export const newsFeed = [
  { id: 'n1', type: 'system', title: '¡Actualización V2.0 Disponible!', content: 'Ya puedes disfrutar del nuevo diseño y la gestión de comunidades.', date: '2026-04-08T10:00:00Z' },
  { id: 'n2', type: 'ai_achievement', title: '¡Racha Imparable!', content: 'Ana García ha ganado sus últimos 5 partidos y está a un paso de subir de nivel.', date: '2026-04-07T18:30:00Z' },
  { id: 'n3', type: 'ai_stats', title: 'Semana Intensa', content: 'Se han jugado más de 300 partidos esta semana en Córdoba. ¡El nivel 4 Media ha estado on-fire!', date: '2026-04-06T12:15:00Z' }
];

export const mockRooms = [
  {
    id: 'r1',
    name: 'Pachanga de Jueves',
    location: 'Club Padel Madrid - Pista 3',
    datetime: '2026-04-10T19:00:00Z',
    durationSets: 3,
    requiredDivision: 4,
    requiredSubdivision: 'Media',
    isPrivate: false,
    roomCode: 'PAD-X9L2',
    players: [
      { id: 'u2', name: 'Carlos López', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charly77&backgroundColor=93C572', age: 31, gender: 'M', division: 4, subdivision: 'Alta', courtPosition: 'left-bottom' },
      { id: 'u3', name: 'Miguel Rosco', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miguelon&backgroundColor=93C572', age: 26, gender: 'M', division: 4, subdivision: 'Media', courtPosition: 'right-bottom' }
    ]
  },
  {
    id: 'r2',
    name: 'Entreno Nivel 4 Alta',
    location: 'Polideportivo Municipal',
    datetime: '2026-04-12T10:00:00Z',
    durationSets: 3,
    requiredDivision: 4,
    requiredSubdivision: 'Alta',
    isPrivate: false,
    roomCode: 'PAD-T4Q1',
    players: [
      { id: 'u4', name: 'Ana García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anag&backgroundColor=93C572', age: 29, gender: 'F', division: 4, subdivision: 'Alta', courtPosition: 'left-top' },
      { id: 'u1', name: 'Juan Pérez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juanpe_padel&backgroundColor=93C572', age: 28, gender: 'M', division: 4, subdivision: 'Media', courtPosition: 'right-bottom' }
    ]
  }
];

export const userHistory = [
  {
    id: 'h1',
    date: '2026-03-25',
    result: 'Victoria (6-4, 6-2)',
    pointsEarned: 10,
    pointDetails: 'Victoria normal',
    location: 'Club Padel Madrid'
  },
  {
    id: 'h2',
    date: '2026-03-18',
    result: 'Victoria (6-0, 6-2)',
    pointsEarned: 45,
    pointDetails: '+10 Normal, +35 Rosco!',
    location: 'Polideportivo Municipal'
  },
  {
    id: 'h3',
    date: '2026-04-01',
    result: 'Derrota (7-6, 5-7, 4-6)',
    pointsEarned: 25,
    pointDetails: '+25 Partido Reñido',
    location: 'Club Padel Madrid'
  }
];

export const friendsList = [
  { id: 'u2', name: 'Carlos López', username: 'charly77', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charly77&backgroundColor=93C572', division: 4, subdivision: 'Alta' },
  { id: 'u5', name: 'Laura Sánchez', username: 'lauri_padel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lauri_padel&backgroundColor=93C572', division: 4, subdivision: 'Media' }
];

export const communitiesList = [
  { id: 'c1', name: 'Nómadas del Pádel', icon: '🌍', isPrivate: true, membersCount: 15, maxMembers: 30, leaderId: 'u2' },
  { id: 'c2', name: 'Torneos de Fin de Semana', icon: '🏆', isPrivate: false, membersCount: 48, maxMembers: 50, leaderId: 'u4' },
  { id: 'c3', name: 'Solo 4ª División Córdoba', icon: '🎾', isPrivate: false, membersCount: 22, maxMembers: 50, leaderId: 'u1' }
];
