import initSqlJs from 'sql.js';

let db = null;
let SQL = null;

export const initDatabase = async () => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
  }
  
  try {
    const savedDb = localStorage.getItem('charityDb');
    if (savedDb) {
      const uint8Array = new Uint8Array(savedDb.split(',').map(Number));
      db = new SQL.Database(uint8Array);
    } else {
      db = new SQL.Database();
      db.run(`
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
    }
    saveDatabase();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

const saveDatabase = () => {
  if (db) {
    try {
      const data = db.export();
      const array = Array.from(data);
      localStorage.setItem('charityDb', array.toString());
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }
};

export const saveMember = (id, name) => {
  try {
    db.run('INSERT OR REPLACE INTO members (id, name) VALUES (?, ?)', [id, name]);
    saveDatabase();
  } catch (error) {
    console.error('Error saving member:', error);
    throw error;
  }
};

export const deleteMember = (id) => {
  try {
    db.run('DELETE FROM members WHERE id = ?', [id]);
    db.run('DELETE FROM payments WHERE member_id = ?', [id]);
    saveDatabase();
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const savePayment = (memberId, month, amount, year) => {
  try {
    db.run(`
      INSERT OR REPLACE INTO payments (member_id, month, amount, year)
      VALUES (?, ?, ?, ?)
    `, [memberId, month, amount, year]);
    saveDatabase();
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

export const loadMembers = () => {
  try {
    const stmt = db.prepare('SELECT * FROM members');
    const members = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      members.push({
        id: row.id,
        name: row.name
      });
    }
    return members;
  } catch (error) {
    console.error('Error loading members:', error);
    return [];
  }
};

export const loadPayments = (year) => {
  try {
    const stmt = db.prepare('SELECT * FROM payments WHERE year = ?');
    stmt.bind([year]);
    const payments = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      payments.push({
        id: row.id,
        member_id: row.member_id,
        month: row.month,
        amount: row.amount,
        year: row.year
      });
    }
    return payments;
  } catch (error) {
    console.error('Error loading payments:', error);
    return [];
  }
};

export const loadMembersWithPayments = (year) => {
  try {
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
  } catch (error) {
    console.error('Error loading members with payments:', error);
    return [];
  }
};