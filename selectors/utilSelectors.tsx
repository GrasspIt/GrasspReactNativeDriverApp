import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash.isequal'

/**Create a "selector creator" that uses lodash.isequal instead of ===
 * -> can be used in place of create selector to make a memoized selector
 * -> the memoized selector will not run again if one of the input selectors returns a new reference type,
 *      but the fields or items in the array have not changed
 *
 * WARNING: before using this function, consider if a deep equality check is more expensive than rerunning the memoized selector
 * */
export const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
)