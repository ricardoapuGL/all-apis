

import React, { FormEvent, useEffect, useState } from 'react';
import {
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
import axios, { CancelTokenSource } from 'axios';
import { FAB, Modal, Portal, Provider, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';


interface TodoCardProps {
  todo: Todo
  onCheckboxChange: (todo: Todo) => Promise<void>
  onDelete: (todoId: string) => Promise<void>
}

const TextStyle = (isDarkMode: boolean) => ({ color: isDarkMode ? 'white' : 'black' })
const BackgroundStyle = (isDarkMode: boolean) => ({ backgroundColor: isDarkMode ? 'black' : 'white' })


const TodoCard: React.FC<TodoCardProps> = ({ todo, onCheckboxChange, onDelete }: TodoCardProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[BackgroundStyle(isDarkMode), { display: 'flex',
    flexDirection: 'row', justifyContent: 'space-between'}, styles.rowContainer]}>
      <View style={[ { display: 'flex',
    flexDirection: 'row'},BackgroundStyle(isDarkMode)]}>
        <Text
          style={[
            styles.sectionTitle,
            TextStyle(isDarkMode),
          ]}>
          {todo.text}
        </Text>
        <CheckBox onChange={async (e) => {
          await onCheckboxChange(todo)
        }
        } value={todo.done} />
      </View>
      <Icon 
        style={styles.deleteIcon} 
        name={'trash'} 
        {...TextStyle(isDarkMode)} 
        size={24}
        onPress={() => onDelete(todo.todoId)} />
    </View>
  );
};

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [todos, setTodos] = useState<Todo[]>([])
  console.log(todos)

  const getData = async (source?: CancelTokenSource) => {
    try {
      const todos = (await axios.get('http://10.0.2.2:8080/todo', { cancelToken: source && source.token })).data
      setTodos(todos)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const onDelete = async (todoId: string) => {
    try {
      await axios.delete(`http://10.0.2.2:8080/todo/${todoId}`)
      await getData()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
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
    console.log(todo)
    try {
      const response = await axios.patch(`http://10.0.2.2:8080/todo/${todo.todoId}`, {
        done: !todo.done
      })
      console.log(response.data)
      await getData()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }

  }

  const modalStyle = { ...BackgroundStyle(isDarkMode), padding: 50 };


  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = async (newTodo: string) => {
    console.log(`Create todo: ${newTodo}`)
    setLoading(true)
    // create todo
    try {
      const response = await axios.post(`http://10.0.2.2:8080/todo/`, {
        text: newTodo,
        done: false
      })
      console.log(response.data)
      await getData()
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
    setLoading(false)
    setNewTodo('')
    hideModal()
  }


  return (
    <Provider >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">

        <View
          style={BackgroundStyle(isDarkMode)}>

          {todos.map((todo, i) => {
            return <TodoCard key={i} todo={todo} onCheckboxChange={onChange} onDelete={onDelete}/>
          })}
        </View>

      </ScrollView>
      <FAB
        style={styles.fab}
        icon='plus'
        onPress={showModal}
      />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={modalStyle}>
          <Text style={TextStyle(isDarkMode)}>Create a new Todo:</Text>
          <TextInput value={newTodo} onChangeText={(text) => setNewTodo(text)} />
          <Button mode="text" onPress={() => handleSubmit(newTodo)} loading={loading}>
            <Text style={TextStyle(isDarkMode)}>Submit</Text></Button>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
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
  fab: {
    color: 'white',
    position: 'absolute',
    margin: 32,
    right: 0,
    bottom: 0,
  },
  deleteIcon: {
    padding: 5,
  }
});

export default App;
