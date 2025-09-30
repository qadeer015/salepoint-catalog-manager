const db = require("../config/db");

class Product {
  static async create(name, purchase_price, sale_price, quantity, batch, vendor_id, user_id) {
    try {
      const [result] = await db.execute(
        "INSERT INTO products (name, purchase_price, sale_price, quantity, batch, vendor_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, purchase_price, sale_price, quantity, batch, vendor_id, user_id]
      );
      return result;
    } catch (error) {
      console.error("Error inserting product:", error);
      throw error;
    }
  }

  static async getUserProducts(user_id) {
    const [rows] = await db.execute(`
      SELECT p.*, v.name AS vendor_name
      FROM products p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      WHERE p.user_id = ?
    `, [user_id]);
    return rows;
  }

 static async getAll() {
  const [rows] = await db.execute(`
    SELECT 
      p.*, 
      u.name AS user_name, 
      v.name AS vendor_name
    FROM products p
    LEFT JOIN users u ON up.user_id = u.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
  `);
  return rows;
}


  static async findById(id) {
    const [rows] = await db.execute(`
    SELECT 
      p.*, 
      u.name AS user_name, 
      v.name AS vendor_name
    FROM products p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN vendors v ON p.vendor_id = v.id
    WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const [result] = await db.execute(
      `UPDATE products SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute("DELETE FROM products WHERE id = ?", [id]);
    return result;
  }
}

module.exports = Product;
