import React, {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  FlatList,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';

type ItemsList = {
  text: string;
  dateCreated: number;
}[];

type StorageObject = {
  items: ItemsList;
};

const STORAGE_KEY = 'suru';

async function loadItems(): Promise<StorageObject> {
  let items: ItemsList = [];
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);

    if (value !== null && value !== undefined) {
      const parsedValue = JSON.parse(value);
      items = parsedValue.items;
    }
  } catch (error) {
  } finally {
    return {items};
  }
}

async function saveItem(newItemText: string) {
  const storage = await loadItems();

  storage.items.push({
    text: newItemText,
    dateCreated: Date.now(),
  });

  const stringifiedStorage = JSON.stringify(storage);
  await AsyncStorage.setItem(STORAGE_KEY, stringifiedStorage);
}

function App() {
  const [currentValue, setCurrentValue] = useState('');
  const [storage, setStorage] = useState<StorageObject>({items: []});

  const handleSubmit = useCallback(
    async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      await saveItem(currentValue);
      setCurrentValue('');
      // const storage = await loadItems();
      // setStorage(storage);
    },
    [currentValue],
  );

  useEffect(() => {
    loadItems().then(storage => {
      setStorage(storage);
    });
  }, [currentValue]);

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.logo}>suru</Text>
          <TextInput
            autoCapitalize="none"
            autoFocus
            blurOnSubmit={false}
            autoCompleteType="off"
            autoCorrect={false}
            multiline={false}
            onChangeText={setCurrentValue}
            onSubmitEditing={handleSubmit}
            placeholder="write something"
            returnKeyType="next"
            selectionColor="#e56"
            spellCheck={false}
            style={styles.input}
            textContentType="none"
            underlineColorAndroid="transparent"
            value={currentValue}
          />
          <FlatList
            data={storage.items}
            renderItem={({item}) => <Text>{item.text}</Text>}
            keyExtractor={item => `${item.dateCreated}`}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  wrapper: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 3,
    color: '#000',
    fontFamily: 'monospace',
    padding: 8,
  },
  logo: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default App;
