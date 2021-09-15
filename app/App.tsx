/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useState } from 'react';
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
   Colors,
 } from 'react-native/Libraries/NewAppScreen';

 import {
   Todo, todos
 } from './todo/todo'
 


 const TodoCard: React.FC<Todo> = ({todoId, text, done}: Todo) => {
   const [doneState, setDoneState] = useState(done)
   const isDarkMode = useColorScheme() === 'dark';
   return (
     <View style={styles.sectionContainer} key={todoId}>
       <Text
         style={[
           styles.sectionTitle,
           {
             color: isDarkMode ? Colors.white : Colors.black,
           },
         ]}>
         {text}
       </Text>
        <CheckBox onValueChange={() => setDoneState(!doneState)} value={doneState}/>
     </View>
   );
 };

 const App = (): JSX.Element => {
   const isDarkMode = useColorScheme() === 'dark';

   const backgroundStyle = {
     backgroundColor: 'black',
   };
   console.log(todos)
   return (
     <SafeAreaView style={backgroundStyle}>
       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
       <ScrollView
         contentInsetAdjustmentBehavior="automatic"
         style={backgroundStyle}>
         
         <View
           style={{
             backgroundColor: isDarkMode ? Colors.black : Colors.white,
           }}>

           {todos.map((todo) => {
             console.log(todo)
             return <TodoCard key={todo.todoId}{...todo}/>
           })}
         </View>
       </ScrollView>
     </SafeAreaView>
   );
 };

 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
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
