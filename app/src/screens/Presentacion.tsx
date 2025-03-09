import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Presentacion'>;

const Presentacion: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Inventario de Productos</Text>
      <Text style={styles.subtitle}>
        Administra tus productos y mantén el control de sus fechas de vencimiento.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Paso1')}
      >
        <Text style={styles.buttonText}>Agregar Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Calendario')}
      >
        <Text style={styles.buttonText}>Ver Calendario</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Notificaciones')}
      >
        <Text style={styles.buttonText}>Items</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5', padding: 16 },
  logo: { width: 120, height: 120, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginHorizontal: 32, marginBottom: 32 },
  button: { backgroundColor: '#0066CC', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginVertical: 8, width: '80%', alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default Presentacion;
