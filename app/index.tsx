import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const App = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [numPeople, setNumPeople] = useState(0);
  const [people, setPeople] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [accounts, setAccounts] = useState([]);

  const handleCreateAccount = () => {
    const newPeople = Array.from({ length: numPeople }, (_, i) => ({
      id: i,
      name: `Pessoa ${i + 1}`,
      value: totalValue / numPeople,
      fixed: false,
    }));
    setPeople(newPeople);
  };

  const handleEditValue = (id, newValue) => {
    let updatedPeople = [...people];
    let remainingValue = totalValue - newValue;

    updatedPeople = updatedPeople.map(person => 
      person.id === id ? { ...person, value: newValue, fixed: true } : person
    );

    const nonFixedPeople = updatedPeople.filter(person => !person.fixed);
    const dividedValue = remainingValue / nonFixedPeople.length;

    setPeople(updatedPeople.map(person =>
      person.fixed ? person : { ...person, value: dividedValue }
    ));
  };

  const handleFinalizeAccount = () => {
    const newAccount = {
      accountName,
      totalValue,
      people,
    };

    setAccounts(prevAccounts => [...prevAccounts, newAccount]);

    setAccountName('');
    setTotalValue(0);
    setNumPeople(0);
    setPeople([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Conta:</Text>
      <TextInput
        placeholder="Digite o nome da conta"
        value={accountName}
        onChangeText={setAccountName}
        style={styles.input}
      />

      <Text style={styles.label}>Total da Conta:</Text>
      <TextInput
        placeholder="Digite o valor total"
        keyboardType="numeric"
        value={totalValue.toString()}
        onChangeText={(val) => setTotalValue(parseFloat(val))}
        style={styles.input}
      />

      <Text style={styles.label}>Número de Pessoas:</Text>
      <TextInput
        placeholder="Digite o número de pessoas"
        keyboardType="numeric"
        value={numPeople.toString()}
        onChangeText={(val) => setNumPeople(parseInt(val))}
        style={styles.input}
      />

      <Button title="Criar Conta" onPress={handleCreateAccount} />

      <FlatList
        data={people}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personText}>
              {item.name} - R${item.value.toFixed(2)}
            </Text>
            <TextInput
              placeholder="Editar valor"
              keyboardType="numeric"
              onChangeText={(val) => handleEditValue(item.id, parseFloat(val))}
              style={styles.input}
            />
          </View>
        )}
        style={styles.list}
      />

      {people.length > 0 && (
        <Button title="Finalizar Conta" onPress={handleFinalizeAccount} />
      )}

      <Text style={styles.label}>Histórico de Contas Criadas:</Text>
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>
              {item.accountName} - Total: R${item.totalValue.toFixed(2)}
            </Text>
            {item.people.map(person => (
              <Text key={person.id} style={styles.personText}>
                {person.name}: R${person.value.toFixed(2)}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 15,
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
  },
  personContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  personText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  list: {
    marginTop: 20,
  },
  accountContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  accountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default App;
