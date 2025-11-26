import { render, screen } from '@testing-library/react';
import App from './App';

test('renders gobang game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/五子棋/i);
  expect(titleElement).toBeInTheDocument();
});
