import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Database, { Producto } from '../services/Database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Notificaciones'>;

const Notificaciones: React.FC<Props> = ({ navigation }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState<'upcoming' | 'expired'>('upcoming');

  // Función para cargar los productos desde la BD
  const cargarProductos = async () => {
    try {
      const datos = await Database.getProductos();
      setProductos(datos);
    } catch (error) {
      console.error('Error al cargar productos', error);
    }
  };

  // Cada vez que la pantalla reciba el foco, se vuelve a cargar la data
  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [])
  );

  const today = new Date();

  // Filtrar según el estado del producto
  const filteredProducts = productos.filter((producto) => {
    const expiration = new Date(producto.fechaCaducidad);
    return filtro === 'upcoming' ? expiration >= today : expiration < today;
  });

  // Ordenar los productos por fecha de caducidad (ascendente)
  filteredProducts.sort(
    (a, b) =>
      new Date(a.fechaCaducidad).getTime() - new Date(b.fechaCaducidad).getTime()
  );

  const renderProducto = ({ item }: { item: Producto }) => {
    const expiration = new Date(item.fechaCaducidad);
    // Calculamos la diferencia en días
    const diffDays =
      (expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    // Aplicamos estilos según la cantidad de días restantes
    let styleModifier = {};
    if (filtro === 'upcoming') {
      if (diffDays <= 5) {
        // Rojo si faltan 5 días o menos
        styleModifier = styles.urgent;
      } else if (diffDays > 5 && diffDays <= 10) {
        // Amarillo si faltan entre 5 y 10 días
        styleModifier = styles.warning;
      }
    }

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ItemDetail', { producto: item })}
      >
        <Text style={[styles.itemTitulo, styleModifier]}>
          {item.titulo}
        </Text>
        <Text style={[styles.itemFecha, styleModifier]}>
          Vence: {expiration.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Listado de Productos</Text>

      {/* Controles para filtrar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'upcoming' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('upcoming')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtro === 'upcoming' && styles.filterButtonTextActive,
            ]}
          >
            Próximos a vencer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'expired' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('expired')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtro === 'expired' && styles.filterButtonTextActive,
            ]}
          >
            Vencidos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderProducto}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    color: '#007bff',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemTitulo: { fontSize: 16 },
  itemFecha: { fontSize: 14, color: '#666' },
  urgent: { color: 'red', fontWeight: 'bold' },
  warning: { color: 'orange', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  listContainer: { paddingBottom: 16 },
});

export default Notificaciones;
