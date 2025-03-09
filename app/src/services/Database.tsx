import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Inventario.db";
const database_version = "1.0";
const database_displayname = "Inventario Local";
const database_size = 200000;

export interface Producto {
  id?: number;
  titulo: string;
  imagenUri: string | null;
  fechaCaducidad: string; // Almacenamos la fecha en formato ISO
}

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDB(): Promise<SQLite.SQLiteDatabase> {
    try {
      this.db = await SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );
      // Crear tabla si no existe
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            imagenUri TEXT,
            fechaCaducidad TEXT NOT NULL
         );`
      );
      return this.db;
    } catch (error) {
      console.error("Error al inicializar la base de datos: ", error);
      throw error;
    }
  }

  async addProducto(producto: Producto): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    await this.db.executeSql(
      `INSERT INTO productos (titulo, imagenUri, fechaCaducidad) VALUES (?, ?, ?)`,
      [producto.titulo, producto.imagenUri, producto.fechaCaducidad]
    );
  }

  async getProductos(): Promise<Producto[]> {
    if (!this.db) {
      await this.initDB();
    }
    const [results] = await this.db.executeSql(`SELECT * FROM productos`);
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      productos.push({
        id: row.id,
        titulo: row.titulo,
        imagenUri: row.imagenUri,
        fechaCaducidad: row.fechaCaducidad,
      });
    }
    return productos;
  }

  async getProductosProximos(fechaLimite: string): Promise<Producto[]> {
    // Ejemplo: productos cuya fechaCaducidad sea menor o igual a fechaLimite
    if (!this.db) {
      await this.initDB();
    }
    const [results] = await this.db.executeSql(
      `SELECT * FROM productos WHERE fechaCaducidad <= ?`,
      [fechaLimite]
    );
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      productos.push({
        id: row.id,
        titulo: row.titulo,
        imagenUri: row.imagenUri,
        fechaCaducidad: row.fechaCaducidad,
      });
    }
    return productos;
  }

  async updateProducto(producto: Producto): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    if (!producto.id) {
      throw new Error("El producto debe tener un id para ser actualizado");
    }
    await this.db.executeSql(
      `UPDATE productos SET titulo = ?, imagenUri = ?, fechaCaducidad = ? WHERE id = ?`,
      [producto.titulo, producto.imagenUri, producto.fechaCaducidad, producto.id]
    );
  }

  async deleteProducto(id: number): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    await this.db.executeSql(
      `DELETE FROM productos WHERE id = ?`,
      [id]
    );
  }
}

export default new Database();
