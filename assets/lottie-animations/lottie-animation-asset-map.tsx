import locationPermission from './location-permissions-lottie-grassp.json';
import error from './error-message-lottie-grassp.json';
import checkmarkSuccess from './success-check-mark-animated-grassp.json';

export type LottieAnimationNames = 'checkmarkSuccess' | 'error' | 'locationPermission';

type LottieAnimationAssets = {
    [key in LottieAnimationNames]: any;
};


/**Import lottie animation file paths so webpack can properly bundle them.
 * Components can then dynamically choose which animation to use without running into a build error*/
const lottieAssets: LottieAnimationAssets = {
    locationPermission,
    error,
    checkmarkSuccess,
}

export default lottieAssets;