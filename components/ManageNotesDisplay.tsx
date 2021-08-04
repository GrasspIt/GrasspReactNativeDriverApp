import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { List, useTheme, FAB, Card, IconButton } from 'react-native-paper';
import NewUserNoteForm from '../components/NewUserNoteForm';
import Moment from 'moment';

type Props = {
  userNotes;
  hideUserNote;
  unhideUserNote;
  showNotes;
  setShowNotes;
  handleNewNoteSubmit;
};

const ManageNotesDisplay = ({
  hideUserNote,
  unhideUserNote,
  userNotes,
  showNotes,
  setShowNotes,
  handleNewNoteSubmit,
}: Props) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {userNotes && userNotes.length > 0 ? (
          <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            {userNotes.map((userNote) => (
              <>
                <Card key={userNote.id} style={{ marginHorizontal: 10, marginTop: 10 }}>
                  <Card.Content>
                    <List.Item
                      key={userNote.id}
                      title={<Text>{userNote.note}</Text>}
                      description={`${Moment(userNote.createdTimestamp).format(
                        'MMMM Do YYYY, h:mm a'
                      )}`}
                      descriptionStyle={{ alignSelf: 'flex-end' }}
                      titleNumberOfLines={3}
                    />
                  </Card.Content>
                  <Card.Actions>
                    {!userNote.isVisible ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                          icon='checkbox-blank-outline'
                          color={colors.error}
                          size={22}
                          onPress={() => unhideUserNote(userNote.id)}
                        />
                        <Text>not visible</Text>
                      </View>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                          icon='check-box-outline'
                          color={colors.primary}
                          size={22}
                          onPress={() => hideUserNote(userNote.id)}
                        />
                        <Text>visible</Text>
                      </View>
                    )}
                  </Card.Actions>
                </Card>
              </>
            ))}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No User Notes</Text>
          </View>
        )}
        <FAB
          style={styles.fab}
          color={colors.surface}
          label='Create Note'
          icon='plus'
          onPress={() => setShowNotes(true)}
        />
        <NewUserNoteForm
          showNotes={showNotes}
          closeDialog={() => setShowNotes(false)}
          onSubmit={handleNewNoteSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ManageNotesDisplay;
