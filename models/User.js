const db = require("../config/db");

class User {
  static async create(name, email, password, role = "customer") {
    try {
      const [result] = await db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, password, role]
      );
      return result;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  }

  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM users");
    return rows;
  }

  static async findUser({ key, value }) {
    const [rows] = await db.execute(`SELECT * FROM users WHERE ${key} = ?`, [
      value
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const [result] = await db.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  }
}

module.exports = User;
