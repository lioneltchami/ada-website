import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function that includes common providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => {
  const { initialRoute = '/', ...renderOptions } = options || {};

  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { screen } from '@testing-library/react';

// Override render with our custom version
export { customRender as render };
