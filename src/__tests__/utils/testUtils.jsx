import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with necessary providers
 * @param {ReactElement} ui - Component to render
 * @param {Object} options - Additional render options
 * @returns {RenderResult} - Testing library render result
 */
export const renderWithRouter = (ui, options = {}) => {
    const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

    return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Helper function to wait for async operations
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Auth Context Provider for testing
 */
export const mockAuthContext = {
    user: null,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    saveUser: vi.fn(),
};

// Re-export common testing utilities
export { screen, waitFor, fireEvent } from '@testing-library/react';
