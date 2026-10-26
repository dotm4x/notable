import type { Preview } from '@storybook/react-vite';
import '../source/styles.d.ts';
import '../source/styles/index.css';
import './preview.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute(
        'data-theme',
        context.globals.theme,
      );

      return Story();
    },
  ],
};

export default preview;
