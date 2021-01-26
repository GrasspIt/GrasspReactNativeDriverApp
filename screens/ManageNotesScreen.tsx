import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getUserNotesFromProps } from '../selectors/userSelectors';

import {
  getSpecificUser,
  createUserNote,
  hideUserNote,
  unhideUserNote,
} from '../actions/userActions';
import ManageNotesDisplay from '../components/ManageNotesDisplay';

type Props = {
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
  createUserNote,
  hideUserNote,
  unhideUserNote,
  getSpecificUser,
  userNotes,
  dsprDriverId,
  userId,
}: Props) => {
  const [showNotes, setShowNotes] = useState(false);

  const handleNewNoteSubmit = (values) => {
    createUserNote(userId, values.note, dsprDriverId, null);
    getSpecificUser(userId);
    setShowNotes(false);
  };

  return (
    <ManageNotesDisplay
      userNotes={userNotes}
      unhideUserNote={unhideUserNote}
      hideUserNote={hideUserNote}
      showNotes={showNotes}
      setShowNotes={setShowNotes}
      handleNewNoteSubmit={handleNewNoteSubmit}
    />
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
