import React from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import Database from '../../services/Database';

type Props = NativeStackScreenProps<RootStackParamList, 'Paso3'>;

const Paso3: React.FC<Props> = ({ navigation, route }) => {
  const { titulo, imagenUri, fechaCaducidad } = route.params;

  const crearProducto = async () => {
    try {
      await Database.addProducto({
        titulo,
        imagenUri,
        fechaCaducidad: fechaCaducidad.toISOString(),
      });
      Alert.alert("Éxito", "Producto creado exitosamente", [
        { text: "OK", onPress: () => navigation.popToTop() },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el producto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titulo}</Text>
      {imagenUri && <Image source={{ uri: imagenUri }} style={styles.image} />}
      <Text style={styles.fecha}>
        Fecha de caducidad: {fechaCaducidad.toLocaleDateString()}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Volver" onPress={() => navigation.goBack()} />
        <Button title="Crear" onPress={crearProducto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  image: { width: 200, height: 200, marginBottom: 16 },
  fecha: { fontSize: 18, marginBottom: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});

export default Paso3;
