/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  Todo, todos
} from './todo/todo'
import Delete from './icons/delete'
import axios from 'axios';

interface TodoCardProps extends Todo {
  idx: number
  onCheckboxChange: (idx: number) => void
}

const TodoCard: React.FC<TodoCardProps> = ({ text, done, onCheckboxChange, idx }: TodoCardProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, {
      backgroundColor: isDarkMode ? 'black' : 'white'
    }]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}>
        {text}
      </Text>
      <CheckBox onValueChange={() => {
        onCheckboxChange(idx)
      }} value={done} />
      <Delete color={isDarkMode ? 'white' : 'black'} />
    </View>
  );
};

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // get TODOS
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let isSubscribed = true
    if (isSubscribed) {
      axios.get('http://10.0.2.2:8080/todo', { cancelToken: source.token }).then(res => {
        console.log(res.data)
        setTodos(res.data)
      }).catch(err => console.error(err.stack))
    }
    return () => {
      source.cancel()
      isSubscribed = false
    }
  }, [])

  const [doneState, setDoneState] = useState(todos.map(t => t.done))

  const onChange = (idx: number) => {
    const newState: React.SetStateAction<boolean[]> = []
    doneState[idx] = !doneState[idx]
    doneState.forEach(item => newState.push(item))
    setDoneState(newState)
  }
  const backgroundStyle = {
    backgroundColor: 'black',
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>

        <View
          style={{
            backgroundColor: isDarkMode ? 'black' : 'white',
          }}>

          {todos.map((todo, i) => {
            return <TodoCard key={i} idx={i} {...todo} done={doneState[i]} onCheckboxChange={onChange} />
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    display: 'flex',
    flexDirection: 'row'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  checkbox: {
    alignSelf: "center",
  },
});

export default App;
