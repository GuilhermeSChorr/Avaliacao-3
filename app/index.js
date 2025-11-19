import { Link } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
    return (
        <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1605902711622-cfb43c44367f" }}
            style={estilos.background}
            resizeMode="cover"
        >
            <SafeAreaView style={estilos.areaSegura}>

                <Text style={estilos.titulo}>Bem-vindo à Loja de Jogos</Text>

                <Link href="lojadejogos" asChild>
                    <TouchableOpacity style={estilos.botao}>
                        <Text style={estilos.botaoTexto}>Clique para ver a loja de jogos</Text>
                    </TouchableOpacity>
                </Link>

            </SafeAreaView>
        </ImageBackground>
    );
}

const estilos = StyleSheet.create({ 
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  areaSegura: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  botao: {
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "80%",
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});
