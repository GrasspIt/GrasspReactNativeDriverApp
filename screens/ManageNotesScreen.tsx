import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';

import { Button, useTheme } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import NewUserNoteForm from '../components/NewUserNoteForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderListStackParamsList } from '../navigation/OrderListNavigator';
import { useDispatch, useSelector, shallowEqual, connect } from 'react-redux';
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
                    userNote.isVisible
                      ? () => hideUserNote(userNote.id)
                      : () => unhideUserNote(userNote.id)
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
      <Button
        icon='plus'
        mode='contained'
        color={colors.primary}
        labelStyle={{ paddingVertical: 4, color: colors.surface }}
        onPress={() => setShowNotes(true)}
        style={{ width: '100%', borderRadius: 0 }}
      >
        Create Note
      </Button>
      <NewUserNoteForm
        showNotes={showNotes}
        closeDialog={() => setShowNotes(false)}
        onSubmit={handleNewNoteSubmit}
      />
    </View>
  );
};

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
