import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import NewUserNoteForm from '../components/NewUserNoteForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import { useDispatch } from 'react-redux';
import {
  getSpecificUser,
  createUserNote,
  hideUserNote,
  unhideUserNote,
} from '../actions/userActions';
import Colors from '../constants/Colors';

type ManageNotesScreenNavigationProp = StackNavigationProp<DashboardStackParamsList, 'Notes'>;

type Props = {
  navigation: ManageNotesScreenNavigationProp;
  route;
  userId: number;
  dsprDriverId?: number;
  userNotes: any[];
  showTitle?: boolean;
};

const ManageNotes = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const { userId, dsprDriverId, userNotes } = route.params;
  const [showNotes, setShowNotes] = useState(false);

  const createNote = (userId, note, dsprDriverId) =>
    dispatch(createUserNote(userId, note, dsprDriverId, null));
  const hideNote = (noteId) => dispatch(hideUserNote(noteId));
  const unhideNote = (noteId) => dispatch(unhideUserNote(noteId));
  const refreshUser = () => dispatch(getSpecificUser(userId));

  const handleNewNoteSubmit = (values) => {
    createNote(userId, values.note, dsprDriverId);
    refreshUser();
    setShowNotes(false);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.light }}>
        <ScrollView style={{ flex: 1, backgroundColor: Colors.light }}>
          {userNotes && userNotes.length > 0 ? (
            userNotes.map((userNote) => (
              <ListItem key={userNote.id}>
                <ListItem.Content>
                  <ListItem.Title>{userNote.note}</ListItem.Title>
                  <ListItem.CheckBox
                    checkedColor={Colors.primary}
                    title={userNote.isVisible ? 'visible' : 'hidden'}
                    onPress={
                      userNote.isVisible
                        ? () => hideNote(userNote.id)
                        : () => unhideNote(userNote.id)
                    }
                    checked={userNote.isVisible}
                  />
                </ListItem.Content>
              </ListItem>
            ))
          ) : (
            <View>No User Notes</View>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            color={Colors.primary}
            labelStyle={{ color: Colors.light }}
            onPress={() => setShowNotes(true)}
            style={{ width: '100%' }}
          >
            Create Note
          </Button>
        </View>
      </View>
      <Dialog visible={showNotes} onDismiss={() => setShowNotes(false)}>
        <Dialog.Title>New Note</Dialog.Title>
        <Dialog.Content>
          <NewUserNoteForm closeDialog={() => setShowNotes(false)} onSubmit={handleNewNoteSubmit} />
        </Dialog.Content>
      </Dialog>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: Colors.light,
    padding: 10,
    bottom: 0,
  },
});

export default ManageNotes;
