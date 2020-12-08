import * as Sentry from 'sentry-expo';

export const logException = (err, context) => {
  if (
    (context.action === 'GET_USER_ID_DOCUMENT' ||
      context.action === 'GET_USER_MEDICAL_RECOMMENDATION') &&
    err.includes('has no current')
  ) {
    Sentry.captureException(err, {
      extra: context,
    });
  }
};
