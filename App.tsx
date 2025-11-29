import { useState, useEffect } from 'react'; // <--- AGREGAMOS useEffect
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  FlatList, 
  useColorScheme, 
  View, 
  TouchableOpacity, 
  Modal,
  Platform // <--- AGREGAMOS Platform para saber si es Android
} from 'react-native';
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as NavigationBar from 'expo-navigation-bar'; // <--- IMPORTAMOS LA LIBRERÍA NUEVA

import { Jornada } from './src/models/Jornada';
import { JornadaCard } from './src/components/JornadaCard';
import { Colores } from './src/constants/Colors';

function MainContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;
  
  const [modalVisible, setModalVisible] = useState(false);

  // --- LÓGICA CORREGIDA PARA LA BARRA DE ABAJO ---
  useEffect(() => {
    if (Platform.OS === 'android') {
      // 1. El fondo transparente suele funcionar bien en la mayoría
      NavigationBar.setBackgroundColorAsync("transparent");
      
      // 2. CHECK DE SEGURIDAD:
      // Platform.Version en Android nos devuelve el número de API.
      // La API 26 equivale a Android 8.0.
      if (Platform.Version >= 26) {
        NavigationBar.setButtonStyleAsync(esOscuro ? "light" : "dark");
      }
    }
  }, [esOscuro]);
  // -------------------------------------------

  const [jornadas, setJornadas] = useState<Jornada[]>([
    { id: '2025-01-01', fecha: '01/01/2025', horasNormales: 8, horas50: 0, horas100: 0, tipo: 'Normal' },
    { id: '2025-01-02', fecha: '02/01/2025', horasNormales: 8, horas50: 2, horas100: 0, tipo: 'Extra', observaciones: 'Se quedó un rato más' },
    { id: '2025-01-03', fecha: '03/01/2025', horasNormales: 0, horas50: 0, horas100: 0, tipo: 'Franco' },
  ]);

  return (
    <View style={[styles.container, { backgroundColor: colores.background }]}>
      
      <View style={{ paddingTop: insets.top }}>
        <Text style={[styles.titulo, { color: colores.text }]}>JornadApp</Text>
      </View>
      
      <FlatList
        data={jornadas}
        renderItem={({ item }) => <JornadaCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.lista, { paddingBottom: 100 + insets.bottom }]}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: colores.cardBackground,
              borderWidth: esOscuro ? 1 : 0,
              borderColor: esOscuro ? '#444' : 'transparent',
            }
          ]}>
            <Text style={[styles.modalTitulo, { color: colores.text }]}>Nueva Jornada</Text>
            
            <Text style={{color: colores.textSecondary, marginVertical: 20}}>
              (Aquí irá el formulario)
            </Text>

            <TouchableOpacity 
              style={[styles.botonCerrar, { backgroundColor: colores.estados.extra }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={[
          styles.fab, 
          { 
            backgroundColor: colores.tint,
            bottom: 30 + insets.bottom 
          }
        ]} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color={colores.textOnPrimary} />
      </TouchableOpacity>
      
      <StatusBar style={esOscuro ? "light" : "dark"} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  lista: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botonCerrar: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  }
});