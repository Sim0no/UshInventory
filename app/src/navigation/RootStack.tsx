import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Presentacion from '../screens/Presentacion';
import Calendario from '../screens/Calendario';
import Notificaciones from '../screens/Notificaciones';
import Paso1 from '../screens/AgregarProducto/Paso1';
import Paso2 from '../screens/AgregarProducto/Paso2';
import Paso3 from '../screens/AgregarProducto/Paso3';
import ItemDetail from '../screens/ItemDetail';

export type RootStackParamList = {
  Presentacion: undefined;
  Paso1: undefined;
  Paso2: {titulo: string; imagenUri: string | null};
  Paso3: {titulo: string; imagenUri: string | null; fechaCaducidad: Date};
  Calendario: undefined;
  Notificaciones: undefined;
  ItemDetail: { producto: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Presentacion">
      <Stack.Screen
        name="Presentacion"
        component={Presentacion}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Paso1"
        component={Paso1}
        options={{title: 'Agregar Producto: Paso 1'}}
      />
      <Stack.Screen
        name="Paso2"
        component={Paso2}
        options={{title: 'Agregar Producto: Paso 2'}}
      />
      <Stack.Screen
        name="Paso3"
        component={Paso3}
        options={{title: 'Resumen y Confirmación'}}
      />
      <Stack.Screen
        name="Calendario"
        component={Calendario}
        options={{title: 'Calendario de Vencimientos'}}
      />
      <Stack.Screen
        name="Notificaciones"
        component={Notificaciones}
        options={{title: 'Notificaciones'}}
      />
      
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{title: 'Detalle del Producto'}}
      />

    </Stack.Navigator>
  );
};

export default RootStack;
