import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, delay: number) => {
    const savedCallback: React.MutableRefObject<any> = useRef();
    
    // Remember latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [callback, delay]);
}