const db = require("../config/db");

class Customer {
  static async create(name, phone, cnic_number, address, email, userId) {
    try {
      const [result] = await db.execute(
        "INSERT INTO customers (name, phone, cnic_number, address, email, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [name, phone, cnic_number, address, email, userId]
      );
      return result;
    } catch (error) {
      console.error("Error inserting customer:", error);
      throw error;
    }
  }

  static async findAll() {
    const [rows] = await db.execute("SELECT * FROM customers");
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.execute(
      `SELECT c.*, u.name AS user_name
       FROM customers c
       LEFT JOIN users u ON c.user_id = u.id`
    );
    return rows;
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const [result] = await db.execute(
      `UPDATE customers SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result;
  }

  static async getByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT c.*, u.name AS user_name
       FROM customers c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM customers WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Customer;
