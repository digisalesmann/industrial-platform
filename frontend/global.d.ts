// Allow importing CSS files as modules or side effects
// This fixes TS errors for CSS imports in Next.js

declare module '*.css';

// Fix React 19 children type issue with framer-motion
import 'react';

declare module 'react' {
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES {
        children?: React.ReactNode;
    }
}

