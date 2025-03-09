import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootStack';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Paso1'>;

const Paso1: React.FC<Props> = ({ navigation }) => {
  const [titulo, setTitulo] = useState<string>('');
  const [imagenUri, setImagenUri] = useState<string | null>(null);

  const seleccionarImagen = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        setImagenUri(response.assets[0].uri || null);
      }
    });
  };

  const tomarFoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        setImagenUri(response.assets[0].uri || null);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título del producto:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ingresa el título"
      />
      
      <View style={styles.buttonWrapper}>
        <Button title="Adjuntar imagen" onPress={seleccionarImagen} />
      </View>
      
      <View style={styles.buttonWrapper}>
        <Button title="Tomar foto" onPress={tomarFoto} />
      </View>

      {imagenUri && <Image source={{ uri: imagenUri }} style={styles.image} />}

      <View style={styles.buttonWrapper}>
        <Button
          title="Siguiente"
          onPress={() => navigation.navigate('Paso2', { titulo, imagenUri })}
          disabled={titulo.trim() === ''}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#FFFFFF' 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginBottom: 16, 
    borderRadius: 4 
  },
  buttonWrapper: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 8,
  },
  image: { 
    width: 200, 
    height: 200, 
    marginVertical: 16, 
    alignSelf: 'center' 
  },
});

export default Paso1;
