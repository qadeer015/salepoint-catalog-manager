const db = require("../config/db");

class Vendor {
  static async create(name, phone, address, email, userId) {
    try {
      const [result] = await db.execute(
        "INSERT INTO vendors (name, phone, address, email, user_id) VALUES (?, ?, ?, ?, ?)",
        [name, phone, address, email, userId]
      );
      return result;
    } catch (error) {
      console.error("Error inserting vendor:", error);
      throw error;
    }
  }

  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM vendors");
    return rows;
  }

   static async getAll() {
    const [rows] = await db.execute(
      `SELECT v.*, u.name AS user_name
       FROM vendors v
       LEFT JOIN users u ON v.user_id = u.id`
    );
    return rows;
  }

  static async getByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT v.*, u.name AS user_name
       FROM vendors v
       LEFT JOIN users u ON v.user_id = u.id
       WHERE v.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM vendors WHERE id = ?", [id]);
    return rows[0];
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const [result] = await db.execute(
      `UPDATE vendors SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM vendors WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Vendor;
