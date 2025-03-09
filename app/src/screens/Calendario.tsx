import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Database, { Producto } from '../services/Database';

const Calendario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  });

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const datos = await Database.getProductos();
        setProductos(datos);
      } catch (error) {
        console.error('Error al cargar los productos', error);
      }
    };

    cargarProductos();
  }, []);

  // Función auxiliar para formatear la fecha en formato YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Construir el objeto de fechas marcadas para el calendario
  const markedDates: { [date: string]: any } = {};

  productos.forEach((producto) => {
    const dateStr = formatDate(producto.fechaCaducidad);
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { dots: [] };
    }
    // Cada producto genera un punto rojo
    markedDates[dateStr].dots.push({
      key: producto.id?.toString() || Math.random().toString(),
      color: 'red',
    });
  });

  // Marcar la fecha seleccionada
  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#00adf5',
    };
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#00adf5',
      dots: [],
    };
  }

  // Filtrar los productos que vencen en la fecha seleccionada
  const productosFiltrados = productos.filter(
    (producto) => formatDate(producto.fechaCaducidad) === selectedDate
  );

  // Renderizado de cada producto en la lista
  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productItem}>
      {item.imagenUri ? (
        <Image source={{ uri: item.imagenUri }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.placeholder]}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      <Text style={styles.productTitle}>{item.titulo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sección del Calendario */}
      <View style={styles.calendarSection}>
        <Text style={styles.sectionTitle}>Calendario</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          markingType={'multi-dot'}
        />
      </View>

      {/* Sección de Lista de Productos */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>
          Productos para {new Date(selectedDate).toLocaleDateString()}
        </Text>
        {productosFiltrados.length > 0 ? (
          <FlatList
            data={productosFiltrados}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={renderProducto}
            style={styles.productList}
          />
        ) : (
          <Text style={styles.noProductsText}>
            No hay productos para esta fecha
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendarSection: { flex: 1, padding: 16 },
  listSection: {
    flex: 1,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productList: { flex: 1 },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 4,
  },
  placeholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { fontSize: 10, color: '#fff' },
  productTitle: { fontSize: 16, flex: 1, flexWrap: 'wrap' },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default Calendario;
