
export enum ProjectStatus {
  INICIADO = 'Iniciado',
  RENDERIZANDO = 'Renderizando',
  FINALIZADO = 'Finalizado',
  APROVADO = 'Aprovado',
  REPROVADO = 'Reprovado'
}

export enum EmployeeRole {
  DESIGNER_3D = 'Designer 3D',
  DETALHISTA = 'Detalhista Técnico',
  PROJETISTA = 'Projetista',
  COMERCIAL = 'Comercial',
  ADMINISTRATIVO = 'Administrativo',
  DIRETOR = 'Diretor de Arte'
}

export enum WorkStatus {
  OFFLINE = 'Offline',
  WORKING = 'Trabalhando',
  LUNCH = 'Em Almoço',
  FINISHED = 'Expediente Finalizado'
}

export interface TimeLog {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Entrada' | 'Almoço' | 'Retorno' | 'Saída';
  timestamp: Date;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  email: string;
  phone: string;
  startDate: string;
  status: 'Ativo' | 'Férias' | 'Inativo';
  avatar?: string;
  currentWorkStatus?: WorkStatus;
  salary?: string;
  address?: string;
  addressNumber?: string;
  neighborhood?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  birthDate?: string;
  birthPlace?: string;
  birthUF?: string;
  rg?: string;
  rgIssuer?: string;
  rgUF?: string;
  workCardNumber?: string;
  workCardSeries?: string;
  pis?: string;
  cpf?: string;
  // Acesso ao Sistema
  username?: string;
  password?: string;
  isAccessEnabled?: boolean;
  permissions?: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'image' | 'other';
  size: string;
  uploadDate: Date;
}

export interface Milestone {
  id: string;
  task: string;
  date: string;
  completed: boolean;
  priority: 'baixa' | 'media' | 'alta';
}

export interface EngineeringData {
  structuralSpecs: string;
  electricalPlan: string;
  woodworkDetails: string;
  graphicsSpecs: string; 
  externalModelLink: string;
  engineeringDeadline?: string;
  checklist: {
    piso: boolean;
    estrutura: boolean;
    eletrica: boolean;
    marcenaria: boolean;
    pintura: boolean;
    limpeza: boolean;
  };
}

export interface TechnicalSpecs {
  flooring: string;
  lighting: string;
  furniture: string;
  electricalPoints: string;
  woodwork: string;
  heightLimit: string;
}

export interface MoodboardItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'color' | 'material';
}

export interface Briefing {
  clientName: string;
  eventName: string;
  eventDate?: string;
  deliveryDeadline?: string;
  standSize: string;
  standType?: string;
  budgetType: string;
  budgetValue?: string;
  keyRequirements: string;
  aiReferences: string[];
  attachments: ProjectFile[];
  technicalSpecs?: TechnicalSpecs;
  engineering?: EngineeringData;
  moodboard?: MoodboardItem[];
  timeline?: Milestone[];
}

export interface Client {
  id: string;
  name: string;
  projectsCount: number;
}

export interface Project {
  id: string;
  clientId: string; 
  title: string;
  status: ProjectStatus;
  progress: number;
  briefing?: Briefing;
  createdAt: Date;
  lastModified: Date;
}
