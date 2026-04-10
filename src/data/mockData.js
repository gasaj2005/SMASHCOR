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
  { id: 'n1', type: 'app_update', title: '¡Bienvenidos a la versión 1.0 de SmashCor!', content: 'Lanzamos la aplicación oficial. Podrás crear partidas, unirte a grupos, registrar tus palas y competir en el ranking vivo.', date: '2026-04-10T10:00:00Z' },
  { id: 'n2', type: 'app_update', title: 'Nueva función de estadísticas disponible', content: 'Tus partidos ahora generarán gráficas y analizarán tus rachas de victoria en tu perfil. Mantén tu progreso al día.', date: '2026-04-09T18:30:00Z' },
  { id: 'n3', type: 'padel_news', title: 'Babolat lanza la nueva Technical Viper', content: 'El actual número 1 ha presentado la que será su pala estrella para esta temporada. Más reactiva, fibra de carbono 12K y un balance aún más alto.', date: '2026-04-08T12:15:00Z' },
  { id: 'n4', type: 'padel_news', title: 'Premier Padel aterriza una vez más en Madrid', content: 'El circuito mundial más importante llegará a la capital española a finales de verano. Ve guardando la fecha en el calendario.', date: '2026-04-07T09:00:00Z' },
  { id: 'n5', type: 'community', title: '¡Racha Imparable de PadelKing!', content: 'El usuario "PadelKing" lleva 5 victorias consecutivas esta semana. Las pistas de la zona norte ya le temen cuando saca la bandeja.', date: '2026-04-06T20:30:00Z' },
  { id: 'n6', type: 'community', title: 'El partido más largo del mes', content: '3 horas de infarto en la pista central. Laura y Charly pelearon un tie-break del tercer set que ya es historia local (14-12).', date: '2026-04-05T14:45:00Z' }
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
  { 
    id: 'c1', name: 'Nómadas del Pádel', icon: '🌍', isPrivate: true, 
    membersCount: 15, maxMembers: 30, leaderId: 'u2', membersIds: ['u2', 'u1'],
    messages: [
      { id: 'm1', senderId: 'u2', text: '¡Bienvenidos a la nueva comunidad privada!', timestamp: '2026-04-10T10:00:00Z' }
    ]
  },
  { 
    id: 'c2', name: 'Torneos de Fin de Semana', icon: '🏆', isPrivate: false, 
    membersCount: 48, maxMembers: 50, leaderId: 'u4', membersIds: ['u4'],
    messages: []
  },
  { 
    id: 'c3', name: 'Solo 4ª División Córdoba', icon: '🎾', isPrivate: false, 
    membersCount: 22, maxMembers: 50, leaderId: 'u5', membersIds: ['u5'],
    messages: []
  }
];

export const globalUsers = [...leaderboardData];
