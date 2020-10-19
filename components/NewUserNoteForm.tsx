import React from 'react';
import { Modal } from 'react-native';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Button, TextInput, Dialog, useTheme } from 'react-native-paper';

// error if field is left empty
const validate = (values) => {
  const errors: any = {};
  if (!values.note) {
    errors.note = 'Required';
  }
  return errors;
};

interface NewUserNoteFormProps {
  closeDialog: () => void;
}

const NewUserNoteForm = (
  props: NewUserNoteFormProps & InjectedFormProps<{}, NewUserNoteFormProps>
) => {
  const { closeDialog, handleSubmit, showNotes } = props;
  const { colors } = useTheme();

  const renderField = ({
    input,
    label,
    type,
    meta: { asyncValidating, touched, error },
    ...custom
  }) => (
    <TextInput
      label={label}
      type={type}
      {...input}
      {...custom}
      multiline={true}
      numberOfLines={3}
      underlineColor={colors.primary}
      error={!!(touched && error)}
      helperText={touched && error ? error : ''}
    />
  );
  return (
    <Modal animationType='slide' visible={showNotes} onRequestClose={closeDialog}>
      <Dialog.Title>New Note</Dialog.Title>
      <Dialog.Content>
        <Field
          name='note'
          component={renderField}
          multiline
          rows={3}
          mode='outlined'
          label='Note'
          className='field'
        />
        <Dialog.Actions>
          <Button
            mode='contained'
            color={colors.primary}
            labelStyle={{ color: colors.surface }}
            style={{ flex: 1 }}
            onPress={handleSubmit}
          >
            Submit
          </Button>
          <Button color={colors.primary} style={{ flex: 1 }} onPress={closeDialog}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog.Content>
    </Modal>
  );
};

export default reduxForm<any, NewUserNoteFormProps>({
  form: 'NewUserNoteForm', // a unique identifier for this form
  validate,
})(NewUserNoteForm);
