import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Image, Modal, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    try {
      setCarregando(true);
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEventos(data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  // 2. Criei a forma do Card. FlatList vai usar isso para cada item do banco.
  const renderizarEvento = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.0}
        onPress={() => {
            setEventoSelecionado(item);
            setModalVisivel(true);
        }}
      >

        {/* aqui eu estou puxando o link da foto que eu coloquei lá no Supabase */}
        <Image source={{ uri: item.imagem_url }} style={styles.imagem} />
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardDescricao} numberOfLines={2}>
            {item.descricao}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text style={styles.loadingText}>Buscando eventos da nuvem...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vitrine de Eventos</Text>
        <Text style={styles.subtitle}>Confira os momentos mágicos na Mansão</Text>
      </View>

      <FlatList
        data={eventos} 
        keyExtractor={(item) => item.id} 
        renderItem={renderizarEvento} 
        contentContainerStyle={styles.listaContainer} 
        showsVerticalScrollIndicator={false} 
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{eventoSelecionado?.titulo}</Text>
            <Text style={styles.modalSubtitle}>Decoradora: {eventoSelecionado?.decoradora}</Text>
            
            <TouchableOpacity 
              style={styles.fecharBotao}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.fecharBotaoTexto}>Fechar Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  listaContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
  },
  imagem: {
    width: "100%",
    height: 200,
    backgroundColor: "#e1e4e8"
  },
  cardInfo: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardDescricao: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  fecharBotao: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  fecharBotaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});