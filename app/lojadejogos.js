import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, View, Alert, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

async function getGames() {
  const resposta = await fetch(`http://177.44.248.50:8080/games`);
  if (resposta.ok) return await resposta.json();
}

async function cadastrarGame(body) {
  const resposta = await fetch(`http://177.44.248.50:8080/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return resposta.ok;
}

async function editarGame(id, body) {
  const resposta = await fetch(`http://177.44.248.50:8080/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return resposta.ok;
}

async function excluirGame(id) {
  const resposta = await fetch(`http://177.44.248.50:8080/games/${id}`, {
    method: "DELETE",
  });
  return resposta.ok;
}

export default function Games() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [developer, setDeveloper] = useState("");

  const [games, setGames] = useState([]);
  const [editingId, setEditingId] = useState(null);

  async function carregarGames() {
    const lista = await getGames();
    setGames(lista || []);
  }

  async function salvar() {
    if (!title.trim()) return Alert.alert("Erro", "O título é obrigatório.");
    if (!slug.trim()) return Alert.alert("Erro", "O slug é obrigatório.");
    if (!price.trim()) return Alert.alert("Erro", "O preço é obrigatório.");
    if (isNaN(Number(price))) return Alert.alert("Erro", "Preço inválido.");

    const body = {
      title,
      slug,
      price: Number(price),
      description: description || null,
      developer: developer || null,
    };

    let ok = false;

    if (editingId) {
      ok = await editarGame(editingId, body);
    } else {
      ok = await cadastrarGame(body);
    }

    if (ok) {
      limparFormulario();
      carregarGames();
    }
  }

  function limparFormulario() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setPrice("");
    setDescription("");
    setDeveloper("");
  }

  async function remover(id) {
    Alert.alert(
      "Excluir jogo",
      "Deseja realmente excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (await excluirGame(id)) carregarGames();
          },
        },
      ]
    );
  }

  function iniciarEdicao(jogo) {
    setEditingId(jogo.id);
    setTitle(jogo.title);
    setSlug(jogo.slug);
    setPrice(String(jogo.price));
    setDescription(jogo.description || "");
    setDeveloper(jogo.developer || "");
  }

  useEffect(() => {
    carregarGames();
  }, []);

  return (
    <SafeAreaView style={estilos.container}>
      <Text style={estilos.titulo}>
        {editingId ? "Editar Jogo" : "Cadastrar Jogo"}
      </Text>

      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={estilos.input} />
      <TextInput placeholder="Slug" value={slug} onChangeText={setSlug} style={estilos.input} />
      <TextInput placeholder="Preço" keyboardType="numeric" value={price} onChangeText={setPrice} style={estilos.input} />
      <TextInput placeholder="Descrição" value={description} onChangeText={setDescription} style={estilos.input} />
      <TextInput placeholder="Developer" value={developer} onChangeText={setDeveloper} style={estilos.input} />

      <TouchableOpacity style={estilos.botao} onPress={salvar}>
        <Text style={estilos.botaoTexto}>
          {editingId ? "Salvar Alterações" : "Cadastrar Jogo"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={estilos.botaoCinza} onPress={carregarGames}>
        <Text style={estilos.botaoCinzaTexto}>Recarregar lista</Text>
      </TouchableOpacity>

      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 12 }}
        renderItem={({ item }) => (
          <View style={estilos.item}>
            <Text style={estilos.itemTitulo}>{item.title}</Text>
            <Text>Slug: {item.slug}</Text>
            <Text>Preço: R$ {item.price}</Text>
            {item.description && <Text>Descrição: {item.description}</Text>}
            {item.developer && <Text>Dev: {item.developer}</Text>}

            <View style={estilos.botoesLinha}>
              <TouchableOpacity style={estilos.botaoEditar} onPress={() => iniciarEdicao(item)}>
                <Text style={estilos.botaoTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={estilos.botaoExcluir} onPress={() => remover(item.id)}>
                <Text style={estilos.botaoTexto}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EEF2F5",
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },

  botao: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  botaoTexto: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  botaoCinza: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 10,
  },

  botaoCinzaTexto: {
    textAlign: "center",
    color: "#333",
    fontWeight: "bold",
  },

  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },

  itemTitulo: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },

  botoesLinha: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  botaoEditar: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },

  botaoExcluir: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
  },
});
