import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStack';
import Database from '../services/Database';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetail'>;

const ItemDetail: React.FC<Props> = ({ route, navigation }) => {
  const { producto } = route.params;

  // Modo edición: inicialmente la vista muestra los datos sin editar
  const [isEditing, setIsEditing] = useState(false);

  // Estados para edición y visualización (inicializados con los valores actuales)
  const [titulo, setTitulo] = useState(producto.titulo);
  const [imagenUri, setImagenUri] = useState<string | null>(producto.imagenUri);
  const [fechaCaducidad, setFechaCaducidad] = useState<Date>(
    new Date(producto.fechaCaducidad)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Función para confirmar la eliminación del producto
  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      'Esto eliminará el producto permanentemente y no hay vuelta atrás. ¿Deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await Database.deleteProducto(producto.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error al eliminar producto', error);
            }
          },
        },
      ]
    );
  };
  // TODO: Desde el calendario ir a itemDetail,
  //  hacer la parte de los items en el calendario mas grande
  // Añadir un filtro por nombre de item en notificaciones
  // Nuevo requerimiento, agregar compañia a los productos


  const handleSave = async () => {
    try {
      const updatedProduct = {
        ...producto,
        titulo,
        imagenUri,
        fechaCaducidad: fechaCaducidad.toISOString(),
      };
      await Database.updateProducto(updatedProduct);
      // Reemplazamos la pantalla actual con la nueva, forzando la actualización
      navigation.replace('ItemDetail', { producto: updatedProduct });
    } catch (error) {
      console.error('Error al actualizar el producto', error);
    }
  };
  

  // Función para actualizar la fecha de vencimiento
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFechaCaducidad(selectedDate);
    }
  };

  // Función para cambiar la imagen utilizando la galería
  const handleChangeImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        setImagenUri(response.assets[0].uri || null);
      }
    });
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        // Modo edición
        <>
          <Text style={styles.label}>Editar Producto</Text>

          <Text style={styles.subLabel}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.subLabel}>Imagen:</Text>
          {imagenUri ? (
            <Image source={{ uri: imagenUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>Sin imagen</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={handleChangeImage}>
            <Text style={styles.buttonText}>Cambiar Imagen</Text>
          </TouchableOpacity>

          <Text style={styles.subLabel}>Fecha de Vencimiento:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowDatePicker(true)}>
            <Text style={styles.buttonText}>
              {fechaCaducidad.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={fechaCaducidad}
              mode="date"
              display="default"
              onChange={onChangeFecha}
            />
          )}

          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Modo visualización: usamos los estados locales actualizados
        <>
          <Text style={styles.title}>{titulo}</Text>
          {imagenUri ? (
            <Image source={{ uri: imagenUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Text style={styles.placeholderText}>Sin imagen</Text>
            </View>
          )}
          <Text style={styles.expiration}>
            Vence: {fechaCaducidad.toLocaleDateString()}
          </Text>
          {producto.createdAt && (
            <Text style={styles.creation}>
              Creado: {new Date(producto.createdAt).toLocaleDateString()}
            </Text>
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  subLabel: { fontSize: 16, marginTop: 8 },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#fff', fontSize: 16 },
  expiration: { fontSize: 18, color: '#333', marginBottom: 8 },
  creation: { fontSize: 16, color: '#666', marginBottom: 16 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
});

export default ItemDetail;
