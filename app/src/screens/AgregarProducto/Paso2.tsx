import React, { useState } from 'react';
import { View, Button, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Paso2'>;

const Paso2: React.FC<Props> = ({ navigation, route }) => {
  const { titulo, imagenUri } = route.params;
  const [fecha, setFecha] = useState<Date>(new Date());
  const [mostrarPicker, setMostrarPicker] = useState<boolean>(false);

  const onChangeFecha = (event: any, selectedDate?: Date) => {
    // Para Android ocultamos el picker una vez seleccionada la fecha.
    if (Platform.OS === 'android') {
      setMostrarPicker(false);
    }
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  // Formateamos la fecha para mostrarla en pantalla.
  const formattedDate = fecha.toLocaleDateString();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha seleccionada:</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setMostrarPicker(true)}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={onChangeFecha}
        />
      )}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Volver" onPress={() => navigation.goBack()} color="#6c757d" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Siguiente"
            onPress={() =>
              navigation.navigate('Paso3', { titulo, imagenUri, fechaCaducidad: fecha })
            }
            color="#007bff"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    backgroundColor: '#fff' 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: { 
    fontSize: 18 
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  buttonWrapper: { 
    flex: 1, 
    marginHorizontal: 10 
  },
});

export default Paso2;
