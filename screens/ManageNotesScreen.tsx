import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { List, useTheme, FAB, Card, IconButton } from 'react-native-paper';
import NewUserNoteForm from '../components/NewUserNoteForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { connect } from 'react-redux';
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
  userNotes;
  userId: number;
  dsprDriverId?: number;
  showTitle?: boolean;
  createUserNote;
  hideUserNote;
  unhideUserNote;
  getSpecificUser;
};

const ManageNotes = ({
  navigation,
  route,
  createUserNote,
  hideUserNote,
  unhideUserNote,
  getSpecificUser,
  userNotes,
  dsprDriverId,
  userId,
}: Props) => {
  const { colors } = useTheme();
  const [showNotes, setShowNotes] = useState(false);

  const handleNewNoteSubmit = (values) => {
    createUserNote(userId, values.note, dsprDriverId, null);
    getSpecificUser(userId);
    setShowNotes(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {userNotes && userNotes.length > 0 ? (
          <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            {userNotes.map((userNote) => (
              <>
                <Card style={{ marginHorizontal: 10, marginTop: 10 }}>
                  <Card.Content>
                    <List.Item
                      key={userNote.id}
                      title={`${userNote.note}`}
                      description={`${Moment(userNote.createdTimestamp).format(
                        'MMMM Do YYYY, h:mm a'
                      )}`}
                      descriptionStyle={{ alignSelf: 'flex-end' }}
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
          style={[styles.fab, { backgroundColor: colors.primary }]}
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

const mapStateToProps = (state, route) => {
  const { userId, dsprDriverId } = route.route.params;
  const userNotes = getUserNotesFromProps(state, { userId });
  return {
    userNotes,
    dsprDriverId,
    userId,
  };
};

const mapDispatchToProps = { createUserNote, hideUserNote, unhideUserNote, getSpecificUser };

export default connect(mapStateToProps, mapDispatchToProps)(ManageNotes);
