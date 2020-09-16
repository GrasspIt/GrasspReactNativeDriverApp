import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox, List, Dialog } from 'react-native-paper';
import NewUserNoteForm from '../components/NewUserNoteForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashboardStackParamsList } from '../navigation/DashboardNavigator';
import { useSelector, useDispatch, shallowEqual, connect } from 'react-redux';
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

const ManageNotes = ({
  navigation,
  route,
}: //   userId,
//   dsprDriverId,
//   userNotes,
Props) => {
  const dispatch = useDispatch();
  const { userId, dsprDriverId, userNotes } = route.params;
  const [showNotes, setShowNotes] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const createUserNote = (userId, note, dsprDriverId) =>
    dispatch(createUserNote(userId, note, dsprDriverId));
  const hideUserNote = (noteId) => dispatch(hideUserNote(noteId));
  const unhideUserNote = (noteId) => dispatch(unhideUserNote(noteId));
  const refreshUser = () => dispatch(getSpecificUser(userId));

  const handleNewNoteSubmit = (values) => {
    createUserNote(userId, values.note, dsprDriverId).then(() => refreshUser());
    setShowNotes(false);
  };

  return (
    <Card>
      <Card.Title title="Notes" />
      <Card.Actions>
        <Button
          mode="contained"
          color={Colors.primary}
          labelStyle={{ color: Colors.light }}
          onPress={() => setShowNotes(true)}
        >
          Create Note
        </Button>

        <Checkbox
          status={showHidden ? 'checked' : 'unchecked'}
          color={Colors.primary}
          onPress={() => {
            setShowHidden(!showHidden);
          }}
        >
          Show Hidden
        </Checkbox>
      </Card.Actions>
      <Card.Content>
        <List.Section>
          {userNotes
            ? userNotes
                .filter((userNote) => (showHidden ? userNote : userNote.isVisible))
                .map((userNote) => (
                  <>
                    <List.Item key={userNote.id} title={userNote.note} />
                    {userNote.isVisible ? (
                      <Button
                        color={Colors.primary}
                        labelStyle={{ color: Colors.light }}
                        mode="contained"
                        onPress={() => hideUserNote(userNote.id)}
                      >
                        HIDE
                      </Button>
                    ) : (
                      <Button
                        color={Colors.primary}
                        labelStyle={{ color: Colors.light }}
                        mode="contained"
                        onPress={() => unhideUserNote(userNote.id)}
                      >
                        UNHIDE
                      </Button>
                    )}
                  </>
                ))
            : null}
        </List.Section>
      </Card.Content>
      <Dialog visible={showNotes} onDismiss={() => setShowNotes(false)}>
        <Dialog.Title>New Note</Dialog.Title>
        <Dialog.Content>
          <NewUserNoteForm closeDialog={() => setShowNotes(false)} onSubmit={handleNewNoteSubmit} />
        </Dialog.Content>
      </Dialog>
    </Card>
  );
};

export default ManageNotes;
