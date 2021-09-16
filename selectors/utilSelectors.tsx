import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash.isequal'

/**Create a "selector creator" that uses lodash.isequal instead of ===
 * -> can be used in place of create selector to make a memoized selector
 * -> the memoized selector will not run again if one of the input selectors returns a new reference type,
 *      but the fields or items in the array have not changed
 * */
export const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
)