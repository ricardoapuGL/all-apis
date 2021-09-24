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
  Todo
} from './todo/todo'
import Delete from './icons/delete'
import axios, { CancelTokenSource } from 'axios';

interface TodoCardProps {
  todo: Todo
  onCheckboxChange: (todo: Todo) => Promise<void>
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onCheckboxChange }: TodoCardProps) => {
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
        {todo.text}
      </Text>
      <CheckBox onValueChange={async (e) => {
        console.log(e);
        await onCheckboxChange(todo)
      }
      } value={todo.done} />
      <Delete color={isDarkMode ? 'white' : 'black'} />
    </View>
  );
};

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<Todo[]>([])

  const getData = async (source?: CancelTokenSource) => {
    try {
      const todos = (await axios.get('http://10.0.2.2:8080/todo', { cancelToken: source && source.token })).data
      setTodos(todos)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    // get TODOS
    let isSubscribed = true
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (isSubscribed) {
      getData(source)
    }
    return () => {
      source.cancel()
      isSubscribed = false
    }
  }, [])


  const onChange = async (todo: Todo) => {
    try {
      const response = await axios.patch(`http://10.0.2.2:8080/todo/${todo.todoId}`, {
        body: {
          done: !todo.done
        }
      })
      console.log(response)
      getData()
    } catch (error) {
      console.error(error.message)
    }

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
            return <TodoCard key={i} todo={todo} onCheckboxChange={onChange} />
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
