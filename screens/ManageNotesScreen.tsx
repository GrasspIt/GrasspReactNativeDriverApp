import React, { useState } from 'react';
import { ScrollView, View, Text, KeyboardAvoidingView, Platform } from 'react-native';

import { Button, Portal, useTheme } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import NewUserNoteForm from '../components/NewUserNoteForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { State } from '../store/reduxStoreState';
import { getUserNotesFromProps } from '../selectors/userSelectors';
import Moment from 'moment';

import {
  getSpecificUser,
  createUserNote,
  hideUserNote,
  unhideUserNote,
} from '../actions/userActions';

type ManageNotesScreenNavigationProp = StackNavigationProp<OrderListStackParamsList, 'Notes'>;

type Props = {
  navigation: ManageNotesScreenNavigationProp;
  route;
  userId: number;
  dsprDriverId?: number;
  showTitle?: boolean;
};

const ManageNotes = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { userId, dsprDriverId } = route.params;
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

  const userNotes = useSelector<State, any[]>(
    (state) => getUserNotesFromProps(state, { userId }),
    shallowEqual
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {userNotes && userNotes.length > 0 ? (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
          {userNotes.map((userNote) => (
            <ListItem key={userNote.id} bottomDivider>
              <ListItem.Content>
                <ListItem.CheckBox
                  containerStyle={{
                    backgroundColor: colors.surface,
                    borderColor: colors.surface,
                  }}
                  checkedColor={colors.primary}
                  title={userNote.isVisible ? 'visible' : 'hidden'}
                  onPress={
                    userNote.isVisible ? () => hideNote(userNote.id) : () => unhideNote(userNote.id)
                  }
                  checked={userNote.isVisible}
                />
                <ListItem.Title style={{ margin: 6 }}>{userNote.note}</ListItem.Title>
                <ListItem.Subtitle style={{ alignSelf: 'flex-end' }}>
                  {Moment(userNote.createdTimestamp).format('MMMM Do YYYY, h:mm a')}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No User Notes</Text>
        </View>
      )}
      <View
        style={{
          backgroundColor: colors.background,
          padding: 10,
          bottom: 0,
        }}
      >
        <Button
          mode='contained'
          color={colors.primary}
          labelStyle={{ color: colors.surface }}
          onPress={() => setShowNotes(true)}
          style={{ width: '100%' }}
        >
          Create Note
        </Button>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Portal>
            <NewUserNoteForm
              showNotes={showNotes}
              closeDialog={() => setShowNotes(false)}
              onSubmit={handleNewNoteSubmit}
            />
          </Portal>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ManageNotes;
