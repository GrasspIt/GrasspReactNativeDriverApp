import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox, List, Dialog } from 'react-native-paper';
import NewUserNoteForm from './NewUserNoteForm';
import Colors from '../constants/Colors';

interface UserNotesProps {
  createUserNote: (userId: number, note: any, dsprDriverId: number) => any;
  hideUserNote: (noteId: number) => any;
  unhideUserNote: (noteId: number) => any;
  userId: number;
  dsprDriverId?: number;
  userNotes: any[];
  refreshUser: () => any;
  showTitle?: boolean;
}

const UserNotes = (props: UserNotesProps) => {
  const {
    userId,
    dsprDriverId,
    userNotes,
    refreshUser,
    createUserNote,
    hideUserNote,
    unhideUserNote,
    showTitle,
  } = props;

  const [showNotes, setShowNotes] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const handleNewNoteSubmit = (values) => {
    createUserNote(userId, values.note, dsprDriverId).then(() => refreshUser());
    setShowNotes(false);
  };

  return (
    <Card>
      {showTitle === undefined ? (
        <Card.Title title="Notes" />
      ) : showTitle ? (
        <Card.Title title="Notes" />
      ) : null}
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

export default UserNotes;
