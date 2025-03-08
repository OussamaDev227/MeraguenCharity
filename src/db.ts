import Database from 'better-sqlite3';

const db = new Database('charity.db');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id TEXT NOT NULL,
    month TEXT NOT NULL,
    amount REAL NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (member_id) REFERENCES members (id)
  );
`);

export const saveMember = (id: string, name: string) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO members (id, name) VALUES (?, ?)');
  stmt.run(id, name);
};

export const deleteMember = (id: string) => {
  const stmt = db.prepare('DELETE FROM members WHERE id = ?');
  stmt.run(id);
  
  const deletePayments = db.prepare('DELETE FROM payments WHERE member_id = ?');
  deletePayments.run(id);
};

export const savePayment = (memberId: string, month: string, amount: number, year: number) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO payments (member_id, month, amount, year)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(memberId, month, amount, year);
};

export const loadMembers = () => {
  const stmt = db.prepare('SELECT * FROM members');
  return stmt.all();
};

export const loadPayments = (year: number) => {
  const stmt = db.prepare('SELECT * FROM payments WHERE year = ?');
  return stmt.all(year);
};

export const loadMembersWithPayments = (year: number) => {
  const members = loadMembers();
  const payments = loadPayments(year);
  
  return members.map(member => ({
    ...member,
    payments: payments
      .filter(p => p.member_id === member.id)
      .reduce((acc, p) => ({
        ...acc,
        [p.month]: p.amount
      }), {})
  }));
};