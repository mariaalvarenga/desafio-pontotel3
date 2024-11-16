import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('https://api.spacexdata.com/v4/launches');
        const data = await response.json();
        setLaunches(data);
        setFilteredLaunches(data); // Inicializa a lista com todos os lançamentos
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
      }
    };

    fetchLaunches();
  }, []);

  // Função para filtrar a lista com base no texto de busca
  const handleSearch = (text) => {
    setSearchText(text);
    const filteredData = launches.filter((launch) =>
      launch.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLaunches(filteredData);
  };

  // Renderizar cada item da lista de lançamentos
  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
      <Button title="Ver Vídeo" onPress={() => setSelectedLaunch(item)} />
      <Button
        title="Ver Artigo"
        onPress={() => setSelectedLaunch(item)}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      {/* Campo de Busca */}
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Buscar por nome"
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Lista filtrada de lançamentos */}
      <FlatList
        data={filteredLaunches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Exibir WebView com o vídeo */}
      {selectedLaunch && (
        <WebView
          source={{
            uri: selectedLaunch.links.youtube_id
              ? `https://www.youtube.com/watch?v=${selectedLaunch.links.youtube_id}`
              : '',
          }}
          style={{ marginTop: 20, height: 300 }}
        />
      )}

      {/* Exibir WebView com o link do artigo */}
      {selectedLaunch && selectedLaunch.links.article && (
        <WebView
          source={{ uri: selectedLaunch.links.article }}
          style={{ marginTop: 20, height: 300 }}
        />
      )}
    </View>
  );
}