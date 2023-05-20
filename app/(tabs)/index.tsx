import React, {useState} from 'react';
import { Platform, KeyboardAvoidingView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList,} from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

export default function TabOneScreen() {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // padding: 16,
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12,
      marginHorizontal: 30,
      paddingHorizontal: 16,
    },
    userContainer: {
      flexDirection: 'row-reverse',
      alignSelf: 'flex-end',
      backgroundColor: '#0084FF',
      borderRadius: 20,
    },
    aiContainer: {
      alignSelf: 'flex-start',
      backgroundColor: '#e5e5e5',
      borderRadius: 20,
    },
    userMessage: {
      color: '#fff',
      fontSize: 16,
      padding: 8,
      paddingRight: 12,
    },
    aiMessage: {
      color: '#000',
      fontSize: 16,
      padding: 8,
      paddingLeft: 12,
    },
    icon: {
      maxHeight: 24,
      maxWidth: 24,
      borderRadius: 50,
    },
    input: {
      borderColor: '#ccc',
      borderRadius: 25,
      borderWidth: 1,
      bottom: 0,
      fontSize: 18,
      height: 50,
      margin: 16,
      paddingLeft: 16,
      paddingRight: 60,
    },
    sendButton: {
      marginBottom: 16,
      width: '50%',
      marginHorizontal: '25%',
    },
  });

  const ChatGPT_API_URL = 'https://api.openai.com/v1/chat/completions';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const token = 'YOUR_CHATGPT_TOKEN';

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
    };

    setMessages([...messages, userMessage]);

    const prompt = `User: ${inputText}\nAI: `;

    try {
      const response = await axios.post(ChatGPT_API_URL, {
        // モデル ID の指定
        model: 'gpt-3.5-turbo',
        max_tokens: 500,
          temperature: 1,
        n: 1,
        // 質問内容
        messages: [
          {
            'role': 'user',
            'content': prompt,
          }
        ],
      }, {
        // 送信する HTTP ヘッダー(認証情報)
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      });

      const aiMessage = {
        role: 'ai',
        content: response.data.choices[0].message.content.trim(),
      };
      console.log("aiMessage", aiMessage);
      
      setMessages([...messages, userMessage, aiMessage]);
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    }

    setInputText('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.role === 'user' ? styles.userContainer : styles.aiContainer,
            ]}>
            {item.role === 'user' ? (
              <MaterialIcons name="tag-faces" size={24} color="#FFF" />
            ) : (
              <MaterialCommunityIcons name="robot-outline" size={24} color="#333" />
            )}
            <Text style={item.role === 'user' ? styles.userMessage : styles.aiMessage}>
              {item.content}
            </Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={sendMessage}
        placeholder="Type your message..."
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Button icon="send" mode="contained">Send</Button>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};
