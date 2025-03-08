export interface Member {
  id: string;
  name: string;
  payments: Record<string, number>;
}

export interface Payment {
  month: string;
  amount: number;
}

export interface AppState {
  members: Member[];
  selectedYear: number;
}