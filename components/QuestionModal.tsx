import React, { useState } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Provider, Text } from 'react-native-paper';

const QuestionModal = ({visible, hideModal}) => {
  // const [modalVisible, setModalVisible] = useState(false);
  return (
    <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <Text>Hello World!</Text>
          <Button title="Hide Modal" onPress={hideModal} />
        </Modal>
      </Portal> 
    </Provider>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    height: Dimensions.get('window').height / 2, // Use half of the screen
    width: '100%', // Use 100% of the screen width
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0
  }
});

export default QuestionModal;
